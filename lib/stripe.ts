import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const PRICES = {
  PREMIUM: process.env.STRIPE_PREMIUM_PRICE_ID!,   // $19 one-time
  AGENCY:  process.env.STRIPE_AGENCY_PRICE_ID!,    // $99/month
}
