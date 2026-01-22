'use client';

import { useState, useEffect } from 'react';
import { searchUsersForMessage, startConversation } from '@/actions/message-actions';
import { Search, X } from 'lucide-react';

interface UserSearchListProps {
    onCancel: () => void;
    onSelectUser: (userId: string) => void;
}

export function UserSearchList({ onCancel, onSelectUser }: UserSearchListProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
             // Allowing empty query to fetch defaults/recommendations
            setSearching(true);
            try {
                const res = await searchUsersForMessage(query);
                if (res && res.users) {
                    setResults(res.users);
                }
            } finally {
                setSearching(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleUserClick = async (userId: string) => {
        const conversationId = await startConversation(userId);
        if (conversationId) {
            onSelectUser(conversationId);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input 
                        className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Search users..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        autoFocus
                    />
                </div>
                <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                    <X size={20} />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {searching && <div className="p-4 text-center text-gray-500">Searching...</div>}
                
                {!searching && results.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                        {query.length > 0 ? "No users found" : "No related contacts found."}
                    </div>
                )}

                {results.map(user => (
                    <button
                        key={user.id}
                        onClick={() => handleUserClick(user.id)}
                        className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 text-left border-b"
                    >
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden">
                             {user.image ? (
                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                             ) : (
                                (user.name?.[0] || 'U').toUpperCase()
                             )}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.role}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
