import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'vidyasetu.db');

// Initialize database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database at:', DB_PATH);
    initializeTables();
  }
});

// Convert sqlite3 callbacks to Promises for convenience
export const dbQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const initializeTables = async () => {
  try {
    // 1. Users Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        class TEXT
      )
    `);

    // 2. Notices Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS notices (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL
      )
    `);

    // 3. Classes Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS classes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subject TEXT NOT NULL,
        teacherId TEXT NOT NULL,
        teacherName TEXT NOT NULL,
        date TEXT NOT NULL,
        startTime TEXT NOT NULL,
        duration INTEGER NOT NULL,
        status TEXT NOT NULL,
        attendees INTEGER DEFAULT 0
      )
    `);

    // 4. Attendance Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId TEXT NOT NULL,
        studentName TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL
      )
    `);

    // 5. Fees Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS fees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId TEXT NOT NULL,
        month TEXT NOT NULL,
        amount INTEGER NOT NULL,
        status TEXT NOT NULL,
        date TEXT DEFAULT '-',
        invoice TEXT DEFAULT '-'
      )
    `);

    // 6. Library Books Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS library_books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subject TEXT NOT NULL,
        board TEXT NOT NULL,
        grade TEXT NOT NULL,
        author TEXT NOT NULL,
        coverUrl TEXT NOT NULL,
        pdfUrl TEXT NOT NULL
      )
    `);

    console.log('All database tables initialized.');
    await seedData();
  } catch (err) {
    console.error('Error initializing tables:', err);
  }
};

const seedData = async () => {
  try {
    // Check if users exist before seeding
    const usersCount = await dbGet('SELECT COUNT(*) as count FROM users');
    if (usersCount.count === 0) {
      console.log('Seeding database with default records...');

      // Seed Users
      const salt = bcrypt.genSaltSync(8);
      const demoUsers = [
        { id: 'admin1', name: 'Dr. A. Sharma', email: 'admin1@vidyasetu.edu', password: '123', role: 'ADMIN', class: null },
        { id: 'teach1', name: 'Mrs. K. Verma', email: 'teach1@vidyasetu.edu', password: '123', role: 'TEACHER', class: '10-A' },
        { id: 'stud1', name: 'Rohan Gupta', email: 'stud1@vidyasetu.edu', password: '123', role: 'STUDENT', class: '10-A' },
      ];

      for (const u of demoUsers) {
        const hash = bcrypt.hashSync(u.password, salt);
        await dbRun(
          'INSERT INTO users (id, name, email, password_hash, role, class) VALUES (?, ?, ?, ?, ?, ?)',
          [u.id, u.name, u.email, hash, u.role, u.class]
        );
      }

      // Seed Notices
      const demoNotices = [
        { id: '1', title: 'Science Fair 2026', content: 'Annual Science Fair registration open. Prepare your projects.', type: 'academic', date: '2026-06-20' },
        { id: '2', title: 'Bus Route 5 Delay', content: 'Due to roadwork on Rabindra Setu, Route 5 will be 10 mins late.', type: 'transport', date: '2026-06-21' },
        { id: '3', title: 'Fee Reminder', content: 'Q2 Tuition fees are due by next week. Avoid late fine.', type: 'academic', date: '2026-06-18' },
      ];

      for (const n of demoNotices) {
        await dbRun(
          'INSERT INTO notices (id, title, content, type, date) VALUES (?, ?, ?, ?, ?)',
          [n.id, n.title, n.content, n.type, n.date]
        );
      }

      // Seed Classes
      const demoClasses = [
        {
          id: 'c1',
          title: 'Linear Algebra Fundamentals',
          subject: 'Mathematics',
          teacherId: 'teach1',
          teacherName: 'Mrs. K. Verma',
          date: new Date().toISOString().split('T')[0],
          startTime: '10:00',
          duration: 60,
          status: 'scheduled'
        },
        {
          id: 'c2',
          title: 'Thermodynamics',
          subject: 'Physics',
          teacherId: 'teach2', // Mock
          teacherName: 'Mr. R. Singh',
          date: new Date().toISOString().split('T')[0],
          startTime: '14:00',
          duration: 45,
          status: 'scheduled'
        }
      ];

      for (const c of demoClasses) {
        await dbRun(
          'INSERT INTO classes (id, title, subject, teacherId, teacherName, date, startTime, duration, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [c.id, c.title, c.subject, c.teacherId, c.teacherName, c.date, c.startTime, c.duration, c.status]
        );
      }

      // Seed Fees for Student 'stud1'
      const months = [
        { month: 'January 2026', amount: 3500, status: 'PAID', date: '2026-01-10', invoice: 'INV-001' },
        { month: 'February 2026', amount: 3500, status: 'PAID', date: '2026-02-11', invoice: 'INV-002' },
        { month: 'March 2026', amount: 3500, status: 'PAID', date: '2026-03-10', invoice: 'INV-003' },
        { month: 'April 2026', amount: 3500, status: 'PAID', date: '2026-04-12', invoice: 'INV-004' },
        { month: 'May 2026', amount: 3500, status: 'PAID', date: '2026-05-10', invoice: 'INV-005' },
        { month: 'June 2026', amount: 3500, status: 'PENDING', date: '-', invoice: '-' },
        { month: 'July 2026', amount: 3500, status: 'PENDING', date: '-', invoice: '-' },
        { month: 'August 2026', amount: 3500, status: 'PENDING', date: '-', invoice: '-' },
        { month: 'September 2026', amount: 3500, status: 'PENDING', date: '-', invoice: '-' },
        { month: 'October 2026', amount: 3500, status: 'PENDING', date: '-', invoice: '-' },
        { month: 'November 2026', amount: 3500, status: 'PENDING', date: '-', invoice: '-' },
        { month: 'December 2026', amount: 3500, status: 'PENDING', date: '-', invoice: '-' },
      ];

      for (const m of months) {
        await dbRun(
          'INSERT INTO fees (studentId, month, amount, status, date, invoice) VALUES (?, ?, ?, ?, ?, ?)',
          ['stud1', m.month, m.amount, m.status, m.date, m.invoice]
        );
      }

      // Seed Library Books
      const demoBooks = [
        {
          id: '1',
          title: 'Mathematics - Class X',
          subject: 'Mathematics',
          board: 'CBSE',
          grade: 'Class 10',
          author: 'NCERT',
          coverUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600',
          pdfUrl: 'https://ncert.nic.in/textbook/pdf/jemh101.pdf'
        },
        {
          id: '2',
          title: 'Science - Class X',
          subject: 'Science',
          board: 'CBSE',
          grade: 'Class 10',
          author: 'NCERT',
          coverUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600',
          pdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc101.pdf'
        },
        {
          id: '3',
          title: 'Biology - Life Processes',
          subject: 'Science',
          board: 'CBSE',
          grade: 'Class 10',
          author: 'NCERT',
          coverUrl: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=600',
          pdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc106.pdf'
        },
        {
          id: '4',
          title: 'Biology - Class XII',
          subject: 'Science',
          board: 'CBSE',
          grade: 'Class 12',
          author: 'NCERT',
          coverUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600',
          pdfUrl: 'https://ncert.nic.in/textbook/pdf/lebo101.pdf'
        }
      ];

      for (const b of demoBooks) {
        await dbRun(
          'INSERT INTO library_books (id, title, subject, board, grade, author, coverUrl, pdfUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [b.id, b.title, b.subject, b.board, b.grade, b.author, b.coverUrl, b.pdfUrl]
        );
      }

      console.log('Database seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

export default db;
