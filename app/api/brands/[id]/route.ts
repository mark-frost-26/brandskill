import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const brand = await prisma.brand.findUnique({ where: { id: params.id } })
  if (!brand) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Allow owner or share token access
  if (brand.userId && brand.userId !== session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Increment download count
  await prisma.brand.update({ where: { id: params.id }, data: { downloadCount: { increment: 1 } } })

  return NextResponse.json({ brand })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const brand = await prisma.brand.findUnique({ where: { id: params.id } })
  if (!brand || brand.userId !== session.user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const updated = await prisma.brand.update({ where: { id: params.id }, data: body })
  return NextResponse.json({ brand: updated })
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const brand = await prisma.brand.findUnique({ where: { id: params.id } })
  if (!brand || brand.userId !== session.user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.brand.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
