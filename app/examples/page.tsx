import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'

const FAMOUS_BRANDS = [
  { name: 'Apple', slug: 'apple', domain: 'apple.com', colors: ['#1d1d1f', '#f5f5f7', '#0066cc'], desc: 'Minimalist precision. Every word earns its place.' },
  { name: 'Stripe', slug: 'stripe', domain: 'stripe.com', colors: ['#635bff', '#0a2540', '#00d4ff'], desc: 'Technical clarity with human warmth.' },
  { name: 'Linear', slug: 'linear', domain: 'linear.app', colors: ['#5e6ad2', '#1e1e2e', '#ffffff'], desc: 'Opinionated, fast, and built for makers.' },
  { name: 'Notion', slug: 'notion', domain: 'notion.so', colors: ['#000000', '#ffffff', '#37352f'], desc: 'Calm productivity. Everything in one place.' },
  { name: 'Figma', slug: 'figma', domain: 'figma.com', colors: ['#f24e1e', '#ff7262', '#a259ff'], desc: 'Creative and collaborative. Tools for teams that care.' },
  { name: 'Vercel', slug: 'vercel', domain: 'vercel.com', colors: ['#000000', '#ffffff', '#0070f3'], desc: 'Speed and developer experience above everything.' },
  { name: 'Framer', slug: 'framer', domain: 'framer.com', colors: ['#0055ff', '#141414', '#ff4488'], desc: 'Motion-first. Craft things that feel alive.' },
  { name: 'Loom', slug: 'loom', domain: 'loom.com', colors: ['#625df5', '#f8f8f8', '#1a1a1a'], desc: 'Async-first communication that feels human.' },
  { name: 'Webflow', slug: 'webflow', domain: 'webflow.com', colors: ['#4353ff', '#1a1a2e', '#ffffff'], desc: 'Power for designers who don\'t want to compromise.' },
  { name: 'Shopify', slug: 'shopify', domain: 'shopify.com', colors: ['#96bf48', '#1a1a1a', '#ffffff'], desc: 'Commerce for everyone. Serious about making it simple.' },
  { name: 'Duolingo', slug: 'duolingo', domain: 'duolingo.com', colors: ['#58cc02', '#1cb0f6', '#ff4b4b'], desc: 'Playful, irreverent, and genuinely educational.' },
  { name: 'Superhuman', slug: 'superhuman', domain: 'superhuman.com', colors: ['#e06c00', '#1c1c1c', '#ffffff'], desc: 'Obsessively fast. Built for people who care about time.' },
]

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-gray-900 mb-4">Brand skill file examples</h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              See how BrandSkill captures the voice, colors, and content patterns of the world&apos;s most recognizable brands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {FAMOUS_BRANDS.map(brand => (
              <Link
                key={brand.slug}
                href={`/examples/${brand.slug}`}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-brand-200 hover:shadow-md transition-all group"
              >
                <div className="mb-4">
                  <div className="flex gap-3">
                    {brand.colors.map(c => (
                      <div key={c} className="flex flex-col items-center gap-1">
                        <div
                          className="w-8 h-8 rounded-lg border border-gray-200 shadow-sm"
                          style={{ background: c }}
                        />
                        <span className="text-[10px] font-mono text-gray-400 tracking-tight">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-bold text-gray-900 group-hover:text-brand-700 transition-colors">{brand.name}</h2>
                  <span className="text-xs text-gray-400 font-mono">{brand.domain}</span>
                </div>
                <p className="text-gray-500 text-sm">{brand.desc}</p>
                <div className="mt-3 text-xs text-brand-600 font-medium group-hover:underline">
                  View skill file →
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
            >
              Generate for your brand →
            </Link>
            <p className="text-gray-400 text-sm mt-3">Free · No account required</p>
          </div>
        </div>
      </main>
    </div>
  )
}
