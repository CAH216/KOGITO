'use client';

import { useState } from 'react';
import { confirmSession, declineSession } from '@/actions/booking-actions';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function RequestActions({ requestId }: { requestId: string }) {
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

    const handleAccept = async () => {
        if (!confirm("Accepter cette demande ?")) return;
        setStatus('LOADING');
        try {
            const res = await confirmSession(requestId);
            if (res.success) setStatus('SUCCESS');
            else { alert(res.error); setStatus('ERROR'); }
        } catch {
            setStatus('ERROR');
        }
    };

    const handleDecline = async () => {
         if (!confirm("Refuser cette demande ?")) return;
         // TODO implement decline
         alert("Fonctionnalité de refus bientôt disponible");
    };

    if (status === 'SUCCESS') return <span className="text-green-600 font-bold flex items-center gap-2"><CheckCircle size={16}/> Accepté</span>;

    return (
        <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <button 
                onClick={handleAccept}
                disabled={status === 'LOADING'}
                className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
                {status === 'LOADING' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />} 
                Accepter
            </button>
            <button 
                onClick={handleDecline}
                className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
                <XCircle size={16} /> Refuser
            </button>
        </div>
    );
}