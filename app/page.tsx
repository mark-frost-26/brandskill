import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

const EXAMPLE_BRANDS = [
  { name: 'Apple', url: 'apple.com', color: '#1d1d1f' },
  { name: 'Stripe', url: 'stripe.com', color: '#635bff' },
  { name: 'Linear', url: 'linear.app', color: '#5e6ad2' },
  { name: 'Notion', url: 'notion.so', color: '#000000' },
  { name: 'Figma', url: 'figma.com', color: '#f24e1e' },
  { name: 'Vercel', url: 'vercel.com', color: '#000000' },
]

const FEATURES = [
  {
    icon: '🎨',
    title: 'Brand colors & fonts',
    desc: 'Extracts your exact color palette and typography from CSS, computed styles, and Google Fonts.',
  },
  {
    icon: '🗣️',
    title: 'Voice & tone rules',
    desc: 'Analyzes your copy to distill 3–5 specific DO/DON\'T rules that capture how your brand actually talks.',
  },
  {
    icon: '📝',
    title: 'Content templates',
    desc: 'Generates Instagram, LinkedIn, X, TikTok, email, ad, and blog formulas — with character counts.',
  },
  {
    icon: '🚫',
    title: 'Anti-patterns',
    desc: '5 concrete things your brand must never say, do, or sound like. The guardrails AI needs.',
  },
  {
    icon: '🖼️',
    title: 'Image guidance',
    desc: 'Written as AI image generation instructions — mood, style, composition, what to avoid.',
  },
  {
    icon: '⚔️',
    title: 'Competitor analysis',
    desc: 'Paste a competitor URL and get differentiation rules baked into your skill file.',
  },
]

const STEPS = [
  { step: '01', title: 'Paste your URL', desc: 'Homepage, product page, or any public URL. No login required.' },
  { step: '02', title: 'We analyze everything', desc: 'Colors, fonts, copy, CTAs, navigation — all extracted in seconds using Claude.' },
  { step: '03', title: 'Download your skill file', desc: 'A structured .md file ready to load into Claude, Cursor, Copilot, or Gemini CLI.' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
            Free tier · No credit card · Instant download
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 mb-6 leading-none">
            Your brand identity
            <br />
            <span className="gradient-text">on every AI.</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Paste a URL. Get a Claude Skill file personalized to your brand voice, colors, and content style — in 60 seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
            >
              Generate your skill file →
            </Link>
            <Link
              href="/examples"
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              See examples
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof ticker */}
      <section className="py-8 border-y border-gray-100 bg-gray-50 overflow-hidden">
        <div className="flex gap-8 animate-pulse-slow justify-center flex-wrap px-4">
          {EXAMPLE_BRANDS.map(b => (
            <div key={b.name} className="flex items-center gap-2 text-gray-500 text-sm font-medium">
              <span className="w-2 h-2 rounded-full" style={{ background: b.color }} />
              {b.name}
            </div>
          ))}
          <span className="text-gray-400 text-sm">+ thousands more brands</span>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map(s => (
              <div key={s.step} className="text-center">
                <div className="text-5xl font-black text-brand-100 mb-4">{s.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's extracted */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything your AI needs to sound like you</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our analyzer extracts every brand signal and sends it to Claude Sonnet, which produces a structured skill file that any AI can load.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Simple pricing</h2>
          <p className="text-center text-gray-500 mb-16">Start free. Upgrade once. Never re-prompt again.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="border border-gray-200 rounded-2xl p-8">
              <div className="text-2xl font-black text-gray-900 mb-1">Free</div>
              <div className="text-4xl font-black text-gray-900 mb-6">$0</div>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                {['Homepage scan', '3 voice rules', '2 content templates', 'Colors + fonts', 'Instant download'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/generate" className="block text-center bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                Get started free
              </Link>
            </div>

            {/* Premium */}
            <div className="border-2 border-brand-600 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <div className="text-2xl font-black text-gray-900 mb-1">Premium</div>
              <div className="text-4xl font-black text-gray-900 mb-1">$19</div>
              <div className="text-sm text-gray-500 mb-6">one-time per brand</div>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                {['10-page deep crawl', '5 voice rules', 'All 6 content templates', 'Anti-patterns', 'Image generation guidance', 'Competitor analysis', 'Brand positioning'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-brand-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/generate" className="block text-center bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200">
                Get Premium
              </Link>
            </div>

            {/* Agency */}
            <div className="border border-gray-200 rounded-2xl p-8">
              <div className="text-2xl font-black text-gray-900 mb-1">Agency</div>
              <div className="text-4xl font-black text-gray-900 mb-1">$99</div>
              <div className="text-sm text-gray-500 mb-6">per month</div>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                {['Unlimited brands', 'Team dashboard', 'White-label exports', 'API access', 'Priority support', 'Client management'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-purple-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="block text-center border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-colors">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-brand-950 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black mb-4">Stop re-prompting. Start sounding like yourself.</h2>
          <p className="text-brand-300 text-lg mb-10">Every AI you use from that point forward sounds like your brand.</p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 bg-white text-brand-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-50 transition-colors"
          >
            Generate your skill file →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="font-bold text-gray-900">BrandSkill</div>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
            <Link href="/examples" className="hover:text-gray-900 transition-colors">Examples</Link>
            <Link href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link>
          </div>
          <div>© {new Date().getFullYear()} BrandSkill. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
