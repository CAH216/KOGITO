import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  // Warn but don't crash in dev if not set, but standard is to fail
  console.warn("STRIPE_SECRET_KEY is missing in env variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-01-27.acacia' as any, 
  typescript: true,
});
