'use client'

import { updatePassword } from "@/actions/settings-actions"
import { useState } from "react"
import { Lock, Loader2, Save } from "lucide-react"

export default function ChangePasswordForm({ hasPassword = true }: { hasPassword?: boolean }) {
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setMessage('')
        setError('')
        
        try {
            const result = await updatePassword(formData)
            if (result?.error) {
                setError(result.error)
            } else if (result?.success) {
                setMessage(result.success)
                const form = document.querySelector('form#passwordFor') as HTMLFormElement
                if (form) form.reset()
            }
        } catch (e) {
            setError("Une erreur est survenue")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form id="passwordFor" action={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">{error}</div>}
            {message && <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 text-sm font-medium">{message}</div>}

            <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Mot de passe actuel</label>
                <input type="password" name="currentPassword" required className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Nouveau mot de passe</label>
                <input type="password" name="newPassword" required className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Confirmer</label>
                <input type="password" name="confirmPassword" required className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 mt-2 flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />} 
                {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </button>
        </form>
    )
}
