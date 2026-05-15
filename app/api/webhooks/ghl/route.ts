import { NextRequest, NextResponse } from 'next/server'

// GoHighLevel webhook handler for inbound events (form fills, pipeline moves, etc.)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[GHL Webhook]', JSON.stringify(body, null, 2))
    // Handle specific event types here as needed
    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
}
