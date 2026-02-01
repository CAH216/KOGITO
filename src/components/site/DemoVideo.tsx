'use client';

import { useState, useRef } from 'react';
import { Play, Pause, Settings } from 'lucide-react';

interface DemoVideoProps {
    src: string;
    title: string;
    description: string;
    poster?: string; // Optional poster image
}

export function DemoVideo({ src, title, description, poster }: DemoVideoProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePlay = () => {
        if (!videoRef.current) return;
        
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleSpeedChange = (speed: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
            setPlaybackRate(speed);
            setShowSpeedMenu(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 group hover:shadow-2xl transition-all duration-300">
            <div className="relative aspect-video bg-slate-900 group/video">
                {/* Video Element */}
                <video 
                    ref={videoRef}
                    src={src}
                    poster={poster}
                    className="w-full h-full object-cover cursor-pointer"
                    playsInline
                    loop
                    onClick={togglePlay}
                />
                
                {/* Overlay Play Button */}
                <div 
                    className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 pointer-events-none ${isPlaying ? 'opacity-0 group-hover/video:opacity-100' : 'opacity-100'}`}
                >
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50 group-hover:scale-110 transition-transform">
                        {isPlaying ? (
                            <Pause className="w-8 h-8 text-white fill-current" />
                        ) : (
                            <Play className="w-8 h-8 text-white fill-current ml-1" />
                        )}
                    </div>
                </div>

                {/* Speed Control - Bottom Right */}
                <div className="absolute bottom-4 right-4 z-20">
                    <div className="relative">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowSpeedMenu(!showSpeedMenu);
                            }}
                            className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors"
                        >
                            <Settings className="w-3 h-3" />
                            {playbackRate}x
                        </button>

                        {showSpeedMenu && (
                            <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-slate-100 py-1 min-w-[80px] overflow-hidden flex flex-col">
                                {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
                                    <button
                                        key={rate}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSpeedChange(rate);
                                        }}
                                        className={`px-4 py-2 text-sm text-left hover:bg-slate-50 ${rate === playbackRate ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-700'}`}
                                    >
                                        {rate}x
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-600 text-sm">{description}</p>
                <div className="flex items-center justify-between mt-4">
                    <button 
                        onClick={togglePlay}
                        className="text-blue-600 font-semibold text-sm hover:text-blue-700 flex items-center gap-2"
                    >
                        {isPlaying ? "Mettre en pause" : "Voir la démonstration"}
                    </button>
                </div>
            </div>
        </div>
    );
}
