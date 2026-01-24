'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addChild(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const name = formData.get('name') as string;
  const grade = formData.get('grade') as string;
  const schoolName = formData.get('schoolName') as string;

  if (!name || !grade) {
      throw new Error("Name and Grade are required");
  }

  // Get Parent Profile ID
  const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { parentProfile: true }
  });

  if (!user || !user.parentProfile) {
      throw new Error("Parent profile not found on user");
  }

  // Handle School (Optional: find existing or create placeholder, or just store string if we change schema later, but schema currently links to School model)
  // For now, let's assume we might need to find a school or leave it null if not implementing full school search yet. 
  // If the user provided a school name, we might want to search for it.
  // For simplicity in this step, I'll skip the School relation linkage unless explicitly required, or create a 'Not Listed' school if needed.
  // Actually, let's check the schema again. School is optional on Student.
  // If the user inputs a school name, ideally we should link it. 
  // Let's keep it simple: Just create the student for now. Linking school is a separate complex feature (search/select).

  await prisma.student.create({
      data: {
          name,
          grade,
          parentId: user.parentProfile.id,
          // schoolId: ... (Implemented later via search)
      }
  });

  revalidatePath('/parent/children');
  redirect('/parent/children');
}

export async function updateChild(studentId: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    const name = formData.get('name') as string;
    const grade = formData.get('grade') as string;

    // Verify parent owns this student
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { parentProfile: { include: { children: true } } }
    });

    const isOwner = user?.parentProfile?.children.some(child => child.id === studentId);
    
    if (!isOwner) throw new Error("Unauthorized access to this student");

    await prisma.student.update({
        where: { id: studentId },
        data: {
            name,
            grade
        }
    });

    revalidatePath('/parent/children');
    revalidatePath(`/parent/children/${studentId}`);
    redirect('/parent/children');
}

export async function deleteChild(studentId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Unauthorized");

    // Verify parent owns this student
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { parentProfile: { include: { children: true } } }
    });

    const isOwner = user?.parentProfile?.children.some(child => child.id === studentId);
    
    if (!isOwner) throw new Error("Unauthorized access to this student");

    await prisma.student.delete({
        where: { id: studentId }
    });

    revalidatePath('/parent/children');
    redirect('/parent/children');
}

import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function purchaseCredits(packageId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Unauthorized" };

    if (!process.env.STRIPE_SECRET_KEY) {
        return { error: "Système de paiement non configuré (Clé manquante)." };
    }

    // Determine Price and Metadata
    let priceAmount = 0; // In Cents
    let productName = "";
    let creditsToAdd = 0;
    let mode: 'payment' | 'subscription' = 'payment';
    
    // Mapping Package to Real Money (CAD)
    switch(packageId) {
        case 'sub_essential': 
            priceAmount = 4900; // 49.00$
            productName = "Abonnement Essentiel (AI + 30$ Credits)";
            creditsToAdd = 30; // 30$ value
            mode = 'subscription'; // Ideally reuse a Price ID for sub
            break;
        case 'sub_premium':
             priceAmount = 9900;
             productName = "Abonnement Réussite (AI + 80$ Credits)";
             creditsToAdd = 80;
             mode = 'subscription';
             break;
        case 'credit_50':
             priceAmount = 5000;
             productName = "Recharge 50 Crédits";
             creditsToAdd = 50;
             break;
        case 'credit_100':
             priceAmount = 10000;
             productName = "Recharge 100 Crédits";
             creditsToAdd = 100;
             break;
        case 'credit_200':
             priceAmount = 20000;
             productName = "Recharge 220 Crédits";
             creditsToAdd = 220; // Bonus
             break;
         default: return { error: "Produit inconnu" };
    }
    
    // Create Stripe Session
    try {
        const origin = (await headers()).get('origin') || 'http://localhost:3000';
        
        const stripeSession = await stripe.checkout.sessions.create({
            mode: mode,
            payment_method_types: ['card'], // Can add 'interac_present' if supported or configured
            line_items: [
                {
                    price_data: {
                        currency: 'cad',
                        product_data: {
                            name: productName,
                            description: `Ajoute ${creditsToAdd} crédits à votre compte.`,
                        },
                        unit_amount: priceAmount,
                        recurring: mode === 'subscription' ? { interval: 'month' } : undefined,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId: session.user.id,
                packageId: packageId,
                creditsToAdd: creditsToAdd.toString(),
                type: 'CREDIT_TOPUP'
            },
            customer_email: session.user.email,
            success_url: `${origin}/parent/billing/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/parent/billing?canceled=true`,
        });

        if (!stripeSession.url) throw new Error("Erreur création session Stripe");
        
        // Return URL for frontend redirection
        return { success: true, url: stripeSession.url };

    } catch (err: any) {
        console.error("Stripe Error:", err);
        return { error: "Erreur paiement: " + err.message };
    }
}
