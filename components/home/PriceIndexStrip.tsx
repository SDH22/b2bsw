'use client'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Zap, Radio } from 'lucide-react'
import { cn } from '@/lib/utils'

const MOCK_INDEX = [
  { label: 'MR 18mm',       price: 38, unit: '/sht', trend: 'stable', note: '' },
  { label: 'NFR 12mm',      price: 30, unit: '/sht', trend: 'down',   note: '↓ dropped AED 2' },
  { label: 'FR 18mm',       price: 61, unit: '/sht', trend: 'up',     note: '↑ revision due Apr' },
  { label: 'Acoustic 18mm', price: 85, unit: '/sht', trend: 'stable', note: '' },
  { label: 'MR 12mm',       price: 32, unit: '/sht', trend: 'down',   note: '↓ limited stock' },
  { label: 'NFR 16mm',      price: 34, unit: '/sht', trend: 'up',     note: '↑ demand surge' },
  { label: 'STOCK ALERT',   price: 0,  unit: '',     trend: 'alert',  note: 'FR 18mm — 38 sheets left' },
  { label: 'BEST DEAL',     price: 34, unit: '/sht', trend: 'deal',   note: 'NFR 12mm · delivered Al Quoz' },
  { label: 'FR 12mm',       price: 55, unit: '/sht', trend: 'stable', note: '' },
  { label: 'PRICE LOCK',    price: 0,  unit: '',     trend: 'deal',   note: 'Order today · rate valid 6 days' },
]

function TickerItem({ item }: { item: typeof MOCK_INDEX[0] }) {
  const isAlert = item.trend === 'alert'
  const isDeal  = item.trend === 'deal'
  const isUp    = item.trend === 'up'
  const isDown  = item.trend === 'down'

  return (
    <span className="inline-flex items-center gap-1.5 px-4 whitespace-nowrap">
      {/* Label */}
      <span className={cn(
        'text-[11px] font-black uppercase tracking-wide',
        isAlert ? 'text-blue-300'
        : isDeal  ? 'text-yellow-300'
        : isUp    ? 'text-amber-300'
        : isDown  ? 'text-emerald-300'
        : 'text-sw-300'
      )}>
        {item.label}
      </span>

      {/* Price or note */}
      {item.price > 0 ? (
        <span className={cn(
          'text-[13px] font-black',
          isUp   ? 'text-amber-200'
          : isDown ? 'text-emerald-200'
          : 'text-white'
        )}>
          AED {item.price}
          <span className="text-[10px] font-normal text-white/50">{item.unit}</span>
        </span>
      ) : (
        <span className={cn(
          'text-xs font-bold',
          isAlert ? 'text-blue-200' : 'text-yellow-200'
        )}>
          {item.note}
        </span>
      )}

      {/* Trend icon */}
      {item.trend === 'up'    && <TrendingUp    className="w-3 h-3 text-amber-400"   />}
      {item.trend === 'down'  && <TrendingDown  className="w-3 h-3 text-emerald-400" />}
      {item.trend === 'stable'&& <Minus         className="w-3 h-3 text-white/30"    />}
      {item.trend === 'alert' && <AlertTriangle className="w-3 h-3 text-blue-400"    />}
      {item.trend === 'deal'  && <Zap           className="w-3 h-3 text-yellow-400"  />}

      {/* Note for price items */}
      {item.note && item.price > 0 && (
        <span className="text-[10px] text-white/40 italic">{item.note}</span>
      )}

      {/* Separator */}
      <span className="text-white/20 mx-1 text-sm">|</span>
    </span>
  )
}

export function PriceIndexStrip() {
  const { data: index = MOCK_INDEX } = useQuery({
    queryKey: ['price-index'],
    queryFn: async () => {
      const res = await fetch('/api/pricing/index')
      if (!res.ok) return MOCK_INDEX
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
  })

  // Duplicate 3× so the loop is seamless at all screen widths
  const items = [...index, ...index, ...index]

  return (
    <div className="bg-sw-900 border-b border-sw-800 overflow-hidden select-none">
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker-scroll 38s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="flex items-stretch">

        {/* Left label — fixed, doesn't scroll */}
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-sw-500 border-r border-sw-400 z-10">
          <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
          <span className="text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
            Live Prices
          </span>
        </div>

        {/* Scrolling track */}
        <div className="flex-1 overflow-hidden py-2.5">
          <div className="ticker-track">
            {items.map((item, i) => (
              <TickerItem key={i} item={item} />
            ))}
          </div>
        </div>

        {/* Right — timestamp */}
        <div className="flex-shrink-0 flex items-center px-3 border-l border-sw-800">
          <span className="text-[10px] text-sw-400 whitespace-nowrap">Updated just now</span>
        </div>
      </div>
    </div>
  )
}
