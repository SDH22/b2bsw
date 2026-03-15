'use client'
import { cn } from '@/lib/utils'

const ZONES = [
  { id: 'jebel-ali', name: 'Jebel Ali', cost: 4, nearest: true },
  { id: 'al-quoz', name: 'Al Quoz', cost: 6 },
  { id: 'business-bay', name: 'Business Bay', cost: 7 },
  { id: 'sharjah-ind', name: 'Sharjah Ind.', cost: 9 },
  { id: 'ajman', name: 'Ajman', cost: 11 },
  { id: 'rak', name: 'RAK', cost: 14 },
  { id: 'mussafah-ad', name: 'Mussafah AD', cost: 18 },
  { id: 'abu-dhabi-city', name: 'Abu Dhabi City', cost: 22 },
  { id: 'al-ain', name: 'Al Ain', cost: 28 },
  { id: 'fujairah-port', name: 'Fujairah Port', cost: 35 },
]

interface ZoneStripProps {
  selectedZoneId: string
  onZoneChange: (id: string, cost: number) => void
}

export function ZoneStrip({ selectedZoneId, onZoneChange }: ZoneStripProps) {
  const selected = ZONES.find((z) => z.id === selectedZoneId) ?? ZONES[0]

  return (
    <div className="bg-white border-b border-gray-200 py-3 sticky top-[52px] z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Delivery location — all prices update live
          </span>
          <span className="text-sm font-semibold text-sw-700">
            Delivering to: {selected.name} · AED {selected.cost}/sht
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {ZONES.map((zone) => (
            <button
              key={zone.id}
              onClick={() => onZoneChange(zone.id, zone.cost)}
              className={cn(
                'zone-card flex-shrink-0 border rounded-lg px-3 py-2 text-left transition-all',
                selectedZoneId === zone.id
                  ? 'border-sw-500 bg-sw-50 active'
                  : 'border-gray-200 bg-white hover:border-sw-300'
              )}
            >
              <div className="flex items-center gap-1 mb-0.5">
                <span className={cn(
                  'text-sm font-semibold',
                  selectedZoneId === zone.id ? 'text-sw-700' : 'text-gray-700'
                )}>
                  {zone.name}
                </span>
                {zone.nearest && (
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">Nearest</span>
                )}
              </div>
              <div className={cn(
                'text-xs font-bold',
                selectedZoneId === zone.id ? 'text-sw-600' : 'text-gray-500'
              )}>
                AED {zone.cost}/sht
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
