'use client'
import { useState, useRef } from 'react'
import { Plus, GripVertical, ToggleLeft, ToggleRight, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

const INITIAL_DEALS = [
  { id: '1', position: 1, typeTag: 'BULK OFFER', gradientFrom: '#1e4d38', gradientTo: '#0f2318', emoji: '📦', titleEn: '100 Sheets NFR', description: "Order 100+ NFR 12mm — delivery drops to AED 3/sheet", pricingText: 'Save AED 150 on delivery', ctaText: 'Order Now', isActive: true },
  { id: '2', position: 2, typeTag: 'PRICE LOCK', gradientFrom: '#1e3a5f', gradientTo: '#0f2318', emoji: '🔒', titleEn: 'Lock MR 18mm Price', description: "April revision expected — lock today's AED 38/sht", pricingText: 'AED 110 price lock fee', ctaText: 'Lock Price', isActive: true },
  { id: '3', position: 3, typeTag: 'NEW', gradientFrom: '#2d6a4f', gradientTo: '#1e4d38', emoji: '🆕', titleEn: 'Acoustic 25mm', description: 'New thickness — 25mm acoustic board', pricingText: 'AED 98/sht ex-factory', ctaText: 'View Product', isActive: true },
  { id: '4', position: 4, typeTag: 'HOT DEAL', gradientFrom: '#7c1d1d', gradientTo: '#0f2318', emoji: '🔥', titleEn: 'FR Clearance', description: 'End-of-batch FR 16mm at special pricing', pricingText: 'AED 52/sht (was AED 61)', ctaText: 'Claim Deal', isActive: true },
  { id: '5', position: 5, typeTag: 'SERVICE', gradientFrom: '#374151', gradientTo: '#1f2937', emoji: '✂️', titleEn: 'Cut-to-Size', description: 'CNC cut panels ready for install', pricingText: 'AED 8/sheet add-on', ctaText: 'Add to Order', isActive: true },
  { id: '6', position: 6, typeTag: 'CLEARANCE', gradientFrom: '#92400e', gradientTo: '#0f2318', emoji: '🏷️', titleEn: 'MR 9mm Clearance', description: 'Last 320 sheets at clearance price', pricingText: 'AED 22/sht (was AED 28)', ctaText: 'Order Now', isActive: false },
]

const TAG_COLORS: Record<string, string> = {
  'BULK OFFER': 'bg-green-500', 'PRICE LOCK': 'bg-blue-500', 'NEW': 'bg-purple-500',
  'HOT DEAL': 'bg-red-500', 'SERVICE': 'bg-gray-500', 'CLEARANCE': 'bg-amber-500',
}

export default function AdminDeals() {
  const [deals, setDeals] = useState(INITIAL_DEALS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const dragItem = useRef<string | null>(null)
  const dragOverItem = useRef<string | null>(null)

  const toggle = (id: string) => setDeals(prev => prev.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d))

  const handleDragEnd = () => {
    if (!dragItem.current || !dragOverItem.current || dragItem.current === dragOverItem.current) return
    const items = [...deals]
    const fromIdx = items.findIndex(d => d.id === dragItem.current)
    const toIdx = items.findIndex(d => d.id === dragOverItem.current)
    const [moved] = items.splice(fromIdx, 1)
    items.splice(toIdx, 0, moved)
    setDeals(items.map((d, i) => ({ ...d, position: i + 1 })))
    dragItem.current = null
    dragOverItem.current = null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Deals &amp; Offers</h1>
          <p className="text-sm text-gray-500 mt-0.5">Drag to reorder · changes reflect on homepage carousel</p>
        </div>
        <button className="flex items-center gap-2 bg-sw-500 hover:bg-sw-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Add Deal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Deal list */}
        <div className="space-y-2">
          {deals.map((deal) => (
            <div
              key={deal.id}
              draggable
              onDragStart={() => { dragItem.current = deal.id }}
              onDragEnter={() => { dragOverItem.current = deal.id }}
              onDragEnd={handleDragEnd}
              className={cn(
                'bg-white rounded-xl border overflow-hidden cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow',
                editingId === deal.id ? 'border-sw-400 ring-2 ring-sw-100' : 'border-gray-200'
              )}
            >
              <div className="flex items-center gap-3 p-3">
                <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
                {/* Mini preview */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${deal.gradientFrom}, ${deal.gradientTo})` }}
                >
                  {deal.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn('text-white text-xs font-bold px-1.5 py-0.5 rounded', TAG_COLORS[deal.typeTag] || 'bg-gray-500')}>
                      {deal.typeTag}
                    </span>
                    <span className="font-semibold text-gray-800 text-sm truncate">{deal.titleEn}</span>
                  </div>
                  <div className="text-xs text-gray-500 truncate">{deal.pricingText}</div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => setEditingId(editingId === deal.id ? null : deal.id)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => toggle(deal.id)}>
                    {deal.isActive ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-gray-300" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Preview panel */}
        <div className="sticky top-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Homepage Carousel Preview</div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {deals.filter(d => d.isActive).map((deal) => (
                <div
                  key={deal.id}
                  className="flex-shrink-0 w-[160px] rounded-xl overflow-hidden border border-gray-200"
                >
                  <div
                    className="h-20 flex flex-col justify-between p-2"
                    style={{ background: `linear-gradient(135deg, ${deal.gradientFrom}, ${deal.gradientTo})` }}
                  >
                    <span className={cn('text-white text-xs font-bold px-1.5 py-0.5 rounded-full self-start', TAG_COLORS[deal.typeTag] || 'bg-gray-500')}>
                      {deal.typeTag}
                    </span>
                    <div className="text-2xl">{deal.emoji}</div>
                  </div>
                  <div className="p-2 bg-white">
                    <div className="font-semibold text-gray-800 text-xs mb-0.5 truncate">{deal.titleEn}</div>
                    <div className="text-xs text-sw-600 font-medium">{deal.pricingText}</div>
                    <div className="text-xs text-sw-500 mt-1">{deal.ctaText} →</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
