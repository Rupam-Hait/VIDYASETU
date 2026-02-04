import React, { useState, useEffect, useRef } from 'react';
import { Bus, Phone, ShieldCheck, AlertTriangle, Plus, Minus, Navigation, Map as MapIcon, Maximize, Home, School, MapPin, Clock } from 'lucide-react';

export const BusTracker: React.FC = () => {
  const [progress, setProgress] = useState(0); // 0 to 100
  const [speed, setSpeed] = useState(45);
  const [isTraffic, setIsTraffic] = useState(false);
  const [currentStreet, setCurrentStreet] = useState("Station Road");
  const [viewState, setViewState] = useState<'3D' | '2D'>('2D');
  const [zoom, setZoom] = useState(0.85);
  const [pathLength, setPathLength] = useState(0);
  
  const pathRef = useRef<SVGPathElement>(null);
  const [busPosition, setBusPosition] = useState({ x: 0, y: 0, angle: 0 });

  // --- CONFIGURATION ---
  const MAP_WIDTH = 1600;
  const MAP_HEIGHT = 900;

  // Stops Configuration (Kolkata Route)
  const stops = [
    { id: 'start', name: 'Howrah Station', progress: 0, x: 100, y: 500 },
    { id: 's1', name: 'Esplanade', progress: 35, x: 550, y: 550 },
    { id: 's2', name: 'Science City', progress: 65, x: 950, y: 500 },
    { id: 'end', name: 'Salt Lake Sec-V', progress: 100, x: 1350, y: 250 },
  ];

  // Route Path: Howrah -> Bridge -> Esplanade -> Science City -> Salt Lake
  const routePath = "M 100 500 L 350 500 L 450 500 L 550 550 Q 750 650 950 500 Q 1150 350 1350 250";

  // --- LOGIC ---

  // Measure path on mount
  useEffect(() => {
    if (pathRef.current) {
        setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  // Physics Loop
  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
        const dt = (time - lastTime) / 1000;
        lastTime = time;

        setProgress(prev => {
            let targetSpeed = 5; // Base speed % per second
            
            // 1. Traffic Logic (Esplanade area)
            const inTraffic = prev > 30 && prev < 40;
            if (inTraffic) targetSpeed = 1.5;

            // 2. Stop Logic (Slow down near stops)
            const distToStop1 = Math.abs(prev - 35);
            const distToStop2 = Math.abs(prev - 65);
            
            if (distToStop1 < 2 || distToStop2 < 2) {
                targetSpeed = 0.8; // Crawl at stop
            }

            // Update State for UI
            setSpeed(Math.round(targetSpeed * 9)); // Convert internal speed to approx km/h
            setIsTraffic(inTraffic);

            const next = prev + (targetSpeed * dt);
            return next >= 100 ? 0 : next;
        });

        frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Position & Orientation
  useEffect(() => {
    const path = pathRef.current;
    if (path && pathLength > 0) {
      const currentLen = (progress / 100) * pathLength;
      const point = path.getPointAtLength(currentLen);
      
      // Calculate Look-ahead for smooth rotation
      const lookAheadLen = Math.min(currentLen + 10, pathLength);
      const nextPoint = path.getPointAtLength(lookAheadLen);
      const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);

      setBusPosition({ x: point.x, y: point.y, angle });
      
      // Update Street Name based on Kolkata landmarks
      if (progress < 15) setCurrentStreet("Howrah Station Rd");
      else if (progress < 25) setCurrentStreet("Rabindra Setu (Howrah Bridge)");
      else if (progress < 45) setCurrentStreet("Jawaharlal Nehru Rd");
      else if (progress < 75) setCurrentStreet("J.B.S Haldane Ave (EM Bypass)");
      else setCurrentStreet("Salt Lake Sector V Main Rd");
    }
  }, [progress, pathLength]);

  const getNextStop = () => {
    return stops.find(s => s.progress > progress + 1) || stops[stops.length - 1];
  };

  const nextStop = getNextStop();

  // Map Colors (Professional Dark Mode Palette)
  const C = {
    bg: '#181b21',       
    block: '#242f3e',    
    road: '#38414e',     
    routeRoad: '#455061',
    water: '#17263c',    
    park: '#263c3f',     
    text: '#9ca5b3',     
    highlight: '#22d3ee' 
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] animate-fadeIn">
      
      {/* --- TOP SECTION: MAP --- */}
      <div className="flex-1 relative bg-[#181b21] overflow-hidden group border-b border-slate-700">
        
        {/* Navigation Overlay - Top Left */}
        <div className="absolute top-4 left-4 z-20 space-y-2">
           <div className="bg-[#242f3e]/90 backdrop-blur-xl text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-slideDown">
              <div className="bg-cyan-600 p-2.5 rounded-xl shadow-lg shadow-cyan-900/50 animate-pulse">
                 <Navigation className="w-5 h-5 text-white" />
              </div>
              <div>
                 <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-0.5">Next Stop</p>
                 <p className="font-bold text-base leading-tight">{nextStop.name}</p>
                 <p className="text-xs text-slate-400 mt-0.5">
                    {Math.max(1, Math.round((nextStop.progress - progress) * 0.5))} min away
                 </p>
              </div>
           </div>
        </div>

        {/* Map Controls - Top Right */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <button 
                onClick={() => setViewState(viewState === '2D' ? '3D' : '2D')}
                className="w-10 h-10 bg-slate-800 text-white rounded-xl shadow-lg flex items-center justify-center border border-slate-600 hover:bg-slate-700 font-bold text-xs transition active:scale-95"
            >
                {viewState}
            </button>
            <button 
                onClick={() => setZoom(0.85)} 
                className="w-10 h-10 bg-slate-800 text-white rounded-xl shadow-lg flex items-center justify-center border border-slate-600 hover:bg-slate-700 transition active:scale-95"
            >
                <Maximize className="w-5 h-5" />
            </button>
            <div className="flex flex-col bg-slate-800 rounded-xl border border-slate-600 overflow-hidden shadow-lg">
                <button 
                    onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-slate-700 text-white transition active:bg-slate-600"
                >
                    <Plus className="w-5 h-5" />
                </button>
                <div className="h-px bg-slate-600 w-full"></div>
                <button 
                    onClick={() => setZoom(Math.max(zoom - 0.2, 0.4))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-slate-700 text-white transition active:bg-slate-600"
                >
                    <Minus className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* --- MAP CANVAS --- */}
        <div 
            className="w-full h-full transition-transform duration-700 ease-out will-change-transform cursor-grab active:cursor-grabbing"
            style={{
                transform: viewState === '3D' 
                    ? `perspective(1000px) rotateX(45deg) scale(${zoom}) translate(${-busPosition.x/5}px, ${-busPosition.y/5}px)` 
                    : `scale(${zoom}) translate(0px, 0px)`
            }}
        >
             <svg 
                className="w-full h-full" 
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} 
                preserveAspectRatio="xMidYMid meet"
                style={{backgroundColor: C.bg}}
             >
                <defs>
                   <pattern id="city-grid" width="100" height="100" patternUnits="userSpaceOnUse">
                      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#2a3340" strokeWidth="1"/>
                   </pattern>
                   <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                </defs>

                {/* 1. Background Grid */}
                <rect width="100%" height="100%" fill="url(#city-grid)" />

                {/* 2. Geography: Hooghly River */}
                {/* Runs mostly North-South, separates Howrah (Left) from Kolkata (Right) */}
                <path 
                  d="M 380 0 Q 450 450 380 900" 
                  fill="none"
                  stroke={C.water}
                  strokeWidth="120"
                  strokeLinecap="round"
                />
                <text x="320" y="800" fill="#2a3b55" fontSize="24" fontWeight="bold" fontStyle="italic" transform="rotate(-90 320 800)">Hooghly River</text>

                {/* Maidan Area (Large Park) */}
                <rect x="500" y="600" width="250" height="200" rx="20" fill={C.park} />
                <text x="550" y="700" fill="#3d565a" fontSize="20" fontWeight="bold">Maidan</text>
                
                {/* Salt Lake Area (Water bodies/Lakes) */}
                <circle cx="1300" cy="150" r="40" fill={C.water} opacity="0.5" />
                <circle cx="1400" cy="350" r="50" fill={C.water} opacity="0.5" />

                {/* 3. City Blocks */}
                <g fill={C.block} stroke="none">
                    {/* Howrah Side */}
                    <rect x="50" y="200" width="200" height="250" rx="4" />
                    <rect x="50" y="550" width="200" height="150" rx="4" />
                    
                    {/* Central Kolkata */}
                    <rect x="500" y="100" width="200" height="400" rx="4" />
                    <rect x="800" y="400" width="300" height="200" rx="4" />
                    
                    {/* Salt Lake */}
                    <rect x="1200" y="100" width="300" height="200" rx="4" />
                </g>

                {/* 4. Road Network */}
                <g stroke={C.road} strokeWidth="18" fill="none" strokeLinecap="round">
                    {/* Howrah Roads */}
                    <path d="M 0 500 L 350 500" />
                    {/* Kolkata Roads */}
                    <path d="M 450 500 L 1600 500" /> {/* Central Ave approx */}
                    <path d="M 550 0 L 550 900" /> {/* Chittaranjan Ave */}
                    <path d="M 1150 0 L 1150 900" /> {/* EM Bypass */}
                </g>

                {/* Howrah Bridge Representation */}
                <line x1="320" y1="500" x2="440" y2="500" stroke="#566275" strokeWidth="40" /> 
                <line x1="320" y1="500" x2="440" y2="500" stroke="#746855" strokeWidth="34" /> 

                {/* 5. Route Underlay */}
                <path d={routePath} fill="none" stroke={C.routeRoad} strokeWidth="28" strokeLinecap="round" />
                <path d={routePath} fill="none" stroke="#566275" strokeWidth="2" strokeDasharray="12 12" />

                {/* 6. Active Traveled Route (Dynamic Fill) */}
                <path ref={pathRef} d={routePath} fill="none" stroke="transparent" strokeWidth="1" /> 
                <path 
                    d={routePath} 
                    fill="none" 
                    stroke={C.highlight} 
                    strokeWidth="8" 
                    strokeLinecap="round" 
                    filter="url(#glow)"
                    strokeDasharray={pathLength}
                    strokeDashoffset={pathLength * (1 - progress / 100)}
                    style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                />

                {/* Traffic Overlay (Esplanade) */}
                {isTraffic && (
                     <path 
                     d="M 500 525 L 600 575"
                     fill="none" 
                     stroke="#ef4444" 
                     strokeWidth="8" 
                     strokeLinecap="round"
                   />
                )}

                {/* 7. Locations & Labels */}
                <text x="150" y="480" fill={C.text} fontSize="14" fontWeight="bold">Howrah Stn</text>
                <text x="380" y="480" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">Howrah Bridge</text>
                <text x="1170" y="300" fill={C.text} fontSize="14" fontWeight="bold">EM Bypass</text>
                <text x="1350" y="220" fill={C.text} fontSize="14" fontWeight="bold">Salt Lake</text>

                {/* Bus Stops */}
                {stops.map(stop => (
                    <g key={stop.id} transform={`translate(${stop.x}, ${stop.y})`}>
                        <circle r="6" fill="#1e293b" stroke={progress >= stop.progress ? "#22d3ee" : "#64748b"} strokeWidth="3" />
                        <text y="20" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold" className="bg-slate-900/50 px-1 rounded">{stop.name}</text>
                    </g>
                ))}

             </svg>

             {/* 8. Bus Entity (HTML Overlay) */}
             <div 
                className="absolute top-0 left-0 w-0 h-0 z-30 transition-transform duration-100 ease-linear"
                style={{ transform: `translate(${busPosition.x}px, ${busPosition.y}px) rotate(${busPosition.angle}deg)` }}
             >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                    {/* Headlight Beam */}
                    <div className="absolute top-1/2 left-8 -translate-y-1/2 w-48 h-32 bg-gradient-to-r from-cyan-200/20 via-cyan-100/5 to-transparent blur-xl transform -skew-x-12 origin-left pointer-events-none"></div>

                    {/* GPS Pulse */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-cyan-500/10 rounded-full animate-ping pointer-events-none"></div>

                    {/* Bus Body */}
                    <div className="w-16 h-8 bg-slate-100 rounded-[4px] shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative overflow-hidden border border-slate-300 z-10">
                         <div className="absolute right-0 top-0 bottom-0 w-3 bg-blue-400/80"></div>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] font-bold text-slate-400 rotate-90">BUS</div>
                         {/* Lights */}
                         <div className="absolute right-0 top-1 w-1 h-2 bg-yellow-400 blur-[1px]"></div>
                         <div className="absolute right-0 bottom-1 w-1 h-2 bg-yellow-400 blur-[1px]"></div>
                         <div className="absolute left-0 top-1 w-1 h-2 bg-red-500 blur-[1px]"></div>
                         <div className="absolute left-0 bottom-1 w-1 h-2 bg-red-500 blur-[1px]"></div>
                    </div>
                </div>
             </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: INFO PANEL --- */}
      <div className="bg-slate-900 border-t border-slate-800 z-10 p-6 shadow-[0_-10px_50px_rgba(0,0,0,0.5)]">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Route Info */}
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-lg relative">
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                  <Bus className="w-7 h-7 text-cyan-400" />
               </div>
               <div>
                  <h2 className="text-xl font-bold text-white">Route #05 - Morning Pickup</h2>
                  <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                     <MapIcon className="w-3 h-3" />
                     <span>{currentStreet}</span>
                  </div>
               </div>
            </div>

            {/* Live Stats */}
            <div className="flex-1 max-w-xl mx-auto w-full">
               <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                  <span className="flex items-center gap-1"><Home className="w-3 h-3"/> Howrah</span>
                  <span className="text-cyan-400 animate-pulse">{speed} km/h</span>
                  <span className="flex items-center gap-1">School <School className="w-3 h-3"/></span>
               </div>
               <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden relative border border-slate-700 shadow-inner">
                  <div className="absolute inset-0 bg-slate-800/50 w-full h-full pattern-dots opacity-20"></div>
                  <div 
                     className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-300 relative" 
                     style={{width: `${progress}%`}}
                  >
                     <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white]"></div>
                  </div>
               </div>
               <div className="flex justify-between mt-2">
                  <div className="text-left">
                     <p className="text-white font-bold">07:30 AM</p>
                     <p className="text-xs text-slate-500">Departed</p>
                  </div>
                  <div className="text-right">
                     <p className="text-white font-bold">08:45 AM</p>
                     <p className="text-xs text-slate-500">ETA</p>
                  </div>
               </div>
            </div>

            {/* Driver Card */}
            <div className="flex items-center gap-4 bg-slate-800/50 p-3 pr-6 rounded-2xl border border-slate-700/50">
               <div className="relative">
                   <img 
                       src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                       alt="Driver" 
                       className="w-10 h-10 rounded-full object-cover border-2 border-slate-600"
                   />
                   <div className="absolute -bottom-1 -right-1 bg-green-500 text-black p-0.5 rounded-full border border-slate-900">
                       <ShieldCheck className="w-2.5 h-2.5" />
                   </div>
               </div>
               <div>
                   <p className="text-white font-bold text-sm">Rajesh S.</p>
                   <p className="text-xs text-slate-400">WB-04-E-1234</p>
               </div>
               <div className="w-px h-8 bg-slate-700 mx-2"></div>
               <button className="bg-green-600 hover:bg-green-500 text-white p-2.5 rounded-xl shadow-lg transition active:scale-95">
                  <Phone className="w-4 h-4" />
               </button>
            </div>
         </div>

         {/* Traffic Alert */}
         {isTraffic && (
            <div className="mt-4 bg-orange-500/10 border border-orange-500/20 p-3 rounded-xl flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-3">
                   <AlertTriangle className="w-5 h-5 text-orange-500" />
                   <span className="text-sm font-medium text-orange-200">Heavy traffic reported at Esplanade Crossing.</span>
                </div>
                <span className="text-xs font-bold bg-orange-500/20 text-orange-300 px-2 py-1 rounded">+10m delay</span>
            </div>
         )}
      </div>
    </div>
  );
};
