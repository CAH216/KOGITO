'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  Loader2, 
  ShieldCheck,
  Copy,
  Users,
  MoreVertical,
  Settings
} from 'lucide-react';
import Peer from 'peerjs';

interface InterviewClientProps {
  roomId: string;
  displayName: string;
  isHost: boolean; 
}

export default function InterviewClient({ roomId, displayName, isHost }: InterviewClientProps) {
  const router = useRouter();
  
  // State
  const [peerId, setPeerId] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'call-ended'>('idle');
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [fatalError, setFatalError] = useState<string | null>(null);

  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  // Refs for media elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Refs for peer/call management
  const peerInstance = useRef<Peer | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const currentCallRef = useRef<any>(null); // Type 'MediaConnection'
  const connectionRetryRef = useRef<NodeJS.Timeout | null>(null);

  const targetConnectId = `${roomId}-host`;

  useEffect(() => {
    // Initialize Peer
    const initPeer = async () => {
      setStatus('connecting');

      const Peer = (await import('peerjs')).default;
      
      // If Host, use deterministic ID. If Guest, undefined (random).
      const peer = isHost 
        ? new Peer(`${roomId}-host`, { debug: 0 }) 
        : new Peer(undefined as unknown as string, { debug: 0 });

      peer.on('open', (id) => {
        setPeerId(id);
        setStatus('idle');
        console.log('My peer ID is: ' + id);
        
        // Start local video immediately
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((stream) => {
             localStreamRef.current = stream;
             if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
                // Ensure local video is muted to prevent echo
                localVideoRef.current.muted = true;
             }
             
             // If we are Guest, start auto-connecting to Host
             if (!isHost) {
                 connectToPeer(targetConnectId, stream);
             }
          })
          .catch((err) => {
             console.error('Failed to get local stream', err);
             alert("Impossible d'accéder à la caméra/micro. Vérifiez vos permissions.");
          });
      });

      // Handle incoming call (Host receives call from Guest)
      peer.on('call', (call) => {
        console.log('Receiving call from:', call.peer);
        // Clean up retries if we receive a call
        if (connectionRetryRef.current) {
            clearInterval(connectionRetryRef.current);
            connectionRetryRef.current = null;
        }

        // Answer automatically if we have stream, or ask for it
        if (!localStreamRef.current) {
             navigator.mediaDevices.getUserMedia({ video: true, audio: true })
             .then((stream) => {
                 localStreamRef.current = stream;
                 if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                    localVideoRef.current.muted = true;
                 }
                 
                 call.answer(stream);
                 handleCallStream(call);
             });
        } else {
             call.answer(localStreamRef.current);
             handleCallStream(call);
        }
      });
      
      peer.on('error', (err: any) => { 
        // Suppress "peer-unavailable" errors from console if possible, or just ignore them logically
        if (err.type === 'peer-unavailable') {
             // Normal during polling
             return; 
        } 
        
        console.error('Peer error:', err);
        
        if(err.type === 'unavailable-id') {
            if (isHost) {
                setFatalError("Cette session est déjà active dans un autre onglet/fenêtre.");
            }
        }
      });

      peerInstance.current = peer;
    };

    initPeer();

    // Auto-retry mechanism for Guest
    if (!isHost) {
        connectionRetryRef.current = setInterval(() => {
            if (peerInstance.current && !peerInstance.current.destroyed && status !== 'connected') {
                if (localStreamRef.current && !currentCallRef.current) {
                     connectToPeer(targetConnectId, localStreamRef.current);
                }
            }
        }, 4000); 
    }

    return () => {
      if (connectionRetryRef.current) clearInterval(connectionRetryRef.current);
      if (localStreamRef.current) {
         localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerInstance.current) {
        peerInstance.current.destroy();
      }
    };
  }, [roomId, targetConnectId, isHost]);


  const connectToPeer = (remoteId: string, stream: MediaStream) => {
      if (!peerInstance.current) return;
      if (status === 'connected') return;
      
      setConnectionAttempts(prev => prev + 1);
      
      const call = peerInstance.current.call(remoteId, stream);
      currentCallRef.current = call;
      
      call.on('stream', (remoteStream: MediaStream) => {
          handleCallStream(call, remoteStream);
      });
      
      call.on('close', () => {
          setStatus('call-ended');
          currentCallRef.current = null;
      });
      
      call.on('error', (err: any) => {
         // Silent fail for polling
         currentCallRef.current = null;
      });
  };
  
  const handleCallStream = (call: any, remoteStream?: MediaStream) => {
      if (connectionRetryRef.current) {
         clearInterval(connectionRetryRef.current);
         connectionRetryRef.current = null;
      }
  
      currentCallRef.current = call;
      setStatus('connected');
      
      if (remoteStream && remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
      }
      
      if (!remoteStream) {
          call.on('stream', (rStream: MediaStream) => {
             if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = rStream;
             }
          });
      }

      call.on('close', () => {
          setStatus('call-ended');
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      });
  };

  const manualRetry = () => {
      if (localStreamRef.current && peerInstance.current) {
            connectToPeer(targetConnectId, localStreamRef.current);
      }
  };

  const toggleVideo = () => {
      if (localStreamRef.current) {
          const videoTrack = localStreamRef.current.getVideoTracks()[0];
          if (videoTrack) {
              // Toggle native track state
              videoTrack.enabled = !videoTrack.enabled;
              // Update React state
              setIsVideoOn(videoTrack.enabled);
              console.log("Video toggled:", videoTrack.enabled);
          }
      }
  };

  const toggleAudio = () => {
      if (localStreamRef.current) {
          const audioTrack = localStreamRef.current.getAudioTracks()[0];
          if (audioTrack) {
              // Toggle native track state
              audioTrack.enabled = !audioTrack.enabled;
              // Update React state
              setIsAudioOn(audioTrack.enabled);
              console.log("Audio toggled:", audioTrack.enabled);
          }
      }
  };

  const endCall = () => {
      if (currentCallRef.current) {
          currentCallRef.current.close();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      router.back();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Header Overlay */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
             <button 
                onClick={() => router.back()} 
                className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all"
             >
                <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex flex-col">
                <h1 className="text-white font-semibold text-sm backdrop-blur-sm px-2 py-0.5 rounded-md bg-black/20 inline-block">
                    {isHost ? 'Espace Recrutement' : 'Entretien Vidéo'}
                </h1>
                <div className="flex items-center gap-2 mt-0.5 px-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${status === 'connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-amber-500 animate-pulse'}`} />
                    <span className="text-xs text-slate-300 font-medium tracking-wide">
                        {status === 'connected' ? 'En ligne' : 'Connexion...'}
                    </span>
                </div>
            </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
             <ShieldCheck className="h-3 w-3 text-emerald-400" />
             <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Sécurisé & Chiffré</span>
        </div>
      </header>

      {/* Main Stage */}
      <main className="flex-1 relative w-full h-full bg-slate-900 flex items-center justify-center p-4">
        
        {/* Remote Video (Stage) */}
        <div className="relative w-full h-full max-w-[1600px] flex items-center justify-center rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-800/50">
           
           {/* Waiting State Overlay */}
           {status !== 'connected' && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
                   <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                        <div className="relative bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 text-center max-w-sm mx-auto shadow-2xl">
                                <div className="h-20 w-20 bg-slate-700/50 rounded-full mx-auto mb-6 flex items-center justify-center ring-4 ring-slate-800">
                                    <Users className="h-10 w-10 text-slate-400" />
                                </div>
                                
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {fatalError ? "Erreur de Session" : "Salle d'attente"}
                                </h3>
                                
                                {fatalError ? (
                                    <p className="text-red-400 text-sm mb-4 leading-relaxed">{fatalError}</p>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            {isHost 
                                                ? "En attente de l'arrivée du candidat..." 
                                                : "Nous connectons votre session avec le recruteur."}
                                        </p>
                                        {!isHost && (
                                            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-mono bg-black/20 py-1.5 rounded-lg">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                Tentative {connectionAttempts}...
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {!isHost && !fatalError && connectionAttempts > 5 && (
                                    <button 
                                        onClick={manualRetry}
                                        className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-blue-500/25"
                                    >
                                        Forcer la connexion
                                    </button>
                                )}
                        </div>
                   </div>
               </div>
           )}
           
           <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline
              className={`w-full h-full object-contain transition-opacity duration-700 ${status === 'connected' ? 'opacity-100' : 'opacity-0'}`} 
           />
        </div>

        {/* Local Video (Floating PiP) */}
        <div className="absolute top-20 right-6 w-48 sm:w-72 aspect-video bg-slate-800 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 z-20 group transition-transform hover:scale-105 duration-300 origin-top-right">
             <video 
                ref={localVideoRef} 
                autoPlay 
                muted 
                playsInline
                className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-300 ${isVideoOn ? 'opacity-100' : 'opacity-0'}`} 
             />
             
             {/* Local Video Off State */}
             <div className={`absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-slate-500 transition-opacity duration-300 ${isVideoOn ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                 <div className="h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center mb-2">
                    <VideoOff className="h-6 w-6" />
                 </div>
                 <span className="text-xs font-medium">Caméra désactivée</span>
             </div>

             <div className="absolute bottom-3 left-3 flex flex-col gap-0.5">
                 <span className="text-[11px] font-bold text-white shadow-black drop-shadow-md">MOI</span>
                 <span className="text-[10px] text-white/70 shadow-black drop-shadow-md truncate max-w-[120px]">{displayName}</span>
             </div>
             
             {/* Mute Indicator on PiP */}
             {!isAudioOn && (
                 <div className="absolute top-3 right-3 h-6 w-6 bg-red-500/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                     <MicOff className="h-3 w-3 text-white" />
                 </div>
             )}
        </div>
             
        {/* Controls Dock */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
            <div className="flex items-center gap-3 p-2.5 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl ring-1 ring-black/20">
                
                <button 
                    onClick={toggleAudio}
                    className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-200 group relative
                        ${isAudioOn 
                            ? 'bg-slate-800 text-white hover:bg-slate-700 hover:-translate-y-0.5' 
                            : 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                        }`}
                >
                    {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    <span className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {isAudioOn ? 'Couper micro' : 'Activer micro'}
                    </span>
                </button>
                
                <button 
                    onClick={toggleVideo}
                    className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-200 group relative
                        ${isVideoOn 
                            ? 'bg-slate-800 text-white hover:bg-slate-700 hover:-translate-y-0.5' 
                            : 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                        }`}
                >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    <span className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {isVideoOn ? 'Couper caméra' : 'Activer caméra'}
                    </span>
                </button>

                <div className="w-px h-8 bg-white/10 mx-1" />

                <button 
                    onClick={endCall}
                    className="h-12 w-16 bg-red-600 text-white rounded-xl flex items-center justify-center hover:bg-red-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-red-900/20 group relative"
                >
                    <PhoneOff className="h-6 w-6" />
                    <span className="absolute -top-8 bg-red-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Raccrocher
                    </span>
                </button>
            </div>
        </div>
      </main>
    </div>
  );
}