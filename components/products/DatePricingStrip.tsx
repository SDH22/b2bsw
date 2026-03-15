'use client'
import { cn } from '@/lib/utils'

/* Standing-order date slots — further = cheaper */
const DATE_SLOTS = [
  { offsetDays: 7,  delta:  0,  label: '1 Week'   },
  { offsetDays: 14, delta: -1,  label: '2 Weeks'  },
  { offsetDays: 21, delta: -2,  label: '3 Weeks'  },
  { offsetDays: 30, delta: -3,  label: '1 Month'  },
  { offsetDays: 45, delta: -4,  label: '6 Weeks'  },
  { offsetDays: 60, delta: -5,  label: '2 Months' },
]

function addDays(n: number) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })
}

interface DatePricingStripProps {
  selectedIdx: number
  onSelect: (idx: number, delta: number) => void
}

export function DatePricingStrip({ selectedIdx, onSelect }: DatePricingStripProps) {
  const selected = DATE_SLOTS[selectedIdx]

  return (
    <div className="bg-white border-b border-gray-200 sticky top-[52px] z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2.5">

        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-sw-700">🔄 Standing Order</span>
            <span className="text-xs text-gray-400 font-medium hidden sm:block">
              — Pick a delivery week · further date = better price
            </span>
          </div>
          <span className="text-sm font-bold text-sw-700">
            Deliver by: <span className="text-green-700">{addDays(selected.offsetDays)}</span>
            {selected.delta < 0 && (
              <span className="ml-2 text-xs bg-green-100 text-green-700 font-black px-2 py-0.5 rounded-full">
                ↓ AED {Math.abs(selected.delta)}/sht saved
              </span>
            )}
            {selected.delta === 0 && (
              <span className="ml-2 text-xs bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">
                base rate
              </span>
            )}
          </span>
        </div>

        {/* Date slots */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {DATE_SLOTS.map((slot, i) => {
            const isSelected  = selectedIdx === i
            const isDiscount  = slot.delta < 0
            const btnColor    = isSelected
              ? 'border-sw-500 bg-sw-500 text-white shadow-sm'
              : isDiscount
                ? 'border-green-200 bg-green-50 hover:border-green-400'
                : 'border-gray-200 bg-white hover:border-sw-300'

            return (
              <button
                key={i}
                onClick={() => onSelect(i, slot.delta)}
                className={cn(
                  'flex-shrink-0 flex flex-col items-center px-4 py-2 rounded-xl border-2 transition-all min-w-[90px]',
                  btnColor
                )}
              >
                <span className={cn('text-[10px] font-bold uppercase tracking-wide',
                  isSelected ? 'text-sw-100' : 'text-gray-500')}>
                  {slot.label}
                </span>
                <span className={cn('text-xs font-black mt-0.5',
                  isSelected ? 'text-white' : isDiscount ? 'text-green-700' : 'text-gray-600')}>
                  by {addDays(slot.offsetDays)}
                </span>
                <span className={cn('text-[9px] font-semibold mt-0.5',
                  isSelected ? 'text-sw-200'
                  : isDiscount ? 'text-green-600'
                  : 'text-gray-400')}>
                  {slot.delta === 0 ? '— base' : `↓ save AED ${Math.abs(slot.delta)}`}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
