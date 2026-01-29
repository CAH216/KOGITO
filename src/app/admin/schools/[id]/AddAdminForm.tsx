'use client'

import { addSchoolAdmin } from '@/app/actions/school-actions'
import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'

export function AddAdminForm({ organizationId }: { organizationId: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPending, setIsPending] = useState(false)

  async function  handleSubmit(formData: FormData) {
    setIsPending(true)
    try {
        await addSchoolAdmin(formData)
        setIsExpanded(false)
        // Reset form would be nice here
    } catch (e) {
        alert("Erreur lors de la création de l'admin")
    } finally {
        setIsPending(false)
    }
  }

  if (!isExpanded) {
    return (
      <button 
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-2 text-sm text-indigo-600 font-medium hover:text-indigo-700"
      >
        <Plus size={16} />
        Ajouter un administrateur
      </button>
    )
  }

  return (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Nouvel Administrateur</h3>
      <form action={handleSubmit} className="space-y-3">
        <input type="hidden" name="organizationId" value={organizationId} />
        
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Nom Complet</label>
          <input 
            name="name" 
            required 
            className="w-full text-sm rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" 
            placeholder="Jean Dupont"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
          <input 
            type="email" 
            name="email" 
            required 
            className="w-full text-sm rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" 
            placeholder="admin@ecole.com"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Mot de passe provisoire</label>
          <input 
            type="password" 
            name="password" 
            required 
            className="w-full text-sm rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" 
            placeholder="••••••••"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button 
            type="button" 
            onClick={() => setIsExpanded(false)}
            className="text-xs font-medium text-slate-500 hover:text-slate-700 px-3 py-2"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            disabled={isPending}
            className="bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
          >
            {isPending && <Loader2 className="animate-spin h-3 w-3" />}
            Créer l'accès
          </button>
        </div>
      </form>
    </div>
  )
}