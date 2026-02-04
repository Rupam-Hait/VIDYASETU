import React, { useState, useRef } from 'react';
import { FileText, Upload, Sparkles, Copy, Check, FileType, AlertCircle } from 'lucide-react';
import { compressStudyMaterial } from '../services/geminiService';

export const TextCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [compressedText, setCompressedText] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setCompressedText('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setCompressedText('');
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove data URL prefix (e.g., "data:image/png;base64,")
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const base64 = await convertToBase64(file);
      const result = await compressStudyMaterial(base64, file.type);
      setCompressedText(result);
    } catch (error) {
      console.error(error);
      setCompressedText("Error processing file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(compressedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Sparkles className="text-cyan-400 w-8 h-8" /> 
            Smart Study Notes
          </h2>
          <p className="text-slate-400 mt-1">Upload a book page or document. We'll compress it into exam-ready notes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        {/* Left Side: Upload */}
        <div className="flex flex-col gap-4">
          <div 
            className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer relative overflow-hidden group ${
              file ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 hover:border-cyan-500/30'
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
            />
            
            {!file ? (
              <>
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Upload className="w-10 h-10 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Click or Drag to Upload</h3>
                <p className="text-slate-400 text-center max-w-xs">Supports PDF, PNG, JPG. Perfect for scanning textbook pages.</p>
              </>
            ) : (
              <div className="text-center z-10">
                 <div className="w-20 h-20 bg-cyan-900/50 rounded-full flex items-center justify-center mb-6 mx-auto border border-cyan-500/30">
                  <FileType className="w-10 h-10 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{file.name}</h3>
                <p className="text-cyan-300 text-sm font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); setCompressedText(''); }}
                  className="mt-4 text-red-400 text-sm hover:underline"
                >
                  Remove File
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={handleCompress}
            disabled={!file || loading}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Compressing Text...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Generate Magic Gist
              </>
            )}
          </button>
        </div>

        {/* Right Side: Output */}
        <div className="glass-panel rounded-2xl flex flex-col overflow-hidden h-[500px] lg:h-auto relative">
          <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" /> Compressed Notes
            </h3>
            {compressedText && (
              <button 
                onClick={copyToClipboard}
                className="text-xs flex items-center gap-1 bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-white transition"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 bg-slate-900/50">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce"></div>
                </div>
                <p className="animate-pulse">Reading document & extracting key facts...</p>
              </div>
            ) : compressedText ? (
              <div className="prose prose-invert prose-cyan max-w-none">
                <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                  {compressedText}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <p>Upload a file to see the summarized study notes here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
