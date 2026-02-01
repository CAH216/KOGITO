import { searchTutors } from '@/actions/search-actions';
import { Search, MapPin, Star, Clock, Filter, SlidersHorizontal, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { calculateSessionCost } from '@/lib/pricing';

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> // Nextjs 15+ searchParams is async promise
}

export default async function TutorSearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams;
  const subject = typeof searchParams.subject === 'string' ? searchParams.subject : undefined;

  const tutors = await searchTutors({ subject });

  const subjects = [
    { id: 'Maths', label: 'Mathématiques', icon: '📐' },
    { id: 'Physique', label: 'Physique', icon: '⚡' },
    { id: 'Anglais', label: 'Anglais', icon: '🇬🇧' },
    { id: 'Français', label: 'Français', icon: '📚' },
    { id: 'SVT', label: 'Biologie', icon: '🧬' },
  ];

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Header Search Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Trouvez le tuteur idéal</h1>
        <p className="text-slate-500 mb-6">Des experts vérifiés pour accompagner la réussite de votre enfant.</p>
        
        <form className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <input 
                    type="text" 
                    name="q"
                    placeholder="Que voulez-vous apprendre ? (Ex: Maths, Piano...)" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                />
            </div>
            
            <div className="w-full md:w-48 relative">
                 <Filter className="absolute left-3 top-3.5 text-slate-400" size={20} />
                 <select 
                    name="subject"
                    defaultValue={subject || 'all'}
                    className="w-full pl-10 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                 >
                     <option value="all">Toutes matières</option>
                     {subjects.map(sub => (
                         <option key={sub.id} value={sub.id}>{sub.label}</option>
                     ))}
                 </select>
            </div>

            <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                Rechercher
            </button>
        </form>

        {/* Popular Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-1.5">Populaire :</span>
            {['Maths', 'Anglais', 'Aide aux devoirs', 'Physique'].map(tag => (
                <Link 
                    key={tag} 
                    href={`/parent/tutors/search?subject=${tag}`}
                    className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                    {tag}
                </Link>
            ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Results */}
          <div className="flex-1 space-y-6">
              <div className="flex justify-between items-center">
                  <h2 className="font-bold text-slate-800 text-lg">
                      {tutors.length > 0 ? `${tutors.length} tuteurs disponibles` : "Aucun résultat"}
                  </h2>
                  <div className="flex items-center gap-2">
                       <span className="text-sm text-slate-500">Trier par:</span>
                       <select className="text-sm font-medium text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer">
                           <option>Pertinence</option>
                           <option>Note (Haut en bas)</option>
                           <option>Prix (Croissant)</option>
                       </select>
                  </div>
              </div>

              {tutors.map((tutor) => (
                  <div key={tutor.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex flex-col sm:flex-row gap-6">
                          {/* Avatar */}
                          <div className="relative shrink-0 text-center sm:text-left">
                              <div className="w-24 h-24 mx-auto sm:mx-0 rounded-2xl bg-slate-100 object-cover overflow-hidden mb-2">
                                  {/* Placeholder or Image */}
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 text-3xl font-bold">
                                      {tutor.user.name?.[0] || 'T'}
                                  </div>
                              </div>
                              <div className="flex flex-col items-center sm:items-start">
                                  <div className="flex items-center gap-1 text-yellow-500 font-bold">
                                      <Star size={16} fill="currentColor" />
                                      <span>{tutor.rating > 0 ? tutor.rating : 'Nouveau'}</span>
                                      <span className="text-slate-400 font-normal text-xs">({tutor.totalReviews})</span>
                                  </div>
                              </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 text-center sm:text-left">
                              <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                                  <div>
                                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2 justify-center sm:justify-start">
                                          {tutor.user.name}
                                          {tutor.isVerified && <CheckCircle2 size={18} className="text-blue-500" />}
                                      </h3>
                                      <p className="text-slate-500 text-sm flex items-center gap-1 justify-center sm:justify-start">
                                          <MapPin size={14} /> En ligne • Canada
                                      </p>
                                  </div>
                                  <div className="mt-2 sm:mt-0 text-right">
                                      <span className="block text-2xl font-bold text-slate-900">
                                          {calculateSessionCost(tutor.hourlyRate || 35)}
                                          <span className="text-sm text-slate-400 font-normal ml-1">$</span>
                                      </span>
                                      <span className="text-xs text-slate-400">
                                          / heure
                                      </span>
                                  </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
                                  {tutor.subjects.map(sub => (
                                      <span key={sub} className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                                          {sub}
                                      </span>
                                  ))}
                              </div>

                              <p className="text-slate-600 text-sm line-clamp-2 mb-6">
                                  {tutor.bio || "Aucune description disponible pour ce tuteur."}
                              </p>

                              <div className="flex flex-col sm:flex-row items-center gap-3">
                                  <Link href={`/parent/tutors/${tutor.id}`} className="w-full sm:w-auto bg-slate-900 text-white font-medium py-2.5 px-6 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                                      Voir le profil
                                  </Link>
                              </div>
                          </div>
                      </div>
                  </div>
              ))}

              {tutors.length === 0 && (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                          <Search size={32} className="text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Aucun tuteur trouvé</h3>
                      <p className="text-slate-500">Essayez de modifier vos filtres ou revenez plus tard.</p>
                      <button className="mt-6 text-blue-600 font-medium hover:underline">Voir tous les tuteurs</button>
                  </div>
              )}
          </div>

          {/* Filters Sidebar (Right) */}
          <div className="hidden lg:block w-72 space-y-6">
               <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-6">
                   <div className="flex items-center gap-2 mb-4 font-bold text-slate-900 border-b border-slate-100 pb-2">
                       <SlidersHorizontal size={18} />
                       Filtres
                   </div>

                   <div className="space-y-6">
                       <div>
                           <label className="text-sm font-semibold text-slate-700 mb-2 block">Niveau scolaire</label>
                           <div className="space-y-2">
                               <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                   <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                   Primaire
                               </label>
                               <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                   <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                   Collège
                               </label>
                               <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                   <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                   Lycée
                               </label>
                           </div>
                       </div>

                       <div>
                           <label className="text-sm font-semibold text-slate-700 mb-2 block">Disponibilité</label>
                           <div className="space-y-2">
                               <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                   <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                   En semaine (Soir)
                               </label>
                               <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                   <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                   Mercredi après-midi
                               </label>
                               <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                   <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                   Week-end
                               </label>
                           </div>
                       </div>
                       
                        <div>
                           <label className="text-sm font-semibold text-slate-700 mb-2 block">Budget Max (Crédits)</label>
                           <input type="range" min="0.5" max="3" step="0.5" className="w-full accent-blue-600" />
                           <div className="flex justify-between text-xs text-slate-500 mt-1">
                               <span>0.5</span>
                               <span>3+</span>
                           </div>
                       </div>
                   </div>
               </div>
          </div>

      </div>
    </div>
  )
}