import { NextResponse } from 'next/server'

const PRICE_INDEX = [
  { label: 'MR 18mm', price: 38, unit: '/sht', trend: 'stable', note: '' },
  { label: 'NFR 12mm', price: 30, unit: '/sht', trend: 'down', note: '' },
  { label: 'FR 18mm', price: 61, unit: '/sht', trend: 'up', note: 'revision Apr' },
  { label: 'Acoustic 18mm', price: 85, unit: '/sht', trend: 'stable', note: '' },
  { label: 'Stock Alert', price: 0, unit: '', trend: 'alert', note: 'FR — 38 sheets left' },
  { label: 'Best Deal', price: 34, unit: '/sht', trend: 'deal', note: 'NFR 12mm delivered' },
]

export async function GET() {
  return NextResponse.json(PRICE_INDEX, {
    headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' },
  })
}
