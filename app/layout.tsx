import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from './providers'

export const metadata: Metadata = {
  title: 'BrandSkill — Your Brand Identity on Every AI',
  description: 'Turn any website URL into a Claude Skill file in 60 seconds. Extract brand voice, colors, fonts, and content templates automatically.',
  keywords: ['claude skills', 'brand identity', 'AI branding', 'Claude AI', 'brand voice'],
  openGraph: {
    title: 'BrandSkill — Your Brand Identity on Every AI',
    description: 'Paste your URL. Get a brand identity skill file. Sound like your brand on every AI.',
    type: 'website',
    url: 'https://brandskill.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrandSkill',
    description: 'Turn any website into a Claude Skill file in 60 seconds.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
