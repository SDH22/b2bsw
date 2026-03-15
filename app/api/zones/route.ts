import { NextResponse } from 'next/server'

const ZONES = [
  { id: 'jebel-ali', name: 'Jebel Ali', emirate: 'DUBAI', distanceKm: 5, leadTimeDays: 1, pricingTiers: { '1-49': 6, '50-99': 4, '100-199': 3, '200-499': 2, '500+': 1.5 }, nearest: true },
  { id: 'al-quoz', name: 'Al Quoz', emirate: 'DUBAI', distanceKm: 15, leadTimeDays: 1, pricingTiers: { '1-49': 9, '50-99': 6, '100-199': 5, '200-499': 4, '500+': 3 } },
  { id: 'business-bay', name: 'Business Bay', emirate: 'DUBAI', distanceKm: 22, leadTimeDays: 1, pricingTiers: { '1-49': 10, '50-99': 7, '100-199': 6, '200-499': 5, '500+': 3.5 } },
  { id: 'sharjah-ind', name: 'Sharjah Industrial', emirate: 'SHARJAH', distanceKm: 35, leadTimeDays: 2, pricingTiers: { '1-49': 12, '50-99': 9, '100-199': 7, '200-499': 6, '500+': 5 } },
  { id: 'ajman', name: 'Ajman', emirate: 'AJMAN', distanceKm: 45, leadTimeDays: 2, pricingTiers: { '1-49': 15, '50-99': 11, '100-199': 9, '200-499': 8, '500+': 6 } },
  { id: 'rak', name: 'Ras Al Khaimah', emirate: 'RAK', distanceKm: 80, leadTimeDays: 2, pricingTiers: { '1-49': 18, '50-99': 14, '100-199': 12, '200-499': 10, '500+': 8 } },
  { id: 'mussafah-ad', name: 'Mussafah AD', emirate: 'ABU_DHABI', distanceKm: 120, leadTimeDays: 2, pricingTiers: { '1-49': 22, '50-99': 18, '100-199': 15, '200-499': 13, '500+': 10 } },
  { id: 'abu-dhabi-city', name: 'Abu Dhabi City', emirate: 'ABU_DHABI', distanceKm: 130, leadTimeDays: 2, pricingTiers: { '1-49': 28, '50-99': 22, '100-199': 19, '200-499': 16, '500+': 12 } },
  { id: 'al-ain', name: 'Al Ain', emirate: 'ABU_DHABI', distanceKm: 180, leadTimeDays: 3, pricingTiers: { '1-49': 35, '50-99': 28, '100-199': 24, '200-499': 20, '500+': 16 } },
  { id: 'fujairah-port', name: 'Fujairah Port', emirate: 'FUJAIRAH', distanceKm: 220, leadTimeDays: 3, pricingTiers: { '1-49': 42, '50-99': 35, '100-199': 30, '200-499': 25, '500+': 20 } },
]

export async function GET() {
  return NextResponse.json(ZONES, {
    headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' },
  })
}
