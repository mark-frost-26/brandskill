import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { scrapeUrl, scrapePremiumPages } from '@/lib/scraper'
import { generateSkillFile } from '@/lib/analyzer'
import { prisma } from '@/lib/prisma'
import { createOrUpdateGHLContact } from '@/lib/ghl'
import { z } from 'zod'

const schema = z.object({
  url: z.string().url(),
  tier: z.enum(['FREE', 'PREMIUM']).default('FREE'),
  competitorUrl: z.string().url().optional(),
  brandId: z.string().optional(), // for upgrading existing brand
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 })
    }

    const { url, tier, competitorUrl, brandId } = parsed.data
    const session = await getServerSession(authOptions)

    // If requesting PREMIUM without auth/payment, reject
    if (tier === 'PREMIUM' && !session?.user) {
      return NextResponse.json({ error: 'Authentication required for Premium', code: 'AUTH_REQUIRED' }, { status: 401 })
    }

    if (tier === 'PREMIUM' && session?.user) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } })
      if (user?.plan === 'FREE') {
        // Check if this brand already has a premium payment
        if (brandId) {
          const brand = await prisma.brand.findUnique({ where: { id: brandId } })
          if (brand?.tier !== 'PREMIUM') {
            return NextResponse.json({ error: 'Payment required for Premium', code: 'PAYMENT_REQUIRED' }, { status: 402 })
          }
        } else {
          return NextResponse.json({ error: 'Payment required for Premium', code: 'PAYMENT_REQUIRED' }, { status: 402 })
        }
      }
    }

    // Scrape the URL
    const signals = await scrapeUrl(url)
    if (signals.blocked) {
      return NextResponse.json({ error: 'This website blocks automated access. Try a different URL.' }, { status: 422 })
    }

    let extras: { about?: string; blog?: string; pricing?: string; competitor?: typeof signals } | undefined

    if (tier === 'PREMIUM') {
      const parsed = new URL(url)
      const baseUrl = `${parsed.protocol}//${parsed.hostname}`
      const pages = await scrapePremiumPages(baseUrl)
      extras = { ...pages }

      if (competitorUrl) {
        const competitor = await scrapeUrl(competitorUrl)
        extras.competitor = competitor
      }
    }

    // Generate skill file
    const skillFile = await generateSkillFile(signals, tier, extras)

    // Extract brand name from meta or domain
    const brandName = signals.meta.title?.split(/[-|–]/)[0]?.trim() ||
      signals.domain.replace(/^www\./, '').split('.')[0] || 'Brand'

    // Save to database
    let savedBrand
    if (brandId && session?.user) {
      savedBrand = await prisma.brand.update({
        where: { id: brandId },
        data: { skillFile, brandData: signals as any, tier: tier as any, updatedAt: new Date() },
      })
    } else {
      savedBrand = await prisma.brand.create({
        data: {
          url,
          name: brandName,
          tier: tier as any,
          brandData: signals as any,
          skillFile,
          userId: session?.user?.id || null,
        },
      })

      // Add to GHL if user exists
      if (session?.user?.email) {
        createOrUpdateGHLContact({
          email: session.user.email,
          firstName: session.user.name?.split(' ')[0],
          tags: [`brandskill-${tier.toLowerCase()}`],
        }).catch(() => {})
      }
    }

    return NextResponse.json({
      success: true,
      brand: {
        id: savedBrand.id,
        name: savedBrand.name,
        url: savedBrand.url,
        tier: savedBrand.tier,
        shareToken: savedBrand.shareToken,
        skillFile,
        signals,
      },
    })
  } catch (err: unknown) {
    console.error('[/api/generate]', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
