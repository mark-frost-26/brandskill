import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe, PRICES } from '@/lib/stripe'
import { z } from 'zod'

const schema = z.object({
  type: z.enum(['PREMIUM', 'AGENCY']),
  brandId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const { type, brandId } = parsed.data
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: type === 'AGENCY' ? 'subscription' : 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: PRICES[type], quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgraded=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/pricing`,
    customer_email: session.user.email!,
    metadata: {
      userId: session.user.id,
      brandId: brandId || '',
      type,
    },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
