'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { submitPartnerRequest } from '@/actions/partner-actions';

export function PartnerRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    const res = await submitPartnerRequest(formData);
    setIsSubmitting(false);
    if (res.success) {
      setSuccess(true);
    }
  }

  if (success) {
    return (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center animate-in fade-in zoom-in">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Message reçu !</h3>
            <p className="mt-2 text-slate-600">Un de nos experts en éducation numérique vous contactera sous 24h.</p>
        </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-6 bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div>
            <label className="block text-sm font-semibold leading-6 text-slate-900">Type d'organisation</label>
            <div className="mt-2 grid grid-cols-2 gap-4">
                <label className="cursor-pointer">
                    <input type="radio" name="organizationType" value="SCHOOL" className="peer sr-only" defaultChecked />
                    <div className="rounded-lg border border-slate-300 bg-white p-4 text-center hover:bg-slate-50 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-600 transition-all font-medium">
                        École / Collège
                    </div>
                </label>
                <label className="cursor-pointer">
                    <input type="radio" name="organizationType" value="AGENCY" className="peer sr-only" />
                    <div className="rounded-lg border border-slate-300 bg-white p-4 text-center hover:bg-slate-50 peer-checked:border-teal-600 peer-checked:bg-teal-50 peer-checked:text-teal-600 transition-all font-medium">
                        Agence de Tutorat
                    </div>
                </label>
            </div>
        </div>

        <div>
            <label htmlFor="organizationName" className="block text-sm font-semibold leading-6 text-slate-900">Nom de l'établissement</label>
            <div className="mt-2.5">
                <input type="text" name="organizationName" id="organizationName" required className="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
                <label htmlFor="contactName" className="block text-sm font-semibold leading-6 text-slate-900">Votre Nom</label>
                <div className="mt-2.5">
                    <input type="text" name="contactName" id="contactName" required className="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
            </div>
                <div>
                <label htmlFor="phone" className="block text-sm font-semibold leading-6 text-slate-900">Téléphone (Optionnel)</label>
                <div className="mt-2.5">
                    <input type="tel" name="phone" id="phone" className="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                </div>
            </div>
        </div>

        <div>
            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-slate-900">Email professionnel</label>
            <div className="mt-2.5">
                <input type="email" name="email" id="email" required className="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
        </div>

        <div>
            <label htmlFor="password" className="block text-sm font-semibold leading-6 text-slate-900">Mot de passe pour votre compte admin</label>
            <div className="mt-2.5">
                <input type="password" name="password" id="password" required className="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
        </div>

        <div>
            <label htmlFor="message" className="block text-sm font-semibold leading-6 text-slate-900">Message (Volume d'élèves, besoins spécifiques...)</label>
            <div className="mt-2.5">
                <textarea name="message" id="message" rows={4} className="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
            </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400 transition-colors">
            {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
        </button>
    </form>
  );
}
