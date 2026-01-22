'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, User as UserIcon, MoreVertical, Phone, Video, Search, ArrowLeft } from 'lucide-react';
import { getMessages, sendMessage } from '@/actions/message-actions';
import { useRouter } from 'next/navigation';

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
    sender?: {
        name: string | null;
        image: string | null;
    }
}

interface Conversation {
    id: string;
    lastMessageAt: Date;
    lastMessage: { content: string, createdAt: Date } | null;
    otherParticipant: {
        id: string;
        name: string | null;
        image: string | null;
        role: string;
    } | undefined;
}

export default function ChatInterface({ 
    initialConversations, 
    currentUserId 
}: { 
    initialConversations: Conversation[], 
    currentUserId: string 
}) {
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMobileListVisible, setIsMobileListVisible] = useState(true);

    const filteredConversations = conversations.filter(c => 
        c.otherParticipant?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeConversation = conversations.find(c => c.id === selectedId);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch messages when conversation selected
    useEffect(() => {
        if (selectedId) {
            setLoading(true);
            getMessages(selectedId)
                .then((msgs: any) => {
                    setMessages(msgs);
                    setLoading(false);
                    setIsMobileListVisible(false); // Hide list on mobile when selected
                })
                .catch(err => console.error(err));
        }
    }, [selectedId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedId) return;

        const tempId = Date.now().toString();
        const content = inputText;
        setInputText("");

        // Optimistic update
        const newMessage: Message = {
            id: tempId,
            content,
            senderId: currentUserId,
            createdAt: new Date(),
        };

        setMessages(prev => [...prev, newMessage]);
        
        // Update list preview
        setConversations(prev => prev.map(c => {
            if (c.id === selectedId) {
                return {
                    ...c,
                    lastMessage: { content, createdAt: new Date() },
                    lastMessageAt: new Date()
                };
            }
            return c;
        }).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()));

        try {
            await sendMessage(selectedId, content);
            // In a real app we'd replace the temp ID with the real one, but here we just wait for next fetch or ignore
        } catch (error) {
            console.error("Failed to send", error);
            // Rollback in production
        }
    };

    return (
        <div className="flex h-full w-full">
            {/* LEFT: Conversation List */}
            <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col bg-white
                ${selectedId && !isMobileListVisible ? 'hidden md:flex' : 'flex'}
            `}>
                <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher..." 
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">
                            {searchTerm ? 'Aucun résultat.' : 'Aucune conversation.'}
                        </div>
                    ) : (
                        filteredConversations.map(conv => (
                            <button
                                key={conv.id}
                                onClick={() => {
                                    setSelectedId(conv.id);
                                    setIsMobileListVisible(false);
                                }}
                                className={`w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50
                                    ${selectedId === conv.id ? 'bg-indigo-50/50 hover:bg-indigo-50' : ''}
                                `}
                            >
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-700 font-bold overflow-hidden">
                                    {conv.otherParticipant?.image ? (
                                        <img src={conv.otherParticipant.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon size={20} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className={`font-semibold truncate ${selectedId === conv.id ? 'text-indigo-900' : 'text-slate-900'}`}>
                                            {conv.otherParticipant?.name || 'Utilisateur'}
                                        </span>
                                        {conv.lastMessageAt && (
                                            <span className="text-[10px] text-slate-400 shrink-0">
                                                {new Date(conv.lastMessageAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 truncate">
                                        {conv.lastMessage?.content || <span className="italic opacity-50">Nouvelle conversation</span>}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT: Chat Area */}
            <div className={`flex-1 flex flex-col bg-[#F8FAFC]
                ${(!selectedId || isMobileListVisible) ? 'hidden md:flex' : 'flex'}
            `}>
                {selectedId && activeConversation ? (
                    <>
                        {/* Header */}
                        <div className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <button 
                                    className="md:hidden p-2 -ml-2 text-slate-500"
                                    onClick={() => setIsMobileListVisible(true)}
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                
                                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden">
                                    {activeConversation.otherParticipant?.image ? (
                                        <img src={activeConversation.otherParticipant.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-sm">{activeConversation.otherParticipant?.name?.[0]}</span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{activeConversation.otherParticipant?.name}</h3>
                                    <span className="text-xs text-green-500 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                        En ligne (IA Simulé)
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <button className="p-2 hover:bg-slate-100 rounded-full"><Phone size={20} /></button>
                                <button className="p-2 hover:bg-slate-100 rounded-full"><Video size={20} /></button>
                                <button className="p-2 hover:bg-slate-100 rounded-full"><MoreVertical size={20} /></button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {loading ? (
                                <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isMe = msg.senderId === currentUserId;
                                    return (
                                        <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm shadow-sm
                                                ${isMe 
                                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                                                }
                                            `}>
                                                <p>{msg.content}</p>
                                                <div className={`text-[10px] mt-1 text-right opacity-70
                                                     ${isMe ? 'text-indigo-100' : 'text-slate-400'}
                                                `}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-slate-200">
                            <form onSubmit={handleSend} className="flex items-center gap-2 max-w-4xl mx-auto">
                                <input 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Écrivez votre message..." 
                                    className="flex-1 bg-slate-100 text-slate-900 placeholder-slate-500 border-0 rounded-full px-5 py-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                />
                                <button 
                                    type="submit"
                                    disabled={!inputText.trim()}
                                    className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95 shadow-lg shadow-indigo-200"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Send size={32} className="text-slate-300 ml-1" />
                        </div>
                        <p className="font-medium text-lg text-slate-600">Aucune conversation sélectionnée</p>
                        <p className="text-sm">Choisissez une personne dans la liste pour commencer.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
