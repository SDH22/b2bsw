'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Grade } from '@/types/product'

const GRADES: { value: Grade; label: string; desc: string }[] = [
  { value: 'NFR', label: 'NFR', desc: 'Standard' },
  { value: 'MR', label: 'MR', desc: 'Moisture Resistant' },
  { value: 'FR', label: 'FR', desc: 'Fire Retardant' },
  { value: 'AC', label: 'AC', desc: 'Acoustic' },
]

const THICKNESSES = [9, 12, 16, 18, 25]

const ZONES = [
  { id: 'jebel-ali', label: 'Jebel Ali', short: 'Jebel' },
  { id: 'al-quoz', label: 'Al Quoz', short: 'Al Quoz' },
  { id: 'sharjah', label: 'Sharjah Ind.', short: 'Sharjah' },
  { id: 'abu-dhabi', label: 'Abu Dhabi', short: 'Abu Dhabi' },
  { id: 'al-ain', label: 'Al Ain', short: 'Al Ain' },
]

const QTY_OPTIONS = [
  { value: 50, label: '50' },
  { value: 100, label: '100' },
  { value: 200, label: '200' },
  { value: 500, label: '500+' },
]

const BASE_PRICES: Record<Grade, number> = { NFR: 30, MR: 38, FR: 61, AC: 85 }
const DELIVERY_COSTS: Record<string, number> = {
  'jebel-ali': 4, 'al-quoz': 6, 'sharjah': 9, 'abu-dhabi': 22, 'al-ain': 28
}

function calcPrice(grade: Grade, zoneId: string) {
  const base = BASE_PRICES[grade]
  const delivery = DELIVERY_COSTS[zoneId] ?? 6
  const sub = base + delivery
  const vat = Math.round(sub * 0.05 * 10) / 10
  return Math.round((sub + vat) * 10) / 10
}

const ORDER_TYPES = [
  {
    id:   'spot'     as const,
    icon: '⚡',
    label: 'Spot Order',
    desc:  'Pay now · earliest available delivery',
  },
  {
    id:   'standing' as const,
    icon: '🔄',
    label: 'Standing Order',
    desc:  'Pay now · choose a future delivery date',
  },
]

export function SearchWidget() {
  const router = useRouter()
  const [orderType, setOrderType] = useState<'spot' | 'standing'>('spot')
  const [grade, setGrade] = useState<Grade>('MR')
  const [thickness, setThickness] = useState(18)
  const [zoneId, setZoneId] = useState('al-quoz')
  const [qty, setQty] = useState(100)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [history, setHistory] = useState([
    { label: 'MR → 18mm · Al Quoz', id: '1' },
    { label: 'FR → 18mm · Sharjah', id: '2' },
  ])

  const estimatedPrice = calcPrice(grade, zoneId)

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams({
      grade,
      thickness: String(thickness),
      zone: zoneId,
      qty: String(qty),
      orderType,
      ...(inStockOnly ? { inStock: '1' } : {}),
    })
    router.push(`/products?${params}`)
  }, [grade, thickness, zoneId, qty, orderType, inStockOnly, router])

  const selectedZone = ZONES.find((z) => z.id === zoneId)

  return (
    /* ── Hero wrapper ─────────────────────────────────────────── */
    <div className="bg-gradient-to-b from-sw-800 via-sw-700 to-sw-600 pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* ── Hero headline ── */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1.5 tracking-tight">
            Order Chipboard &amp; Density Board — Direct from Factory
          </h1>
          <p className="text-sw-200 text-sm font-medium">
            JAFZA / NIP Dubai &nbsp;·&nbsp; Next-day delivery across UAE &nbsp;·&nbsp; LC · PDC · TT accepted
          </p>
        </div>

        {/* ── Order-type pills ── */}
        <div className="flex items-center justify-center gap-3 mb-5">
          {ORDER_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setOrderType(t.id)}
              className={cn(
                'flex flex-col items-center px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all border-2',
                orderType === t.id
                  ? 'bg-white text-sw-800 border-white shadow-lg'
                  : 'bg-transparent border-sw-500/60 text-sw-200 hover:border-white hover:text-white'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{t.icon}</span>
                <span className="font-bold">{t.label}</span>
              </div>
              <span className={cn(
                'text-[10px] mt-0.5 font-medium',
                orderType === t.id ? 'text-sw-500' : 'text-sw-400/70'
              )}>
                {t.desc}
              </span>
            </button>
          ))}
        </div>

        {/* ── Main search card ── */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">

            {/* GRADE */}
            <div className="flex-1 p-4 hover:bg-gray-50/70 transition-colors cursor-default group">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Grade</div>
              <div className="text-2xl font-black text-sw-800 mb-2 leading-none">{grade}</div>
              <div className="flex gap-1.5 flex-wrap">
                {GRADES.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGrade(g.value)}
                    className={cn(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all',
                      grade === g.value
                        ? 'bg-sw-500 text-white shadow-sm scale-105'
                        : 'bg-gray-100 text-gray-500 hover:bg-sw-50 hover:text-sw-700'
                    )}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* THICKNESS */}
            <div className="flex-1 p-4 hover:bg-gray-50/70 transition-colors cursor-default">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Thickness</div>
              <div className="text-2xl font-black text-sw-800 mb-2 leading-none">{thickness}mm</div>
              <div className="flex gap-1.5 flex-wrap">
                {THICKNESSES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setThickness(t)}
                    className={cn(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all',
                      thickness === t
                        ? 'bg-sw-500 text-white shadow-sm scale-105'
                        : 'bg-gray-100 text-gray-500 hover:bg-sw-50 hover:text-sw-700'
                    )}
                  >
                    {t}mm
                  </button>
                ))}
              </div>
            </div>

            {/* DELIVERY ZONE */}
            <div className="flex-1 p-4 hover:bg-gray-50/70 transition-colors cursor-default">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                Delivery Zone <ChevronDown className="w-3 h-3" />
              </div>
              <div className="text-xl font-black text-sw-800 mb-2 leading-none truncate">{selectedZone?.label}</div>
              <div className="flex gap-1.5 flex-wrap">
                {ZONES.map((z) => (
                  <button
                    key={z.id}
                    onClick={() => setZoneId(z.id)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                      zoneId === z.id
                        ? 'bg-sw-500 text-white shadow-sm scale-105'
                        : 'bg-gray-100 text-gray-500 hover:bg-sw-50 hover:text-sw-700'
                    )}
                  >
                    {z.short}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY */}
            <div className="flex-1 p-4 hover:bg-gray-50/70 transition-colors cursor-default">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                Quantity <ChevronDown className="w-3 h-3" />
              </div>
              <div className="text-2xl font-black text-sw-800 mb-2 leading-none">
                {qty}&thinsp;<span className="text-sm font-semibold text-gray-400">sheets</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {QTY_OPTIONS.map((q) => (
                  <button
                    key={q.value}
                    onClick={() => setQty(q.value)}
                    className={cn(
                      'px-3 py-1 rounded-lg text-xs font-bold transition-all',
                      qty === q.value
                        ? 'bg-sw-500 text-white shadow-sm scale-105'
                        : 'bg-gray-100 text-gray-500 hover:bg-sw-50 hover:text-sw-700'
                    )}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
              <div className="mt-1.5 text-[11px] font-bold text-sw-500 bg-sw-50 inline-block px-2 py-0.5 rounded-md">
                ~AED {estimatedPrice}/sht incl. VAT
              </div>
            </div>

            {/* SEARCH CTA */}
            <button
              onClick={handleSearch}
              className="bg-sw-500 hover:bg-sw-400 active:bg-sw-600 text-white px-8 py-5 font-bold flex flex-col items-center justify-center gap-2 transition-all min-w-[170px] group"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-sm text-center leading-snug font-bold">
                Find Products<br />&amp; Price ▶
              </span>
            </button>
          </div>

          {/* ── Bottom bar ── */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50/80 border-t border-gray-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-green-600 font-bold">✓ Configured:</span>
              {history.map((h) => (
                <span
                  key={h.id}
                  className="inline-flex items-center gap-1 bg-sw-50 text-sw-700 text-[11px] px-2.5 py-1 rounded-full border border-sw-200 font-semibold"
                >
                  {h.label}
                  <button
                    onClick={() => setHistory((prev) => prev.filter((x) => x.id !== h.id))}
                    className="hover:text-red-500 ml-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-sw-500 w-3.5 h-3.5"
              />
              <span className="text-[11px] text-gray-500 font-semibold">In-stock only</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
