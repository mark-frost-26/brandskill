'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

type Step = 'input' | 'loading' | 'result'
type Tier = 'FREE' | 'PREMIUM'

interface BrandResult {
  id: string
  name: string
  url: string
  tier: Tier
  shareToken: string
  skillFile: string
  signals: {
    colors: Array<{ hex: string; label: string; usage: number }>
    fonts: { heading?: string; body?: string }
    logo?: string
    meta: { title: string; description: string }
    ctas: string[]
  }
}

const LOADING_MESSAGES = [
  'Scanning your website…',
  'Extracting brand colors…',
  'Analyzing typography…',
  'Reading your copy…',
  'Identifying voice patterns…',
  'Building content templates…',
  'Generating your skill file…',
]

export default function GeneratePage() {
  const { data: session } = useSession()
  const [step, setStep] = useState<Step>('input')
  const [url, setUrl] = useState('')
  const [competitorUrl, setCompetitorUrl] = useState('')
  const [tier, setTier] = useState<Tier>('FREE')
  const [loadingMsg, setLoadingMsg] = useState(0)
  const [result, setResult] = useState<BrandResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showCompetitor, setShowCompetitor] = useState(false)

  const handleGenerate = async () => {
    if (!url.trim()) return
    setError('')
    setStep('loading')
    setLoadingMsg(0)

    // Cycle through loading messages
    const interval = setInterval(() => {
      setLoadingMsg(prev => (prev + 1) % LOADING_MESSAGES.length)
    }, 1800)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.startsWith('http') ? url : `https://${url}`,
          tier,
          competitorUrl: competitorUrl || undefined,
        }),
      })

      const data = await res.json()
      clearInterval(interval)

      if (!res.ok) {
        if (data.code === 'AUTH_REQUIRED') {
          setError('Sign in to generate Premium skill files.')
        } else if (data.code === 'PAYMENT_REQUIRED') {
          setError('Upgrade to Premium to get the full skill file.')
        } else {
          setError(data.error || 'Something went wrong.')
        }
        setStep('input')
        return
      }

      setResult(data.brand)
      setStep('result')
    } catch {
      clearInterval(interval)
      setError('Network error. Please try again.')
      setStep('input')
    }
  }

  const handleCopy = () => {
    if (!result?.skillFile) return
    navigator.clipboard.writeText(result.skillFile)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!result?.skillFile) return
    const blob = new Blob([result.skillFile], { type: 'text/markdown' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${result.name.toLowerCase().replace(/\s+/g, '-')}-brand-skill.md`
    link.click()
  }

  const handleReset = () => {
    setStep('input')
    setResult(null)
    setError('')
    setUrl('')
    setCompetitorUrl('')
    setTier('FREE')
    setShowCompetitor(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Input step */}
          {step === 'input' && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-gray-900 mb-3">Generate your skill file</h1>
                <p className="text-gray-500">Paste any URL — homepage, landing page, or product page.</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm glow">
                {/* Tier selector */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setTier('FREE')}
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                      tier === 'FREE'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Free
                  </button>
                  <button
                    onClick={() => {
                      if (!session) {
                        window.location.href = '/login'
                        return
                      }
                      setTier('PREMIUM')
                    }}
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all relative ${
                      tier === 'PREMIUM'
                        ? 'bg-brand-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Premium — $19
                    {tier !== 'PREMIUM' && (
                      <span className="ml-2 text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">10-page crawl</span>
                    )}
                  </button>
                </div>

                {/* URL input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                    placeholder="https://yourbrand.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                    autoFocus
                  />
                </div>

                {/* Competitor URL (premium only) */}
                {tier === 'PREMIUM' && (
                  <div className="mb-4">
                    {!showCompetitor ? (
                      <button
                        onClick={() => setShowCompetitor(true)}
                        className="text-sm text-brand-600 hover:text-brand-700 transition-colors"
                      >
                        + Add competitor URL (optional)
                      </button>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Competitor URL (optional)</label>
                        <input
                          type="url"
                          value={competitorUrl}
                          onChange={e => setCompetitorUrl(e.target.value)}
                          placeholder="https://competitor.com"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                        />
                        <p className="text-xs text-gray-400 mt-1">Adds differentiation rules to your skill file.</p>
                      </div>
                    )}
                  </div>
                )}

                {error && (
                  <div className="mb-4 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={!url.trim()}
                  className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-base hover:bg-brand-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brand-200"
                >
                  Generate skill file →
                </button>

                <p className="text-center text-xs text-gray-400 mt-4">
                  {tier === 'FREE'
                    ? 'Free · No account required · Instant download'
                    : 'Premium unlocks 10-page crawl, all 6 templates, anti-patterns & more'}
                </p>
              </div>

              {/* What's included comparison */}
              <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="font-bold text-gray-900 mb-3">Free includes</div>
                  {['Homepage scan', '3 voice rules', 'Colors & fonts', '2 templates (Social)'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-gray-600 py-1">
                      <span className="text-green-500 text-xs">✓</span> {f}
                    </div>
                  ))}
                </div>
                <div className="bg-brand-50 rounded-xl border border-brand-100 p-4">
                  <div className="font-bold text-brand-900 mb-3">Premium adds</div>
                  {['10-page deep crawl', '5 voice rules', 'All 6 templates', 'Anti-patterns', 'Image guidance', 'Competitor analysis'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-brand-700 py-1">
                      <span className="text-brand-500 text-xs">✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading step */}
          {step === 'loading' && (
            <div className="text-center py-24 animate-fade-in">
              <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-8" />
              <p className="text-gray-900 font-semibold text-lg mb-2">{LOADING_MESSAGES[loadingMsg]}</p>
              <p className="text-gray-400 text-sm">{url}</p>
            </div>
          )}

          {/* Result step */}
          {step === 'result' && result && (
            <div className="animate-slide-up">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-black text-gray-900">{result.name}</h1>
                  <p className="text-gray-500 text-sm">{result.url} · {result.tier === 'PREMIUM' ? '🟣 Premium' : '🟢 Free'}</p>
                </div>
                <button onClick={handleReset} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  ← New scan
                </button>
              </div>

              {/* Brand signals preview */}
              {result.signals.colors.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 flex items-center gap-4">
                  <div className="flex gap-2">
                    {result.signals.colors.map(c => (
                      <div
                        key={c.hex}
                        className="w-8 h-8 rounded-lg border border-gray-100"
                        style={{ background: c.hex }}
                        title={`${c.label}: ${c.hex}`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    {result.signals.fonts.heading && <span className="font-medium text-gray-700">{result.signals.fonts.heading}</span>}
                    {result.signals.fonts.body && result.signals.fonts.body !== result.signals.fonts.heading && (
                      <span> · {result.signals.fonts.body}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Skill file preview */}
              <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden mb-4">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-400 text-xs font-mono">{result.name.toLowerCase().replace(/\s+/g, '-')}-brand-skill.md</span>
                  <button
                    onClick={handleCopy}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <div className="p-4 overflow-auto max-h-96 skill-file-preview text-green-400">
                  {result.skillFile}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
                >
                  ↓ Download .md file
                </button>
                <button
                  onClick={handleCopy}
                  className="px-6 py-4 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {copied ? '✓' : '⎘ Copy'}
                </button>
              </div>

              {/* Upsell if free */}
              {result.tier === 'FREE' && (
                <div className="mt-4 bg-brand-50 border border-brand-100 rounded-2xl p-5">
                  <div className="font-bold text-brand-900 mb-1">Want the full skill file?</div>
                  <p className="text-brand-700 text-sm mb-4">
                    Upgrade to Premium for $19 — one-time — and get 10-page crawl, all 6 templates, anti-patterns, image guidance, and competitor analysis.
                  </p>
                  <Link
                    href={`/api/checkout`}
                    onClick={async (e) => {
                      e.preventDefault()
                      if (!session) { window.location.href = '/login'; return }
                      const res = await fetch('/api/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: 'PREMIUM', brandId: result.id }),
                      })
                      const { url } = await res.json()
                      if (url) window.location.href = url
                    }}
                    className="inline-flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors"
                  >
                    Upgrade to Premium — $19 →
                  </Link>
                </div>
              )}

              {/* How to use */}
              <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-5">
                <div className="font-bold text-gray-900 mb-3 text-sm">How to use this file</div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex gap-2"><span className="font-mono text-brand-600">Claude:</span> Go to Settings → Skills → Add skill → paste the file content</div>
                  <div className="flex gap-2"><span className="font-mono text-brand-600">Cursor:</span> Save as <code className="bg-gray-100 px-1 rounded">.cursorrules</code> in your project root</div>
                  <div className="flex gap-2"><span className="font-mono text-brand-600">Gemini CLI:</span> Use <code className="bg-gray-100 px-1 rounded">--system-prompt-file</code> flag</div>
                  <div className="flex gap-2"><span className="font-mono text-brand-600">Copilot:</span> Add to <code className="bg-gray-100 px-1 rounded">.github/copilot-instructions.md</code></div>
                </div>
              </div>

              {/* Share link */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">
                  Share: <span className="font-mono text-gray-600">{process.env.NEXT_PUBLIC_APP_URL}/examples/{result.shareToken}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
