'use client'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

interface Brand {
  id: string
  name: string
  url: string
  tier: 'FREE' | 'PREMIUM'
  shareToken: string
  downloadCount: number
  createdAt: string
}

function DashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const upgraded = searchParams.get('upgraded')
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (!session) return
    fetch('/api/brands')
      .then(r => r.json())
      .then(d => setBrands(d.brands || []))
      .finally(() => setLoading(false))
  }, [session])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this brand? This cannot be undone.')) return
    await fetch(`/api/brands/${id}`, { method: 'DELETE' })
    setBrands(prev => prev.filter(b => b.id !== id))
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {upgraded && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-5 py-4 rounded-2xl font-medium text-sm">
          🎉 Payment successful! Your brand has been upgraded to Premium.
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Your brands</h1>
          <p className="text-gray-500 text-sm mt-1">
            {session?.user?.plan === 'AGENCY' ? '∞ brands · Agency plan' :
             session?.user?.plan === 'PREMIUM' ? 'Premium plan' : 'Free plan'}
          </p>
        </div>
        <div className="flex gap-3">
          {session?.user?.plan === 'FREE' && (
            <Link href="/pricing" className="text-sm border border-brand-200 text-brand-700 px-4 py-2 rounded-xl hover:bg-brand-50 transition-colors">
              Upgrade
            </Link>
          )}
          <Link href="/generate" className="bg-brand-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors">
            + New scan
          </Link>
        </div>
      </div>

      {brands.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
          <div className="text-5xl mb-4">🎨</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No brands yet</h2>
          <p className="text-gray-500 mb-6">Generate your first skill file to see it here.</p>
          <Link href="/generate" className="bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-700 transition-colors">
            Generate your first skill file →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brands.map(brand => (
            <div key={brand.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-brand-200 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{brand.name}</h3>
                  <p className="text-gray-400 text-xs mt-0.5 font-mono">{brand.url}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  brand.tier === 'PREMIUM' ? 'bg-brand-50 text-brand-700' : 'bg-gray-100 text-gray-600'
                }`}>{brand.tier}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                <span>↓ {brand.downloadCount} downloads</span>
                <span>{new Date(brand.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/brands/${brand.id}`} className="flex-1 text-center text-sm bg-gray-900 text-white py-2 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                  View & edit
                </Link>
                {brand.tier === 'FREE' && (
                  <Link href={`/pricing?brandId=${brand.id}`} className="text-sm border border-brand-200 text-brand-700 px-3 py-2 rounded-xl font-semibold hover:bg-brand-50 transition-colors">
                    Upgrade
                  </Link>
                )}
                <button onClick={() => handleDelete(brand.id)} className="text-sm text-gray-400 hover:text-red-500 px-2 py-2 rounded-xl transition-colors">
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  )
}
