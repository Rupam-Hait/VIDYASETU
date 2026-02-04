import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Bus, 
  CreditCard, 
  MessageSquare, 
  LogOut, 
  GraduationCap, 
  Calendar, 
  Menu, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Lock, 
  ChevronLeft, 
  BrainCircuit, 
  FileText, 
  Mail, 
  Phone
} from 'lucide-react';
import { Logo } from './components/Logo';
import { AIChat } from './components/AIChat';
import { Attendance } from './components/Attendance';
import { Quiz } from './components/Quiz';
import { TextCompressor } from './components/TextCompressor';
import { OnlineClass } from './components/OnlineClass';
import { Fees } from './components/Fees';
import { Library } from './components/Library';
import { BusTracker } from './components/BusTracker';
import { User, UserRole, ClassSession } from './types';
import { DEMO_USERS, MOCK_NOTICES, MOCK_CLASSES } from './constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// --- View State Management ---
type ViewState = 'landing' | 'login' | 'app';

// --- Landing Page Component ---
const LandingPage: React.FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      {/* Sticky Navbar */}
      <nav className="fixed w-full z-50 glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <Logo size="md" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-slate-300 hover:text-cyan-400 transition-colors">Features</button>
              <button onClick={() => scrollToSection('about')} className="text-slate-300 hover:text-cyan-400 transition-colors">About</button>
              <button onClick={() => scrollToSection('contact')} className="text-slate-300 hover:text-cyan-400 transition-colors">Contact</button>
              <button 
                onClick={onLoginClick}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-6 py-2.5 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transform hover:scale-105"
              >
                Login
              </button>
            </div>
            {/* Mobile menu button placeholder */}
            <div className="md:hidden">
              <button onClick={onLoginClick} className="text-cyan-400 font-bold border border-cyan-400/50 px-4 py-2 rounded-lg">
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="University Campus" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-semibold tracking-wide animate-fadeIn">
             ✨ The Future of School Management
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-slideUp">
            Bridge to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">Knowledge</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-slideUp" style={{animationDelay: '0.2s'}}>
            Empower students, teachers, and parents with VIDYASETU. 
            Experience AI-driven analytics, seamless communication, and smart management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp" style={{animationDelay: '0.4s'}}>
            <button onClick={onLoginClick} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-lg px-8 py-4 rounded-full font-bold shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform hover:translate-y-[-2px]">
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-900 relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose VidyaSetu?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to run your educational institution efficiently, all in one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "AI-Powered RAG", desc: "Instant answers from school policy documents using Gemini AI." },
              { icon: ShieldCheck, title: "Smart Attendance", desc: "Facial recognition integration for secure and fast attendance marking." },
              { icon: BrainCircuit, title: "AI Quizzes", desc: "Generate unlimited practice quizzes on any topic instantly." },
              { icon: FileText, title: "Smart Notes", desc: "Compress heavy textbook pages into concise exam-ready notes." },
              { icon: CreditCard, title: "Fee Management", desc: "Secure online payments and automated reminders for parents." },
              { icon: GraduationCap, title: "Result Analysis", desc: "Comprehensive dashboards to track student performance trends." }
            ].map((feature, i) => (
              <div key={i} className="glass-panel p-8 rounded-2xl hover:bg-slate-800/50 transition-colors group">
                <div className="w-14 h-14 bg-cyan-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-950 py-12 border-t border-slate-800 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start">
               <Logo size="sm" />
               <p className="text-slate-500 text-sm mt-4 text-center md:text-left">
                 Empowering education with advanced technology.
               </p>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col items-center md:items-start space-y-3">
               <h3 className="text-white font-bold mb-2">Contact Us</h3>
               <div className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:contact@vidyasetu.edu.in">contact@vidyasetu.edu.in</a>
               </div>
               <div className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+919876543210">+91 98765 43210</a>
               </div>
            </div>

            {/* Links */}
            <div className="flex flex-col items-center md:items-end space-y-2">
               <h3 className="text-white font-bold mb-2">Legal</h3>
               <a href="#" className="text-slate-400 hover:text-cyan-400 text-sm">Privacy Policy</a>
               <a href="#" className="text-slate-400 hover:text-cyan-400 text-sm">Terms of Service</a>
               <a href="#" className="text-slate-400 hover:text-cyan-400 text-sm">Support</a>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center">
             <p className="text-slate-600 text-sm">© 2026 VidyaSetu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- Auth Component (Login/Signup) ---
const AuthPage: React.FC<{ onLogin: (user: User) => void, onBack: () => void }> = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole(UserRole.STUDENT);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // 1. Get stored users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem('vidyasetu_users') || '[]');
      // 2. Combine with Demo users for Login check
      const allUsers = [...DEMO_USERS, ...storedUsers];

      if (isLogin) {
        // --- LOGIN LOGIC ---
        const user = allUsers.find(u => u.id === email && u.password === password);
        
        if (user) {
          onLogin({ id: user.id, name: user.name, role: user.role, class: user.class });
        } else {
          setError('Invalid Credentials. Please check your email and password.');
        }
      } else {
        // --- SIGNUP LOGIC ---
        // Check if user already exists
        if (allUsers.find(u => u.id === email)) {
            setError('User already exists with this email ID.');
            setLoading(false);
            return;
        }

        const newUser = {
            id: email, // Use email as ID
            name: name,
            role: role,
            password: password,
            class: '10-A' // Default class for demo
        };

        // Save to localStorage
        localStorage.setItem('vidyasetu_users', JSON.stringify([...storedUsers, newUser]));
        
        // Auto-login
        onLogin(newUser);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-slate-900">
      {/* Left Side - Image */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-800 items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Study Group" 
          className="absolute inset-0 w-full h-full object-cover opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/20"></div>
        <div className="relative z-10 p-12 text-white max-w-xl">
           <Logo size="lg" />
           <h2 className="text-4xl font-bold mt-8 mb-6">Welcome to your digital campus.</h2>
           <p className="text-lg text-slate-300">Access your grades, attend classes, and stay updated with the latest announcements, all in one secure platform.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative">
        <button onClick={onBack} className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
          <ChevronLeft className="w-5 h-5" /> Back to Home
        </button>

        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Sign In' : 'Create Account'}</h2>
            <p className="text-slate-400">
              {isLogin ? "Enter your email & password to access" : "Join VidyaSetu today"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
             {!isLogin && (
               <>
                <div className="relative">
                    <UserRoleIcon className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                    <input 
                        type="text" 
                        required={!isLogin}
                        placeholder="Full Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition" 
                    />
                </div>
                
                <div className="relative">
                    <div className="absolute left-3 top-3.5 text-slate-500">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition appearance-none"
                    >
                        <option value={UserRole.STUDENT}>I am a Student</option>
                        <option value={UserRole.TEACHER}>I am a Teacher</option>
                        <option value={UserRole.PARENT}>I am a Parent</option>
                        <option value={UserRole.ADMIN}>I am an Admin</option>
                    </select>
                </div>
               </>
             )}
             
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Email ID</label>
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-slate-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition"
                    placeholder="name@example.com"
                  />
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-slate-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
             </div>

             {error && <div className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded-lg border border-red-500/30">{error}</div>}

             <button 
               type="submit" 
               disabled={loading}
               className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-wait"
             >
               {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
             </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => { setIsLogin(!isLogin); resetForm(); }}
                className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-xs text-center text-slate-500 mb-2">Or use Demo Credentials</p>
            <div className="flex justify-center gap-3 text-xs text-slate-400">
              <span onClick={() => {setEmail('stud1'); setPassword('123'); setIsLogin(true)}} className="cursor-pointer hover:text-cyan-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">Student: stud1</span>
              <span onClick={() => {setEmail('teach1'); setPassword('123'); setIsLogin(true)}} className="cursor-pointer hover:text-cyan-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">Teacher: teach1</span>
            </div>
            <div className="flex justify-center mt-2">
               <span onClick={() => {setEmail('admin1'); setPassword('123'); setIsLogin(true)}} className="cursor-pointer hover:text-cyan-400 text-xs text-slate-500">Admin Login</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserRoleIcon = (props: any) => <Users {...props} />;

// --- Main App (Dashboard) ---
interface DashboardProps {
  user: User;
  onLogout: () => void;
  classes: ClassSession[];
  setClasses: React.Dispatch<React.SetStateAction<ClassSession[]>>;
}

const DashboardApp: React.FC<DashboardProps> = ({ user, onLogout, classes, setClasses }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Navigation config with Role-based Access Control
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT] },
    { id: 'classes', label: 'Online Classes', icon: GraduationCap, roles: [UserRole.TEACHER, UserRole.STUDENT] },
    { id: 'attendance', label: 'Smart Attendance', icon: Users, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
    { id: 'bus', label: 'Bus Tracking', icon: Bus, roles: [UserRole.STUDENT, UserRole.PARENT] },
    { id: 'ai-help', label: 'AI Chatbot', icon: MessageSquare, highlight: true, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT] },
    { id: 'quiz', label: 'AI Quiz', icon: BrainCircuit, highlight: true, roles: [UserRole.STUDENT] },
    { id: 'compress', label: 'Smart Notes', icon: FileText, highlight: true, roles: [UserRole.STUDENT] },
    { id: 'fees', label: 'Fees & Payments', icon: CreditCard, roles: [UserRole.STUDENT, UserRole.ADMIN, UserRole.PARENT] },
    { id: 'library', label: 'Library', icon: BookOpen, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
  ];

  // Filter navigation based on current user role
  const allowedNavItems = navItems.filter(item => item.roles.includes(user.role));

  const renderContent = () => {
    switch(currentView) {
      case 'dashboard':
        const isTeacher = user.role === UserRole.TEACHER;
        const isAdmin = user.role === UserRole.ADMIN;
        
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats Cards */}
              
              {/* Card 1: Grade vs Salary vs Admin Stat */}
              {isTeacher ? (
                 <div className="glass-panel p-6 rounded-2xl border-l-4 border-green-400">
                  <h3 className="text-slate-400 text-sm font-medium">Net Salary (May)</h3>
                  <p className="text-3xl font-bold text-white mt-1">₹45,000</p>
                  <div className="text-green-400 text-xs mt-2">Paid on 01/05/2024</div>
                </div>
              ) : isAdmin ? (
                 <div className="glass-panel p-6 rounded-2xl border-l-4 border-purple-400">
                  <h3 className="text-slate-400 text-sm font-medium">Total Students</h3>
                  <p className="text-3xl font-bold text-white mt-1">1,240</p>
                  <div className="text-green-400 text-xs mt-2">+45 New Admissions</div>
                </div>
              ) : (
                <div className="glass-panel p-6 rounded-2xl border-l-4 border-cyan-400">
                  <h3 className="text-slate-400 text-sm font-medium">Average Grade</h3>
                  <p className="text-3xl font-bold text-white mt-1">A (92%)</p>
                  <div className="text-green-400 text-xs mt-2">↑ 2.5% from last term</div>
                </div>
              )}

              {/* Card 2: Attendance (Common) */}
              <div className="glass-panel p-6 rounded-2xl border-l-4 border-blue-400">
                <h3 className="text-slate-400 text-sm font-medium">{isAdmin ? 'Staff Attendance' : 'Attendance'}</h3>
                <p className="text-3xl font-bold text-white mt-1">{isAdmin ? '98%' : '96%'}</p>
                <div className="text-slate-400 text-xs mt-2">{isAdmin ? '42/43 Present' : '28/30 Days Present'}</div>
              </div>

              {/* Card 3: Fees vs Leaves */}
              {isTeacher ? (
                <div className="glass-panel p-6 rounded-2xl border-l-4 border-yellow-400">
                  <h3 className="text-slate-400 text-sm font-medium">Leave Balance</h3>
                  <p className="text-3xl font-bold text-white mt-1">12 Days</p>
                  <div className="text-yellow-400 text-xs mt-2">Casual Leaves remaining</div>
                </div>
              ) : isAdmin ? (
                 <div className="glass-panel p-6 rounded-2xl border-l-4 border-green-400">
                  <h3 className="text-slate-400 text-sm font-medium">Fee Collection</h3>
                  <p className="text-3xl font-bold text-white mt-1">₹1.25 Cr</p>
                  <div className="text-green-400 text-xs mt-2">Target reached</div>
                </div>
              ) : (
                <div className="glass-panel p-6 rounded-2xl border-l-4 border-orange-400">
                  <h3 className="text-slate-400 text-sm font-medium">Pending Fees</h3>
                  <p className="text-3xl font-bold text-white mt-1">₹7,000</p>
                  <div className="text-orange-400 text-xs mt-2">2 Months Pending</div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Charts */}
              {isTeacher ? (
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-4">Salary History</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salaryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                          itemStyle={{ color: '#4ade80' }}
                          formatter={(value) => [`₹${value}`, 'Amount']}
                        />
                        <Line type="monotone" dataKey="amount" stroke="#4ade80" strokeWidth={3} dot={{ fill: '#4ade80' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-white mb-4">
                    {isAdmin ? 'School Performance Index' : 'Academic Performance'}
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                          itemStyle={{ color: '#22d3ee' }}
                        />
                        <Line type="monotone" dataKey="score" stroke="#22d3ee" strokeWidth={3} dot={{ fill: '#22d3ee' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Notices (Common) */}
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Notices & Announcements</h3>
                <div className="space-y-4">
                  {MOCK_NOTICES.map(notice => (
                    <div key={notice.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-cyan-100">{notice.title}</h4>
                        <span className="text-xs bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded">{notice.type}</span>
                      </div>
                      <p className="text-sm text-slate-400">{notice.content}</p>
                      <p className="text-xs text-slate-500 mt-2">{notice.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'attendance':
        return <Attendance />;
      case 'quiz':
        return <Quiz />;
      case 'compress':
        return <TextCompressor />;
      case 'fees':
        return <Fees user={user} />;
      case 'library':
        return <Library />;
      case 'bus':
        return <BusTracker />;
      case 'ai-help':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-2">
              <AIChat userRole={user.role} />
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-4">About RAG Tech</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                This Chatbot uses <strong>Retrieval-Augmented Generation</strong>.
              </p>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                When you ask a question, the system first searches the school's digital handbook (policies, schedules, fees) for relevant information.
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                It then combines that specific knowledge with Gemini's AI capabilities to give you an accurate, school-specific answer.
              </p>
            </div>
          </div>
        );
      case 'classes':
        return <OnlineClass user={user} classes={classes} setClasses={setClasses} />;
      default:
        return <div className="text-white p-10 text-center">Module under construction</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex text-slate-100 font-sans selection:bg-cyan-500/30">
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-800 rounded-lg text-cyan-400 shadow-lg">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <aside className={`fixed md:relative z-40 w-72 h-screen glass-panel border-r border-cyan-900/30 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}>
        <div className="p-8 border-b border-slate-700/50">
          <Logo size="md" />
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {allowedNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                currentView === item.id 
                  ? 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-cyan-200'
              } ${item.highlight ? 'border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : ''}`}
            >
              <item.icon className={`w-5 h-5 ${currentView === item.id ? 'animate-pulse' : ''}`} />
              <span className="font-medium">{item.label}</span>
              {currentView === item.id && (
                <div className="absolute right-0 top-0 h-full w-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-700/50 bg-slate-900/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold border-2 border-slate-700 shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{user.name}</p>
              <p className="text-xs text-cyan-400">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(34,211,238,0.5)]"></div>
        
        <div className="p-6 md:p-10 max-w-7xl mx-auto pt-16 md:pt-10">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {currentView === 'dashboard' ? `Welcome back, ${user.name.split(' ')[0]}` : 
                 navItems.find(n => n.id === currentView)?.label}
              </h1>
              <p className="text-slate-400 mt-1">
                {currentView === 'dashboard' ? "Here's what's happening at VIDYASETU today." : "Manage your school activities efficiently."}
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-2xl font-mono text-cyan-400 font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </header>

          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// --- Main App Logic ---
const performanceData = [
  { name: 'Mon', score: 85 },
  { name: 'Tue', score: 88 },
  { name: 'Wed', score: 92 },
  { name: 'Thu', score: 89 },
  { name: 'Fri', score: 95 },
];

const salaryData = [
  { name: 'Jan', amount: 42000 },
  { name: 'Feb', amount: 42000 },
  { name: 'Mar', amount: 42000 },
  { name: 'Apr', amount: 45000 }, // Increment
  { name: 'May', amount: 45000 },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [viewState, setViewState] = useState<ViewState>('landing');
  // Lifted state for Classes to persist schedule across user sessions for demo
  const [classes, setClasses] = useState<ClassSession[]>(MOCK_CLASSES);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setViewState('app');
  };

  const handleLogout = () => {
    setUser(null);
    setViewState('landing');
  };

  return (
    <>
      {viewState === 'landing' && <LandingPage onLoginClick={() => setViewState('login')} />}
      {viewState === 'login' && <AuthPage onLogin={handleLogin} onBack={() => setViewState('landing')} />}
      {viewState === 'app' && user && <DashboardApp user={user} onLogout={handleLogout} classes={classes} setClasses={setClasses} />}
    </>
  );
}
