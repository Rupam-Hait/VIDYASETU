import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, 
  Users, Calendar, Clock, Plus, Play, Loader2, Send,
  MonitorUp, MonitorOff, PenTool, Eraser, Trash2, Palette,
  MousePointer2, Type
} from 'lucide-react';
import { User, UserRole, ClassSession } from '../types';

interface OnlineClassProps {
  user: User;
  classes: ClassSession[];
  setClasses: React.Dispatch<React.SetStateAction<ClassSession[]>>;
}

type ViewState = 'dashboard' | 'lobby' | 'room';
type DisplayMode = 'camera' | 'screen' | 'whiteboard';

interface ClassMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isSystem?: boolean;
}

interface TextInputState {
  x: number;
  y: number;
  text: string;
  width: number;
  height: number;
}

export const OnlineClass: React.FC<OnlineClassProps> = ({ user, classes, setClasses }) => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [currentSession, setCurrentSession] = useState<ClassSession | null>(null);
  
  // Media State
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('camera');
  
  const myVideoRef = useRef<HTMLVideoElement>(null); // For PIP
  const mainVideoRef = useRef<HTMLVideoElement>(null); // For Screen/Main Camera
  
  // Whiteboard State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'text'>('pen');
  
  // Text Tool State
  const [textInput, setTextInput] = useState<TextInputState | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Chat State
  const [showChat, setShowChat] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ClassMessage[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  
  // Schedule Form State
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [newClass, setNewClass] = useState({ title: '', subject: '', date: '', time: '' });

  // --- MEDIA HANDLING ---

  const startMediaStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(mediaStream);
      setMicOn(mediaStream.getAudioTracks()[0].enabled);
      setCamOn(mediaStream.getVideoTracks()[0].enabled);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("Could not access camera/microphone. Please check permissions.");
    }
  };

  const stopMediaStream = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleCam = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCamOn(videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (displayMode === 'screen') {
      // Stopping screen share
      if (screenStream) {
        screenStream.getTracks().forEach(track => {
          track.onended = null; // Remove listener to avoid double-call
          track.stop();
        });
      }
      setScreenStream(null);
      setDisplayMode('camera');
    } else {
      // Starting screen share
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true,
          audio: true // Request system audio
        });
        
        // Handle user clicking "Stop Sharing" in browser UI
        stream.getVideoTracks()[0].onended = () => {
          setScreenStream(null);
          setDisplayMode('camera');
        };

        setScreenStream(stream);
        setDisplayMode('screen');
      } catch (err) {
        console.error("Error starting screen share:", err);
      }
    }
  };

  const toggleWhiteboard = () => {
    if (displayMode === 'whiteboard') {
      setDisplayMode('camera');
    } else {
      setDisplayMode('whiteboard');
    }
  };

  // --- WHITEBOARD LOGIC ---
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if (tool === 'text') {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setTimeout(() => {
          setTextInput({ x, y, text: '', width: 200, height: 100 });
        }, 10);
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#f1f5f9' : brushColor; 
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const drawTextToCanvas = (text: string, x: number, y: number, maxWidth: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && text) {
        ctx.fillStyle = brushColor;
        const fontSize = Math.max(14, brushSize * 3);
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textBaseline = 'top';
        const words = text.split(' ');
        let line = '';
        let currentY = y + 4;
        const lineHeight = fontSize * 1.2;
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  useEffect(() => {
    if (textInput && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [textInput]);

  useEffect(() => {
    if (displayMode === 'whiteboard' && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      if(ctx) {
          ctx.fillStyle = '#f1f5f9';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [displayMode]);

  useEffect(() => {
    const videoEl = mainVideoRef.current;
    if (videoEl) {
      // Clear previous source to prevent freezing
      videoEl.srcObject = null;

      if (displayMode === 'screen' && screenStream) {
        videoEl.srcObject = screenStream;
        videoEl.play().catch(e => console.error("Error playing screen stream:", e));
      } else if (displayMode === 'camera' && localStream) {
        videoEl.srcObject = localStream; 
        videoEl.play().catch(e => console.error("Error playing local stream:", e));
      }
    }
  }, [displayMode, screenStream, localStream, view]);

  useEffect(() => {
    if (myVideoRef.current && localStream) {
      myVideoRef.current.srcObject = localStream;
      myVideoRef.current.play().catch(e => console.error("Error playing PIP stream:", e));
    }
  }, [localStream, view]);

  useEffect(() => {
    if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, showChat]);

  useEffect(() => {
    return () => stopMediaStream();
  }, []);

  const handleScheduleClass = (e: React.FormEvent) => {
    e.preventDefault();
    const session: ClassSession = {
      id: Date.now().toString(),
      title: newClass.title,
      subject: newClass.subject,
      teacherId: user.id,
      teacherName: user.name,
      date: newClass.date,
      startTime: newClass.time,
      duration: 60,
      status: 'scheduled',
      attendees: 0
    };
    setClasses(prev => [...prev, session]);
    setShowScheduleForm(false);
    setNewClass({ title: '', subject: '', date: '', time: '' });
  };

  const handleJoinClick = (session: ClassSession) => {
    setCurrentSession(session);
    setChatMessages([
        { 
            id: 'sys_1', 
            sender: 'System', 
            text: `Welcome to ${session.title}. Please be respectful.`, 
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
            isSystem: true 
        }
    ]);
    startMediaStream();
    setView('lobby');
  };

  const enterClassroom = () => {
    if (currentSession && user.role === UserRole.TEACHER) {
        const sessionId = currentSession.id;
        setClasses(prev => prev.map(c => c.id === sessionId ? { ...c, status: 'live' } : c));
    }
    setView('room');
  };

  const leaveClassroom = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!currentSession) {
        setView('dashboard');
        return;
    }

    const sessionId = currentSession.id;

    if (user.role === UserRole.TEACHER) {
        if (window.confirm("Do you want to end the class session?")) {
            setClasses(prev => prev.map(c => c.id === sessionId ? { ...c, status: 'ended' } : c));
            stopMediaStream();
            setView('dashboard');
            setCurrentSession(null);
            setDisplayMode('camera');
        }
    } else {
        stopMediaStream();
        setView('dashboard');
        setCurrentSession(null);
        setDisplayMode('camera');
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg: ClassMessage = {
        id: Date.now().toString(),
        sender: user.name,
        text: chatInput,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  if (view === 'dashboard') {
    return (
      <div className="animate-fadeIn p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <MonitorUp className="text-cyan-400 w-8 h-8" /> Online Classes
            </h2>
            <p className="text-slate-400 mt-1">Join live sessions or schedule upcoming lectures.</p>
          </div>
          {(user.role === UserRole.TEACHER || user.role === UserRole.ADMIN) && (
            <button 
              onClick={() => setShowScheduleForm(!showScheduleForm)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition"
            >
              <Plus className="w-5 h-5" /> Schedule Class
            </button>
          )}
        </div>

        {showScheduleForm && (
          <div className="glass-panel p-6 rounded-2xl mb-8 border border-cyan-500/30 animate-slideUp">
             <h3 className="text-xl font-bold text-white mb-4">Schedule New Session</h3>
             <form onSubmit={handleScheduleClass} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input required type="text" placeholder="Class Title (e.g. Algebra)" className="bg-slate-900 border border-slate-700 text-white p-3 rounded-lg" value={newClass.title} onChange={e => setNewClass({...newClass, title: e.target.value})} />
                <input required type="text" placeholder="Subject" className="bg-slate-900 border border-slate-700 text-white p-3 rounded-lg" value={newClass.subject} onChange={e => setNewClass({...newClass, subject: e.target.value})} />
                <input required type="date" className="bg-slate-900 border border-slate-700 text-white p-3 rounded-lg" value={newClass.date} onChange={e => setNewClass({...newClass, date: e.target.value})} />
                <input required type="time" className="bg-slate-900 border border-slate-700 text-white p-3 rounded-lg" value={newClass.time} onChange={e => setNewClass({...newClass, time: e.target.value})} />
                <div className="md:col-span-4 flex justify-end gap-3 mt-2">
                    <button type="button" onClick={() => setShowScheduleForm(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                    <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold">Create Schedule</button>
                </div>
             </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
               {cls.status === 'live' && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full">
                     <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                     </span>
                     <span className="text-red-400 text-xs font-bold tracking-wider">LIVE</span>
                  </div>
               )}
               {cls.status === 'ended' && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-400 font-bold">
                     ENDED
                  </div>
               )}

               <h3 className="text-xl font-bold text-white mb-1">{cls.title}</h3>
               <p className="text-cyan-400 text-sm font-medium mb-4">{cls.subject}</p>
               
               <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                     <Users className="w-4 h-4" /> {cls.teacherName}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                     <Calendar className="w-4 h-4" /> {cls.date}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                     <Clock className="w-4 h-4" /> {cls.startTime} ({cls.duration} min)
                  </div>
               </div>

               {cls.status !== 'ended' || user.role === UserRole.TEACHER ? (
                  <button 
                    onClick={() => handleJoinClick(cls)}
                    disabled={user.role === UserRole.STUDENT && cls.status !== 'live'}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                        user.role === UserRole.TEACHER 
                        ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                        : cls.status === 'live'
                            ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {user.role === UserRole.TEACHER ? (
                        <> {cls.status === 'live' || cls.status === 'ended' ? 'Re-join Class' : 'Start Class'} <Play className="w-4 h-4 fill-current" /> </>
                    ) : (
                        <> {cls.status === 'live' ? 'Join Live Class' : 'Waiting for Host...'} </>
                    )}
                  </button>
               ) : (
                  <button disabled className="w-full py-3 rounded-xl bg-slate-800 text-slate-600 font-bold cursor-not-allowed">
                     Class Completed
                  </button>
               )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'lobby') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 animate-fadeIn">
        <div className="glass-panel max-w-4xl w-full p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white">System Check</h2>
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              <video 
                ref={myVideoRef} 
                autoPlay 
                muted 
                playsInline 
                className={`w-full h-full object-cover transform scale-x-[-1] ${!camOn && 'hidden'}`} 
              />
              {!camOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-slate-500">
                  <VideoOff className="w-12 h-12 mb-2" />
                  <p>Camera is off</p>
                </div>
              )}
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 bg-slate-900/80 p-2 rounded-full backdrop-blur-md border border-slate-700 z-10">
                <button onClick={toggleMic} className={`p-3 rounded-full transition ${micOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white'}`}>
                  {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <button onClick={toggleCam} className={`p-3 rounded-full transition ${camOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white'}`}>
                  {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6">
             <div>
                <h1 className="text-4xl font-bold text-white mb-2">{currentSession?.title}</h1>
                <p className="text-slate-400 text-lg flex items-center gap-2">
                   <Users className="w-4 h-4" /> {currentSession?.teacherName}
                </p>
             </div>
             
             <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <p className="text-sm text-slate-300">Ensure you are in a quiet environment. Your microphone is {micOn ? 'ON' : 'OFF'} and camera is {camOn ? 'ON' : 'OFF'}.</p>
             </div>

             <div className="flex gap-4">
                <button 
                  onClick={() => { stopMediaStream(); setView('dashboard'); }}
                  className="px-6 py-4 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition"
                >
                   Cancel
                </button>
                <button 
                  onClick={enterClassroom}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform active:scale-98"
                >
                  {user.role === UserRole.TEACHER && currentSession?.status === 'scheduled' ? 'Start Class' : 'Join Room'}
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE CLASSROOM
  return (
    <div className="h-[calc(100vh-140px)] flex gap-4 animate-fadeIn">
      {/* Main Stage */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="flex-1 bg-black rounded-2xl overflow-hidden relative border border-slate-700 shadow-2xl group">
           
           <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
              {displayMode === 'whiteboard' ? (
                 <div className="w-full h-full bg-slate-100 relative cursor-crosshair">
                     <canvas
                         ref={canvasRef}
                         onMouseDown={startDrawing}
                         onMouseMove={draw}
                         onMouseUp={stopDrawing}
                         onMouseLeave={stopDrawing}
                         className="w-full h-full"
                     />
                     {textInput && (
                        <div
                            style={{
                                position: 'absolute',
                                left: textInput.x,
                                top: textInput.y,
                                width: textInput.width,
                                height: textInput.height,
                                pointerEvents: 'auto',
                                zIndex: 10
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <textarea
                                ref={textInputRef}
                                value={textInput.text}
                                onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
                                onBlur={() => {
                                    if (textInput.text.trim()) {
                                        drawTextToCanvas(textInput.text, textInput.x, textInput.y, textInput.width);
                                    }
                                    setTextInput(null);
                                }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    color: brushColor,
                                    fontSize: `${Math.max(14, brushSize * 3)}px`,
                                    fontFamily: 'sans-serif',
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    border: '1px dashed #22d3ee',
                                    outline: 'none',
                                    resize: 'none', 
                                    padding: '4px',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}
                            />
                        </div>
                     )}
                     
                     <div className="absolute top-4 left-4 bg-slate-800 p-2 rounded-xl flex flex-col gap-2 shadow-xl border border-slate-600">
                        <button onClick={() => setTool('pen')} className={`p-2 rounded-lg ${tool === 'pen' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`} title="Pen">
                           <PenTool className="w-5 h-5" />
                        </button>
                        <button onClick={() => setTool('eraser')} className={`p-2 rounded-lg ${tool === 'eraser' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`} title="Eraser">
                           <Eraser className="w-5 h-5" />
                        </button>
                        <button onClick={() => setTool('text')} className={`p-2 rounded-lg ${tool === 'text' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`} title="Text">
                           <Type className="w-5 h-5" />
                        </button>

                        <div className="h-px bg-slate-600 my-1"></div>
                        
                        <div className="p-2 pt-0">
                           <label className="text-[10px] text-slate-400 block mb-1">Size: {brushSize}px</label>
                           <input 
                              type="range" 
                              min="2" 
                              max="40" 
                              value={brushSize} 
                              onChange={(e) => setBrushSize(Number(e.target.value))} 
                              className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                              title="Adjust Brush/Eraser/Text Size"
                           />
                        </div>

                        <div className="h-px bg-slate-600 my-1"></div>
                        
                        <div className="flex flex-col gap-1 p-1">
                           {['#000000', '#ef4444', '#22d3ee', '#10b981'].map(color => (
                              <button 
                                key={color}
                                onClick={() => { setBrushColor(color); if(tool !== 'text') setTool('pen'); }}
                                className={`w-6 h-6 rounded-full border-2 ${brushColor === color && tool !== 'eraser' ? 'border-white scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                              />
                           ))}
                        </div>
                        <div className="h-px bg-slate-600 my-1"></div>
                        <button onClick={clearCanvas} className="p-2 rounded-lg text-red-400 hover:bg-slate-700" title="Clear Board">
                           <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                 </div>
              ) : (
                <>
                  {(displayMode === 'screen' || displayMode === 'camera') && (
                     <video 
                        key={displayMode} // Force re-mount when switching modes to clear buffer
                        ref={mainVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-contain ${displayMode === 'camera' && 'transform scale-x-[-1]'}`}
                     />
                  )}
                  {displayMode === 'camera' && !localStream && (
                     <div className="text-center opacity-50">
                        <MonitorUp className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                        <h3 className="text-xl font-bold text-white">Waiting for video source...</h3>
                     </div>
                  )}
                </>
              )}
           </div>
           
           {/* PIP Video - Always Visible (Reverted Change) */}
           <div className={`absolute top-4 right-4 w-48 aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-600 shadow-lg z-20 transition-all ${displayMode === 'whiteboard' ? 'opacity-50 hover:opacity-100' : ''}`}>
              <video 
                ref={myVideoRef} 
                autoPlay 
                muted 
                playsInline 
                className={`w-full h-full object-cover transform scale-x-[-1] ${!camOn && 'hidden'}`} 
              />
              {!camOn && (
                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                  </div>
                </div>
              )}
              <div className="absolute bottom-1 left-2 text-[10px] font-bold text-white bg-black/50 px-1 rounded">You</div>
           </div>

           <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-slate-900/90 px-6 py-3 rounded-2xl border border-slate-700 backdrop-blur-md z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={toggleMic} className={`p-3 rounded-full transition ${micOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white'}`} title="Mic">
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button onClick={toggleCam} className={`p-3 rounded-full transition ${camOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white'}`} title="Camera">
              {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            
            <div className="w-px h-8 bg-slate-700 mx-2"></div>
            
            <button 
              onClick={toggleScreenShare} 
              className={`p-3 rounded-full transition ${displayMode === 'screen' ? 'bg-green-600 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
              title="Share Screen"
            >
              {displayMode === 'screen' ? <MonitorOff className="w-5 h-5" /> : <MonitorUp className="w-5 h-5" />}
            </button>

            <button 
              onClick={toggleWhiteboard} 
              className={`p-3 rounded-full transition ${displayMode === 'whiteboard' ? 'bg-green-600 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
              title="Whiteboard"
            >
              <PenTool className="w-5 h-5" />
            </button>

            <div className="w-px h-8 bg-slate-700 mx-2"></div>
            
            <button onClick={() => setShowChat(!showChat)} className={`p-3 rounded-full transition ${showChat ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-white'}`} title="Chat">
              <MessageSquare className="w-5 h-5" />
            </button>
            <div className="w-px h-8 bg-slate-700 mx-2"></div>
            <button type="button" onClick={leaveClassroom} className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 transition">
              <PhoneOff className="w-5 h-5" /> {user.role === UserRole.TEACHER ? 'End Class' : 'Leave'}
            </button>
           </div>
        </div>
      </div>

      {showChat && (
        <div className="w-80 glass-panel rounded-2xl flex flex-col overflow-hidden border border-slate-700 shadow-xl">
           <div className="p-4 border-b border-slate-700 bg-slate-800/50">
              <h3 className="font-bold text-white">Live Chat</h3>
              <p className="text-xs text-slate-400">Class: {currentSession?.title}</p>
           </div>
           
           <div className="flex-1 p-4 overflow-y-auto space-y-4" ref={chatScrollRef}>
              {chatMessages.map((msg) => (
                <div key={msg.id} className="flex flex-col animate-fadeIn">
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className={`font-bold text-sm ${msg.isSystem ? 'text-cyan-400' : msg.sender === user.name ? 'text-blue-400' : 'text-slate-300'}`}>
                            {msg.sender}
                        </span>
                        <span className="text-[10px] text-slate-500">{msg.time}</span>
                    </div>
                    <div className={`p-2 rounded-lg text-xs ${msg.isSystem ? 'bg-slate-800/80 text-slate-300 italic' : 'bg-slate-700/50 text-white'}`}>
                        {msg.text}
                    </div>
                </div>
              ))}
           </div>
           
           <div className="p-4 bg-slate-800/50 border-t border-slate-700">
              <div className="relative">
                 <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type..." 
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pl-4 pr-10 text-white text-sm focus:border-cyan-500 outline-none" 
                 />
                 <button 
                    onClick={handleSendMessage}
                    className="absolute right-2 top-2 p-1.5 rounded-lg hover:bg-slate-700 text-cyan-500 transition-colors"
                 >
                    <Send className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};