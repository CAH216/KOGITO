import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {/* Column 1: Produit (REMOVED as requested, merging key links into other columns or assuming they are now on homepage) */}
                 <div>
                    <h4 className="font-extrabold text-slate-900 mb-6 uppercase text-xs tracking-wider">Plateforme</h4>
                    <ul className="space-y-3 text-sm text-slate-600">
                         <li><Link href="/#features" className="hover:text-indigo-600 transition-colors">Fonctionnalités</Link></li>
                         <li><Link href="/#subjects" className="hover:text-indigo-600 transition-colors">Matières</Link></li>
                         <li><Link href="/#pricing" className="hover:text-indigo-600 transition-colors">Tarifs</Link></li>
                    </ul>
                </div>

                {/* Column 2: Écosystème */}
                <div>
                    <h4 className="font-extrabold text-slate-900 mb-6 uppercase text-xs tracking-wider">Écosystème</h4>
                    <ul className="space-y-3 text-sm text-slate-600">
                        <li><Link href="/tutors" className="hover:text-indigo-600 transition-colors">Devenir Tuteur</Link></li>
                        <li><Link href="/partners" className="hover:text-indigo-600 transition-colors">Nos Partenaires</Link></li>
                    </ul>
                </div>

                {/* Column 3: Entreprise */}
                <div>
                    <h4 className="font-extrabold text-slate-900 mb-6 uppercase text-xs tracking-wider">Entreprise</h4>
                    <ul className="space-y-3 text-sm text-slate-600">
                        <li><Link href="/about" className="hover:text-indigo-600 transition-colors">À propos</Link></li>
                        <li><Link href="/careers" className="hover:text-indigo-600 transition-colors">Carrières</Link></li>
                        <li><Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
                    </ul>
                </div>

                {/* Column 4: Ressources & Légal */}
                <div>
                    <h4 className="font-extrabold text-slate-900 mb-6 uppercase text-xs tracking-wider">Ressources</h4>
                    <ul className="space-y-3 text-sm text-slate-600">
                        <li><Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
                        <li><Link href="/manual" className="hover:text-indigo-600 transition-colors">Guide Parents</Link></li>
                        <li className="pt-4"><Link href="/privacy" className="hover:text-indigo-600 transition-colors">Politique de Confidentialité</Link></li>
                        <li><Link href="/terms" className="hover:text-indigo-600 transition-colors">Conditions d'Utilisation</Link></li>
                    </ul>
                </div>
            </div>
            
            <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-400 text-sm">© 2026 Kogito Inc. Tous droits réservés.</p>
                <div className="flex gap-6">
                    {/* Social Media Placeholders - Could be icons later */}
                </div>
            </div>
        </div>
      </footer>
  );
}
