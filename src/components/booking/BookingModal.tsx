'use client';

import { useState, useMemo, useEffect } from 'react';
import { requestSession } from '@/actions/booking-actions';
import { getTutorAvailability, AvailabilitySlot } from '@/actions/schedule-actions';
import { getRecentAiChats } from '@/actions/student-actions';
import { X, Clock, Calendar, AlertCircle, Bot } from 'lucide-react';
import { useTransition } from 'react';

const CREDIT_VALUE = 25; 
const FEE_PERCENT = 0.20;

function estimateCost(tutorRate: number, durationMinutes: number) {
   const rate = tutorRate || 25; 
   const durationHours = durationMinutes / 60;
   const costInCredits = (rate * (1 + FEE_PERCENT)) / CREDIT_VALUE;
   return Math.ceil(costInCredits * durationHours * 100) / 100;
}

// Helper to format slots
function formatSlots(slots: AvailabilitySlot[]) {
    if (slots.length === 0) return null;
    const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const grouped: Record<string, string[]> = {};
    slots.forEach(s => {
        const day = DAYS[s.dayOfWeek];
        if (!grouped[day]) grouped[day] = [];
        grouped[day].push(`${s.startTime} - ${s.endTime}`);
    });
    return grouped;
}

interface BookingModalProps {
    tutor: {
        id: string;
        name: string;
        hourlyRate: number | null;
        subjects: string[];
    };
    parentBalance: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function BookingModal({ tutor, parentBalance, isOpen, onClose }: BookingModalProps) {
    const [subject, setSubject] = useState(tutor.subjects[0] || 'Aide générale');
    const [duration, setDuration] = useState(60); 
    
    // Split Date and Time for better UX ("Select date and time")
    const [selectedDate, setSelectedDate] = useState(''); 
    const [selectedTime, setSelectedTime] = useState(''); 

    const [message, setMessage] = useState('');
    
    // AI Chat Context
    const [aiChats, setAiChats] = useState<any[]>([]);
    const [selectedAiChat, setSelectedAiChat] = useState<string>('');
    const [loadingChats, setLoadingChats] = useState(false);

    // Availability
    const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
    const [loadingAvail, setLoadingAvail] = useState(false);
    
    const [isPending, startTransition] = useTransition();

    const formattedAvailability = useMemo(() => formatSlots(availability), [availability]);
    const cost = useMemo(() => estimateCost(tutor.hourlyRate || 25, duration), [tutor.hourlyRate, duration]);

    // Calculate max minutes 
    const maxMinutes = useMemo(() => {
        const rate = tutor.hourlyRate || 25;
        const result = (parentBalance * 60 * CREDIT_VALUE) / (rate * (1 + FEE_PERCENT));
        return Math.floor(result);
    }, [parentBalance, tutor.hourlyRate]);

    useEffect(() => {
        if (isOpen) {
            setLoadingAvail(true);
            getTutorAvailability(tutor.id).then(res => {
                setAvailability(res);
                setLoadingAvail(false);
            });

            setLoadingChats(true);
            getRecentAiChats().then(chats => {
                setAiChats(chats);
                setLoadingChats(false);
            });
        }
    }, [isOpen, tutor.id]);

    const isTimeValid = useMemo(() => {
        if (!selectedDate || !selectedTime || availability.length === 0) return true;
        
        const d = new Date(selectedDate);
        const day = d.getDay(); 
        
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const timeVal = hours * 60 + minutes;

        const daySlots = availability.filter(s => s.dayOfWeek === day);
        if (daySlots.length === 0) return false; 

        const endTimeVal = timeVal + duration;

        return daySlots.some(slot => {
            const [sh, sm] = slot.startTime.split(':').map(Number);
            const [eh, em] = slot.endTime.split(':').map(Number);
            const sVal = sh * 60 + sm;
            const eVal = eh * 60 + em;
            return timeVal >= sVal && endTimeVal <= eVal;
        });
    }, [selectedDate, selectedTime, availability, duration]);

    const canBook = parentBalance >= cost;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const formData = new FormData();
            formData.append('tutorId', tutor.id);
            formData.append('subject', subject);
            formData.append('message', message);
            formData.append('duration', duration.toString());
            
            // Reconstruct ISO string for backend
            const combinedDate = `${selectedDate}T${selectedTime}`;
            formData.append('date', combinedDate);
            
            if (selectedAiChat) {
                formData.append('aiChatId', selectedAiChat);
            }

            const result = await requestSession(formData);
            if (result?.error) {
                alert(result.error);
            } else {
                alert("Demande envoyée avec succès !");
                onClose();
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl my-8">
                {/* Header */}
                <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                    <div>
                        <h3 className="font-bold text-lg">Réserver un cours</h3>
                        <p className="text-indigo-200 text-sm">avec {tutor.name}</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    {/* Duration Slider */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="font-medium text-slate-700 flex items-center gap-2">
                                <Clock size={16} className="text-indigo-500" />
                                Durée du cours
                            </label>
                            <span className="font-bold text-indigo-900">{duration} min</span>
                        </div>
                        
                        {maxMinutes < 15 ? (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <div>
                                    Solde insuffisant pour un cours (Min 15 min).
                                    <br />
                                    Solde actuel : {parentBalance.toFixed(2)} Crédits
                                </div>
                            </div>
                        ) : (
                            <input 
                                type="range" 
                                min="15" 
                                max={Math.min(maxMinutes, 180)} 
                                step="15" 
                                value={duration}
                                onChange={(e) => setDuration(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        )}
                        <p className="text-xs text-slate-500 mt-2 text-right">
                            Solde parent : {parentBalance.toFixed(2)} crédits (Max {Math.floor(maxMinutes)} min)
                        </p>
                    </div>

                    {/* Cost Preview */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-sm">
                        <span className="text-slate-600">Coût estimé :</span>
                        <span className={`font-bold ${cost > parentBalance ? 'text-red-500' : 'text-slate-900'}`}>
                            {cost.toFixed(2)} Crédits
                        </span>
                    </div>

                    {/* Availability Info */}
                    <div>
                         {loadingAvail ? (
                             <p className="text-xs text-slate-400">Chargement des disponibilités...</p>
                         ) : formattedAvailability ? (
                             <details className="mb-2 group">
                                 <summary className="text-xs font-medium text-indigo-600 cursor-pointer list-none flex items-center gap-1">
                                     <Clock size={12} />
                                     Voir les créneaux habituels
                                 </summary>
                                 <div className="mt-2 text-xs bg-indigo-50 p-2 rounded-lg grid grid-cols-2 gap-1 text-indigo-900">
                                     {Object.entries(formattedAvailability).map(([day, slots]) => (
                                         <div key={day}>
                                             <span className="font-bold">{day}:</span> {slots.join(', ')}
                                         </div>
                                     ))}
                                 </div>
                             </details>
                         ) : (
                             <p className="text-xs text-slate-400 mb-2">Aucune disponibilité définie (Flexible)</p>
                         )}

                        <label className="font-medium text-slate-700 mb-2 block">Date et Heure souhaitée</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <input 
                                    type="date" 
                                    required
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className={`w-full p-3 bg-white border rounded-xl focus:ring-2 focus:outline-none ${!isTimeValid && selectedDate && selectedTime ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-500'}`}
                                    min={new Date().toISOString().slice(0, 10)}
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                            </div>
                            <div className="relative">
                                <input 
                                    type="time" 
                                    required
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className={`w-full p-3 bg-white border rounded-xl focus:ring-2 focus:outline-none ${!isTimeValid && selectedDate && selectedTime ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-500'}`}
                                />
                                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                            </div>
                        </div>
                        {!isTimeValid && selectedDate && selectedTime && (
                             <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                 <AlertCircle size={12} />
                                 Créneau en dehors des heures définies par le tuteur.
                             </p>
                        )}
                    </div>

                    {/* Subject & Message & AI Context */}
                    <div className="space-y-4">
                        <select 
                            value={subject} 
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl"
                        >
                             {tutor.subjects.length > 0 ? (
                                 tutor.subjects.map(s => <option key={s} value={s}>{s}</option>)
                             ) : (
                                 <option value="General">Aide générale</option>
                             )}
                        </select>
                        
                        {/* AI Chat Selection */}
                        {aiChats.length > 0 && (
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                                <label className="text-xs font-bold text-indigo-900 mb-1 flex items-center gap-1">
                                    <Bot size={12} />
                                    Lier une conversation Kogito (IA)
                                </label>
                                <select 
                                    value={selectedAiChat}
                                    onChange={(e) => setSelectedAiChat(e.target.value)}
                                    className="w-full text-sm p-2 rounded-lg border-indigo-200 bg-white"
                                >
                                    <option value="">-- Ne rien lier --</option>
                                    {aiChats.map(chat => (
                                        <option key={chat.id} value={chat.id}>
                                            {chat.title || chat.subject || 'Conversation'} ({new Date(chat.createdAt).toLocaleDateString()})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-indigo-600 mt-1">
                                    Cela permettra au tuteur de comprendre ton besoin.
                                </p>
                            </div>
                        )}

                        <textarea 
                            placeholder="Message pour le tuteur (ex: J'ai besoin d'aide sur les fractions...)"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm resize-none h-24"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={!canBook || isPending || maxMinutes < 15 || !isTimeValid}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isPending ? 'Envoi...' : 'Envoyer la demande'}
                    </button>
                    
                </form>
            </div>
        </div>
    );
}
