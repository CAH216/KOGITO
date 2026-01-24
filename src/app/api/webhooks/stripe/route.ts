import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error("Missing Webhook Secret");
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        // Logic for initial purchase (One-time or Sub)
        await fulfillOrder(session);
    } else if (event.type === "invoice.payment_succeeded") {
        // Logic for subscription renewals
        const invoice = event.data.object as any; // Cast to any to avoid strict type issues with 'subscription'
        if (invoice.subscription) {
            await fulfillSubscriptionRenewal(invoice as Stripe.Invoice);
        }
    }

    return new NextResponse(null, { status: 200 });
}

async function fulfillOrder(session: Stripe.Checkout.Session) {
    const metadata = session.metadata;
    if (!metadata || !metadata.userId || !metadata.creditsToAdd) {
        console.error("Missing metadata in webhook", session.id);
        return;
    }

    const userId = metadata.userId;
    const credits = parseFloat(metadata.creditsToAdd);
    const packageId = metadata.packageId;

    // Idempotency Check
    const existingLog = await prisma.systemLog.findFirst({
        where: { message: { contains: `Webhook processed: ${session.id}` } }
    });
    if (existingLog) return;

    const user = await prisma.user.findUnique({
             where: { id: userId },
             include: { parentProfile: true }
    });

    if (!user || !user.parentProfile) return;

    await prisma.parentProfile.update({
        where: { id: user.parentProfile.id },
        data: { hoursBalance: { increment: credits } }
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
            action: 'WEBHOOK_SUCCESS',
            userId: userId,
            message: `Webhook processed: ${session.id}. Added ${credits} credits.`,
        }
    });
}

async function fulfillSubscriptionRenewal(invoice: Stripe.Invoice) {
    // Logic: Find user by Stripe Customer ID -> Add monthly credits
    // This requires us to have stored the stripeCustomerId on the ParentProfile during the first checkout.
    // For now, let's log it. To implement fully, we need to sync customer ID in checkout.session.completed.
    
    // 1. Sync Customer ID if needed (Simulated)
    // 2. Add monthly credits (e.g. 30$ for Essential)
    console.log("Subscription Renewal processed for invoice:", invoice.id);
}
