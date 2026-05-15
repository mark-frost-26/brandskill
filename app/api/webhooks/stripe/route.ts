import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { addGHLTag } from '@/lib/ghl'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown'
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const { userId, brandId, type } = session.metadata || {}

      if (!userId) break

      // Record payment
      await prisma.payment.create({
        data: {
          userId,
          brandId: brandId || userId, // fallback
          stripeId: session.id,
          amount: session.amount_total || 0,
          status: 'completed',
        },
      }).catch(() => {})

      // Upgrade user plan
      if (type === 'AGENCY') {
        await prisma.user.update({ where: { id: userId }, data: { plan: 'AGENCY' } })
      } else if (type === 'PREMIUM') {
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (user?.plan === 'FREE') {
          await prisma.user.update({ where: { id: userId }, data: { plan: 'PREMIUM' } })
        }
        // Upgrade the specific brand
        if (brandId) {
          await prisma.brand.update({ where: { id: brandId }, data: { tier: 'PREMIUM' } })
        }
      }

      // GHL tag
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (user?.ghlId) {
        addGHLTag(user.ghlId, `purchased-${type?.toLowerCase()}`).catch(() => {})
      }

      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const userId = sub.metadata?.userId
      if (userId) {
        await prisma.user.update({ where: { id: userId }, data: { plan: 'FREE' } })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
