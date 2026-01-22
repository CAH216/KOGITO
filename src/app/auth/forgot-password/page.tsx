
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2 group">
                 <div className="bg-blue-600 p-2 rounded-lg shadow-sm group-hover:bg-blue-700 transition-colors">
                    <Brain className="h-8 w-8 text-white" />
                 </div>
                 <span className="text-2xl font-bold text-slate-900 tracking-tight">Kogito</span>
            </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Récupération de compte
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Entrez votre email pour réinitialiser votre mot de passe.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
          
          {submitted ? (
             <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Email envoyé !</h3>
                <p className="mt-2 text-sm text-slate-500 mb-6">
                    Si un compte existe pour <strong>{email}</strong>, vous recevrez un lien de réinitialisation dans quelques instants.
                </p>
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium text-sm">
                    Retour à la connexion
                </Link>
             </div>
          ) : (
             <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Adresse email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-slate-900 bg-white focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 px-3 border"
                    placeholder="vous@exemple.com"
                    />
                </div>
                </div>

                <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                </button>
                </div>
            </form>
          )}
          
          {!submitted && (
              <div className="mt-6 text-center">
                  <Link href="/auth/login" className="text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1">
                      <ArrowLeft size={16} /> Retour à la connexion
                  </Link>
              </div>
          )}

        </div>
      </div>
    </div>
  );
}
