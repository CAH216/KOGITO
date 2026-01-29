'use client';

import { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { submitReview } from '@/actions/review-actions';
import { useRouter } from 'next/navigation';

interface SessionReviewButtonProps {
    sessionId: string;
    tutorName: string;
    existingReview?: { rating: number; comment: string | null } | null;
}

export default function SessionReviewButton({ sessionId, tutorName, existingReview }: SessionReviewButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    if (existingReview) {
        return (
            <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100 text-sm">
                <Star size={14} fill="currentColor" />
                {existingReview.rating}/5
            </div>
        );
    }

    const handleSubmit = async () => {
        if (rating === 0) return;
        setSubmitting(true);
        try {
            await submitReview(sessionId, rating, comment);
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors bg-white shadow-sm"
            >
                Noter le cours
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-bold text-slate-900">Noter le cours avec {tutorName}</h3>
                            <p className="text-slate-500 text-sm">Comment s'est passée la séance ? Votre avis aide les autres parents.</p>
                        </div>

                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`p-2 rounded-full transition-all hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-slate-200 hover:text-yellow-200'}`}
                                >
                                    <Star size={32} fill={rating >= star ? "currentColor" : "none"} strokeWidth={rating >= star ? 0 : 2} className="drop-shadow-sm" />
                                </button>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <MessageSquare size={16} className="text-indigo-500" />
                                Commentaire (Optionnel)
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Qu'avez-vous apprécié ? Points à améliorer ?"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[100px] focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none resize-none text-slate-700"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={rating === 0 || submitting}
                                className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                            >
                                {submitting ? 'Envoi...' : 'Envoyer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
