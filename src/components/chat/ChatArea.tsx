'use client';

import { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage, deleteMessage } from '@/actions/message-actions';
// import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
// import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Send, ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface ChatAreaProps {
    conversationId: string;
    onBack: () => void;
    onMessageSent: () => void;
}

type Message = {
    id: string;
    content: string;
    senderId: string;
    sender?: {
        name: string | null;
        image: string | null;
    };
    createdAt: Date;
    isRead: boolean;
};

export function ChatArea({ conversationId, onBack, onMessageSent }: ChatAreaProps) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        try {
            const result = await getMessages(conversationId);
            if (result.success && result.messages) {
                // @ts-ignore
                setMessages(result.messages);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchMessages();
        // Poll for new messages every 5s
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const content = newMessage;
        setNewMessage(''); // Optimistic clear

        // Optimistic UI update could go here

        const result = await sendMessage(conversationId, content);
        if (result && result.success) {
            fetchMessages();
            onMessageSent();
        } else {
            console.error("Message send failed:", result);
            setNewMessage(content); // Restore if failed
            alert("Failed to send message: " + (result?.error || "Unknown error"));
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        if (!confirm("Delete this message?")) return;
        const result = await deleteMessage(messageId);
        if (result.success) {
            setMessages(prev => prev.filter(m => m.id !== messageId));
        } else {
            alert("Failed to delete message");
        }
    };

    if (loading && messages.length === 0) {
        return <div className="flex-1 flex items-center justify-center">Loading messages...</div>;
    }

    return (
        <div className="flex flex-col h-full bg-slate-50">
             <div className="md:hidden p-4 border-b bg-white flex items-center">
                <button onClick={onBack} className="mr-4 text-gray-600">
                    <ArrowLeft size={20} />
                </button>
                <h3 className="font-semibold">Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.senderId === session?.user?.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                            {!isMe && (
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 mr-2 overflow-hidden flex items-center justify-center text-xs">
                                     {msg.sender?.image ? (
                                        <img src={msg.sender.image} alt={msg.sender.name || ''} className="w-full h-full object-cover" />
                                     ) : (
                                        (msg.sender?.name?.[0] || '?').toUpperCase()
                                     )}
                                </div>
                            )}
                            <div className={`relative max-w-[70%] rounded-lg p-3 ${
                                isMe 
                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                    : 'bg-white text-gray-800 shadow-sm border rounded-bl-none'
                            }`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                <span className={`text-[10px] mt-1 block ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                                    {format(new Date(msg.createdAt), 'HH:mm')}
                                </span>
                                {isMe && (
                                    <button 
                                        onClick={() => handleDeleteMessage(msg.id)}
                                        className="absolute -left-8 top-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete message"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button 
                        type="submit" 
                        disabled={!newMessage.trim()}
                        className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}

// Simple fallback components if ui/button/input don't exist
// User environment "Tutor" likely has shadcn/ui.
// I'll assume they exist based on project structure "tutor-web".
