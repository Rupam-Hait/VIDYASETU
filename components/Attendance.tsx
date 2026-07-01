import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, AlertTriangle, ScanFace, Calendar, Clock, UserCheck } from 'lucide-react';
import { API_BASE } from '../services/apiConfig';

interface AttendanceLog {
  id: number;
  studentId: string;
  studentName: string;
  date: string;
  status: string;
}

export const Attendance: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [history, setHistory] = useState<AttendanceLog[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Attach stream to video element when stream state changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Fetch Attendance History on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem('vidyasetu_token');
      const res = await fetch(`${API_BASE}/api/attendance/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Error fetching attendance history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setStatus('idle');
    } catch (err) {
      console.error("Error accessing camera", err);
      alert("Camera access denied or unavailable. Please check your browser permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleScan = () => {
    setScanning(true);
    setStatus('idle');
    
    // Simulate AI Processing and make API request
    setTimeout(async () => {
      try {
        const token = localStorage.getItem('vidyasetu_token');
        const res = await fetch(`${API_BASE}/api/attendance/mark`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'Present' })
        });
        
        const data = await res.json();
        setScanning(false);
        
        if (res.ok) {
          setStatus('success');
          // Add to local history list
          setHistory(prev => [data, ...prev]);
        } else {
          // If already marked, status is success or failure based on error details
          if (data.error && data.error.includes('already marked')) {
            alert('Attendance already marked for today.');
            setStatus('success');
          } else {
            setStatus('failed');
          }
        }
      } catch (err) {
        console.error('Attendance mark API error:', err);
        setScanning(false);
        setStatus('failed');
      }
    }, 2000);
  };

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <ScanFace className="text-cyan-400 w-8 h-8" /> Smart AI Attendance
        </h2>
        <p className="text-slate-400 mt-1">Mark daily attendance securely using real-time biometrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Camera Feed Section */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center">
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.05)]">
            {!stream ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <Camera className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-sm">Camera Off</p>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform scale-x-[-1]" 
                />
                {scanning && (
                  <div className="absolute inset-0 bg-cyan-500/10 z-10 pointer-events-none">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-[scan_1.5s_ease-in-out_infinite]"></div>
                    <div className="absolute inset-0 border-4 border-cyan-400/50 m-8 rounded-lg animate-pulse"></div>
                    <div className="absolute top-4 left-4 text-xs font-mono text-cyan-400 bg-black/75 px-2 py-1 rounded border border-cyan-500/20">
                      ANALYZING BIOMETRICS...
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="flex gap-4 mt-6">
            {!stream ? (
              <button onClick={startCamera} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-white transition font-medium">
                Activate Camera
              </button>
            ) : (
              <button onClick={stopCamera} className="px-6 py-2.5 bg-red-950/40 hover:bg-red-950/60 text-red-200 border border-red-500/20 rounded-full transition font-medium">
                Stop Camera
              </button>
            )}
            
            <button 
              onClick={handleScan}
              disabled={!stream || scanning}
              className={`px-8 py-2.5 rounded-full font-bold transition shadow-lg ${
                !stream || scanning 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-750' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-cyan-500/25'
              }`}
            >
              {scanning ? 'Identifying...' : 'Mark Attendance'}
            </button>
          </div>
        </div>

        {/* Status Section */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-3xl h-full flex flex-col justify-center items-center text-center">
            {status === 'idle' && !scanning && (
              <>
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                  <ScanFace className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300">Ready to Scan</h3>
                <p className="text-slate-400 mt-2 text-sm max-w-xs">Ensure good lighting and position your face within the frame.</p>
              </>
            )}
            
            {scanning && (
              <>
                <div className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-semibold text-cyan-400 animate-pulse">Processing Biometrics...</h3>
                <p className="text-slate-400 mt-2 text-sm">Verifying identity against school database</p>
              </>
            )}

            {status === 'success' && (
              <div className="animate-fadeIn">
                <CheckCircle className="w-24 h-24 text-green-400 mb-4 mx-auto drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
                <h3 className="text-2xl font-bold text-white">Attendance Marked!</h3>
                <p className="text-green-300 mt-2 font-medium text-sm">Identity Verified Successfully</p>
                <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-xl">
                    <p className="text-slate-300 text-sm">Time: <span className="text-white font-mono">{new Date().toLocaleTimeString()}</span></p>
                </div>
              </div>
            )}

            {status === 'failed' && (
              <>
                <AlertTriangle className="w-24 h-24 text-red-400 mb-4 mx-auto drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" />
                <h3 className="text-xl font-bold text-white">Identification Failed</h3>
                <p className="text-red-300 mt-2 text-sm">Face not recognized. Please try again.</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Attendance History Log list */}
      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <UserCheck className="text-cyan-400 w-5 h-5" /> Attendance Logs History
        </h3>
        {loadingHistory ? (
          <div className="text-center py-6 text-cyan-400">Loading history logs...</div>
        ) : history.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm">No attendance records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 text-sm">
                  <th className="py-3 px-4 font-semibold">Student Name</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((log) => (
                  <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition text-sm">
                    <td className="py-3.5 px-4 text-white font-medium">{log.studentName}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {log.date}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-900/30 text-green-300 border border-green-500/25">
                        <CheckCircle className="w-3 h-3" /> {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};