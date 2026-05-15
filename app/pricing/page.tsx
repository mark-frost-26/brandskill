'use client'
import { useSession } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

function PricingContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const brandId = searchParams.get('brandId')
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (type: 'PREMIUM' | 'AGENCY') => {
    if (!session) { router.push('/login'); return }
    setLoading(type)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, brandId: brandId || undefined }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Simple, honest pricing</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Start free. When you see the value, upgrade once — no subscriptions for individual brands.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Free */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="text-xl font-black text-gray-900 mb-1">Free</div>
          <div className="text-5xl font-black text-gray-900 mb-2">$0</div>
          <p className="text-gray-500 text-sm mb-6">No account required. Just paste and download.</p>
          <ul className="space-y-3 text-sm text-gray-600 mb-8">
            {[
              ['Homepage scan only', true],
              ['3 voice rules', true],
              ['Brand colors & fonts', true],
              ['Social media templates (2)', true],
              ['Instant .md download', true],
              ['10-page deep crawl', false],
              ['All 6 content templates', false],
              ['Anti-patterns', false],
              ['Image generation guidance', false],
              ['Competitor analysis', false],
            ].map(([f, included]) => (
              <li key={f as string} className="flex items-center gap-2">
                <span className={included ? 'text-green-500' : 'text-gray-200'}>{included ? '✓' : '✕'}</span>
                <span className={included ? '' : 'text-gray-300'}>{f as string}</span>
              </li>
            ))}
          </ul>
          <Link href="/generate" className="block text-center border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
            Start free →
          </Link>
        </div>

        {/* Premium */}
        <div className="bg-white rounded-2xl border-2 border-brand-600 p-8 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
            MOST POPULAR
          </div>
          <div className="text-xl font-black text-gray-900 mb-1">Premium</div>
          <div className="text-5xl font-black text-gray-900 mb-1">$19</div>
          <p className="text-gray-500 text-sm mb-6">One-time per brand. Pay once, download forever.</p>
          <ul className="space-y-3 text-sm text-gray-600 mb-8">
            {['10-page deep crawl', '5 voice rules', 'Brand colors & fonts', 'All 6 content templates', 'Anti-patterns (5 rules)', 'Image generation guidance', 'Competitor analysis', 'Brand positioning', 'Saved to dashboard', 'Editable in dashboard'].map(f => (
              <li key={f} className="flex items-center gap-2"><span className="text-brand-500">✓</span> {f}</li>
            ))}
          </ul>
          <button
            onClick={() => handleCheckout('PREMIUM')}
            disabled={loading === 'PREMIUM'}
            className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200 disabled:opacity-50"
          >
            {loading === 'PREMIUM' ? 'Redirecting…' : 'Get Premium — $19 →'}
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">Secure checkout via Stripe</p>
        </div>

        {/* Agency */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="text-xl font-black text-gray-900 mb-1">Agency</div>
          <div className="flex items-end gap-1 mb-2">
            <span className="text-5xl font-black text-gray-900">$99</span>
            <span className="text-gray-400 text-sm mb-2">/mo</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">For agencies managing 5+ client brands.</p>
          <ul className="space-y-3 text-sm text-gray-600 mb-8">
            {['Unlimited brand scans', 'Team dashboard', 'White-label exports', 'API access (REST)', 'Priority support', 'Client management', 'Bulk export', 'Custom branding on files', 'Cancel anytime'].map(f => (
              <li key={f} className="flex items-center gap-2"><span className="text-purple-500">✓</span> {f}</li>
            ))}
          </ul>
          <button
            onClick={() => handleCheckout('AGENCY')}
            disabled={loading === 'AGENCY'}
            className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loading === 'AGENCY' ? 'Redirecting…' : 'Get Agency — $99/mo →'}
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">FAQ</h2>
        <div className="space-y-6">
          {[
            { q: 'Do I need an account for the free tier?', a: 'No. Just paste a URL and download your skill file. No login required.' },
            { q: "What's a Claude Skill file?", a: "A .md file you load into Claude that permanently shapes how it generates content — voice, tone, colors, templates, everything." },
            { q: 'Does it work with tools other than Claude?', a: 'Yes. The .md format works with Cursor (as .cursorrules), GitHub Copilot (copilot-instructions.md), Gemini CLI, and Codex CLI.' },
            { q: 'What does "one-time per brand" mean?', a: "You pay $19 once for a brand, download it, and it's yours. No subscription. Re-scan anytime you need an updated file." },
            { q: 'Can I try before I buy?', a: "Yes — the free tier generates a real, usable skill file. It's limited to 3 voice rules and 2 templates, but it's not a fake preview." },
            { q: 'Does it work for any website?', a: "Most public websites work. A small number block automated access — if that happens, we'll tell you clearly." },
          ].map(({ q, a }) => (
            <div key={q}>
              <h3 className="font-semibold text-gray-900 mb-1">{q}</h3>
              <p className="text-gray-500 text-sm">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <PricingContent />
        </Suspense>
      </main>
    </div>
  )
}
