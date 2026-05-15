'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

export default function BrandDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [brand, setBrand] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [skillFile, setSkillFile] = useState('')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    fetch(`/api/brands/${params.id}`)
      .then(r => r.json())
      .then(d => {
        setBrand(d.brand)
        setSkillFile(d.brand?.skillFile || '')
      })
      .finally(() => setLoading(false))
  }, [params.id])

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch(`/api/brands/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillFile }),
    })
    const data = await res.json()
    setBrand(data.brand)
    setEditing(false)
    setSaving(false)
  }

  const handleDownload = () => {
    const blob = new Blob([skillFile], { type: 'text/markdown' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${brand.name.toLowerCase().replace(/\s+/g, '-')}-brand-skill.md`
    link.click()
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(skillFile)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen text-gray-500">Brand not found.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-900 text-sm">← Dashboard</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium text-sm">{brand.name}</span>
          </div>

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900">{brand.name}</h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span className="font-mono">{brand.url}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  brand.tier === 'PREMIUM' ? 'bg-brand-50 text-brand-700' : 'bg-gray-100 text-gray-600'
                }`}>{brand.tier}</span>
                <span>↓ {brand.downloadCount} downloads</span>
              </div>
            </div>
            <div className="flex gap-2">
              {editing ? (
                <>
                  <button
                    onClick={() => { setEditing(false); setSkillFile(brand.skillFile) }}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 text-sm bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                  >
                    {copied ? '✓ Copied' : '⎘ Copy'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 text-sm bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700"
                  >
                    ↓ Download
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Skill file editor/viewer */}
          {editing ? (
            <textarea
              value={skillFile}
              onChange={e => setSkillFile(e.target.value)}
              className="w-full h-[70vh] font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-2xl border border-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              spellCheck={false}
            />
          ) : (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-gray-400 text-xs font-mono">{brand.name.toLowerCase().replace(/\s+/g, '-')}-brand-skill.md</span>
                <button onClick={handleCopy} className="text-xs text-gray-400 hover:text-white">
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-4 overflow-auto skill-file-preview text-green-400 max-h-[70vh]">
                {skillFile}
              </div>
            </div>
          )}

          {/* Upgrade prompt for free brands */}
          {brand.tier === 'FREE' && (
            <div className="mt-4 bg-brand-50 border border-brand-100 rounded-2xl p-5">
              <div className="font-bold text-brand-900 mb-1">This is your Free skill file</div>
              <p className="text-brand-700 text-sm mb-4">Upgrade to Premium for $19 to unlock the full 10-page crawl, all 6 templates, anti-patterns, image guidance, and competitor analysis.</p>
              <button
                onClick={async () => {
                  const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'PREMIUM', brandId: brand.id }),
                  })
                  const { url } = await res.json()
                  if (url) window.location.href = url
                }}
                className="bg-brand-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors"
              >
                Upgrade to Premium — $19 →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
