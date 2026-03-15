import { NextResponse } from 'next/server'

const DEALS = [
  { id: '1', position: 1, typeTag: 'BULK OFFER', gradientFrom: '#1e4d38', gradientTo: '#0f2318', emoji: '📦', titleEn: '100 Sheets NFR', description: "Order 100+ NFR 12mm — delivery drops to AED 3/sheet", pricingText: 'Save AED 150 on delivery', ctaText: 'Order Now', ctaLink: '/products?grade=NFR&qty=100', isActive: true },
  { id: '2', position: 2, typeTag: 'PRICE LOCK', gradientFrom: '#1e3a5f', gradientTo: '#0f2318', emoji: '🔒', titleEn: 'Lock MR 18mm Price', description: "April revision expected — lock today's AED 38/sht", pricingText: 'AED 110 price lock fee', ctaText: 'Lock Price', ctaLink: '/products?grade=MR', isActive: true },
  { id: '3', position: 3, typeTag: 'NEW', gradientFrom: '#2d6a4f', gradientTo: '#1e4d38', emoji: '🆕', titleEn: 'Acoustic 25mm', description: 'New thickness — 25mm acoustic board', pricingText: 'AED 98/sht ex-factory', ctaText: 'View Product', ctaLink: '/products?grade=AC&thickness=25', isActive: true },
  { id: '4', position: 4, typeTag: 'HOT DEAL', gradientFrom: '#7c1d1d', gradientTo: '#0f2318', emoji: '🔥', titleEn: 'FR Clearance', description: 'End-of-batch FR 16mm at special pricing', pricingText: 'AED 52/sht (was AED 61)', ctaText: 'Claim Deal', ctaLink: '/products?grade=FR&thickness=16', isActive: true },
  { id: '5', position: 5, typeTag: 'SERVICE', gradientFrom: '#374151', gradientTo: '#1f2937', emoji: '✂️', titleEn: 'Cut-to-Size', description: 'CNC cut panels ready for install', pricingText: 'AED 8/sheet add-on', ctaText: 'Add to Order', ctaLink: '/products', isActive: true },
  { id: '6', position: 6, typeTag: 'CLEARANCE', gradientFrom: '#92400e', gradientTo: '#0f2318', emoji: '🏷️', titleEn: 'MR 9mm Clearance', description: 'Last 320 sheets at clearance price', pricingText: 'AED 22/sht (was AED 28)', ctaText: 'Order Now', ctaLink: '/products?grade=MR&thickness=9', isActive: true },
]

export async function GET() {
  const active = DEALS.filter((d) => d.isActive).sort((a, b) => a.position - b.position)
  return NextResponse.json(active)
}
