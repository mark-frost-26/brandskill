import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function SharePage({ params }: { params: { token: string } }) {
  const brand = await prisma.brand.findUnique({
    where: { shareToken: params.token },
  }).catch(() => null)

  if (!brand) notFound()

  // Increment download count
  await prisma.brand.update({
    where: { id: brand.id },
    data: { downloadCount: { increment: 1 } },
  }).catch(() => {})

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-black text-gray-900">{brand.name} Brand Skill File</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-gray-500 text-sm font-mono">{brand.url}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                brand.tier === 'PREMIUM' ? 'bg-brand-50 text-brand-700' : 'bg-gray-100 text-gray-600'
              }`}>{brand.tier}</span>
              <span className="text-gray-400 text-xs">↓ {brand.downloadCount} downloads</span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden mb-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-gray-400 text-xs font-mono">{brand.name.toLowerCase().replace(/\s+/g, '-')}-brand-skill.md</span>
              <div />
            </div>
            <div className="p-4 overflow-auto max-h-[60vh] skill-file-preview text-green-400">
              {brand.skillFile}
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <Link
              href="/generate"
              className="flex-1 text-center bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
            >
              Generate for your brand →
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 text-sm text-gray-500">
            <strong className="text-gray-900">How to use:</strong> Copy the skill file content and add it to Claude (Settings → Skills), save as <code className="bg-gray-100 px-1 rounded">.cursorrules</code> for Cursor, or use with <code className="bg-gray-100 px-1 rounded">--system-prompt-file</code> for Gemini CLI.
          </div>
        </div>
      </main>
    </div>
  )
}
