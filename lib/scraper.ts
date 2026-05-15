import * as cheerio from 'cheerio'

export interface BrandSignals {
  url: string
  domain: string
  colors: Array<{ hex: string; usage: number; label: string }>
  fonts: { heading?: string; body?: string; accent?: string }
  logo?: string
  ogImage?: string
  copy: string
  ctas: string[]
  navigation: string[]
  meta: { title: string; description: string }
  partial?: boolean
  blocked?: boolean
  error?: string
}

const COLOR_LABELS = ['Primary', 'Secondary', 'Accent', 'Background', 'Text']

function normalizeHex(color: string): string | null {
  color = color.trim()
  if (/^#[0-9a-f]{6}$/i.test(color)) return color.toLowerCase()
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
  }
  const rgb = color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i)
  if (rgb) {
    const hex = [rgb[1], rgb[2], rgb[3]]
      .map(n => parseInt(n).toString(16).padStart(2, '0'))
      .join('')
    return `#${hex}`
  }
  return null
}

function extractColors(html: string, $: cheerio.CheerioAPI): Array<{ hex: string; usage: number }> {
  const colorCount: Record<string, number> = {}

  const addColor = (c: string) => {
    const hex = normalizeHex(c)
    if (hex && hex !== '#000000' && hex !== '#ffffff') {
      colorCount[hex] = (colorCount[hex] || 0) + 1
    }
  }

  $('style').each((_, el) => {
    const css = $(el).text()
    // Use exec loop instead of matchAll for broader TS compat
    const propRe = /--[\w-]+\s*:\s*(#[0-9a-f]{3,6}|rgb[a]?\([^)]+\))/gi
    let m: RegExpExecArray | null
    while ((m = propRe.exec(css)) !== null) addColor(m[1])
    const hexRe = /#([0-9a-f]{6}|[0-9a-f]{3})\b/gi
    while ((m = hexRe.exec(css)) !== null) addColor(m[0])
  })

  const themeColor = $('meta[name="theme-color"]').attr('content')
  if (themeColor) addColor(themeColor)

  $('[style]').each((_, el) => {
    const style = ($(el) as any).attr('style') || ''
    const re = /#([0-9a-f]{6}|[0-9a-f]{3})\b|rgb\([^)]+\)/gi
    let m: RegExpExecArray | null
    while ((m = re.exec(style)) !== null) addColor(m[0])
  })

  return Object.entries(colorCount)
    .map(([hex, usage]) => ({ hex, usage }))
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 5)
}

function extractFonts($: cheerio.CheerioAPI): { heading?: string; body?: string; accent?: string } {
  const fontsArr: string[] = []

  $('link[href*="fonts.googleapis.com"]').each((_, el) => {
    const href = $(el).attr('href') || ''
    const match = href.match(/family=([^&:]+)/)
    if (match) {
      const families = decodeURIComponent(match[1]).split('|')
      families.forEach(f => fontsArr.push(f.split(':')[0].replace(/\+/g, ' ')))
    }
  })

  $('style').each((_, el) => {
    const css = $(el).text()
    const re = /font-family\s*:\s*['"]?([^'";,\n]+)['"]?/gi
    let m: RegExpExecArray | null
    while ((m = re.exec(css)) !== null) {
      const name = m[1].trim()
      if (!['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'inherit', 'initial'].includes(name.toLowerCase())) {
        fontsArr.push(name)
      }
    }
  })

  const seen = new Set<string>()
  const unique: string[] = []
  for (const f of fontsArr) {
    if (!seen.has(f)) { seen.add(f); unique.push(f) }
  }

  return {
    heading: unique[0],
    body: unique[1] || unique[0],
    accent: unique[2],
  }
}

function extractLogo($: cheerio.CheerioAPI, baseUrl: string): string | undefined {
  const og = $('meta[property="og:image"]').attr('content')
  if (og) return og

  const apple = $('link[rel="apple-touch-icon"]').attr('href')
  if (apple) return apple.startsWith('http') ? apple : `${baseUrl}${apple}`

  let logoUrl: string | undefined
  $('img').each((_, el) => {
    const src = $(el).attr('src') || ''
    const alt = $(el).attr('alt') || ''
    const cls = $(el).attr('class') || ''
    if (/logo/i.test(src + alt + cls)) {
      logoUrl = src.startsWith('http') ? src : `${baseUrl}${src}`
      return false
    }
  })
  if (logoUrl) return logoUrl

  const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').first().attr('href')
  if (favicon) return favicon.startsWith('http') ? favicon : `${baseUrl}${favicon}`
}

function extractCopy($: cheerio.CheerioAPI): string {
  const parts: string[] = []
  $('h1, h2, h3, p, button, [class*="hero"], [class*="headline"]').each((_, el) => {
    const text = $(el).text().trim()
    if (text.length > 10) parts.push(text)
  })
  return parts.join('\n').slice(0, 3000)
}

function extractCTAs($: cheerio.CheerioAPI): string[] {
  const ctas: string[] = []
  $('button, a[class*="btn"], a[class*="cta"], [class*="button"]').each((_, el) => {
    const text = $(el).text().trim()
    if (text.length > 1 && text.length < 80) ctas.push(text)
  })
  const seen = new Set<string>()
  const unique: string[] = []
  for (const c of ctas) { if (!seen.has(c)) { seen.add(c); unique.push(c) } }
  return unique.slice(0, 10)
}

function extractNav($: cheerio.CheerioAPI): string[] {
  const nav: string[] = []
  $('nav a, header a').each((_, el) => {
    const text = $(el).text().trim()
    if (text.length > 1 && text.length < 40) nav.push(text)
  })
  const seen = new Set<string>()
  const unique: string[] = []
  for (const n of nav) { if (!seen.has(n)) { seen.add(n); unique.push(n) } }
  return unique.slice(0, 10)
}

export async function scrapeUrl(inputUrl: string): Promise<BrandSignals> {
  let url = inputUrl.trim()
  if (!url.startsWith('http')) url = `https://${url}`
  const parsed = new URL(url)
  const domain = parsed.hostname
  const baseUrl = `${parsed.protocol}//${parsed.hostname}`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12000)

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BrandSkillBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    })
    clearTimeout(timeout)

    if (!res.ok) {
      return { url, domain, colors: [], fonts: {}, copy: '', ctas: [], navigation: [], meta: { title: '', description: '' }, error: `HTTP ${res.status}` }
    }

    const html = await res.text()
    const $ = cheerio.load(html)

    const rawColors = extractColors(html, $)
    const colors = rawColors.map((c, i) => ({ ...c, label: COLOR_LABELS[i] || `Color ${i + 1}` }))

    return {
      url,
      domain,
      colors,
      fonts: extractFonts($),
      logo: extractLogo($, baseUrl),
      ogImage: $('meta[property="og:image"]').attr('content'),
      copy: extractCopy($),
      ctas: extractCTAs($),
      navigation: extractNav($),
      meta: {
        title: $('meta[property="og:title"]').attr('content') || $('title').text().trim() || '',
        description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '',
      },
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return {
      url, domain, colors: [], fonts: {}, copy: '', ctas: [], navigation: [],
      meta: { title: '', description: '' },
      error: message,
      partial: true,
    }
  }
}

export async function scrapePremiumPages(baseUrl: string): Promise<{ about?: string; blog?: string; pricing?: string }> {
  const results: { about?: string; blog?: string; pricing?: string } = {}
  const pages = ['/about', '/blog', '/pricing']

  await Promise.all(pages.map(async (path) => {
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BrandSkillBot/1.0)' },
      })
      if (!res.ok) return
      const html = await res.text()
      const $ = cheerio.load(html)
      const text = $('h1, h2, h3, p').map((_, el) => $(el).text().trim()).get().join('\n').slice(0, 2000)
      if (path === '/about') results.about = text
      if (path === '/blog') results.blog = text
      if (path === '/pricing') results.pricing = text
    } catch {
      // silently skip unavailable pages
    }
  }))

  return results
}
