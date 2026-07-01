import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { dbQuery, dbGet, dbRun } from './database.js';
import { generateRAGResponse, generateQuizQuestions, compressStudyMaterial } from './gemini.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'vidyasetu_super_secret_jwt_key_2026';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Higher limit for Base64 document uploads

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token is invalid or expired' });
    }
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION ROUTES ---

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Note: in demo context, users log in using their 'id' (like stud1, teach1) or email.
    // We will support both by querying user where id = email OR email = email
    const user = await dbGet('SELECT * FROM users WHERE id = ? OR email = ?', [email, email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials. Password incorrect.' });
    }

    // Generate Token
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role, class: user.class, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        class: user.class
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server login failed' });
  }
});

// Register / Sign Up
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role, className } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password, and role are required' });
  }

  try {
    const existingUser = await dbGet('SELECT * FROM users WHERE id = ? OR email = ?', [email, email]);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email ID' });
    }

    const salt = bcrypt.genSaltSync(8);
    const passwordHash = bcrypt.hashSync(password, salt);
    // Use email as the user ID to match the original frontend localStorage auth strategy
    const userId = email.split('@')[0] || email;

    await dbRun(
      'INSERT INTO users (id, name, email, password_hash, role, class) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, email, passwordHash, role, className || '10-A']
    );

    const token = jwt.sign(
      { id: userId, name, role, class: className || '10-A', email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: userId,
        name,
        email,
        role,
        class: className || '10-A'
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server registration failed' });
  }
});

// Get Current User (Verify token & return fresh data)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet('SELECT id, name, email, role, class FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get user info error:', err);
    res.status(500).json({ error: 'Failed to fetch user session info' });
  }
});

// --- GEMINI PROXY ROUTES ---

// RAG Chat Response
app.post('/api/gemini/chat', authenticateToken, async (req, res) => {
  const { message, role } = req.body;
  if (!message || !role) {
    return res.status(400).json({ error: 'Message and role are required' });
  }

  const responseText = await generateRAGResponse(message, role);
  res.json({ text: responseText });
});

// Quiz Generation
app.post('/api/gemini/quiz', authenticateToken, async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  const quizQuestions = await generateQuizQuestions(topic);
  res.json({ questions: quizQuestions });
});

// Study Material Compression
app.post('/api/gemini/compress', authenticateToken, async (req, res) => {
  const { base64, mimeType } = req.body;
  if (!base64 || !mimeType) {
    return res.status(400).json({ error: 'base64 data and mimeType are required' });
  }

  const compressedText = await compressStudyMaterial(base64, mimeType);
  res.json({ text: compressedText });
});

// --- NOTICES ROUTES ---

// Fetch Notices
app.get('/api/notices', authenticateToken, async (req, res) => {
  try {
    const notices = await dbQuery('SELECT * FROM notices ORDER BY date DESC');
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

// Create Notice (Admin Only)
app.post('/api/notices', authenticateToken, async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }

  const { title, content, type } = req.body;
  if (!title || !content || !type) {
    return res.status(400).json({ error: 'Title, content, and type are required' });
  }

  const id = Date.now().toString();
  const date = new Date().toISOString().split('T')[0];

  try {
    await dbRun(
      'INSERT INTO notices (id, title, content, type, date) VALUES (?, ?, ?, ?, ?)',
      [id, title, content, type, date]
    );
    res.status(201).json({ id, title, content, type, date });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notice' });
  }
});

// Delete Notice (Admin Only)
app.delete('/api/notices/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }

  try {
    const result = await dbRun('DELETE FROM notices WHERE id = ?', [req.params.id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    res.json({ message: 'Notice deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notice' });
  }
});

// --- ONLINE CLASSES ROUTES ---

// Fetch Classes
app.get('/api/classes', authenticateToken, async (req, res) => {
  try {
    const classes = await dbQuery('SELECT * FROM classes ORDER BY date DESC, startTime ASC');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Create Class (Teacher/Admin Only)
app.post('/api/classes', authenticateToken, async (req, res) => {
  if (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Teachers and Admins only' });
  }

  const { title, subject, date, time } = req.body;
  if (!title || !subject || !date || !time) {
    return res.status(400).json({ error: 'Title, subject, date, and time are required' });
  }

  const id = 'c_' + Date.now();
  const duration = 60; // Default 1 hour
  const status = 'scheduled';

  try {
    await dbRun(
      'INSERT INTO classes (id, title, subject, teacherId, teacherName, date, startTime, duration, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, subject, req.user.id, req.user.name, date, time, duration, status]
    );
    res.status(201).json({ id, title, subject, teacherId: req.user.id, teacherName: req.user.name, date, startTime: time, duration, status, attendees: 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to schedule class' });
  }
});

// Update Class Status
app.put('/api/classes/:id', authenticateToken, async (req, res) => {
  const { status, attendees } = req.body;
  
  try {
    let query = 'UPDATE classes SET ';
    const params = [];
    
    if (status !== undefined) {
      query += 'status = ?';
      params.push(status);
    }
    if (attendees !== undefined) {
      if (status !== undefined) query += ', ';
      query += 'attendees = ?';
      params.push(attendees);
    }
    
    query += ' WHERE id = ?';
    params.push(req.params.id);

    const result = await dbRun(query, params);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json({ message: 'Class updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update class' });
  }
});

// --- ATTENDANCE ROUTES ---

// Fetch Attendance logs
app.get('/api/attendance/history', authenticateToken, async (req, res) => {
  try {
    let logs;
    if (req.user.role === 'STUDENT') {
      logs = await dbQuery('SELECT * FROM attendance WHERE studentId = ? ORDER BY date DESC', [req.user.id]);
    } else {
      logs = await dbQuery('SELECT * FROM attendance ORDER BY date DESC');
    }
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance history' });
  }
});

// Mark Attendance
app.post('/api/attendance/mark', authenticateToken, async (req, res) => {
  const { studentId, studentName, status } = req.body;
  const sId = studentId || req.user.id;
  const sName = studentName || req.user.name;
  const sStatus = status || 'Present';
  const date = new Date().toISOString().split('T')[0];

  try {
    // Check if already marked present today
    const existing = await dbGet('SELECT * FROM attendance WHERE studentId = ? AND date = ?', [sId, date]);
    if (existing) {
      return res.status(400).json({ error: 'Attendance already marked for today' });
    }

    const result = await dbRun(
      'INSERT INTO attendance (studentId, studentName, date, status) VALUES (?, ?, ?, ?)',
      [sId, sName, date, sStatus]
    );
    res.status(201).json({ id: result.id, studentId: sId, studentName: sName, date, status: sStatus });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record attendance' });
  }
});

// --- FEES / SALARY ROUTES ---

// Fetch Fee Status (Student) or Salary Status (Teacher)
app.get('/api/fees', authenticateToken, async (req, res) => {
  try {
    if (req.user.role === 'STUDENT' || req.user.role === 'PARENT') {
      // Return student fees
      const fees = await dbQuery('SELECT * FROM fees WHERE studentId = ?', [req.user.id]);
      res.json({ type: 'fees', data: fees });
    } else {
      // Mock teacher salaries or send static (since teacher table is not stored dynamically in detail)
      res.json({ type: 'salaries', data: [] });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch financial records' });
  }
});

// Pay Student Fee
app.post('/api/fees/pay', authenticateToken, async (req, res) => {
  const { feeId, method } = req.body;
  if (!feeId) {
    return res.status(400).json({ error: 'Fee ID is required' });
  }

  const invoice = method === 'UPI' ? `INV-GP-${Math.floor(Math.random() * 1000)}` : `INV-00${10 + Math.floor(Math.random() * 90)}`;
  const date = new Date().toLocaleDateString();

  try {
    const result = await dbRun(
      "UPDATE fees SET status = 'PAID', date = ?, invoice = ? WHERE id = ? AND studentId = ?",
      [date, invoice, feeId, req.user.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Fee record not found or not belonging to you' });
    }

    res.json({ message: 'Fee paid successfully', date, invoice });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process fee payment' });
  }
});

// --- LIBRARY ROUTES ---

// Fetch Library Books
app.get('/api/library', authenticateToken, async (req, res) => {
  try {
    const books = await dbQuery('SELECT * FROM library_books');
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch library books' });
  }
});

// --- STATIC PRODUCTION FRONTEND SERVING ---
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  console.log('Serving static files from:', distPath);
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
