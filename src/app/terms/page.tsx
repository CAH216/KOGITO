import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FileText, ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <>
    <SiteHeader />
    <main className="min-h-screen bg-slate-50">
      
      {/* Header Section */}
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-6">
                <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Conditions Générales d'Utilisation</h1>
            <p className="text-xl text-slate-300">
                La transparence est la clé d'une relation de confiance. Voici nos engagements.
            </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-10 px-4 pb-24 relative z-10">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
            <div className="prose prose-lg max-w-none text-black prose-headings:text-black prose-p:text-black prose-li:text-black prose-strong:text-black">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-100">
                    <ShieldCheck className="w-4 h-4" />
                    Dernière mise à jour : 20 Octobre 2023
                </div>
                
                <h3>1. Acceptation des conditions</h3>
                <p>
                    En accédant au site web et à l'application de Kogito, vous acceptez d'être lié par les présentes modalités. 
                    Si vous n'acceptez pas ces termes, veuillez ne pas utiliser nos services.
                </p>

                <h3>2. Services offerts</h3>
                <p>
                    Kogito offre une plateforme de mise en relation entre étudiants et tuteurs, ainsi que des outils pédagogiques 
                    basés sur l'intelligence artificielle. Nous agissons en tant qu'intermédiaire technologique et non en tant qu'établissement d'enseignement accrédité.
                </p>

                <h3>3. Inscription et Sécurité</h3>
                <p>
                    Vous êtes responsable de maintenir la confidentialité de votre mot de passe. Toutes les activités effectuées sous votre compte relèvent de votre responsabilité.
                </p>

                <h3>4. Paiements et Remboursements</h3>
                <p>
                    Les sessions de tutorat sont payables à l'avance ou débitées automatiquement après la séance.
                </p>
                <ul>
                    <li><strong>Annulation :</strong> Gratuite jusqu'à 24h avant le cours.</li>
                    <li><strong>Retard :</strong> Le tuteur attendra 15 minutes. Passé ce délai, la séance est due.</li>
                    <li><strong>Remboursement :</strong> En cas d'insatisfaction justifiée lors de la première séance, nous remboursons intégralement.</li>
                </ul>

                <h3>5. Code de conduite</h3>
                <p>
                    Kogito prône un environnement d'apprentissage respectueux. Tout comportement harcelant, discriminatoire ou inapproprié 
                    entraînera la suspension immédiate du compte sans remboursement.
                </p>

                <h3>6. Limitation de responsabilité</h3>
                <p>
                    Bien que nous visons l'excellence académique, Kogito ne garantit pas de résultats scolaires spécifiques (notes, admissions). 
                    La réussite dépend du travail de l'étudiant.
                </p>
                
                <div className="bg-slate-50 p-6 rounded-xl mt-8">
                    <h3 className="mt-0 text-lg font-bold">7. Contact</h3>
                    <p className="mb-0 text-sm">
                        Pour toute question juridique : <a href="mailto:legal@kogito.ca" className="text-indigo-600 font-bold hover:underline">legal@kogito.ca</a>.
                    </p>
                </div>

            </div>
        </div>
      </div>
    </main>
    <SiteFooter />
    </>
  );
}
