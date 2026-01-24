import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

async function verifyAndFulfill(sessionId: string) {
    'use server';
    
    if (!sessionId) return { error: "No Session" };

    try {
        // 1. Retrieve Session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status !== 'paid') {
            return { error: "Paiement non finalisé." };
        }

        const metadata = session.metadata;
        if (!metadata || !metadata.userId || !metadata.creditsToAdd) {
            return { error: "Métadonnées manquantes." };
        }

        const userId = metadata.userId;
        const credits = parseFloat(metadata.creditsToAdd);
        const packageId = metadata.packageId;

        // 2. Check if already processed (Idempotency)
        const existingLog = await prisma.systemLog.findFirst({
            where: {
                message: { contains: `Session processed: ${sessionId}` }
            }
        });

        if (existingLog) {
            return { success: true, alreadyProcessed: true };
        }

        // 3. Fulfill Order
        const user = await prisma.user.findUnique({
             where: { id: userId },
             include: { parentProfile: true }
        });

        if (!user || !user.parentProfile) return { error: "Utilisateur introuvable" };

        await prisma.parentProfile.update({
            where: { id: user.parentProfile.id },
            data: {
                hoursBalance: { increment: credits }
            }
        });

        if (packageId?.startsWith('sub_')) {
            await prisma.student.updateMany({
                where: { parentId: user.parentProfile.id },
                data: { plan: 'PREMIUM' }
            });
        }

        await prisma.systemLog.create({
            data: {
                level: 'INFO',
                action: 'PAYMENT_SUCCESS',
                userId: userId,
                message: `Session processed: ${sessionId}. Added ${credits} credits.`,
            }
        });

        return { success: true, credits };

    } catch (e: any) {
        console.error("Fulfillment Error", e);
        return { error: e.message };
    }
}

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const sp = await searchParams;
    const sessionId = sp.session_id as string;
    
    if (!sessionId) {
        redirect('/parent/billing');
    }

    const result = await verifyAndFulfill(sessionId);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md text-center border-2 border-emerald-100">
                <div className="mx-auto bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Paiement Réussi !</h1>
                
                {result.success ? (
                    <p className="text-slate-600 mb-8">
                        Votre compte a été crédité de <span className="font-bold text-slate-900">{result.credits} crédits</span>.
                        <br/>Vous pouvez maintenant réserver vos séances.
                    </p>
                ) : (
                    <p className="text-red-500 mb-8">
                        Une erreur est survenue lors de la validation : {result.error}
                    </p>
                )}

                <Link href="/parent/dashboard" className="block w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
                    Retour au Tableau de Bord
                </Link>
            </div>
        </div>
    )
}
