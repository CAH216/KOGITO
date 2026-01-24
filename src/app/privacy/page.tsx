import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Lock, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
        <>
            <SiteHeader />
    <main className="min-h-screen bg-slate-50">
       {/* Header Section */}
       <div className="bg-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-6">
                <Lock className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Politique de Confidentialité</h1>
            <p className="text-xl text-slate-300">
                Vos données vous appartiennent. Nous les protégeons.
            </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-10 px-4 pb-24 relative z-10">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
            <div className="prose prose-lg max-w-none text-black prose-headings:text-black prose-p:text-black prose-li:text-black prose-strong:text-black">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-100">
                    <Shield className="w-4 h-4" />
                    Dernière mise à jour : 20 Octobre 2023
                </div>
                
                <h3>1. Introduction</h3>
                <p>
                    Chez Kogito (ci-après "nous", "notre"), la confidentialité de vos données est une priorité absolue. 
                    Si l'éducation est notre passion, la confiance est notre fondation. Cette politique détaille comment nous collectons, 
                    utilisons et protégeons vos informations personnelles.
                </p>

                <h3>2. Données collectées</h3>
                <p>Nous collectons les types de données suivants pour fournir nos services éducatifs :</p>
                <ul>
                    <li><strong>Informations d'identité :</strong> Nom, prénom, date de naissance.</li>
                    <li><strong>Coordonnées :</strong> Adresse email, numéro de téléphone, adresse postale.</li>
                    <li><strong>Données scolaires :</strong> Niveau scolaire, matières étudiées, notes (pour le suivi).</li>
                    <li><strong>Données de connexion :</strong> Logs, adresse IP, type de navigateur.</li>
                </ul>

                <h3>3. Utilisation de l'Intelligence Artificielle</h3>
                <p>
                    Nos modèles d'IA analysent les données d'apprentissage pour personnaliser les parcours éducatifs. 
                    Ces données sont anonymisées avant tout traitement par nos algorithmes de machine learning afin de garantir 
                    qu'aucun profil personnel ne puisse être reconstitué à des fins autres que pédagogiques.
                </p>

                <h3>4. Partage des données</h3>
                <p>
                    Nous <strong>ne vendons jamais</strong> vos données à des tiers. Les données peuvent être partagées uniquement avec :
                </p>
                <ul>
                    <li>Les tuteurs assignés à l'élève (strictement nécessaire au cours).</li>
                    <li>Les prestataires de paiement ( Stripe / PayPal ) pour la facturation.</li>
                    <li>Les autorités légales si requis par la loi.</li>
                </ul>

                <h3>5. Vos droits (Loi 25 - Québec)</h3>
                <p>
                    Conformément aux lois applicables au Québec et au Canada, vous disposez d'un droit d'accès, de rectification 
                    et de suppression de vos données. Pour exercer ces droits, contactez notre Responsable de la protection des données 
                    à <a href="mailto:privacy@kogito.ca" className="text-indigo-600 font-bold">privacy@kogito.ca</a>.
                </p>

                <h3>6. Sécurité</h3>
                <p>
                    Toutes les données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). Nos serveurs sont situés au Canada 
                    et respectent les normes SOC 2 Type II.
                </p>
            </div>
        </div>
      </div>
    </main>
    <SiteFooter />
    </>
  );
}
