'use client'

import { updateProfile } from "@/actions/settings-actions"
import { useState } from "react"
import { User, Camera, Save, Loader2 } from "lucide-react"
import Image from "next/image"

interface Props {
    initialName: string
    initialImage?: string | null
    allowPhoto?: boolean
}

export default function EditProfileForm({ initialName, initialImage, allowPhoto = true }: Props) {
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState<string | null>(initialImage || null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setMessage('')
        setError('')
        
        try {
            const result = await updateProfile(formData)
            if (result?.error) {
                setError(result.error)
            } else if (result?.success) {
                setMessage(result.success)
            }
        } catch (e) {
            setError("Une erreur est survenue")
        } finally {
            setLoading(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreview(url)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            
            {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium">{error}</div>}
            {message && <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 text-sm font-medium">{message}</div>}

            {allowPhoto && (
                <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 mb-6">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 bg-slate-200">
                            {preview ? (
                                <Image src={preview} alt="Avatar" width={96} height={96} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <User size={40} />
                                </div>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 shadow-lg transition-all hover:scale-110">
                            <Camera size={16} />
                            <input type="file" name="image" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="font-medium text-slate-900">Photo de profil</p>
                        <p className="text-sm text-slate-500">Cliquez sur la caméra pour changer.</p>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nom complet</label>
                <input 
                    type="text" 
                    name="name" 
                    defaultValue={initialName}
                    required 
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" 
                />
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />}
                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
        </form>
    )
}
