import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type BrandExample = {
  name: string
  domain: string
  tagline: string
  about: string
  colors: { hex: string; name: string }[]
  fonts: { name: string; role: string }[]
  voiceRules: { do: string; dont: string }[]
  templates: { platform: string; example: string }[]
  antiPatterns: string[]
  imageStyle: string
  keywords: string[]
  bg: string
  accent: string
}

const EXAMPLES: Record<string, BrandExample> = {
  apple: {
    name: 'Apple',
    domain: 'apple.com',
    tagline: 'Designed to surprise. Built to last.',
    about: 'Apple communicates through restraint. Every word is chosen because it cannot be removed. The brand doesn\'t explain — it reveals.',
    colors: [
      { hex: '#1d1d1f', name: 'Graphite' },
      { hex: '#f5f5f7', name: 'Cloud' },
      { hex: '#0066cc', name: 'Apple Blue' },
      { hex: '#86868b', name: 'Stone' },
    ],
    fonts: [
      { name: 'SF Pro Display', role: 'Headlines' },
      { name: 'SF Pro Text', role: 'Body' },
    ],
    voiceRules: [
      { do: 'Lead with the feeling, not the feature.', dont: 'List specs before the human benefit.' },
      { do: 'Sentences end. Not lists.', dont: 'Use bullet points for marketing copy.' },
      { do: 'One idea per sentence.', dont: 'Stack clauses with conjunctions.' },
    ],
    templates: [
      { platform: 'Instagram', example: 'The display that makes everything else look wrong. Liquid Retina XDR.' },
      { platform: 'Twitter / X', example: 'iPhone 16. The camera that outthinks the moment.' },
      { platform: 'Ad Headline', example: 'Shot on iPhone. By you.' },
      { platform: 'Email Subject', example: 'iPhone. Hello, again.' },
    ],
    antiPatterns: [
      'Never use exclamation points.',
      'Never say "innovative" or "revolutionary" — show, don\'t label.',
      'Never list more than 3 features.',
      'Never use passive voice.',
    ],
    imageStyle: 'Ultra-minimal, product-centric, cinematic depth of field. Near-white or deep-space backgrounds. One key light, no harsh shadows.',
    keywords: ['Restraint', 'Precision', 'Audacity', 'Clarity', 'Taste'],
    bg: '#f5f5f7',
    accent: '#0066cc',
  },
  stripe: {
    name: 'Stripe',
    domain: 'stripe.com',
    tagline: 'Infrastructure that thinks.',
    about: 'Stripe writes like a brilliant engineer who is also an exceptional communicator. Technical and precise, but never cold. It treats developers as intellectuals.',
    colors: [
      { hex: '#635bff', name: 'Stripe Purple' },
      { hex: '#0a2540', name: 'Deep Navy' },
      { hex: '#00d4ff', name: 'Electric Teal' },
      { hex: '#f6f9fc', name: 'Fog' },
    ],
    fonts: [
      { name: 'Sohne', role: 'Headlines' },
      { name: 'Inter', role: 'Body' },
      { name: 'JetBrains Mono', role: 'Code' },
    ],
    voiceRules: [
      { do: 'Respect the reader\'s intelligence with technical precision.', dont: 'Dumb down complexity.' },
      { do: 'Lead with the outcome, earn the explanation.', dont: 'Open with process.' },
      { do: 'Own the complexity. Don\'t hide it.', dont: 'Say "we handle everything for you."' },
    ],
    templates: [
      { platform: 'Twitter / X', example: 'Card-not-present fraud costs $32B/year. Stripe Radar uses 100B+ data points to stop it.' },
      { platform: 'Email Subject', example: 'Increase checkout conversion by 11%: new Link data' },
      { platform: 'Doc Opener', example: 'Handling webhooks reliably is harder than it sounds. Here\'s how Stripe makes it simple.' },
      { platform: 'Ad Headline', example: 'Payments infrastructure for the internet.' },
    ],
    antiPatterns: [
      'Never use "seamless," "powerful," or "robust."',
      'Never hide the complexity.',
      'Never write CTAs without context.',
      'Never use stock imagery of coins or credit cards.',
    ],
    imageStyle: 'Abstract, mathematical, architectural. Purple-to-teal gradients on deep navy. "Infrastructure made beautiful."',
    keywords: ['Precision', 'Trust', 'Intelligence', 'Scale', 'Craft'],
    bg: '#0a2540',
    accent: '#635bff',
  },
  linear: {
    name: 'Linear',
    domain: 'linear.app',
    tagline: 'Built for people who care about craft.',
    about: 'Linear is opinionated and proud of it. The brand speaks directly to makers who are tired of bloated tools. No fluff — just speed and intention.',
    colors: [
      { hex: '#5e6ad2', name: 'Linear Blue' },
      { hex: '#1e1e2e', name: 'Night' },
      { hex: '#e8e8f0', name: 'Mist' },
      { hex: '#f65866', name: 'Coral' },
    ],
    fonts: [
      { name: 'Inter', role: 'UI & Headlines' },
      { name: 'IBM Plex Mono', role: 'Code & Accents' },
    ],
    voiceRules: [
      { do: 'Be direct. Say exactly what the product does.', dont: 'Use vague positioning language.' },
      { do: 'Acknowledge the competition without naming names.', dont: 'Play it safe with empty statements.' },
      { do: 'Write for people who hate bad software.', dont: 'Speak to a generic "team."' },
    ],
    templates: [
      { platform: 'Twitter / X', example: 'Issue tracking built for speed. Linear feels fast because it is.' },
      { platform: 'Product Hunt', example: 'The issue tracker you\'ll actually enjoy using. Built for teams that care about craft.' },
      { platform: 'Ad Headline', example: 'Software built for people who hate slow software.' },
      { platform: 'Email Subject', example: 'Linear 3.0 — everything, faster.' },
    ],
    antiPatterns: [
      'Never say "productivity" as a standalone promise.',
      'Never use passive voice.',
      'Never add emoji to serious product copy.',
      'Never speak to "enterprises" — speak to builders.',
    ],
    imageStyle: 'Dark mode UI screenshots, tight grids, monochrome with a single accent pop. Minimal chrome, maximum content.',
    keywords: ['Speed', 'Craft', 'Opinions', 'Focus', 'Makers'],
    bg: '#1e1e2e',
    accent: '#5e6ad2',
  },
  notion: {
    name: 'Notion',
    domain: 'notion.so',
    tagline: 'One tool. Infinite shape.',
    about: 'Notion speaks in calm, confident universality. It\'s for everyone and proud of it — from students to Fortune 500 teams. The voice is warm and unhurried.',
    colors: [
      { hex: '#000000', name: 'Notion Black' },
      { hex: '#ffffff', name: 'Pure White' },
      { hex: '#37352f', name: 'Warm Dark' },
      { hex: '#e9e9e7', name: 'Parchment' },
    ],
    fonts: [
      { name: 'ui-sans-serif', role: 'UI & Headlines' },
      { name: 'Georgia', role: 'Long-form Body' },
    ],
    voiceRules: [
      { do: 'Speak to the use case, not the feature.', dont: 'Lead with technical capability.' },
      { do: 'Make complexity feel approachable.', dont: 'Overwhelm with options.' },
      { do: 'Use "you" a lot — it\'s always personal.', dont: 'Write in corporate third person.' },
    ],
    templates: [
      { platform: 'Twitter / X', example: 'Your wiki. Your docs. Your projects. One tool that adapts to how you think.' },
      { platform: 'Instagram', example: 'Build the system that works for your brain. Not someone else\'s.' },
      { platform: 'Ad Headline', example: 'Your all-in-one workspace.' },
      { platform: 'Email Subject', example: 'A new way to organize everything.' },
    ],
    antiPatterns: [
      'Never feel rushed or urgent — Notion is calm.',
      'Never exclude beginners.',
      'Never use jargon without immediately explaining it.',
      'Never talk about competitors.',
    ],
    imageStyle: 'Clean white canvases with structured content. Real-looking pages, warm serif typography, soft natural light photography.',
    keywords: ['Calm', 'Universal', 'Flexible', 'Warm', 'Organized'],
    bg: '#ffffff',
    accent: '#000000',
  },
  figma: {
    name: 'Figma',
    domain: 'figma.com',
    tagline: 'Design is a team sport.',
    about: 'Figma\'s voice is energetic, inclusive, and community-driven. It celebrates the messy reality of creative collaboration and isn\'t afraid to be playful.',
    colors: [
      { hex: '#f24e1e', name: 'Figma Red' },
      { hex: '#ff7262', name: 'Coral' },
      { hex: '#a259ff', name: 'Purple' },
      { hex: '#1abcfe', name: 'Sky' },
    ],
    fonts: [
      { name: 'Inter', role: 'UI & Headlines' },
      { name: 'DM Sans', role: 'Marketing Body' },
    ],
    voiceRules: [
      { do: 'Celebrate the collaborative process, not just the output.', dont: 'Focus only on the solo designer.' },
      { do: 'Be playful when the moment allows.', dont: 'Be serious and stiff.' },
      { do: 'Highlight community and co-creation.', dont: 'Position design as exclusive.' },
    ],
    templates: [
      { platform: 'Twitter / X', example: 'Design together, ship faster. Figma brings your whole team into the creative process.' },
      { platform: 'Instagram', example: 'Great design happens in the comments, the handoffs, and the 11pm Slack messages. Build it together.' },
      { platform: 'Ad Headline', example: 'Where great design happens. Together.' },
      { platform: 'Email Subject', example: 'Design, together — Figma\'s new collaboration features' },
    ],
    antiPatterns: [
      'Never make design feel exclusive or elite.',
      'Never ignore the engineering side of the product.',
      'Never be formal — Figma is approachable.',
      'Never use "pixel-perfect" as a value proposition.',
    ],
    imageStyle: 'Vibrant, multi-colored, community-made. Real design files, diverse contributors, colorful components. Energy over polish.',
    keywords: ['Collaboration', 'Community', 'Creativity', 'Inclusive', 'Energy'],
    bg: '#ffffff',
    accent: '#a259ff',
  },
  vercel: {
    name: 'Vercel',
    domain: 'vercel.com',
    tagline: 'Ship. Fast.',
    about: 'Vercel speaks to developers who value speed and experience above all. The voice is terse, confident, and obsessed with performance metrics.',
    colors: [
      { hex: '#000000', name: 'Vercel Black' },
      { hex: '#ffffff', name: 'Pure White' },
      { hex: '#0070f3', name: 'Vercel Blue' },
      { hex: '#888888', name: 'Mid Gray' },
    ],
    fonts: [
      { name: 'Geist', role: 'All UI & Headlines' },
      { name: 'Geist Mono', role: 'Code' },
    ],
    voiceRules: [
      { do: 'Lead with speed metrics and concrete outcomes.', dont: 'Use vague performance claims.' },
      { do: 'Short sentences. One point per line.', dont: 'Write long explanatory paragraphs.' },
      { do: 'Talk to the developer, not the manager.', dont: 'Use enterprise procurement language.' },
    ],
    templates: [
      { platform: 'Twitter / X', example: 'Deploy in seconds. Scale to millions. Zero config.' },
      { platform: 'Ad Headline', example: 'The frontend cloud. Ship faster.' },
      { platform: 'Email Subject', example: 'Your site is 3x faster. Here\'s what changed.' },
      { platform: 'Product Announcement', example: 'Vercel v0. AI that generates UI from a prompt. Ship it today.' },
    ],
    antiPatterns: [
      'Never use more words than necessary.',
      'Never bury the speed metric.',
      'Never speak to non-technical buyers first.',
      'Never use warm or friendly language in technical docs.',
    ],
    imageStyle: 'Stark black and white. Terminal screenshots. Speed graphs. Minimal chrome. The aesthetic is "night mode everything."',
    keywords: ['Speed', 'Performance', 'Minimalism', 'Developer-first', 'Deploy'],
    bg: '#000000',
    accent: '#0070f3',
  },
  framer: {
    name: 'Framer',
    domain: 'framer.com',
    tagline: 'Websites that move.',
    about: 'Framer is bold, motion-first, and aimed at designers who want to build. The voice has an edge — it knows its audience is creative and ambitious.',
    colors: [
      { hex: '#0055ff', name: 'Framer Blue' },
      { hex: '#141414', name: 'Near Black' },
      { hex: '#ff4488', name: 'Electric Pink' },
      { hex: '#ffffff', name: 'White' },
    ],
    fonts: [
      { name: 'Inter', role: 'UI & Headlines' },
      { name: 'Framer Custom', role: 'Brand Display' },
    ],
    voiceRules: [
      { do: 'Lead with motion and interactivity as the differentiator.', dont: 'Describe Framer as a "website builder."' },
      { do: 'Be bold. Make strong claims.', dont: 'Hedge or qualify everything.' },
      { do: 'Speak to the design-to-code ambition.', dont: 'Ignore the technical sophistication.' },
    ],
    templates: [
      { platform: 'Twitter / X', example: 'Build websites that actually move. No code. No limits. Just Framer.' },
      { platform: 'Instagram', example: 'Your portfolio deserves more than a template. Make it move.' },
      { platform: 'Ad Headline', example: 'Design. Animate. Publish. Today.' },
      { platform: 'Email Subject', example: 'Your next site has motion built in.' },
    ],
    antiPatterns: [
      'Never undersell the animation capabilities.',
      'Never position as a simple drag-and-drop builder.',
      'Never be modest about what it can do.',
      'Never ignore the design-forward audience.',
    ],
    imageStyle: 'Dynamic, motion-blurred UI, vibrant gradients from blue to pink. Feels like the product itself is in motion.',
    keywords: ['Motion', 'Bold', 'Ambitious', 'Creative', 'Interactive'],
    bg: '#141414',
    accent: '#0055ff',
  },
  loom: {
    name: 'Loom',
    domain: 'loom.com',
    tagline: 'Say it once. Say it well.',
    about: 'Loom is warm, human, and async-native. The brand celebrates the fact that not everything needs a meeting — and makes that feel like a gift.',
    colors: [
      { hex: '#625df5', name: 'Loom Purple' },
      { hex: '#f8f8f8', name: 'Off White' },
      { hex: '#1a1a1a', name: 'Deep Black' },
      { hex: '#ff9500', name: 'Amber' },
    ],
    fonts: [
      { name: 'Graphik', role: 'Headlines' },
      { name: 'Inter', role: 'Body' },
    ],
    voiceRules: [
      { do: 'Position async as a feature, not a workaround.', dont: 'Make it sound like a meeting replacement.' },
      { do: 'Be warm and human — show the face behind the message.', dont: 'Sound cold or transactional.' },
      { do: 'Celebrate the time saved.', dont: 'Focus on the technology.' },
    ],
    templates: [
      { platform: 'Twitter / X', example: 'That 45-minute meeting? It\'s a 3-minute Loom now. Your team will thank you.' },
      { platform: 'Instagram', example: 'Show your face. Share your thinking. Skip the calendar invite.' },
      { platform: 'Ad Headline', example: 'Say more in less time. Record with Loom.' },
      { platform: 'Email Subject', example: 'I recorded this instead of scheduling a meeting.' },
    ],
    antiPatterns: [
      'Never make async feel like a lesser substitute for real communication.',
      'Never ignore the human warmth angle.',
      'Never lead with features over the feeling.',
      'Never use corporate jargon.',
    ],
    imageStyle: 'Real people at real computers. Warm ambient lighting. Genuine expressions. The recorder bubble is always visible.',
    keywords: ['Human', 'Async', 'Warm', 'Efficient', 'Genuine'],
    bg: '#f8f8f8',
    accent: '#625df5',
  },
  webflow: {
    name: 'Webflow',
    domain: 'webflow.com',
    tagline: 'Build without limits. Design without compromise.',
    about: 'Webflow speaks to designers who refuse to choose between creativity and control. The brand is empowering, technical, and deeply proud of what it enables.',
    colors: [
      { hex: '#4353ff', name: 'Webflow Blue' },
      { hex: '#1a1a2e', name: 'Deep Ink' },
      { hex: '#ffffff', name: 'White' },
      { hex: '#146ef5', name: 'Electric Blue' },
    ],
    fonts: [
      { name: 'Gilroy', role: 'Headlines' },
      { name: 'Inter', role: 'Body' },
    ],
    voiceRules: [
      { do: 'Speak to the frustration of creative limitation.', dont: 'Ignore the pain of needing a developer.' },
      { do: 'Celebrate visual power with technical depth.', dont: 'Oversimplify what the product does.' },
      { do: 'Use "you" and speak directly to the designer.', dont: 'Be vague about who the product is for.' },
    ],
    templates: [
      { platform: 'Twitter / X', example: 'You\'ve been waiting for a developer. Webflow is the developer.' },
      { platform: 'Ad Headline', example: 'Build professional websites. Without writing code.' },
      { platform: 'Email Subject', example: 'You don\'t need a developer for this.' },
      { platform: 'Instagram', example: 'The website you imagined? You can build it. Right now.' },
    ],
    antiPatterns: [
      'Never imply Webflow is "easy" in a dumbed-down way.',
      'Never ignore the power user.',
      'Never position as a template-picker.',
      'Never shy away from the developer comparison.',
    ],
    imageStyle: 'Bold, high-contrast. Complex UI that looks powerful but accessible. Blue gradients on dark backgrounds.',
    keywords: ['Empowerment', 'Control', 'Visual', 'Professional', 'Creative'],
    bg: '#1a1a2e',
    accent: '#4353ff',
  },
  shopify: {
    name: 'Shopify',
    domain: 'shopify.com',
    tagline: 'Commerce for everyone.',
    about: 'Shopify is the great equalizer — it speaks to the first-time seller and the billion-dollar brand with the same respect. The voice is optimistic, grounded, and inclusive.',
    colors: [
      { hex: '#96bf48', name: 'Shopify Green' },
      { hex: '#1a1a1a', name: 'Near Black' },
      { hex: '#ffffff', name: 'White' },
      { hex: '#5c6ac4', name: 'Shopify Purple' },
    ],
    fonts: [
      { name: 'ShopifySans', role: 'Headlines' },
      { name: 'Inter', role: 'Body' },
    ],
    voiceRules: [
      { do: 'Celebrate the entrepreneurial ambition at every level.', dont: 'Speak only to big brands.' },
      { do: 'Make complexity feel manageable.', dont: 'Overwhelm with features.' },
      { do: 'Use success stories as proof points.', dont: 'Lead with product specs.' },
    ],
    templates: [
      { platform: 'Twitter / X', example: 'Your first sale is closer than you think. Shopify gets you there.' },
      { platform: 'Ad Headline', example: 'Start selling today. Grow forever.' },
      { platform: 'Email Subject', example: 'Your store is ready. Your customers are waiting.' },
      { platform: 'Instagram', example: 'From idea to first sale in a weekend. Real stories, real sellers.' },
    ],
    antiPatterns: [
      'Never make small sellers feel small.',
      'Never lead with pricing or limitations.',
      'Never ignore the emotional journey of starting a business.',
      'Never be too corporate — Shopify is for builders.',
    ],
    imageStyle: 'Warm, diverse, real people. Real storefronts. Product photography that looks handmade. Optimistic natural light.',
    keywords: ['Inclusive', 'Optimistic', 'Commerce', 'Growth', 'Entrepreneurship'],
    bg: '#ffffff',
    accent: '#96bf48',
  },
  duolingo: {
    name: 'Duolingo',
    domain: 'duolingo.com',
    tagline: 'Learning a language should feel like playing a game.',
    about: 'Duolingo is the internet\'s most unhinged brand — and it works. The voice is chaotic, self-aware, meme-fluent, and secretly very smart about motivation psychology.',
    colors: [
      { hex: '#58cc02', name: 'Duo Green' },
      { hex: '#1cb0f6', name: 'Sky Blue' },
      { hex: '#ff4b4b', name: 'Streak Red' },
      { hex: '#ffc800', name: 'XP Gold' },
    ],
    fonts: [
      { name: 'Din Round', role: 'All UI' },
      { name: 'Feather Bold', role: 'Marketing' },
    ],
    voiceRules: [
      { do: 'Be playful, irreverent, and self-aware.', dont: 'Sound like an educational institution.' },
      { do: 'Use meme culture fluently when appropriate.', dont: 'Force references that feel dated.' },
      { do: 'Gamify everything — streaks, XP, achievement framing.', dont: 'Talk about "studying."' },
    ],
    templates: [
      { platform: 'Twitter / X', example: 'Do your lesson. Duo is watching. 👀' },
      { platform: 'Push Notification', example: 'You\'ve been ghosting me. Your streak disagrees.' },
      { platform: 'Ad Headline', example: 'Learn a language. Fear the owl.' },
      { platform: 'Instagram', example: '365-day streak. Duo cried. So did we. Keep going.' },
    ],
    antiPatterns: [
      'Never sound like homework.',
      'Never take yourself too seriously.',
      'Never miss an opportunity to reference the streak.',
      'Never ignore the meme.',
    ],
    imageStyle: 'Bright, cartoon-adjacent. Duo the owl in increasingly unhinged situations. Flat illustration, bold colors, maximum personality.',
    keywords: ['Playful', 'Irreverent', 'Gamified', 'Meme-fluent', 'Addictive'],
    bg: '#ffffff',
    accent: '#58cc02',
  },
  superhuman: {
    name: 'Superhuman',
    domain: 'superhuman.com',
    tagline: 'The fastest email experience ever made.',
    about: 'Superhuman is obsessively focused on one thing: speed. The brand speaks to high-performers who feel time as a physical resource. Every word earns its nanosecond.',
    colors: [
      { hex: '#e06c00', name: 'Superhuman Orange' },
      { hex: '#1c1c1c', name: 'Near Black' },
      { hex: '#ffffff', name: 'White' },
      { hex: '#f5f0eb', name: 'Warm Cream' },
    ],
    fonts: [
      { name: 'Tiempos Headline', role: 'Display' },
      { name: 'Inter', role: 'UI & Body' },
    ],
    voiceRules: [
      { do: 'Make speed feel like a moral imperative.', dont: 'Treat time savings as a minor benefit.' },
      { do: 'Speak to the top 1% of email users.', dont: 'Try to appeal to everyone.' },
      { do: 'Use specific, measurable claims.', dont: 'Use vague superlatives.' },
    ],
    templates: [
      { platform: 'Twitter / X', example: 'The average knowledge worker spends 4 hours/day in email. Superhuman cuts that in half.' },
      { platform: 'Ad Headline', example: 'Spend less time in email. Do more of everything else.' },
      { platform: 'Email Subject', example: 'You could get through email in half the time.' },
      { platform: 'Instagram', example: 'Inbox zero in 23 minutes. This is what Superhuman feels like.' },
    ],
    antiPatterns: [
      'Never apologize for the price.',
      'Never speak to casual email users.',
      'Never bury the speed claim.',
      'Never use stock imagery of overflowing inboxes.',
    ],
    imageStyle: 'Dark, focused, minimal. Single keyboard shortcut highlighted. The UI is the hero. Warm orange accent on near-black.',
    keywords: ['Speed', 'Performance', 'Elite', 'Focus', 'Time'],
    bg: '#1c1c1c',
    accent: '#e06c00',
  },
}

export function generateStaticParams() {
  return Object.keys(EXAMPLES).map(slug => ({ slug }))
}

function isDark(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

export default function ExamplePage({ params }: { params: { slug: string } }) {
  const brand = EXAMPLES[params.slug]
  if (!brand) notFound()

  const darkBg = isDark(brand.bg)
  const textColor = darkBg ? 'text-white' : 'text-gray-900'
  const subColor = darkBg ? 'text-white/60' : 'text-gray-500'

  return (
    <div className="min-h-screen" style={{ background: brand.bg }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/examples" className={`text-sm ${subColor} hover:opacity-80 mb-6 inline-block`}>
            ← All examples
          </Link>
          <div className="flex items-end gap-4 mb-4">
            <h1 className={`text-6xl font-black ${textColor}`}>{brand.name}</h1>
            <span className={`text-lg ${subColor} mb-2 font-mono`}>{brand.domain}</span>
          </div>
          <p className={`text-2xl font-medium ${subColor} mb-2`}>&ldquo;{brand.tagline}&rdquo;</p>
          <p className={`text-base ${subColor} max-w-2xl`}>{brand.about}</p>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2 mt-6">
            {brand.keywords.map(k => (
              <span
                key={k}
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ background: brand.accent, color: isDark(brand.accent) ? '#fff' : '#000' }}
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Colors */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-xs font-bold uppercase tracking-widest ${subColor} mb-6`}>Color Palette</h2>
          <div className="flex flex-wrap gap-4">
            {brand.colors.map(c => (
              <div key={c.hex} className="flex flex-col items-center gap-2">
                <div
                  className="w-16 h-16 rounded-2xl shadow-lg border border-white/10"
                  style={{ background: c.hex }}
                />
                <span className={`text-xs font-mono ${subColor}`}>{c.hex}</span>
                <span className={`text-xs ${subColor} opacity-70`}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-xs font-bold uppercase tracking-widest ${subColor} mb-6`}>Typography</h2>
          <div className="flex flex-wrap gap-4">
            {brand.fonts.map(f => (
              <div
                key={f.name}
                className="px-5 py-4 rounded-2xl border"
                style={{
                  borderColor: darkBg ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  background: darkBg ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                }}
              >
                <div className={`text-lg font-bold ${textColor}`}>{f.name}</div>
                <div className={`text-xs ${subColor}`}>{f.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voice Rules */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-xs font-bold uppercase tracking-widest ${subColor} mb-6`}>Voice Rules</h2>
          <div className="space-y-4">
            {brand.voiceRules.map((rule, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-2xl overflow-hidden"
              >
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-emerald-400 text-xs font-bold mb-1">✓ DO</div>
                  <div className={`text-sm ${textColor}`}>{rule.do}</div>
                </div>
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                  <div className="text-red-400 text-xs font-bold mb-1">✕ DON&apos;T</div>
                  <div className={`text-sm ${textColor}`}>{rule.dont}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Templates */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-xs font-bold uppercase tracking-widest ${subColor} mb-6`}>Content Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brand.templates.map((t, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border"
                style={{
                  borderColor: brand.accent + '40',
                  background: darkBg ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                }}
              >
                <div
                  className="text-xs font-bold mb-2 uppercase tracking-widest"
                  style={{ color: brand.accent }}
                >
                  {t.platform}
                </div>
                <p className={`text-sm italic ${textColor} opacity-90`}>&ldquo;{t.example}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Anti-Patterns */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-xs font-bold uppercase tracking-widest ${subColor} mb-6`}>Anti-Patterns</h2>
          <div className="space-y-2">
            {brand.antiPatterns.map((ap, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
              >
                <span className="text-red-400 mt-0.5">✕</span>
                <span className={`text-sm ${textColor}`}>{ap}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Style */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-xs font-bold uppercase tracking-widest ${subColor} mb-4`}>Image Generation Guidance</h2>
          <div
            className="p-6 rounded-2xl border"
            style={{
              borderColor: brand.accent + '40',
              background: darkBg ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            }}
          >
            <p className={`text-sm ${textColor} leading-relaxed`}>{brand.imageStyle}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <p className={`text-lg ${subColor} mb-6`}>Want a skill file like this for your brand?</p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
            style={{
              background: brand.accent,
              color: isDark(brand.accent) ? '#fff' : '#000',
            }}
          >
            Generate yours free →
          </Link>
        </div>
      </section>
    </div>
  )
}
