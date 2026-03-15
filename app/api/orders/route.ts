import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const orderRef = `SW-ORD-${Math.floor(10000 + Math.random() * 90000)}`

    // In production: validate, save to DB, trigger notifications, reserve stock
    const order = {
      id: Math.random().toString(36).slice(2),
      orderRef,
      ...body,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ orders: [] })
}
