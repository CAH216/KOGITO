'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GraphNode, GraphLink, getStudentKnowledgeGraph } from '@/app/actions/graph-actions';

interface KnowledgeGalaxyProps {
  initialNodes?: GraphNode[];
  initialLinks?: GraphLink[];
}

export default function KnowledgeGalaxy() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  const router = useRouter();
  
  // Dimensions for the Galaxy View
  const width = 800;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = 5; // Zoom factor

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

  if (loading) return <div className="h-64 w-full flex items-center justify-center text-blue-400 animate-pulse">Chargement de la Galaxie...</div>;

  // Render Logic
  return (
    <div className="relative w-full overflow-hidden bg-slate-900 rounded-xl border border-slate-800 shadow-2xl">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <span className="text-yellow-400">✨</span> Ma Galaxie du Savoir
        </h3>
        <p className="text-slate-400 text-xs">Explore et conquiers de nouvelles connaissances.</p>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[400px] cursor-move">
        <defs>
            {/* Glow Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>

        {/* Background Stars (Static) */}
        {Array.from({ length: 50 }).map((_, i) => (
             <circle 
                key={i}
                cx={Math.random() * width} 
                cy={Math.random() * height} 
                r={Math.random() * 1.5} 
                fill="#ffffff" 
                opacity={0.3}
            />
        ))}

        {/* Links (Edges) */}
        {links.map((link, i) => {
            const source = nodes.find(n => n.id === link.source);
            const target = nodes.find(n => n.id === link.target);
            if (!source || !target) return null;

            return (
                <line 
                    key={i}
                    x1={centerX + source.x * scale} 
                    y1={centerY + source.y * scale} 
                    x2={centerX + target.x * scale} 
                    y2={centerY + target.y * scale} 
                    stroke="#475569" 
                    strokeWidth="2"
                    strokeDasharray="4"
                    opacity={0.6}
                />
            );
        })}

        {/* Nodes (Planets) */}
        {nodes.map((node) => {
            const isHovered = hoveredNode === node.id;
            const isLocked = node.status === 'LOCKED';
            const isMastered = node.status === 'MASTERED';
            
            // Adjust interactivity
            const cx = centerX + node.x * scale;
            const cy = centerY + node.y * scale;
            const r = isHovered ? node.val * 1.5 : node.val; // Zoom on hover

            return (
                <g 
                    key={node.id} 
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => {
                        if (isLocked) return;
                        // Trigger Chat Session on this Subject
                        console.log("Navigating to concept", node.slug);
                        // router.push(`/student/chat?start=${node.slug}`) // Future implementation
                    }}
                    style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
                >
                    {/* Ripple Effect for Mastered/Available nodes */}
                    {!isLocked && (
                         <circle cx={cx} cy={cy} r={r + 5} fill={node.color} opacity="0.2">
                             <animate attributeName="r" from={r} to={r + 10} dur="1.5s" repeatCount="indefinite" />
                             <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
                         </circle>
                    )}

                    <circle 
                        cx={cx} 
                        cy={cy} 
                        r={r} 
                        fill={node.color}
                        stroke={isMastered ? '#ffffff' : 'none'}
                        strokeWidth="2"
                        filter={!isLocked ? "url(#glow)" : ""}
                        style={{ transition: "all 0.3s ease" }}
                    />
                    
                    {/* Node Label (Always show if mastered or hovered) */}
                    {(isHovered || isMastered) && (
                        <text 
                            x={cx} 
                            y={cy + r + 15} 
                            textAnchor="middle" 
                            fill="white" 
                            fontSize="12"
                            fontWeight="bold"
                            className="pointer-events-none drop-shadow-md"
                        >
                            {node.name}
                        </text>
                    )}
                </g>
            );
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-slate-800/80 p-2 rounded text-xs text-white backdrop-blur flex flex-col gap-1">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-500"></span> Verrouillé</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Disponible</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Maîtrisé</div>
      </div>
    </div>
  );
}
