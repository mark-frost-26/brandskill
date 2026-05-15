import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      from: process.env.RESEND_FROM_EMAIL || 'hello@brandskill.com',
      sendVerificationRequest: async ({ identifier: email, url }) => {
        // Lazy-import Resend to avoid build-time initialization error
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'hello@brandskill.com',
          to: email,
          subject: 'Sign in to BrandSkill',
          html: `
            <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="font-size: 24px; font-weight: 700; color: #1e1b4b; margin-bottom: 8px;">BrandSkill</h1>
              <p style="color: #6b7280; font-size: 16px; margin-bottom: 32px;">Your brand identity, on every AI.</p>
              <a href="${url}" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Sign in to BrandSkill
              </a>
              <p style="color: #9ca3af; font-size: 14px; margin-top: 32px;">This link expires in 24 hours. If you didn't request this, you can safely ignore it.</p>
            </div>
          `,
        })
      },
    }),
  ],
  session: { strategy: 'database' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
        session.user.plan = dbUser?.plan || 'FREE'
      }
      return session
    },
  },
}

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      plan: string
    }
  }
}
