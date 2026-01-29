'use client';

import { useState } from 'react';
import { Calendar, MessageCircle, Loader2 } from 'lucide-react';
import BookingModal from '@/components/booking/BookingModal';
import { startConversation } from '@/actions/message-actions';
import { useRouter } from 'next/navigation';

interface TutorProfileActionsProps {
    tutor: {
        id: string; // The TutorProfile ID
        userId: string; // The User ID (for chat)
        name: string;
        hourlyRate: number | null;
        subjects: string[];
    };
    parentBalance: number;
}

export default function TutorProfileActions({ tutor, parentBalance }: TutorProfileActionsProps) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const router = useRouter();

    const handleChat = async () => {
        setLoadingChat(true);
        try {
            const conversationId = await startConversation(tutor.userId);
            router.push(`/parent/messages?id=${conversationId}`);
        } catch (error) {
            console.error("Failed to start chat", error);
            // Optionally show toast error
        } finally {
            setLoadingChat(false);
        }
    };

    return (
        <>
            <div className="flex flex-wrap gap-3 pt-2">
                <button 
                    onClick={() => setIsBookingOpen(true)}
                    className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
                >
                    <Calendar size={20} />
                    Réserver un cours
                </button>
                
                <button 
                    onClick={handleChat}
                    disabled={loadingChat}
                    className="bg-white text-slate-700 border border-slate-200 font-bold py-3 px-6 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {loadingChat ? <Loader2 size={20} className="animate-spin" /> : <MessageCircle size={20} />}
                    Discuter
                </button>
            </div>

            <BookingModal 
                tutor={tutor}
                parentBalance={parentBalance}
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
            />
        </>
    );
}
