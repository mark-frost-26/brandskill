'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export type ColorSwatch = { hex: string; name: string; desc: string }
export type VoiceRule = { title: string; good: string; bad: string }
export type SocialPost = { platform: string; copy: string; handle?: string }
export type AntiPattern = { rule: string; reason: string }
export type ImageRule = { always: string[]; never: string[] }

export type Brand = {
  name: string; domain: string; principle: string; voice: string
  target: string; differentiator: string; positioning: string
  colors: ColorSwatch[]; primaryFont: { name: string; desc: string }
  bodyFont: { name: string; size: string; desc: string }
  voiceRules: VoiceRule[]; socialPosts: SocialPost[]
  emailSubjects: string[]; emailOpener: string; blogOpener: string
  adHeadlines: string[]; antiPatterns: AntiPattern[]; imageRules: ImageRule
  bg: string; fg: string; accent: string; accentAlt: string
}

function isDark(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.08 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(18px)', transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      {children}
    </div>
  )
}

const SECTIONS = ['Overview', 'Voice & Tone', 'Visual Identity', 'Social Media', 'Email', 'Blog & Editorial', 'Ad Creative', 'Anti-Patterns']

function OverviewSection({ brand }: { brand: Brand }) {
  const darkBg = isDark(brand.bg)
  const muted = darkBg ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)'
  const cardBg = darkBg ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'
  const cardBorder = darkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
  return (
    <div>
      <FadeIn>
        <div style={{ textAlign: 'center', padding: '40px 0 32px' }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: brand.fg, letterSpacing: '-0.02em', marginBottom: 10 }}>{brand.name} Brand Portfolio</h2>
          <p style={{ fontSize: 17, color: muted }}>A complete identity system for every surface.</p>
        </div>
      </FadeIn>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Brand Principle', value: brand.principle },
          { label: 'Voice', value: brand.voice },
          { label: 'Target', value: brand.target },
          { label: 'Differentiator', value: brand.differentiator },
        ].map((item, i) => (
          <FadeIn key={i} delay={i * 0.07}>
            <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: brand.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.label}</span>
              <span style={{ fontSize: 15, fontWeight: 500, color: brand.fg, lineHeight: 1.4 }}>{item.value}</span>
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={0.25}>
        <div style={{ borderLeft: `3px solid ${brand.accent}`, paddingLeft: 22, paddingTop: 6, paddingBottom: 6, marginBottom: 28 }}>
          <p style={{ fontSize: 18, color: brand.fg, fontWeight: 500, lineHeight: 1.55, fontStyle: 'italic' }}>{brand.positioning}</p>
        </div>
      </FadeIn>
      <FadeIn delay={0.35}>
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 18, padding: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: brand.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Color Palette</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {brand.colors.map(c => (
              <div key={c.hex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 52, height: 52, borderRadius: 13, background: c.hex, border: `2px solid ${darkBg ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`, boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} />
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: muted }}>{c.hex}</span>
                <span style={{ fontSize: 10, color: muted, opacity: 0.7 }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  )
}

function VoiceToneSection({ brand }: { brand: Brand }) {
  const darkBg = isDark(brand.bg)
  const cardBg = darkBg ? 'rgba(255,255,255,0.04)' : '#ffffff'
  const cardBorder = darkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.09)'
  return (
    <div>
      <FadeIn>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: brand.fg, letterSpacing: '-0.02em', marginBottom: 6 }}>Voice & Tone</h2>
        <p style={{ fontSize: 16, color: brand.fg, opacity: 0.45, marginBottom: 28 }}>{brand.voiceRules.length} rules. No exceptions.</p>
      </FadeIn>
      {brand.voiceRules.map((rule, i) => (
        <FadeIn key={i} delay={i * 0.06}>
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: 22, marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: brand.accent, letterSpacing: '0.08em', marginBottom: 5 }}>0{i + 1}</div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: brand.fg, marginBottom: 14, lineHeight: 1.3 }}>{rule.title}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: 'rgba(34,197,94,0.15)', color: '#22c55e', marginBottom: 7 }}>DO</span>
                <p style={{ fontSize: 14, color: brand.fg, lineHeight: 1.5 }}>{rule.good}</p>
              </div>
              <div>
                <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: 'rgba(239,68,68,0.15)', color: '#ef4444', marginBottom: 7 }}>DON&apos;T</span>
                <p style={{ fontSize: 14, color: brand.fg, opacity: 0.55, lineHeight: 1.5 }}>{rule.bad}</p>
              </div>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  )
}

function VisualIdentitySection({ brand }: { brand: Brand }) {
  const darkBg = isDark(brand.bg)
  const muted = darkBg ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)'
  const cardBg = darkBg ? 'rgba(255,255,255,0.05)' : '#f8f8f8'
  const cardBorder = darkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
  return (
    <div>
      <FadeIn>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: brand.fg, letterSpacing: '-0.02em', marginBottom: 6 }}>Visual Identity</h2>
        <p style={{ fontSize: 16, color: muted, marginBottom: 28 }}>Color, type, and image direction.</p>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p style={{ fontSize: 11, fontWeight: 700, color: brand.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Color Palette</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 40 }}>
          {brand.colors.map((c, i) => (
            <div key={i} style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${cardBorder}` }}>
              <div style={{ background: c.hex, height: 80, display: 'flex', alignItems: 'flex-end', padding: '8px 10px' }}>
                <span style={{ color: isDark(c.hex) ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.65)', fontSize: 11, fontWeight: 600, fontFamily: 'monospace' }}>{c.hex}</span>
              </div>
              <div style={{ padding: 10, background: darkBg ? 'rgba(255,255,255,0.04)' : '#fff' }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: brand.fg }}>{c.name}</div>
                <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p style={{ fontSize: 11, fontWeight: 700, color: brand.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Typography</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 14, padding: 22 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: muted, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Headlines</span>
            <span style={{ fontSize: 26, fontWeight: 700, color: brand.fg, letterSpacing: '-0.02em', lineHeight: 1.1, display: 'block', marginBottom: 8 }}>{brand.primaryFont.name}</span>
            <span style={{ fontSize: 12, color: muted }}>{brand.primaryFont.desc}</span>
          </div>
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 14, padding: 22 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: muted, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Body — {brand.bodyFont.size}</span>
            <span style={{ fontSize: 16, color: brand.fg, lineHeight: 1.5, display: 'block' }}>{brand.bodyFont.name}</span>
            <span style={{ fontSize: 12, color: muted, marginTop: 6, display: 'block' }}>{brand.bodyFont.desc}</span>
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={0.3}>
        <p style={{ fontSize: 11, fontWeight: 700, color: brand.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Image Rules</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14, padding: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#22c55e', marginBottom: 10 }}>✓ Always</div>
            {brand.imageRules.always.map((item, i) => <div key={i} style={{ fontSize: 13, color: brand.fg, padding: '3px 0', opacity: 0.85 }}>→ {item}</div>)}
          </div>
          <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#ef4444', marginBottom: 10 }}>✕ Never</div>
            {brand.imageRules.never.map((item, i) => <div key={i} style={{ fontSize: 13, color: brand.fg, padding: '3px 0', opacity: 0.85 }}>✕ {item}</div>)}
          </div>
        </div>
      </FadeIn>
    </div>
  )
}

function SocialMediaSection({ brand }: { brand: Brand }) {
  const darkBg = isDark(brand.bg)
  const cardBg = darkBg ? 'rgba(255,255,255,0.05)' : '#ffffff'
  const cardBorder = darkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
  return (
    <div>
      <FadeIn>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: brand.fg, letterSpacing: '-0.02em', marginBottom: 6 }}>Social Media</h2>
        <p style={{ fontSize: 16, color: brand.fg, opacity: 0.45, marginBottom: 28 }}>How {brand.name} shows up on every platform.</p>
      </FadeIn>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {brand.socialPosts.map((post, i) => (
          <FadeIn key={i} delay={i * 0.09}>
            <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 18, padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: brand.accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{post.platform}</span>
                {post.handle && <span style={{ fontSize: 12, color: brand.fg, opacity: 0.35, fontFamily: 'monospace' }}>{post.handle}</span>}
              </div>
              <p style={{ fontSize: 16, color: brand.fg, lineHeight: 1.65, whiteSpace: 'pre-line' }}>{post.copy}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}

function EmailSection({ brand }: { brand: Brand }) {
  const darkBg = isDark(brand.bg)
  const cardBg = darkBg ? 'rgba(255,255,255,0.05)' : '#ffffff'
  const cardBorder = darkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
  const chipBg = darkBg ? 'rgba(255,255,255,0.07)' : '#f3f4f6'
  return (
    <div>
      <FadeIn>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: brand.fg, letterSpacing: '-0.02em', marginBottom: 6 }}>Email</h2>
        <p style={{ fontSize: 16, color: brand.fg, opacity: 0.45, marginBottom: 28 }}>Subject lines, openers, and the formula.</p>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p style={{ fontSize: 11, fontWeight: 700, color: brand.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Subject Lines</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
          {brand.emailSubjects.map((s, i) => (
            <div key={i} style={{ background: chipBg, borderRadius: 10, padding: '13px 16px', fontSize: 15, color: brand.fg, fontWeight: 500 }}>📧 {s}</div>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p style={{ fontSize: 11, fontWeight: 700, color: brand.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Email Opener</p>
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 18, padding: 26 }}>
          <p style={{ fontSize: 18, color: brand.fg, lineHeight: 1.6, fontStyle: 'italic' }}>&ldquo;{brand.emailOpener}&rdquo;</p>
        </div>
      </FadeIn>
    </div>
  )
}

function BlogSection({ brand }: { brand: Brand }) {
  const darkBg = isDark(brand.bg)
  const cardBg = darkBg ? 'rgba(255,255,255,0.05)' : '#ffffff'
  const cardBorder = darkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
  return (
    <div>
      <FadeIn>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: brand.fg, letterSpacing: '-0.02em', marginBottom: 6 }}>Blog & Editorial</h2>
        <p style={{ fontSize: 16, color: brand.fg, opacity: 0.45, marginBottom: 28 }}>How {brand.name} opens a story.</p>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 18, padding: 34, marginBottom: 28 }}>
          <p style={{ fontSize: 24, fontWeight: 600, color: brand.fg, lineHeight: 1.45, letterSpacing: '-0.01em' }}>&ldquo;{brand.blogOpener}&rdquo;</p>
        </div>
      </FadeIn>
      <FadeIn delay={0.2}>
        <div style={{ borderLeft: `3px solid ${brand.accent}`, paddingLeft: 18, paddingTop: 4, paddingBottom: 4 }}>
          <p style={{ fontSize: 13, color: brand.fg, opacity: 0.55, lineHeight: 1.6 }}>
            Formula: Start with a contradiction, a reframe, or a number that makes the reader feel something. Never start with the product. Lead with insight.
          </p>
        </div>
      </FadeIn>
    </div>
  )
}

function AdCreativeSection({ brand }: { brand: Brand }) {
  const darkBg = isDark(brand.bg)
  const cardBorder = darkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
  return (
    <div>
      <FadeIn>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: brand.fg, letterSpacing: '-0.02em', marginBottom: 6 }}>Ad Creative</h2>
        <p style={{ fontSize: 16, color: brand.fg, opacity: 0.45, marginBottom: 28 }}>Headlines that stop the scroll.</p>
      </FadeIn>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14 }}>
        {brand.adHeadlines.map((ad, i) => (
          <FadeIn key={i} delay={i * 0.07}>
            <div style={{
              background: i % 2 === 0 ? brand.accent : (darkBg ? 'rgba(255,255,255,0.07)' : '#f3f4f6'),
              borderRadius: 18, padding: '28px 22px', minHeight: 130,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              border: `1px solid ${cardBorder}`,
            }}>
              <p style={{
                fontSize: 20, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.02em',
                color: i % 2 === 0 ? (isDark(brand.accent) ? '#fff' : '#000') : brand.fg,
              }}>{ad}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}

function AntiPatternsSection({ brand }: { brand: Brand }) {
  const darkBg = isDark(brand.bg)
  const cardBg = darkBg ? 'rgba(255,255,255,0.04)' : '#ffffff'
  const cardBorder = darkBg ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  return (
    <div>
      <FadeIn>
        <h2 style={{ fontSize: 36, fontWeight: 700, color: brand.fg, letterSpacing: '-0.02em', marginBottom: 6 }}>Anti-Patterns</h2>
        <p style={{ fontSize: 16, color: brand.fg, opacity: 0.45, marginBottom: 28 }}>What {brand.name} never does.</p>
      </FadeIn>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {brand.antiPatterns.map((p, i) => (
          <FadeIn key={i} delay={i * 0.06}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 18, background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 12 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, color: '#ef4444', fontWeight: 700 }}>✕</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: brand.fg, marginBottom: 3 }}>{p.rule}</div>
                <div style={{ fontSize: 12, color: brand.fg, opacity: 0.45 }}>{p.reason}</div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={0.35}>
        <div style={{ marginTop: 36, background: brand.accent, borderRadius: 18, padding: '44px 28px', textAlign: 'center' }}>
          <h3 style={{ color: isDark(brand.accent) ? '#fff' : '#000', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>{brand.principle}</h3>
          <p style={{ color: isDark(brand.accent) ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)', fontSize: 15 }}>{brand.name} — {brand.domain}</p>
        </div>
      </FadeIn>
    </div>
  )
}

export default function BrandPortfolio({ brand }: { brand: Brand }) {
  const [activeSection, setActiveSection] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const darkBg = isDark(brand.bg)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navBg = darkBg
    ? (scrolled ? 'rgba(10,10,15,0.92)' : brand.bg)
    : (scrolled ? 'rgba(255,255,255,0.92)' : brand.bg)

  const sectionComponents = [
    <OverviewSection key="o" brand={brand} />,
    <VoiceToneSection key="v" brand={brand} />,
    <VisualIdentitySection key="vi" brand={brand} />,
    <SocialMediaSection key="s" brand={brand} />,
    <EmailSection key="e" brand={brand} />,
    <BlogSection key="b" brand={brand} />,
    <AdCreativeSection key="a" brand={brand} />,
    <AntiPatternsSection key="ap" brand={brand} />,
  ]

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif', background: brand.bg, minHeight: '100vh', color: brand.fg }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: navBg,
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom: `1px solid ${scrolled ? (darkBg ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.07)') : 'transparent'}`,
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/examples" style={{ fontSize: 13, color: brand.fg, opacity: 0.4, textDecoration: 'none', whiteSpace: 'nowrap', marginRight: 6 }}>← All</Link>
          <div style={{ display: 'flex', gap: 3, overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {SECTIONS.map((s, i) => (
              <button key={i} onClick={() => setActiveSection(i)} style={{
                padding: '6px 13px', borderRadius: 20, border: 'none',
                background: activeSection === i ? brand.accent : 'transparent',
                color: activeSection === i ? (isDark(brand.accent) ? '#fff' : '#000') : (darkBg ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)'),
                fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.18s ease',
              }}>{s}</button>
            ))}
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px 100px' }}>
        {sectionComponents[activeSection]}
      </main>

      <footer style={{ borderTop: `1px solid ${darkBg ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, padding: 24, textAlign: 'center' }}>
        <Link href="/generate" style={{
          display: 'inline-block', background: brand.accent,
          color: isDark(brand.accent) ? '#fff' : '#000',
          padding: '11px 28px', borderRadius: 11, fontSize: 15, fontWeight: 700, textDecoration: 'none',
        }}>Generate yours free →</Link>
        <p style={{ fontSize: 11, color: brand.fg, opacity: 0.25, marginTop: 14 }}>
          {brand.name} Brand Portfolio — BrandSkill.com
        </p>
      </footer>
    </div>
  )
}
