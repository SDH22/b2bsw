import { NextRequest, NextResponse } from 'next/server'

const ZONE_COSTS: Record<string, Record<string, number>> = {
  'jebel-ali':     { '1-49': 6, '50-99': 4, '100-199': 3, '200-499': 2, '500+': 1.5 },
  'al-quoz':       { '1-49': 9, '50-99': 6, '100-199': 5, '200-499': 4, '500+': 3 },
  'business-bay':  { '1-49': 10, '50-99': 7, '100-199': 6, '200-499': 5, '500+': 3.5 },
  'sharjah-ind':   { '1-49': 12, '50-99': 9, '100-199': 7, '200-499': 6, '500+': 5 },
  'ajman':         { '1-49': 15, '50-99': 11, '100-199': 9, '200-499': 8, '500+': 6 },
  'rak':           { '1-49': 18, '50-99': 14, '100-199': 12, '200-499': 10, '500+': 8 },
  'mussafah-ad':   { '1-49': 22, '50-99': 18, '100-199': 15, '200-499': 13, '500+': 10 },
  'abu-dhabi-city':{ '1-49': 28, '50-99': 22, '100-199': 19, '200-499': 16, '500+': 12 },
  'al-ain':        { '1-49': 35, '50-99': 28, '100-199': 24, '200-499': 20, '500+': 16 },
  'fujairah-port': { '1-49': 42, '50-99': 35, '100-199': 30, '200-499': 25, '500+': 20 },
}

const GRADE_BASE_PRICES: Record<string, number> = {
  NFR: 30, MR: 38, FR: 61, AC: 85,
}

function getQtyTierKey(qty: number): string {
  if (qty < 50) return '1-49'
  if (qty < 100) return '50-99'
  if (qty < 200) return '100-199'
  if (qty < 500) return '200-499'
  return '500+'
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const grade = searchParams.get('grade') || 'MR'
  const zoneId = searchParams.get('zone') || 'al-quoz'
  const qty = Number(searchParams.get('qty') || 100)
  const tier = searchParams.get('tier') || 'VALUE'

  const basePrice = GRADE_BASE_PRICES[grade] ?? 38
  const zoneTiers = ZONE_COSTS[zoneId] ?? ZONE_COSTS['al-quoz']
  const tierKey = getQtyTierKey(qty)
  const deliveryCost = tier !== 'LITE' ? (zoneTiers[tierKey] ?? 0) : 0

  const sub = basePrice + deliveryCost
  const vat = Math.round(sub * 0.05 * 10) / 10
  const totalPerSheet = Math.round((sub + vat) * 10) / 10

  return NextResponse.json({
    basePrice,
    deliveryCost,
    subtotalPerSheet: sub,
    vatPerSheet: vat,
    totalPerSheet,
    totalOrder: Math.round(totalPerSheet * qty * 100) / 100,
  })
}
