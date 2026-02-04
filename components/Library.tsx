import React, { useState } from 'react';
import { BookOpen, Filter, ExternalLink, QrCode, X, Search, GraduationCap, Atom } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  subject: 'Science' | 'Mathematics';
  board: 'CBSE';
  grade: string;
  author: string;
  coverUrl: string;
  pdfUrl: string;
}

const BOOKS: Book[] = [
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
    id: '5',
    title: 'Biology - Life Processes',
    subject: 'Science',
    board: 'CBSE',
    grade: 'Class 10',
    author: 'NCERT',
    coverUrl: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=600',
    pdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc106.pdf'
  },
  {
    id: '6',
    title: 'Biology - Class XII',
    subject: 'Science',
    board: 'CBSE',
    grade: 'Class 12',
    author: 'NCERT',
    coverUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600',
    pdfUrl: 'https://ncert.nic.in/textbook/pdf/lebo101.pdf'
  }
];

export const Library: React.FC = () => {
  const [filterBoard, setFilterBoard] = useState<'ALL' | 'CBSE'>('ALL');
  const [filterSubject, setFilterSubject] = useState<'ALL' | 'Science' | 'Mathematics'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQr, setSelectedQr] = useState<Book | null>(null);

  const filteredBooks = BOOKS.filter(book => {
    const matchesBoard = filterBoard === 'ALL' || book.board === filterBoard;
    const matchesSubject = filterSubject === 'ALL' || book.subject === filterSubject;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBoard && matchesSubject && matchesSearch;
  });

  return (
    <div className="p-6 min-h-full animate-fadeIn">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <BookOpen className="text-cyan-400 w-8 h-8" /> Digital Library
          </h2>
          <p className="text-slate-400 mt-1">Access {BOOKS.length}+ curriculum books instantly.</p>
        </div>
        
        <div className="flex gap-2">
            <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 flex items-center gap-2">
                <div className="p-1.5 bg-cyan-900/50 rounded-lg"><GraduationCap className="w-4 h-4 text-cyan-400" /></div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Board</span>
                    <span className="text-sm font-bold text-white">CBSE</span>
                </div>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 flex items-center gap-2">
                <div className="p-1.5 bg-cyan-900/50 rounded-lg"><Atom className="w-4 h-4 text-cyan-400" /></div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Subjects</span>
                    <span className="text-sm font-bold text-white">Sci & Math</span>
                </div>
            </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter className="w-5 h-5 text-slate-400" />
          <select 
            value={filterBoard}
            onChange={(e) => setFilterBoard(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-xl focus:border-cyan-500 outline-none text-sm"
          >
            <option value="ALL">All Boards</option>
            <option value="CBSE">CBSE</option>
          </select>

          <select 
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-xl focus:border-cyan-500 outline-none text-sm"
          >
            <option value="ALL">All Subjects</option>
            <option value="Science">Science</option>
            <option value="Mathematics">Mathematics</option>
          </select>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search books..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-2 focus:border-cyan-500 outline-none text-sm"
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="glass-panel rounded-2xl overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
            {/* Book Cover */}
            <div className="relative h-48 bg-slate-800 overflow-hidden">
              <img 
                src={book.coverUrl} 
                alt={book.title} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                 <span className="px-2 py-1 rounded-md text-[10px] font-bold text-white shadow-lg bg-orange-500">
                    {book.board}
                 </span>
                 <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-900/80 text-cyan-400 border border-cyan-500/30 backdrop-blur-md shadow-lg">
                    {book.grade}
                 </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-1 line-clamp-1" title={book.title}>{book.title}</h3>
              <p className="text-sm text-slate-400 mb-4">{book.author}</p>
              
              <div className="grid grid-cols-2 gap-2">
                <a 
                  href={book.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded-lg text-sm font-bold transition shadow-lg shadow-cyan-500/20"
                >
                  <ExternalLink className="w-4 h-4" /> Read
                </a>
                <button 
                  onClick={() => setSelectedQr(book)}
                  className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm font-bold transition border border-slate-600"
                >
                  <QrCode className="w-4 h-4" /> Scan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-white">No books found</h3>
            <p className="text-slate-400">Try adjusting your filters or search query.</p>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-sm w-full relative shadow-2xl">
            <button 
              onClick={() => setSelectedQr(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-1">Scan to Read</h3>
              <p className="text-cyan-400 text-sm font-medium">{selectedQr.title}</p>
            </div>

            <div className="bg-white p-4 rounded-2xl mx-auto w-fit mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
               <img 
                 src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedQr.pdfUrl)}`}
                 alt="Book QR Code"
                 className="w-48 h-48"
               />
            </div>

            <p className="text-center text-slate-400 text-xs">
              Point your phone's camera at this QR code to open the book PDF immediately on your device.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};