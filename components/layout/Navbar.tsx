'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-black text-xl text-gray-900">
          Brand<span className="text-brand-600">Skill</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/generate" className="hover:text-gray-900 transition-colors">Generator</Link>
          <Link href="/examples" className="hover:text-gray-900 transition-colors">Examples</Link>
          <Link href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link>
              <button
                onClick={() => signOut()}
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-900 transition-colors">Sign in</Link>
              <Link
                href="/generate"
                className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
              >
                Try free →
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-gray-500"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link href="/generate" onClick={() => setMenuOpen(false)}>Generator</Link>
          <Link href="/examples" onClick={() => setMenuOpen(false)}>Examples</Link>
          <Link href="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
          {session ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => signOut()} className="text-left text-gray-500">Sign out</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)}>Sign in</Link>
          )}
        </div>
      )}
    </nav>
  )
}
