import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Database, Loader2 } from 'lucide-react';
import { generateRAGResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIChatProps {
  userRole: string;
}

type ChatStatus = 'idle' | 'searching' | 'generating';

export const AIChat: React.FC<AIChatProps> = ({ userRole }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Namaste! I am Setu. Ask me about school policies, holidays, fees, or bus routes. I'll search the school handbook for you.`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<ChatStatus>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // RAG Visual Feedback Sequence
    setStatus('searching');
    
    // Simulate network latency for search (optional, improves UX feel)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setStatus('generating');

    const responseText = await generateRAGResponse(userMsg.text, userRole);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setStatus('idle');
  };

  return (
    <div className="flex flex-col h-[600px] glass-panel rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 bg-cyan-900/30 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-full border border-cyan-500/30">
            <Bot className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-cyan-50">Setu AI Assistant</h3>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <p className="text-xs text-cyan-300/70">Online • RAG Enabled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none'
                  : 'bg-slate-700/80 text-cyan-50 border border-cyan-500/20 rounded-tl-none'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <p className={`text-[10px] mt-2 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Status Indicators */}
        {status === 'searching' && (
          <div className="flex justify-start animate-fadeIn">
             <div className="bg-slate-800/80 text-cyan-400 text-xs px-4 py-2 rounded-full border border-cyan-500/30 flex items-center gap-2">
                <Database className="w-3 h-3 animate-pulse" />
                Retrieving relevant documents...
             </div>
          </div>
        )}

        {status === 'generating' && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-slate-700/50 rounded-2xl p-4 border border-cyan-500/10">
              <div className="flex items-center gap-2 text-slate-300 text-xs mb-2">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Generating Answer
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-900/50 border-t border-cyan-500/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about exam dates, fees, or policies..."
            className="flex-1 bg-slate-800 text-white placeholder-slate-400 border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={status !== 'idle'}
            className="bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-cyan-500/20"
          >
            {status !== 'idle' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};