'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WhiteboardShape {
  type: 'rect' | 'circle' | 'line' | 'arrow' | 'text';
  x?: number;
  y?: number;
  width?: number; // for rect
  height?: number; // for rect
  radius?: number; // for circle
  x1?: number; // for line
  y1?: number; // for line
  x2?: number; // for line
  y2?: number; // for line
  content?: string; // for text
  color?: string;
  label?: string;
}

interface WhiteboardData {
  template?: 'PYTHAGORE' | 'THALES' | 'BALANCE' | 'ATOM' | 'FREE';
  params?: any; // For templates (e.g., { a: "3", b: "4", c: "?" })
  elements?: WhiteboardShape[]; // Fallback for FREE mode
  explanation?: string;
}

const getColor = (colorName?: string) => {
  const map: Record<string, string> = {
    'blue': '#3b82f6', // blue-500
    'red': '#ef4444', // red-500
    'green': '#22c55e', // green-500
    'yellow': '#eab308', // yellow-500
    'purple': '#a855f7', // purple-500
    'orange': '#f97316', // orange-500
    'pink': '#ec4899', // pink-500
    'indigo': '#6366f1', // indigo-500
    'black': '#1e293b', // slate-800
    'white': '#ffffff',
    'gray': '#64748b', // slate-500
  };
  if (!colorName) return '#475569'; // slate-600 default
  return map[colorName.toLowerCase()] || colorName;
};

// --- PRE-DEFINED TEMPLATES (The "Cheat Codes" for perfect drawings) ---

const renderPythagoras = (params: any) => {
  // A perfect right triangle in the center
  const p1 = { x: 120, y: 100 }; // Top Vertex (A)
  const p2 = { x: 120, y: 220 }; // Right Angle Vertex (B) - Bottom Left
  const p3 = { x: 280, y: 220 }; // Right Vertex (C) - Bottom Right

  return (
    <g>
      {/* The Triangle */}
      <path d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} Z`} 
            fill="#e0f2fe" stroke="#0284c7" strokeWidth="3" />
      
      {/* Right Angle Marker */}
      <path d={`M ${p2.x} ${p2.y-20} L ${p2.x+20} ${p2.y-20} L ${p2.x+20} ${p2.y}`} 
            fill="none" stroke="#0284c7" strokeWidth="2" />

      {/* Labels */}
      <text x={p1.x - 25} y={(p1.y + p2.y)/2} className="text-sm font-bold" fill="#1e293b" textAnchor="end">{params.a || 'a'}</text>
      <text x={(p2.x + p3.x)/2} y={p2.y + 35} className="text-sm font-bold" fill="#1e293b" textAnchor="middle">{params.b || 'b'}</text>
      <text x={(p1.x + p3.x)/2 + 20} y={(p1.y + p3.y)/2 - 10} className="text-sm font-bold text-orange-600" fill="#ea580c" textAnchor="start">{params.c || 'c'}</text>

      {/* Title */}
      <text x="200" y="50" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#334155">
         {params.title || "Triangle Rectangle"}
      </text>
    </g>
  );
};

const renderBalance = (params: any) => {
    return (
        <g>
            {/* Base */}
            <path d="M 150 250 L 250 250 L 200 150 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
            <line x1="200" y1="150" x2="200" y2="250" stroke="#64748b" strokeWidth="2" />
            {/* Beam */}
            <line x1="50" y1="150" x2="350" y2="150" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            {/* Plateau Left */}
            <line x1="50" y1="150" x2="50" y2="200" stroke="#94a3b8" strokeWidth="2" />
            <rect x="20" y="200" width="60" height="10" rx="2" fill="#94a3b8" />
            <circle cx="50" cy="180" r="25" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="2" />
            <text x="50" y="185" textAnchor="middle" fontWeight="bold" fill="#0369a1">{params.left || "x"}</text>
            {/* Plateau Right */}
            <line x1="350" y1="150" x2="350" y2="200" stroke="#94a3b8" strokeWidth="2" />
            <rect x="320" y="200" width="60" height="10" rx="2" fill="#94a3b8" />
            <rect x="325" y="160" width="50" height="40" rx="4" fill="#fecaca" stroke="#ef4444" strokeWidth="2" />
            <text x="350" y="185" textAnchor="middle" fontWeight="bold" fill="#b91c1c">{params.right || "?"}</text>
            <text x="200" y="50" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#334155">Équilibre</text>
        </g>
    );
};

const renderAtom = (params: any) => {
     return (
        <g>
            <circle cx="200" cy="150" r="20" fill="#fca5a5" stroke="#ef4444" strokeWidth="2" />
            <text x="200" y="155" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#7f1d1d">{params.center || "P+"}</text>
            <ellipse cx="200" cy="150" rx="60" ry="20" fill="none" stroke="#94a3b8" strokeWidth="1" transform="rotate(45 200 150)" />
            <circle cx="242" cy="192" r="6" fill="#60a5fa" />
            <ellipse cx="200" cy="150" rx="60" ry="20" fill="none" stroke="#94a3b8" strokeWidth="1" transform="rotate(-45 200 150)" />
            <circle cx="158" cy="192" r="6" fill="#60a5fa" />
             <text x="200" y="250" textAnchor="middle" fontWeight="bold" fill="#334155">{params.label || "Atome"}</text>
        </g>
     );
}

export default function WhiteboardRenderer({ data }: { data: WhiteboardData }) {
  // Canvas Size
  const width = 400;
  const height = 300;
  
  // Choose render strategy
  const isTemplate = !!data.template && data.template !== 'FREE';

  return (
    <div className="my-4 w-full max-w-md mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
         <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            ✏️ Tableau Blanc IA {isTemplate && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{data.template}</span>}
         </span>
      </div>
      
      <div className="relative bg-white overflow-hidden" style={{ height: '300px' }}>
         <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
              </marker>
              <filter x="0" y="0" width="1" height="1" id="solid">
                <feFlood floodColor="white" result="bg"/>
                <feMerge>
                  <feMergeNode in="bg"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Grid Pattern (Lighter) */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
               <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* --- TEMPLATE RENDERERS --- */}
            {data.template === 'PYTHAGORE' && renderPythagoras(data.params || {})}
            {data.template === 'BALANCE' && renderBalance(data.params || {})}
            {data.template === 'ATOM' && renderAtom(data.params || {})}

            {/* --- FALLBACK: FREEHAND ELEMENTS --- */}
            {(!data.template || data.template === 'FREE') && data.elements && data.elements.map((el, i) => {
               const key = `wb-el-${i}`;
               const stroke = getColor(el.color);
               const fill = el.color ? `${getColor(el.color)}20` : "none"; // 20% opacity hex
               const delay = i * 0.3; // Faster animation

               return (
                 <motion.g 
                    key={key}
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ duration: 0.8, delay: delay }}
                 >
                    {el.type === 'rect' && (
                        <>
                        <rect 
                            x={el.x || 0} 
                            y={el.y || 0} 
                            width={el.width} height={el.height} 
                            stroke={stroke} fill={fill} strokeWidth="2" rx="4"
                        />
                        {el.label && (
                             <text 
                                x={(el.x || 0) + (el.width || 0) / 2} 
                                y={(el.y || 0) + (el.height || 0) / 2} 
                                textAnchor="middle" 
                                dy=".3em" 
                                fontSize="13" 
                                fill="#1e293b" // Always dark for readability
                                fontWeight="bold"
                                stroke="white" strokeWidth="3" paintOrder="stroke" // White halo
                             >
                                {el.label}
                             </text>
                        )}
                        </>
                    )}

                    {el.type === 'circle' && (
                        <>
                        <circle 
                            cx={el.x} cy={el.y} 
                            r={el.radius} 
                            stroke={stroke} fill={fill} strokeWidth="2"
                        />
                        {el.label && (
                             <text 
                                x={el.x} 
                                y={el.y} 
                                textAnchor="middle" 
                                dy=".3em" 
                                fontSize="13" 
                                fill="#1e293b"
                                fontWeight="bold"
                                stroke="white" strokeWidth="3" paintOrder="stroke"
                             >
                                {el.label}
                             </text>
                        )}
                        </>
                    )}

                    {/* Support both line and arrow types */}
                    {(el.type === 'line' || el.type === 'arrow') && (
                        <>
                        <line 
                            x1={el.x1!} y1={el.y1!} 
                            x2={el.x2!} y2={el.y2!} 
                            stroke={stroke} strokeWidth="2" 
                            markerEnd="url(#arrowhead)"
                        />
                        {el.label && (
                             <text 
                                x={(el.x1! + el.x2!) / 2} 
                                y={(el.y1! + el.y2!) / 2 - 12} 
                                textAnchor="middle" 
                                fontSize="13" 
                                fill="#1e293b"
                                fontWeight="bold"
                                stroke="white" strokeWidth="4" paintOrder="stroke"
                             >
                                {el.label}
                             </text>
                        )}
                        </>
                    )}
                    
                    {el.type === 'text' && (
                         <text 
                            x={el.x} 
                            y={el.y} 
                            textAnchor="middle" 
                            fontSize="14" 
                            fill={stroke === '#475569' ? '#1e293b' : stroke} 
                            fontWeight="500"
                            stroke="white" strokeWidth="3" paintOrder="stroke"
                         >
                            {el.content}
                         </text>
                    )}
                 </motion.g>
               );
            })}
         </svg>
      </div>
      
      {data.explanation && (
          <div className="px-4 py-3 bg-white text-sm text-slate-600 italic border-t border-slate-100">
             💡 {data.explanation}
          </div>
      )}
    </div>
  );
}
