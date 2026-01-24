import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div>
                    <h4 className="font-bold text-slate-900 mb-4">Produit</h4>
                    <ul className="space-y-2 text-sm text-slate-500">
                        <li><Link href="/#method" className="hover:text-indigo-600 transition-colors">IA Kogito</Link></li>
                        <li><Link href="/#method" className="hover:text-indigo-600 transition-colors">Tuteurs</Link></li>
                        <li><Link href="/#pricing" className="hover:text-indigo-600 transition-colors">Tarifs</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-4">Entreprise</h4>
                    <ul className="space-y-2 text-sm text-slate-500">
                        <li><Link href="/about" className="hover:text-indigo-600 transition-colors">À propos</Link></li>
                        <li><Link href="/careers" className="hover:text-indigo-600 transition-colors">Carrières</Link></li>
                        <li><Link href="/schools" className="hover:text-indigo-600 transition-colors">Pour les Écoles</Link></li>
                        <li><Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-4">Ressources</h4>
                    <ul className="space-y-2 text-sm text-slate-500">
                        <li><Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
                        <li><Link href="/manual" className="hover:text-indigo-600 transition-colors">Guide Parents</Link></li>
                        <li><Link href="/tutors/apply" className="hover:text-indigo-600 transition-colors">Devenir Tuteur</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-4">Légal</h4>
                    <ul className="space-y-2 text-sm text-slate-500">
                        <li><Link href="/privacy" className="hover:text-indigo-600 transition-colors">Confidentialité</Link></li>
                        <li><Link href="/terms" className="hover:text-indigo-600 transition-colors">Conditions Générales</Link></li>
                    </ul>
                </div>
            </div>
            <div className="text-center pt-8 border-t border-slate-200">
                <p className="text-slate-400 text-sm">© 2026 Kogito Inc. Tous droits réservés. Fièrement développé à Montréal.</p>
            </div>
        </div>
      </footer>
  );
}
