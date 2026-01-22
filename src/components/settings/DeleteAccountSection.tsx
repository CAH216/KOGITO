'use client';

import { useState } from 'react';
import { deleteMyAccount } from '@/actions/user-actions';
import { signOut } from 'next-auth/react';
import { AlertTriangle } from 'lucide-react';

export function DeleteAccountSection({ role }: { role: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    const handleDelete = async () => {
        if (confirmText !== 'DELETE') return;
        
        if (!confirm("Are you absolutely sure? This action cannot be undone.")) return;

        setIsDeleting(true);
        try {
            const res = await deleteMyAccount();
            if (res.success) {
                await signOut({ callbackUrl: '/' });
            } else {
                alert("Failed to delete account: " + res.error);
                setIsDeleting(false);
            }
        } catch (err) {
            console.error(err);
            setIsDeleting(false);
            alert("An error occurred");
        }
    };

    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-8">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 rounded-full text-red-600">
                    <AlertTriangle size={24} />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-red-900">Zone de Danger</h3>
                    <p className="text-red-700 mt-1 text-sm">
                        La suppression de votre compte est irréversible. Toutes vos données (sessions, messages, historique) seront définitivement effacées.
                    </p>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-red-800 mb-2">
                            Tapez <span className="font-mono font-bold bg-white px-1 border rounded">DELETE</span> pour confirmer
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input 
                                type="text"
                                className="border border-red-300 rounded-lg px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500 w-full sm:w-auto"
                                placeholder="DELETE"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                            />
                            <button 
                                onClick={handleDelete}
                                disabled={confirmText !== 'DELETE' || isDeleting}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto text-center"
                            >
                                {isDeleting ? 'Suppression...' : 'Supprimer mon compte'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function DeleteStudentSection({ studentId, studentName }: { studentId: string, studentName: string }) {
  // Similar implementation but calls deleteStudentAccount
  return null; // Implemented inside parent settings if needed, but keeping it simple for now
}
