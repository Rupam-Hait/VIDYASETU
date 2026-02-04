import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, AlertTriangle, ScanFace } from 'lucide-react';

export const Attendance: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Attach stream to video element when stream state changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

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
    // Simulate AI Processing
    setTimeout(() => {
      setScanning(false);
      setStatus('success');
      // In a real app, capture frame, send to Face Rec API
    }, 2000);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <ScanFace className="text-cyan-400" /> Smart AI Attendance
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Camera Feed Section */}
        <div className="glass-panel p-4 rounded-3xl flex flex-col items-center">
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
            {!stream ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <Camera className="w-12 h-12 mb-2" />
                <p>Camera Off</p>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                />
                {scanning && (
                  <div className="absolute inset-0 bg-cyan-500/10 z-10 pointer-events-none">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-[scan_1.5s_ease-in-out_infinite]"></div>
                    <div className="absolute inset-0 border-4 border-cyan-400/50 m-8 rounded-lg animate-pulse"></div>
                    <div className="absolute top-4 left-4 text-xs font-mono text-cyan-400 bg-black/50 px-2 py-1 rounded">
                      ANALYZING BIOMETRICS...
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="flex gap-4 mt-6">
            {!stream ? (
              <button onClick={startCamera} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-full text-white transition font-medium">
                Activate Camera
              </button>
            ) : (
              <button onClick={stopCamera} className="px-6 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-200 border border-red-500/30 rounded-full transition font-medium">
                Stop Camera
              </button>
            )}
            
            <button 
              onClick={handleScan}
              disabled={!stream || scanning}
              className={`px-8 py-2 rounded-full font-bold transition shadow-lg ${
                !stream || scanning 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
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
                <p className="text-slate-400 mt-2">Ensure good lighting and position your face within the frame.</p>
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
                <p className="text-green-300 mt-2 font-medium">Identity Verified Successfully</p>
                <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-xl">
                    <p className="text-slate-300 text-sm">Time: <span className="text-white font-mono">{new Date().toLocaleTimeString()}</span></p>
                </div>
              </div>
            )}

            {status === 'failed' && (
              <>
                <AlertTriangle className="w-24 h-24 text-red-400 mb-4 mx-auto drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" />
                <h3 className="text-xl font-bold text-white">Identification Failed</h3>
                <p className="text-red-300 mt-2">Face not recognized. Please try again.</p>
              </>
            )}
          </div>
        </div>
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