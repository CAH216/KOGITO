'use client';

import { useState } from 'react';
import { Star, Sparkles, Send, User } from 'lucide-react';
import BookingModal from '@/components/booking/BookingModal';

interface Tutor {
    id: string;
    user: {
        name: string | null;
        image: string | null;
    };
    subjects: string[];
    bio: string | null;
    rating: number;
    hourlyRate: number | null;
}

export default function TutorCard({ tutor, parentBalance }: { tutor: Tutor, parentBalance: number }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-100 group flex flex-col h-full">
                
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-slate-100 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                            {tutor.user.image ? (
                                <img src={tutor.user.image} alt={tutor.user.name || ''} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-indigo-50 text-indigo-300">
                                    <User size={32} />
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-slate-800">{tutor.user.name}</h3>
                            <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                                <Star size={14} fill="currentColor" />
                                {tutor.rating > 0 ? tutor.rating : "Nouveau"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6 flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tutor.subjects.map(subject => (
                            <span key={subject} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                                {subject}
                            </span>
                        ))}
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-3">
                        {tutor.bio || "Ce tuteur n'a pas encore ajouté de bio, mais il est prêt à t'aider !"}
                    </p>
                </div>

                {/* Request Button */}
                <div className="pt-6 border-t border-slate-100">
                    <h4 className="font-bold text-sm text-indigo-900 mb-3 flex items-center gap-2">
                        <Sparkles size={14} className="text-indigo-500" />
                        Réserver un cours
                    </h4>
                    
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold custom-shadow transition-transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Send size={16} />
                        Faire une demande
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-2">
                        Solde parent : {parentBalance.toFixed(2)} crédits
                    </p>
                </div>

            </div>

            <BookingModal 
                tutor={{
                    id: tutor.id,
                    name: tutor.user.name || 'Tuteur',
                    hourlyRate: tutor.hourlyRate,
                    subjects: tutor.subjects
                }} 
                parentBalance={parentBalance}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}