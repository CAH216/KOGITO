'use client';

import { useState, useEffect } from 'react';
import { ConversationList } from './ConversationList';
import { ChatArea } from './ChatArea';
import { UserSearchList } from './UserSearchList';
import { getConversations, deleteConversation } from '@/actions/message-actions';
import { Plus } from 'lucide-react';

export type Conversation = {
    id: string;
    lastMessage: {
        content: string;
        createdAt: Date;
        isRead: boolean;
        senderId: string;
    } | null;
    participant: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
        role: string;
    } | undefined;
};

export default function ChatLayout({ currentUserRole, initialConversations = [] }: { currentUserRole: string, initialConversations?: Conversation[] }) {
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [loading, setLoading] = useState(initialConversations.length === 0);
    const [isSearching, setIsSearching] = useState(false);

    const fetchConversations = async () => {
        try {
            const result = await getConversations();
            // @ts-ignore - Validated by server action return type
            setConversations(result || []);
        } catch (error) {
            console.error("Failed to fetch conversations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
        // Poll for new conversations every 30s
        const interval = setInterval(fetchConversations, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleSelectConversation = (id: string) => {
        setSelectedConversationId(id);
        setIsSearching(false);
    };

    const handleDeleteConversation = async (id: string) => {
        if (!confirm("Delete this entire conversation?")) return;
        const result = await deleteConversation(id); // You need to implement this action!
        if (result.success) {
            setConversations(prev => prev.filter(c => c.id !== id));
            if (selectedConversationId === id) {
                setSelectedConversationId(null);
            }
        } else {
            alert("Failed to delete conversation");
        }
    };

    const handleMessageSent = () => {
        fetchConversations(); // Refresh list to update last message
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className={`w-full md:w-80 border-r flex flex-col ${selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
                {!isSearching ? (
                    <>
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                            <button 
                                onClick={() => setIsSearching(true)}
                                className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <ConversationList 
                            conversations={conversations} 
                            selectedId={selectedConversationId} 
                            onSelect={handleSelectConversation}
                            onDelete={handleDeleteConversation}
                            loading={loading}
                        />
                    </>
                ) : (
                    <UserSearchList 
                        onCancel={() => setIsSearching(false)}
                        onSelectUser={(id) => {
                            handleSelectConversation(id);
                            fetchConversations();
                        }}
                    />
                )}
            </div>
            <div className={`flex-1 flex flex-col ${!selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
                {selectedConversationId ? (
                    <ChatArea 
                        conversationId={selectedConversationId} 
                        onBack={() => setSelectedConversationId(null)}
                        onMessageSent={handleMessageSent}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
                        <p>Select a conversation or start a new one.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
