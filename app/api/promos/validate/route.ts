import { NextRequest, NextResponse } from 'next/server'

const PROMOS: Record<string, { type: string; value: number; minOrder: number; desc: string }> = {
  BULK100: { type: 'FIXED', value: 100, minOrder: 2000, desc: 'AED 100 off orders over AED 2,000' },
  BULKPAY: { type: 'FREE_DELIVERY', value: 0, minOrder: 3000, desc: 'Free delivery on orders over AED 3,000' },
  SWWALLET: { type: 'PERCENTAGE', value: 3, minOrder: 1000, desc: '3% off — Steel Wood wallet reward' },
}

export async function POST(request: NextRequest) {
  const { code, orderTotal } = await request.json()
  const promo = PROMOS[code?.toUpperCase()]

  if (!promo) {
    return NextResponse.json({ valid: false, message: 'Invalid promo code' }, { status: 400 })
  }

  if (orderTotal < promo.minOrder) {
    return NextResponse.json({ valid: false, message: `Minimum order AED ${promo.minOrder} required` }, { status: 400 })
  }

  let discountAmount = 0
  if (promo.type === 'FIXED') discountAmount = promo.value
  else if (promo.type === 'PERCENTAGE') discountAmount = Math.round(orderTotal * promo.value / 100 * 100) / 100

  return NextResponse.json({ valid: true, type: promo.type, discountAmount, description: promo.desc })
}
