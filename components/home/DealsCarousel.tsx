'use client'
import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'

const MOCK_DEALS = [
  { id: '1', typeTag: 'BULK OFFER', gradientFrom: '#1e4d38', gradientTo: '#0a1a10', emoji: '📦', titleEn: '100 Sheets NFR', description: 'Order 100+ NFR 12mm — delivery drops to AED 3/sheet', pricingText: 'Save AED 150 on delivery', ctaText: 'Order Now', ctaLink: '/products?grade=NFR&qty=100' },
  { id: '2', typeTag: 'PRICE LOCK', gradientFrom: '#1e3a5f', gradientTo: '#0f2340', emoji: '🔒', titleEn: 'Lock MR 18mm Price', description: "April revision expected — lock today's AED 38/sht rate for 30 days", pricingText: 'AED 110 price lock fee', ctaText: 'Lock Price', ctaLink: '/products?grade=MR' },
  { id: '3', typeTag: 'NEW', gradientFrom: '#2d6a4f', gradientTo: '#1a3d2e', emoji: '🆕', titleEn: 'Acoustic 25mm', description: 'New thickness available — 25mm acoustic board for recording studios', pricingText: 'AED 98/sht ex-factory', ctaText: 'View Product', ctaLink: '/products?grade=AC&thickness=25' },
  { id: '4', typeTag: 'HOT DEAL', gradientFrom: '#991b1b', gradientTo: '#450a0a', emoji: '🔥', titleEn: 'FR Clearance', description: 'End-of-batch FR 16mm at special pricing — limited 200 sheets', pricingText: 'AED 52/sht (was AED 61)', ctaText: 'Claim Deal', ctaLink: '/products?grade=FR&thickness=16' },
  { id: '5', typeTag: 'SERVICE', gradientFrom: '#374151', gradientTo: '#111827', emoji: '✂️', titleEn: 'Cut-to-Size', description: 'Factory precision cutting — CNC cut panels ready for install', pricingText: 'AED 8/sheet add-on', ctaText: 'Add to Order', ctaLink: '/products' },
  { id: '6', typeTag: 'CLEARANCE', gradientFrom: '#92400e', gradientTo: '#451a03', emoji: '🏷️', titleEn: 'MR 9mm Clearance', description: 'Thin MR boards at clearance price — last 320 sheets', pricingText: 'AED 22/sht (was AED 28)', ctaText: 'Order Now', ctaLink: '/products?grade=MR&thickness=9' },
]

const DEAL_TABS = ['All Deals', 'Bulk Discount', 'Price Lock', 'Clearance', 'New Arrivals']

const TAG_STYLES: Record<string, string> = {
  'BULK OFFER': 'bg-emerald-500',
  'PRICE LOCK': 'bg-blue-500',
  'NEW': 'bg-violet-500',
  'HOT DEAL': 'bg-red-500',
  'SERVICE': 'bg-slate-500',
  'CLEARANCE': 'bg-amber-500',
}

export function DealsCarousel() {
  const [activeTab, setActiveTab] = useState('All Deals')
  const scrollRef = useRef<HTMLDivElement>(null)

  const { data: deals = MOCK_DEALS } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const res = await fetch('/api/deals')
      if (!res.ok) return MOCK_DEALS
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
  })

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -240 : 240, behavior: 'smooth' })
  }

  return (
    <div className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        {/* ── Section header ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Exclusive Deals</h2>
            <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse shadow-sm">
              HOT DEAL
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-sw-400 hover:text-sw-600 transition-all hover:shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-sw-400 hover:text-sw-600 transition-all hover:shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
          {DEAL_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border',
                activeTab === tab
                  ? 'bg-sw-600 text-white border-sw-600 shadow-sm'
                  : 'border-gray-200 text-gray-500 hover:border-sw-400 hover:text-sw-600 bg-white'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Deal cards ── */}
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {deals.map((deal: typeof MOCK_DEALS[0]) => (
            <Link
              key={deal.id}
              href={deal.ctaLink}
              className="flex-shrink-0 w-[210px] rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group bg-white"
            >
              {/* ── Gradient banner ── */}
              <div
                className="h-[108px] relative flex flex-col justify-between p-3.5"
                style={{ background: `linear-gradient(145deg, ${deal.gradientFrom}, ${deal.gradientTo})` }}
              >
                {/* Tag badge */}
                <span
                  className={cn(
                    'self-start text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider',
                    TAG_STYLES[deal.typeTag] || 'bg-gray-600'
                  )}
                >
                  {deal.typeTag}
                </span>
                {/* Emoji */}
                <span className="text-[36px] leading-none">{deal.emoji}</span>
                {/* Shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              {/* ── Card body ── */}
              <div className="p-3.5">
                <div className="font-bold text-gray-900 text-[13px] mb-1 leading-tight">{deal.titleEn}</div>
                <div className="text-[11px] text-gray-500 mb-2.5 leading-relaxed line-clamp-2">{deal.description}</div>
                {/* Price */}
                <div className="font-black text-sw-600 text-xs mb-3 bg-sw-50 inline-block px-2 py-0.5 rounded-md">
                  {deal.pricingText}
                </div>
                {/* CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-sw-500 font-bold group-hover:text-sw-600 transition-colors">
                    {deal.ctaText}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-sw-50 group-hover:bg-sw-500 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3 h-3 text-sw-500 group-hover:text-white transition-colors" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
