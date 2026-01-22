'use client';

import { Conversation } from './ChatLayout';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';

interface ConversationListProps {
    conversations: Conversation[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onDelete?: (id: string) => void;
    loading: boolean;
}

export function ConversationList({ conversations, selectedId, onSelect, onDelete, loading }: ConversationListProps) {
    if (loading) {
        return <div className="p-4 text-center text-gray-500">Loading conversations...</div>;
    }

    if (conversations.length === 0) {
        return <div className="p-4 text-center text-gray-500">No conversations yet.</div>;
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => {
                const participant = conv.participant;
                const isSelected = selectedId === conv.id;
                
                return (
                    <div 
                        key={conv.id} 
                        className={`w-full flex items-center border-b group ${isSelected ? 'bg-indigo-50 border-indigo-100' : 'hover:bg-gray-50'}`}
                    >
                        <button
                            onClick={() => onSelect(conv.id)}
                            className="flex-1 p-4 flex items-start space-x-3 text-left min-w-0"
                        >
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold overflow-hidden">
                                    {participant?.image ? (
                                        <img src={participant.image} alt={participant.name || 'User'} className="w-full h-full object-cover" />
                                    ) : (
                                        (participant?.name?.[0] || 'U').toUpperCase()
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className={`text-sm font-semibold truncate ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                                        {participant?.name || participant?.email || 'User'}
                                    </h3>
                                    {conv.lastMessage && (
                                        <span suppressHydrationWarning className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                            {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: false })}
                                        </span>
                                    )}
                                </div>
                                <p className={`text-sm truncate ${isSelected ? 'text-indigo-700' : 'text-gray-500'}`}>
                                    {conv.lastMessage?.content || 'No messages yet'}
                                </p>
                            </div>
                        </button>
                        {onDelete && (
                             <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(conv.id);
                                }}
                                className="p-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete conversation"
                             >
                                <Trash2 size={16} />
                             </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// Helper specific to my previous sloppy typing
// Ideally I would unify the Conversation type in a types file.
interface ExtendedConversation extends Conversation {
    otherParticipant?: any;
}
