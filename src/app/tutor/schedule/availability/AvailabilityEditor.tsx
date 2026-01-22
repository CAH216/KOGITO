'use client';

import { useState, useTransition } from 'react';
import { AvailabilitySlot, saveAvailability } from '@/actions/schedule-actions';
import { Plus, Trash2, Save, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function AvailabilityEditor({ initialAvailability }: { initialAvailability: AvailabilitySlot[] }) {
    // Transform flat backend slots to state: { 0: [{start, end}], 1: [] }
    const [schedule, setSchedule] = useState<Record<number, {start: string, end: string}[]>>(() => {
        const acc: Record<number, {start: string, end: string}[]> = {};
        DAYS.forEach((_, i) => acc[i] = []);
        initialAvailability.forEach(slot => {
            if (!acc[slot.dayOfWeek]) acc[slot.dayOfWeek] = [];
            acc[slot.dayOfWeek].push({ start: slot.startTime, end: slot.endTime });
        });
        return acc;
    });

    const [isPending, startTransition] = useTransition();

    const addSlot = (dayIndex: number) => {
        setSchedule(prev => ({
            ...prev,
            [dayIndex]: [...prev[dayIndex], { start: '09:00', end: '17:00' }]
        }));
    };

    const removeSlot = (dayIndex: number, slotIndex: number) => {
        setSchedule(prev => ({
            ...prev,
            [dayIndex]: prev[dayIndex].filter((_, i) => i !== slotIndex)
        }));
    };

    const updateSlot = (dayIndex: number, slotIndex: number, field: 'start' | 'end', value: string) => {
        setSchedule(prev => {
            const slots = [...prev[dayIndex]];
            slots[slotIndex] = { ...slots[slotIndex], [field]: value };
            return { ...prev, [dayIndex]: slots };
        });
    };

    const handleSave = () => {
        const flatSlots: AvailabilitySlot[] = [];
        Object.entries(schedule).forEach(([dayStr, slots]) => {
            const dayOfWeek = parseInt(dayStr);
            slots.forEach(slot => {
                flatSlots.push({ dayOfWeek, startTime: slot.start, endTime: slot.end });
            });
        });

        startTransition(async () => {
            const res = await saveAvailability(flatSlots);
            if (res.success) {
                alert("Disponibilités enregistrées !");
            } else {
                alert("Erreur: " + res.error);
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <Link href="/tutor/schedule" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-2 text-sm font-medium transition-colors">
                        <ArrowLeft size={16} />
                        Retour au calendrier
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Définir mes disponibilités</h1>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={isPending}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 disabled:opacity-50 w-full md:w-auto"
                >
                    {isPending ? 'Sauvegarde...' : <><Save size={18} /> Enregistrer</>}
                </button>
            </div>

            <div className="space-y-4">
                {DAYS.map((dayName, index) => {
                    // Start week on Monday for better UX (Index 1) but array is 0-6 (Sun-Sat)
                    // Let's reorder: Mon(1) -> Sat(6) -> Sun(0)
                    // But standard logic is easiest.
                    // Just displaying naturally.
                    
                    const slots = schedule[index] || [];
                    const isDayOff = slots.length === 0;

                    return (
                        <div key={index} className={`bg-white border rounded-xl p-4 transition-colors ${isDayOff ? 'border-slate-100 opacity-60' : 'border-indigo-100 shadow-sm'}`}>
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                
                                <div className="w-32 pt-2">
                                    <span className="font-bold text-slate-700">{dayName}</span>
                                    {isDayOff && <p className="text-xs text-slate-400 mt-1">Non disponible</p>}
                                </div>

                                <div className="flex-1 space-y-3">
                                    {slots.map((slot, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5 px-3">
                                                <input 
                                                    type="time" 
                                                    value={slot.start}
                                                    onChange={e => updateSlot(index, i, 'start', e.target.value)}
                                                    className="bg-transparent font-medium text-slate-700 focus:outline-none"
                                                />
                                                <span className="text-slate-400">-</span>
                                                <input 
                                                    type="time" 
                                                    value={slot.end}
                                                    onChange={e => updateSlot(index, i, 'end', e.target.value)}
                                                    className="bg-transparent font-medium text-slate-700 focus:outline-none"
                                                />
                                            </div>
                                            <button onClick={() => removeSlot(index, i)} className="text-slate-400 hover:text-red-500 p-2 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}

                                    <button onClick={() => addSlot(index)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 py-1">
                                        <Plus size={16} />
                                        Ajouter un créneau
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
