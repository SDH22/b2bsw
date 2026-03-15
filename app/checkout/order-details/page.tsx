'use client'
import { Suspense, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Minus, Plus, Package, ChevronRight, CalendarCheck, MapPin, FileText, Download } from 'lucide-react'
import { StepNav } from '@/components/checkout/StepNav'
import { SPOT_DATE_SLOTS, STANDING_DATE_SLOTS } from '@/components/checkout/PriceTrendCalendar'
import { cn } from '@/lib/utils'

/* ── Constants ────────────────────────────────────────────────── */
const BASE_PRICES: Record<string, number> = { NFR: 30, MR: 38, FR: 61, AC: 85 }
const ZONE_COSTS:  Record<string, number> = {
  'jebel-ali': 4, 'al-quoz': 6, 'sharjah': 9, 'abu-dhabi': 22, 'al-ain': 28,
}
const ZONE_DELIVERY_DAYS: Record<string, number> = {
  'jebel-ali': 0, 'al-quoz': 1, 'sharjah': 2, 'abu-dhabi': 3, 'al-ain': 3,
}
const ZONES = [
  { id: 'jebel-ali', label: 'Jebel Ali',  short: 'JAFZA',     emirate: 'Dubai'     },
  { id: 'al-quoz',   label: 'Al Quoz',    short: 'Sanabis',    emirate: 'Dubai'     },
  { id: 'sharjah',   label: 'Sharjah',    short: 'Industrial', emirate: 'Sharjah'   },
  { id: 'abu-dhabi', label: 'Abu Dhabi',  short: 'City',       emirate: 'Abu Dhabi' },
  { id: 'al-ain',    label: 'Al Ain',     short: '',           emirate: 'Abu Dhabi' },
]
const GRADE_INFO: Record<string, { badge: string; dot: string; name: string }> = {
  MR:  { badge: 'bg-blue-100 text-blue-800',    dot: 'bg-blue-500',   name: 'Moisture Resistant' },
  FR:  { badge: 'bg-red-100 text-red-800',      dot: 'bg-red-500',    name: 'Fire Retardant'     },
  NFR: { badge: 'bg-gray-100 text-gray-700',    dot: 'bg-gray-500',   name: 'Standard'           },
  AC:  { badge: 'bg-purple-100 text-purple-800',dot: 'bg-purple-500', name: 'Acoustic'           },
}

const VOL_BANDS = [
  { range: '1–49',    label: 'List price', pct: '',     min: 0,   max: 49   },
  { range: '50–99',   label: '2% off',     pct: '-2%',  min: 50,  max: 99   },
  { range: '100–199', label: '4% off',     pct: '-4%',  min: 100, max: 199  },
  { range: '200+',    label: '7% off',     pct: '-7%',  min: 200, max: 9999 },
]

function addDays(base: Date, n: number) {
  const d = new Date(base); d.setDate(d.getDate() + n); return d
}
function fmtShort(d: Date) {
  return d.toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })
}
function fmtFull(d: Date) {
  return d.toLocaleDateString('en-AE', { weekday: 'short', day: 'numeric', month: 'short' })
}

function calcPricing(grade: string, zoneId: string, qty: number, priceDelta: number) {
  const base     = BASE_PRICES[grade] ?? 38
  const delivery = ZONE_COSTS[zoneId] ?? 6
  const perSht   = base + delivery + priceDelta
  const sub      = perSht * qty
  const vat      = Math.round(sub * 0.05 * 100) / 100
  return {
    basePerSht:     base,
    deliveryPerSht: delivery,
    base:           (base + priceDelta) * qty,
    delivery:       delivery * qty,
    vat,
    total:          Math.round((sub + vat) * 100) / 100,
    totalPerSht:    Math.round((perSht * 1.05) * 10) / 10,
  }
}

/* ── Page ─────────────────────────────────────────────────────── */
function OrderDetailsContent() {
  const router = useRouter()
  const sp     = useSearchParams()

  const sku       = sp.get('sku')       || 'SW-MR-18-2440'
  const grade     = sp.get('grade')     || 'MR'
  const thickness = sp.get('thickness') || '18'
  const orderType = (sp.get('orderType') === 'standing' ? 'standing' : 'spot') as 'spot' | 'standing'

  const DATE_SLOTS = orderType === 'standing' ? STANDING_DATE_SLOTS : SPOT_DATE_SLOTS

  const [zoneId,        setZoneId]        = useState(sp.get('zone') || 'al-quoz')
  const [qty,           setQty]           = useState(Number(sp.get('qty') || 100))
  const [rawQty,        setRawQty]        = useState(String(sp.get('qty') || 100))
  const [orderDateIdx,  setOrderDateIdx]  = useState(0)

  const gradeInfo    = GRADE_INFO[grade] ?? GRADE_INFO.NFR
  const selectedZone = ZONES.find((z) => z.id === zoneId) ?? ZONES[1]
  const selectedSlot = DATE_SLOTS[orderDateIdx]
  const priceDelta   = selectedSlot.delta
  const pricing      = calcPricing(grade, zoneId, qty, priceDelta)
  const activeBand   = VOL_BANDS.find((b) => qty >= b.min && qty <= b.max)

  const today        = new Date()
  const orderDate    = addDays(today, selectedSlot.offsetDays)
  const deliveryDate = addDays(orderDate, ZONE_DELIVERY_DAYS[zoneId] ?? 1)
  const deliveryStr  = fmtFull(deliveryDate)
  const isToday      = selectedSlot.offsetDays === 0

  const setQtySafe = useCallback((v: number) => {
    const rounded = Math.round(v / 5) * 5
    const n = Math.max(5, Math.min(9995, rounded))
    setQty(n); setRawQty(String(n))
  }, [])
  const step = 5

  const handleContinue = () =>
    router.push(
      `/checkout/tier?sku=${sku}&grade=${grade}&thickness=${thickness}&zone=${zoneId}&qty=${qty}&priceDelta=${priceDelta}&orderType=${orderType}`
    )

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <StepNav currentStep={1} />

      {/* ══ STICKY CONFIG BAR — date pricing only ════════════════ */}
      <div className="sticky top-[57px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 py-2.5 overflow-x-auto scrollbar-hide">

            {/* Order type badge */}
            <div className={cn(
              'flex items-center gap-1.5 flex-shrink-0 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide border',
              orderType === 'spot'
                ? 'bg-sw-50 text-sw-700 border-sw-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            )}>
              <span>{orderType === 'spot' ? '⚡' : '🔄'}</span>
              <span>{orderType === 'spot' ? 'Spot' : 'Standing'}</span>
            </div>

            {/* Lead-time hint */}
            <div className="flex-shrink-0 text-[10px] text-gray-400 font-semibold hidden sm:block whitespace-nowrap">
              More lead time → better price
            </div>

            <div className="flex gap-1.5 flex-1 overflow-x-auto scrollbar-hide">
              {DATE_SLOTS.map((slot, i) => {
                const date     = addDays(today, slot.offsetDays)
                const price    = pricing.basePerSht + pricing.deliveryPerSht + slot.delta
                const selected = orderDateIdx === i

                // Negative delta = cheaper (good), positive = dearer (urgent premium)
                const isDiscount = slot.delta < 0
                const isBase     = slot.delta === 0

                let label: string
                if (slot.offsetDays === 0) label = 'Today'
                else if (slot.offsetDays === 1) label = 'Tomorrow'
                else label = date.toLocaleDateString('en-AE', { weekday: 'short' }) + ' ' + fmtShort(date)

                const btnColor = selected
                  ? 'border-sw-500 bg-sw-500 shadow-sm'
                  : isDiscount ? 'border-green-200 bg-green-50 hover:border-green-400'
                  : isBase     ? 'border-gray-200 bg-white hover:border-sw-300'
                  :              'border-orange-200 bg-orange-50 hover:border-orange-400'

                const priceColor = selected     ? 'text-white'
                  : isDiscount ? 'text-green-700'
                  : isBase     ? 'text-gray-700'
                  :              'text-orange-600'

                const badgeTxt = isDiscount
                  ? `↓ save ${Math.abs(slot.delta)}`
                  : isBase ? '— base'
                  : `↑ +${slot.delta} urgent`

                const badgeColor = selected     ? 'text-sw-200'
                  : isDiscount ? 'text-green-600'
                  : isBase     ? 'text-gray-400'
                  :              'text-orange-500'

                return (
                  <button
                    key={i}
                    onClick={() => setOrderDateIdx(i)}
                    className={cn(
                      'flex flex-col items-center px-3 py-1.5 rounded-xl border-2 transition-all flex-shrink-0 min-w-[78px]',
                      btnColor
                    )}
                  >
                    <span className={cn('text-[9px] font-bold uppercase tracking-wide leading-tight',
                      selected ? 'text-sw-100' : 'text-gray-500')}>
                      {label}
                    </span>
                    <span className={cn('text-sm font-black leading-snug', priceColor)}>
                      AED {price}
                    </span>
                    <span className={cn('text-[8px] font-semibold leading-tight', badgeColor)}>
                      {badgeTxt}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      {/* ══ END CONFIG BAR ════════════════════════════════════════ */}

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-6 items-start">

          {/* ══ LEFT ════════════════════════════════════════════════ */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Product info */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', gradeInfo.dot)}>
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-800 truncate">{grade} Chipboard {thickness}mm</div>
                  <div className="text-xs text-gray-400 font-mono">{sku} · 2440×1220mm · E1</div>
                  <a
                    href={`/api/tds?grade=${grade}&thickness=${thickness}`}
                    download
                    className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-bold text-sw-600 hover:text-sw-500 bg-sw-50 hover:bg-sw-100 border border-sw-200 px-2 py-0.5 rounded-md transition-colors"
                  >
                    <FileText className="w-3 h-3" />
                    TDS · Download
                    <Download className="w-3 h-3" />
                  </a>
                </div>
                <span className={cn('text-[11px] font-black px-2.5 py-1 rounded-full flex-shrink-0', gradeInfo.badge)}>
                  {grade} · {gradeInfo.name}
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <div className="w-6 h-6 bg-sw-500 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0">1</div>
                <h2 className="font-bold text-gray-800">Quantity</h2>
                {activeBand?.pct && (
                  <span className="ml-auto bg-green-100 text-green-700 text-[11px] font-black px-2 py-0.5 rounded-full">
                    {activeBand.pct} bulk
                  </span>
                )}
              </div>
              <div className="p-5">
                {/* Spinner */}
                <div className="flex items-center gap-3">
                  <button onClick={() => setQtySafe(qty - step)}
                    className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-sw-400 hover:bg-sw-50 transition-all active:scale-95 flex-shrink-0">
                    <Minus className="w-4 h-4 text-gray-500" />
                  </button>
                  <input type="number" min="1" max="9999" value={rawQty}
                    onChange={(e) => { setRawQty(e.target.value); const n = parseInt(e.target.value, 10); if (!isNaN(n) && n > 0) setQty(Math.min(n, 9995)) }}
                    onBlur={() => setQtySafe(qty)}
                    className="w-24 border-2 border-gray-200 rounded-xl px-2 py-2 text-center text-2xl font-black text-sw-800 focus:outline-none focus:border-sw-500 transition-colors"
                  />
                  <span className="text-sm text-gray-500">sheets</span>
                  <button onClick={() => setQtySafe(qty + step)}
                    className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-sw-400 hover:bg-sw-50 transition-all active:scale-95 flex-shrink-0">
                    <Plus className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                {/* Volume bands */}
                <div className="mt-4 grid grid-cols-4 gap-1.5 text-center text-[11px]">
                  {VOL_BANDS.map((b) => {
                    const active = qty >= b.min && qty <= b.max
                    return (
                      <button key={b.range} onClick={() => setQtySafe(b.min <= 1 ? 10 : b.min)}
                        className={cn('rounded-lg p-2 border transition-all',
                          active ? 'border-sw-400 bg-sw-50 text-sw-700 font-semibold'
                                 : 'border-gray-100 text-gray-400 hover:bg-gray-50')}>
                        <div className="font-bold">{b.range}</div>
                        <div className="text-[10px] mt-0.5">{b.label}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Delivery Zone */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <div className="w-6 h-6 bg-sw-500 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0">2</div>
                <h2 className="font-bold text-gray-800">Delivery Location</h2>
                <span className="ml-auto text-[10px] text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> UAE
                </span>
              </div>
              <div className="p-4 grid grid-cols-1 gap-2">
                {ZONES.map((z) => {
                  const cost    = ZONE_COSTS[z.id] ?? 6
                  const active  = zoneId === z.id
                  const delDate = fmtShort(addDays(orderDate, ZONE_DELIVERY_DAYS[z.id] ?? 1))
                  return (
                    <button key={z.id} onClick={() => setZoneId(z.id)}
                      className={cn(
                        'flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left',
                        active
                          ? 'border-sw-500 bg-sw-50'
                          : 'border-gray-100 hover:border-sw-200 hover:bg-gray-50'
                      )}>
                      <div>
                        <div className={cn('text-sm font-bold', active ? 'text-sw-700' : 'text-gray-700')}>
                          {z.label}
                        </div>
                        <div className="text-[11px] text-gray-400">{z.emirate} · by {delDate}</div>
                      </div>
                      <div className="text-right">
                        <div className={cn('text-sm font-black', active ? 'text-sw-600' : 'text-gray-500')}>
                          +AED {cost}/sht
                        </div>
                        <div className="text-[10px] text-gray-400">
                          AED {cost * qty} total
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Summary card — visible on mobile / confirms selections */}
            <div className="bg-sw-50 rounded-2xl border border-sw-200 p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarCheck className="w-4 h-4 text-sw-500 flex-shrink-0" />
                  <span className="text-gray-600">Order on</span>
                  <span className="font-bold text-sw-700">
                    {selectedSlot.offsetDays === 0 ? 'Today' : fmtFull(orderDate)}
                  </span>
                  {priceDelta > 0 && (
                    <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">
                      +AED {priceDelta}/sht
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-sw-500 flex-shrink-0" />
                  <span className="text-gray-600">Deliver to</span>
                  <span className="font-bold text-sw-700">{selectedZone.label}</span>
                  <span className="text-xs text-gray-500">· by <span className="font-semibold">{deliveryStr}</span></span>
                </div>
              </div>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-xs text-sw-600 font-bold hover:underline flex-shrink-0">
                Change ↑
              </button>
            </div>

          </div>

          {/* ══ RIGHT — Sticky Sidebar ══════════════════════════════ */}
          <div className="w-72 flex-shrink-0 sticky top-[112px]">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

              {/* Header */}
              <div className={cn('px-5 py-4 transition-colors duration-300',
                orderType === 'standing'
                  ? priceDelta < 0 ? 'bg-blue-800' : 'bg-blue-700'
                  : priceDelta === 0 ? 'bg-sw-800' : 'bg-orange-700'
              )}>
                <div className="text-xs text-white/60 font-semibold uppercase tracking-wider mb-0.5">
                  {orderType === 'standing'
                    ? priceDelta < 0
                      ? `Standing Order · AED ${Math.abs(priceDelta)}/sht saved`
                      : 'Standing Order · Rate locked today'
                    : priceDelta === 0
                    ? 'Spot Order · Best rate'
                    : `Spot Order · +AED ${priceDelta}/sht applies`
                  }
                </div>
                <div className="text-3xl font-black text-white leading-none">
                  AED {pricing.total.toLocaleString()}
                </div>
                <div className="text-white/60 text-xs mt-1">{qty} sheets · incl. 5% VAT</div>
              </div>

              {/* Delivery date */}
              <div className={cn('flex items-center gap-2.5 px-5 py-3 border-b',
                orderType === 'standing'
                  ? 'bg-blue-50 border-blue-100'
                  : isToday ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'
              )}>
                <CalendarCheck className={cn('w-4 h-4 flex-shrink-0',
                  orderType === 'standing' ? 'text-blue-600'
                  : isToday ? 'text-green-600' : 'text-orange-600')} />
                <div>
                  <div className={cn('text-xs font-bold',
                    orderType === 'standing' ? 'text-blue-800'
                    : isToday ? 'text-green-800' : 'text-orange-800')}>
                    {orderType === 'standing' ? 'Scheduled delivery' : 'Expected delivery'}
                  </div>
                  <div className={cn('text-sm font-black',
                    orderType === 'standing' ? 'text-blue-700'
                    : isToday ? 'text-green-700' : 'text-orange-700')}>
                    {deliveryStr}
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-[10px] text-gray-400">Zone</div>
                  <div className="text-xs font-bold text-gray-700">{selectedZone.label}</div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="px-5 py-4 space-y-3 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{grade} {thickness}mm × {qty}{priceDelta > 0 ? ` (+${priceDelta})` : ''}</span>
                  <span className="font-semibold text-gray-800">AED {pricing.base.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery · {selectedZone.label}</span>
                  <span className="font-semibold text-gray-800">AED {pricing.delivery.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-dashed border-gray-200 pt-3">
                  <span className="text-gray-500">VAT (5%)</span>
                  <span className="font-semibold text-gray-800">AED {pricing.vat.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-black border-t-2 border-gray-200 pt-2">
                  <span className="text-gray-800">Total</span>
                  <span className="text-sw-700">AED {pricing.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Per sheet */}
              <div className="px-5 py-3 bg-sw-50 border-b border-sw-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-sw-600 font-medium">Per sheet (incl. VAT)</span>
                  <span className="text-base font-black text-sw-700">AED {pricing.totalPerSht}</span>
                </div>
              </div>

              {/* Volume */}
              {activeBand && (
                <div className={cn('px-5 py-2.5 text-xs font-semibold flex items-center gap-2',
                  activeBand.pct
                    ? 'bg-green-50 text-green-700 border-b border-green-100'
                    : 'bg-gray-50 text-gray-500 border-b border-gray-100')}>
                  {activeBand.pct ? '✓' : '→'}
                  <span>{activeBand.pct ? `${activeBand.pct} bulk discount (${activeBand.range} sht)` : 'Order 50+ for bulk discount'}</span>
                </div>
              )}

              {/* Trust */}
              <div className="px-5 py-4 space-y-2">
                {[
                  { icon: '🔒', text: `Price locked · ${deliveryStr}` },
                  { icon: '💳', text: 'LC · PDC · TT · Card accepted' },
                  { icon: '📋', text: 'TDS & certs on every order'    },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-gray-500">
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="px-5 pb-5">
                <button onClick={handleContinue}
                  className="w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all shadow-md text-sm bg-sw-500 hover:bg-sw-400 active:bg-sw-600 text-white">
                  Continue to Service Tier
                  <ChevronRight className="w-4 h-4" />
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-2">
                  Delivery by <span className="font-bold">{deliveryStr}</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading…</div>
      </div>
    }>
      <OrderDetailsContent />
    </Suspense>
  )
}
