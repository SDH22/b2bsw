'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, X, Minus, Plus } from 'lucide-react'
import { StepNav } from '@/components/checkout/StepNav'
import { ContinueBar } from '@/components/checkout/ContinueBar'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { cn } from '@/lib/utils'

/* ── Pricing helpers ──────────────────────────────────────────── */
const BASE_PRICES: Record<string, number> = { NFR: 30, MR: 38, FR: 61, AC: 85 }
const ZONE_COSTS:  Record<string, number> = {
  'jebel-ali': 4, 'al-quoz': 6, 'sharjah': 9, 'abu-dhabi': 22, 'al-ain': 28,
}
const GRADE_BADGES: Record<string, string> = {
  MR: 'bg-blue-100 text-blue-800', FR: 'bg-red-100 text-red-800',
  NFR: 'bg-gray-100 text-gray-800', AC: 'bg-purple-100 text-purple-800',
}
const ZONE_NAMES: Record<string, string> = {
  'jebel-ali': 'Jebel Ali', 'al-quoz': 'Al Quoz',
  'sharjah': 'Sharjah', 'abu-dhabi': 'Abu Dhabi', 'al-ain': 'Al Ain',
}

/* ── Tier definitions ─────────────────────────────────────────── */
const TIER_KEYS = ['LITE', 'VALUE', 'CLASSIC', 'TRADE_PLUS'] as const
type TierKey = typeof TIER_KEYS[number]

const TIER_META: Record<TierKey, {
  name: string; label: string; deliveryMult: number; cuttingAdd: number; premiumAdd: number;
  popular?: boolean; color: string;
  features: Record<string, boolean | string>
}> = {
  LITE: {
    name: 'LITE', label: 'Ex-factory', deliveryMult: 0, cuttingAdd: 0, premiumAdd: 0,
    color: 'border-gray-200',
    features: { delivery: false, cutting: false, tds: true, priceLock: 'chargeable', whatsapp: 'chargeable', accountMgr: false, splitPDC: 'chargeable' },
  },
  VALUE: {
    name: 'VALUE', label: '+ Delivery', deliveryMult: 1, cuttingAdd: 0, premiumAdd: 0,
    popular: true, color: 'border-sw-500 ring-2 ring-sw-200',
    features: { delivery: true, cutting: false, tds: true, priceLock: 'chargeable', whatsapp: true, accountMgr: false, splitPDC: true },
  },
  CLASSIC: {
    name: 'CLASSIC', label: '+ Cut', deliveryMult: 1, cuttingAdd: 8, premiumAdd: 0,
    color: 'border-gray-200',
    features: { delivery: true, cutting: true, tds: true, priceLock: true, whatsapp: true, accountMgr: false, splitPDC: true },
  },
  TRADE_PLUS: {
    name: 'TRADE PLUS', label: 'Full service', deliveryMult: 1, cuttingAdd: 8, premiumAdd: 6,
    color: 'border-gray-200',
    features: { delivery: true, cutting: true, tds: true, priceLock: true, whatsapp: true, accountMgr: true, splitPDC: true },
  },
}

const FEATURE_ROWS = [
  { key: 'delivery',   label: 'Delivery to site' },
  { key: 'cutting',    label: 'Cut to size' },
  { key: 'tds',        label: 'TDS + Certs' },
  { key: 'priceLock',  label: 'Price lock 30d' },
  { key: 'whatsapp',   label: 'WhatsApp status' },
  { key: 'accountMgr', label: 'Account manager' },
  { key: 'splitPDC',   label: 'Split PDC' },
]

function FeatureCell({ value }: { value: boolean | string }) {
  if (value === true)  return <Check className="w-4 h-4 text-green-600 mx-auto" />
  if (value === false) return <X className="w-4 h-4 text-red-400 mx-auto" />
  return <span className="text-amber-600 font-semibold text-xs">Chargeable</span>
}

/* ── Page ─────────────────────────────────────────────────────── */
function TierPageContent() {
  const router = useRouter()
  const sp     = useSearchParams()

  const sku       = sp.get('sku')       || 'SW-MR-18-2440'
  const grade     = sp.get('grade')     || 'MR'
  const thickness = sp.get('thickness') || '18'
  const zone      = sp.get('zone')      || 'al-quoz'

  const [qty, setQty]               = useState(Number(sp.get('qty') || 100))
  const [selectedTier, setTier]     = useState<TierKey>('VALUE')

  /* live pricing */
  const basePSht    = BASE_PRICES[grade]         ?? 38
  const zonePSht    = ZONE_COSTS[zone]           ?? 6
  const tierMeta    = TIER_META[selectedTier]
  const tierPSht    = basePSht
    + tierMeta.deliveryMult * zonePSht
    + tierMeta.cuttingAdd
    + tierMeta.premiumAdd
  const baseAmt     = basePSht * qty
  const deliveryAmt = tierMeta.deliveryMult * zonePSht * qty
  const addonAmt    = (tierMeta.cuttingAdd + tierMeta.premiumAdd) * qty
  const sub         = baseAmt + deliveryAmt + addonAmt
  const vat         = Math.round(sub * 0.05 * 100) / 100
  const total       = sub + vat

  /* dynamic tier price/sht for each column */
  function tierPricePerSht(key: TierKey) {
    const m = TIER_META[key]
    return basePSht + m.deliveryMult * zonePSht + m.cuttingAdd + m.premiumAdd
  }

  const step = qty >= 100 ? 50 : qty >= 10 ? 10 : 1
  const gradeBadge = GRADE_BADGES[grade] ?? 'bg-gray-100 text-gray-800'

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <StepNav currentStep={2} />

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* ── Order summary bar ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full', gradeBadge)}>
              {grade}
            </span>
            <span className="font-semibold text-gray-800">
              {grade} Chipboard {thickness}mm
            </span>
            <span className="text-gray-300">→</span>
            <span className="text-gray-600">{ZONE_NAMES[zone] || zone}</span>
            <span className="text-gray-300">·</span>
            <span className="font-mono text-xs text-gray-500">{sku}</span>

            <div className="flex items-center gap-0.5 ml-auto">
              <span className="text-xs text-gray-500 mr-2 font-medium">Qty:</span>
              <button
                onClick={() => setQty((q) => Math.max(1, q - step))}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-sw-400 hover:bg-sw-50 transition-all"
              >
                <Minus className="w-3 h-3" />
              </button>
              <input
                type="number"
                min="1"
                max="9999"
                value={qty}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10)
                  if (!isNaN(n) && n > 0) setQty(Math.min(n, 9999))
                }}
                className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-center text-sm font-bold focus:outline-none focus:border-sw-500 mx-1"
              />
              <button
                onClick={() => setQty((q) => Math.min(9999, q + step))}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-sw-400 hover:bg-sw-50 transition-all"
              >
                <Plus className="w-3 h-3" />
              </button>
              <span className="text-xs text-gray-500 ml-1.5">sheets</span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-green-700 font-medium">847 in stock</span>
              <span className="font-bold text-sw-700">
                AED {(tierPSht * qty).toLocaleString()} est.
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* ── Tier selector ── */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Select Service Tier</h2>

            {/* Tier cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {TIER_KEYS.map((key) => {
                const m    = TIER_META[key]
                const psht = tierPricePerSht(key)
                return (
                  <button
                    key={key}
                    onClick={() => setTier(key)}
                    className={cn(
                      'border-2 rounded-2xl p-4 text-left transition-all relative',
                      selectedTier === key ? m.color : 'border-gray-200 hover:border-sw-300'
                    )}
                  >
                    {m.popular && (
                      <span className="absolute -top-2.5 left-3 bg-sw-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        ★ Most Popular
                      </span>
                    )}
                    <div className={cn('font-bold text-sm mb-0.5', selectedTier === key ? 'text-sw-700' : 'text-gray-800')}>
                      {m.name}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">{m.label}</div>
                    <div className="text-2xl font-black text-gray-800">AED {psht}</div>
                    <div className="text-xs text-gray-400">/sheet incl. delivery</div>
                    <div className="text-xs font-semibold text-sw-600 mt-1">
                      = AED {(psht * qty).toLocaleString()} excl. VAT
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Feature table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left p-3 text-gray-400 font-semibold w-36 text-xs uppercase tracking-wider">Feature</th>
                    {TIER_KEYS.map((key) => (
                      <th
                        key={key}
                        className={cn(
                          'p-3 text-center font-bold text-xs',
                          selectedTier === key ? 'text-sw-700 bg-sw-50' : 'text-gray-500'
                        )}
                      >
                        {TIER_META[key].name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_ROWS.map((row) => (
                    <tr key={row.key} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="p-3 text-gray-600 text-xs font-medium">{row.label}</td>
                      {TIER_KEYS.map((key) => (
                        <td key={key} className={cn('p-3 text-center', selectedTier === key && 'bg-sw-50')}>
                          <FeatureCell value={(TIER_META[key].features as Record<string, boolean | string>)[row.key]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-gray-50/80 font-semibold border-t-2 border-gray-200">
                    <td className="p-3 text-gray-700 text-xs uppercase tracking-wider">Price/sheet</td>
                    {TIER_KEYS.map((key) => (
                      <td
                        key={key}
                        className={cn(
                          'p-3 text-center text-sm font-black',
                          selectedTier === key ? 'bg-sw-100 text-sw-700' : 'text-gray-600'
                        )}
                      >
                        AED {tierPricePerSht(key)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <div className="px-4 py-2.5 bg-gray-50 text-xs text-gray-400 border-t border-gray-100">
                <span className="text-green-600 font-semibold">✓ Included</span>
                {' · '}
                <span className="text-red-400 font-semibold">✕ Excluded</span>
                {' · '}
                <span className="text-amber-600 font-semibold">Chargeable add-on</span>
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="w-72 flex-shrink-0 hidden lg:block">
            <OrderSummary
              baseAmount={baseAmt}
              deliveryAmount={deliveryAmt}
              addonsAmount={addonAmt}
              vatAmount={vat}
              discount={0}
              convenienceFee={0}
              total={total}
            />
          </div>
        </div>
      </div>

      <ContinueBar
        label={`Tier: ${tierMeta.name} · ${tierMeta.label}`}
        total={total}
        qty={qty}
        onContinue={() =>
          router.push(
            `/checkout/review?sku=${sku}&grade=${grade}&thickness=${thickness}&zone=${zone}&tier=${selectedTier}&qty=${qty}`
          )
        }
      />
    </div>
  )
}

export default function TierPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Loading…</div>
        </div>
      }
    >
      <TierPageContent />
    </Suspense>
  )
}
