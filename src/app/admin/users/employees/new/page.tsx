import { createEmployee } from '@/app/actions/user-actions'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewEmployeePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
            href="/admin/users" 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
        >
            <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Ajouter un Employé</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <form action={createEmployee} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                placeholder="Jean Dupont"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="jean.dupont@kogito.com"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe temporaire <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                placeholder="••••••••"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">L'employé pourra changer son mot de passe plus tard.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 flex justify-end gap-3">
             <Link
                href="/admin/users"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
             >
                Annuler
             </Link>
             <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors"
             >
                Créer l'employé
             </button>
          </div>
        </form>
      </div>
    </div>
  )
}
