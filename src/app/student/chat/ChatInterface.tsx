'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, Brain, Loader2, StopCircle, Ghost, Lock, EyeOff, Trophy, Share2, CheckCircle2, Mic, Image as ImageIcon, X } from 'lucide-react';
import { sendMessageAction, shareSessionAction } from '@/app/actions/kogito-actions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { EmotionalFeedback, analyzeIdeallySentiment } from './components/EmotionalFeedback';
import WhiteboardRenderer from './components/WhiteboardRenderer';
import { BADGES } from '@/lib/kogito/badges';

interface Message {
  id: string;
  role: string;
  content: string;
  sentiment?: string;
  metadata?: any;
}

export default function ChatInterface({ sessionId, initialMessages }: { sessionId: string, initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [emotionalState, setEmotionalState] = useState<{state: 'NEUTRAL' | 'ENCOURAGING' | 'CELEBRATING' | 'THINKING', message?: string}>({ state: 'NEUTRAL' });
  const [newUnlockedBadge, setNewUnlockedBadge] = useState<string | null>(null);
  const [isShared, setIsShared] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachment, setAttachment] = useState<string | null>(null); // base64
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- VOICE INPUT (Speech-to-Text) ---
  const toggleListening = () => {
    if (isListening) {
      window.speechSynthesis.cancel(); // Stop any speaking
      setIsListening(false);
      return;
    }

    // @ts-ignore - Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportée par ce navigateur.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev ? prev + ' ' + transcript : transcript));
    };

    recognition.start();
  };

  // --- IMAGE INPUT ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit size to 2MB to prevent large payloads
    if (file.size > 2 * 1024 * 1024) {
      alert("L'image est trop volumineuse (max 2MB)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachment(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleShareVictory = async () => {
     if (isShared) return;
     try {
         await shareSessionAction(sessionId);
         setIsShared(true);
     } catch (e) {
         console.error(e);
     }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !attachment) || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      metadata: attachment ? { image: attachment } : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachment(null); // Clear attachment
    setIsLoading(true);

    try {
      // We pass the attachment separately or as part of the content if we modified the action
      // For now, let's just pass input. We need to update the server action to handle images.
      // But since we want to show it in the UI, we already updated userMsg.
      
      const response = await sendMessageAction(sessionId, userMsg.content, isPrivateMode, attachment || undefined);
      
      if (response.success && response.message) {
        const aiMsg: Message = {
          id: response.message.id,
          role: 'assistant',
          content: response.message.content,
          sentiment: response.message.sentiment || undefined,
          metadata: response.message.metadata || undefined
        };
        setMessages(prev => [...prev, aiMsg]);

        if (response.newBadges && response.newBadges.length > 0) {
           setNewUnlockedBadge(response.newBadges[0]); // Show the first one
           setTimeout(() => setNewUnlockedBadge(null), 5000);
        }
        
        // Trigger Emotional Feedback based on AI response
        const sentiment = analyzeIdeallySentiment(aiMsg.content);
        setEmotionalState(sentiment);
      }
    } catch (error: any) {
        console.error("Chat Error", error);
        // Error handling for quota
        if (error.message && error.message.includes("Limite quotidienne")) {
             setMessages(prev => [...prev, {
                 id: 'error-' + Date.now(),
                 role: 'assistant',
                 content: `⚠️ **Limite Atteinte**\n\n${error.message}\n\n[Passer en Premium](/parent/billing)`
             }]);
        }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full relative transition-colors duration-500 ${isPrivateMode ? 'bg-slate-900' : 'bg-[#f8fafc]'}`}>
      <EmotionalFeedback state={emotionalState.state} message={emotionalState.message} />

      {/* BADGE UNLOCK OVERLAY */}
      {newUnlockedBadge && (
         <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-10 duration-700 pointer-events-none">
            <div className="bg-yellow-400 text-yellow-900 px-6 py-4 rounded-3xl shadow-xl border-4 border-yellow-200 flex items-center gap-4">
               <div className="bg-white p-2 rounded-full animate-bounce">
                  <Trophy size={24} className="text-yellow-500" />
               </div>
               <div>
                  <h4 className="font-black text-lg uppercase tracking-wider">Badge Débloqué !</h4>
                  <p className="font-bold text-sm opacity-90">Tu as gagné un nouveau trophée.</p>
               </div>
            </div>
         </div>
      )}
      
      {/* Background Pattern */}
      {!isPrivateMode && (
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      )}

      {/* CONFIDENCE MODE HEADER (If Active) */}
      {isPrivateMode && (
         <div className="bg-slate-800/50 backdrop-blur border-b border-slate-700 px-4 py-2 flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-2 absolute top-0 w-full z-10">
             <Ghost size={14} />
             Mode Confidentiel Activé • Tes brouillons sont privés
         </div>
      )}

      {/* Chat Area */}
      <div className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth ${isPrivateMode ? 'pt-12' : ''}`} id="chat-container">
        
        {/* Welcome State */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-in fade-in zoom-in duration-500 text-center px-4">
            <div className={`
               p-6 rounded-3xl shadow-xl mb-8 border transform hover:scale-105 transition-transform
               ${isPrivateMode 
                  ? 'bg-slate-800 border-slate-700 shadow-slate-900/50' 
                  : 'bg-white border-indigo-50 shadow-indigo-100/50'}
            `}>
                {isPrivateMode ? <Ghost className="w-16 h-16 text-emerald-500" /> : <Brain className="w-16 h-16 text-indigo-500" />}
            </div>
            <h3 className={`text-xl md:text-2xl font-bold mb-3 ${isPrivateMode ? 'text-slate-200' : 'text-slate-700'}`}>
               {isPrivateMode ? 'Chut... on est entre nous.' : 'Bonjour !'}
            </h3>
            <p className="max-w-md mx-auto text-slate-500 text-sm md:text-base leading-relaxed">
               {isPrivateMode 
                  ? "Ici, tu peux te tromper, raturer et poser toutes les questions sans jugement. Seul ce que tu apprends sera retenu."
                  : "Je suis Kogito, ton assistant personnel. On commence par quel exercice aujourd'hui ?"
               }
            </p>
          </div>
        )}
        
        <div className="flex flex-col space-y-6 max-w-3xl mx-auto pb-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              
              <div className={`flex max-w-[90%] md:max-w-[80%] gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatars */}
                <div className="flex-shrink-0 mt-auto">
                    {m.role === 'assistant' ? (
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md ring-2 ring-white
                          ${isPrivateMode ? 'bg-emerald-600 ring-slate-700' : 'bg-gradient-to-tr from-indigo-500 to-violet-600'}
                       `}>
                          <Sparkles size={14} />
                       </div>
                    ) : (
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-white
                          ${isPrivateMode ? 'bg-slate-800 text-slate-400 ring-slate-700' : 'bg-slate-200 text-slate-500'}
                       `}>
                          {isPrivateMode ? <EyeOff size={14} /> : <User size={14} />}
                       </div>
                    )}
                </div>

                {/* Message Bubble */}
                <div className={`
                  relative px-5 py-4 text-[15px] leading-relaxed shadow-sm
                  ${m.role === 'user' 
                    ? (isPrivateMode ? 'bg-slate-700 text-slate-200' : 'bg-indigo-600 text-white') + ' rounded-2xl rounded-tr-sm' 
                    : (isPrivateMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-100') + ' border rounded-2xl rounded-tl-sm'}
                `}>
                  <div className="prose prose-sm max-w-none dark:prose-invert break-words">
                    {m.role === 'assistant' ? (
                        <>
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm, remarkMath]} 
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                    a: ({node, ...props}) => <a className="text-indigo-500 underline hover:text-indigo-600" {...props} />,
                                    code: ({node, className, children, ...props}: any) => {
                                        const match = /language-(\w+)/.exec(className || '')
                                        return match ? (
                                            <div className="rounded-md bg-slate-800 p-3 my-2 text-white text-xs overflow-x-auto">
                                                <code className={className} {...props}>{children}</code>
                                            </div>
                                        ) : (
                                            <code className="bg-slate-100 text-indigo-600 px-1 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>
                                        )
                                    }
                                }}
                            >
                                {m.content}
                            </ReactMarkdown>

                            {/* Rendering Intelligence: Whiteboard */}
                            {m.metadata?.whiteboard && (
                                <WhiteboardRenderer data={m.metadata.whiteboard} />
                            )}
                        </>
                    ) : (
                        <div className="whitespace-pre-wrap font-medium">{m.content}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex w-full justify-start animate-in fade-in duration-300">
               <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md ring-2 ring-white flex-shrink-0 mt-auto">
                      <Loader2 size={14} className="animate-spin" />
                   </div>
                   <div className={`px-4 py-3 rounded-2xl rounded-tl-sm border shadow-sm flex items-center gap-1.5 min-h-[44px]
                      ${isPrivateMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}
                   `}>
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                   </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-2" />
        </div>
      </div>

      {/* Modern Input Area */}
      <div className={`p-4 border-t z-20 transition-colors duration-500 ${isPrivateMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="max-w-3xl mx-auto">
            {/* HEADER ACTIONS: PRIVATE MODE & SHARE */}
            <div className="flex justify-center mb-4 gap-3">
                 {/* SHARE BUTTON - Enables "Mur des Fiertés" */}
                 {!isPrivateMode && messages.length > 1 && (
                     <button
                        onClick={handleShareVictory}
                        disabled={isShared}
                        title="Envoyer cette session aux parents (Mur des Fiertés)"
                        className={`
                            flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all border
                            ${isShared 
                                ? 'bg-indigo-50 text-indigo-400 border-indigo-100 cursor-default' 
                                : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 shadow-sm'}
                        `}
                     >
                        {isShared ? <CheckCircle2 size={12} /> : <Share2 size={12} />}
                        {isShared ? 'Partagé !' : 'Partager ma réussite'}
                     </button>
                 )}

                 <button 
                    onClick={() => setIsPrivateMode(!isPrivateMode)}
                    className={`
                        flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all
                        ${isPrivateMode 
                            ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800' 
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}
                    `}
                 >
                    {isPrivateMode ? <Lock size={12} /> : <Ghost size={12} />}
                    {isPrivateMode ? 'Mode Confidentiel' : 'Passer en privé'}
                 </button>
            </div>

            <div className="relative">
                {/* Visual Attachment Preview */}
                {attachment && (
                    <div className="absolute bottom-full left-4 mb-2 p-2 bg-white rounded-lg shadow-lg border border-indigo-100 flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2">
                        <img src={attachment} alt="Preview" className="h-20 w-auto rounded-md object-cover" />
                        <button 
                            type="button" 
                            onClick={removeAttachment}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                <form 
                    onSubmit={handleSubmit} 
                    className={`
                        flex items-end gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-[28px] border transition-all shadow-sm
                        ${isPrivateMode 
                            ? 'bg-slate-800 border-slate-700 focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-900/20' 
                            : 'bg-slate-50 border-slate-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300'}
                    `}
                >
                    {/* Tools Button Group (Vision & Voice) */}
                    <div className="flex items-center gap-0.5 self-center pl-1">
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-black/5 rounded-full transition-colors"
                            title="Ajouter une image"
                        >
                            <ImageIcon size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={toggleListening}
                            className={`p-2 rounded-full transition-colors ${isListening ? 'text-red-500 bg-red-50 animate-pulse' : 'text-slate-400 hover:text-indigo-600 hover:bg-black/5'}`}
                            title="Dictée vocale"
                        >
                            <Mic size={20} />
                        </button>
                    </div>

                    <textarea
                        className={`
                            flex-1 !bg-transparent border-0 px-2 sm:px-3 py-3.5 min-h-[52px] max-h-32 focus:outline-none text-base min-w-0 resize-none overflow-y-auto
                            ${isPrivateMode ? '!text-slate-200 placeholder:text-slate-500' : '!text-slate-800 placeholder:text-slate-400'}
                        `}
                        placeholder={isListening ? "Je t'écoute..." : (isPrivateMode ? "Question secrète..." : "Écris ton message...")}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        rows={1}
                        autoFocus
                    />
                    <button 
                        type="submit" 
                        disabled={(!input.trim() && !attachment) || isLoading}
                        className={`
                            h-11 w-11 flex items-center justify-center text-white rounded-full transition-all shadow-lg mb-0.5 mr-0.5 shrink-0
                            ${(!input.trim() && !attachment) || isLoading ? 'opacity-50' : 'hover:scale-105 active:scale-95'}
                            ${isPrivateMode ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}
                        `}
                    >
                        <Send size={20} className={isLoading ? "opacity-0" : "ml-0.5"} />
                        {isLoading && <Loader2 size={20} className="absolute animate-spin" />}
                    </button>
                </form>
            </div>
            
            <p className={`text-center text-[10px] mt-3 font-medium ${isPrivateMode ? 'text-slate-600' : 'text-slate-400'}`}>
                {isPrivateMode ? '🔒 Tes échanges sont privés et ne seront pas montrés aux parents.' : 'Kogito v1.0 • IA Éducative Sécurisée'}
            </p>
        </div>
      </div>
    </div>
  );
}
