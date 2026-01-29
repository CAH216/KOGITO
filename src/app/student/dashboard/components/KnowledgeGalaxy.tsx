'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraphNode, GraphLink, getStudentKnowledgeGraph } from '@/app/actions/graph-actions';

export default function KnowledgeGalaxy() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [loading, setLoading] = useState(true);

  // Dimensions
  const width = 800;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = 6; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudentKnowledgeGraph();
        if (data) {
          setNodes(data.nodes);
          setLinks(data.links);
        }
      } catch (e) {
        console.error("Failed to load galaxy", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="h-[400px] w-full flex flex-col items-center justify-center bg-slate-950 rounded-3xl border border-indigo-900/50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-indigo-300 animate-pulse text-sm">Initialisation de l'univers...</p>
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 rounded-3xl border border-indigo-900/50 shadow-2xl group">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/50 to-slate-950"></div>
      
      {/* Header Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h3 className="text-white font-black text-xl flex items-center gap-2 drop-shadow-md">
            <span className="text-3xl">🌌</span> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-cyan-200">
                Galaxie du Savoir
            </span>
        </h3>
        <p className="text-indigo-400 text-xs font-medium mt-1 ml-11">
            {nodes.length} planètes découvertes
        </p>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[400px] cursor-grab active:cursor-grabbing relative z-0">
        <defs>
            <radialGradient id="sunGradient">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        {/* Orbit Rings (Decorative) */}
        <circle cx={centerX} cy={centerY} r={50} fill="none" stroke="#6366f1" strokeWidth="0.5" opacity="0.2" />
        <circle cx={centerX} cy={centerY} r={100} fill="none" stroke="#6366f1" strokeWidth="0.5" opacity="0.1" />
        <circle cx={centerX} cy={centerY} r={150} fill="none" stroke="#6366f1" strokeWidth="0.5" opacity="0.05" />

        {/* Central Sun (Kogito Core) */}
        <motion.circle 
            cx={centerX} cy={centerY} r={15} 
            fill="url(#sunGradient)" 
            filter="url(#glow)"
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Rotating Container for the whole system */}
        <g transform={`translate(${centerX}, ${centerY})`}>
            {/* Links */}
            {links.map((link, i) => {
                const source = nodes.find(n => n.id === link.source);
                const target = nodes.find(n => n.id === link.target);
                if (!source || !target) return null;

                return (
                    <motion.line 
                        key={`link-${i}`}
                        initial={{ opacity: 0, pathLength: 0 }}
                        animate={{ opacity: 0.3, pathLength: 1 }}
                        transition={{ duration: 1, delay: i * 0.05 }}
                        x1={source.x * scale} 
                        y1={source.y * scale} 
                        x2={target.x * scale} 
                        y2={target.y * scale} 
                        stroke="#94a3b8" 
                        strokeWidth="1"
                    />
                );
            })}

            {/* Nodes */}
            {nodes.map((node, i) => (
                <motion.g
                    key={node.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                        scale: 1, 
                        opacity: 1,
                        x: node.x * scale,
                        y: node.y * scale 
                    }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: i * 0.1 
                    }}
                    whileHover={{ scale: 1.5, zIndex: 10 }}
                >
                    {/* Planet Glow */}
                    <circle r={node.radius + 4} fill={node.color} opacity="0.2" filter="url(#glow)" />
                    
                    {/* Planet Body */}
                    <circle 
                        r={node.radius} 
                        fill={node.color} 
                        className="cursor-pointer"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth="1"
                    />
                    
                    {/* Label on Hover */}
                    <foreignObject x={-50} y={node.radius + 5} width="100" height="40" className="overflow-visible pointer-events-none">
                        <div className="text-[10px] text-center font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-700/50 backdrop-blur-sm whitespace-nowrap w-fit mx-auto shadow-xl">
                            {node.name}
                        </div>
                    </foreignObject>
                </motion.g>
            ))}
        </g>
      </svg>
      
      <div className="absolute bottom-4 right-4 flex gap-2">
         <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800 text-[10px] text-slate-400">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div> Maths
         </div>
         <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800 text-[10px] text-slate-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> SVT
         </div>
      </div>
    </div>
  );
}
