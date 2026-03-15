'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertTriangle, Check, Shield } from 'lucide-react'
import { StepNav } from '@/components/checkout/StepNav'
import { ContinueBar } from '@/components/checkout/ContinueBar'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { cn } from '@/lib/utils'

function ReviewPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const qty       = Number(searchParams.get('qty')   || 100)
  const tier      = searchParams.get('tier')          || 'VALUE'
  const sku       = searchParams.get('sku')           || 'SW-MR-18-2440'
  const grade     = searchParams.get('grade')         || 'MR'
  const thickness = searchParams.get('thickness')     || '18'
  const zone      = searchParams.get('zone')          || 'al-quoz'
  const [priceLock, setPriceLock] = useState(true)
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)

  const BASE_PRICES: Record<string, number> = { NFR: 30, MR: 38, FR: 61, AC: 85 }
  const ZONE_COSTS:  Record<string, number> = { 'jebel-ali': 4, 'al-quoz': 6, 'sharjah': 9, 'abu-dhabi': 22, 'al-ain': 28 }
  const ZONE_NAMES:  Record<string, string> = { 'jebel-ali': 'Jebel Ali', 'al-quoz': 'Al Quoz', 'sharjah': 'Sharjah', 'abu-dhabi': 'Abu Dhabi', 'al-ain': 'Al Ain' }
  const basePSht = BASE_PRICES[grade] ?? 38
  const zonePSht = ZONE_COSTS[zone]   ?? 6
  const baseAmount     = basePSht * qty
  const deliveryAmount = tier !== 'LITE' ? zonePSht * qty : 0
  const priceLockFee = priceLock ? 110 : 0
  const discount = appliedPromo === 'BULK100' ? 100 : 0
  const sub = baseAmount + deliveryAmount + priceLockFee - discount
  const vat = Math.round(sub * 0.05 * 100) / 100
  const total = sub + vat

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <StepNav currentStep={3} />

      <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6">
        {/* Main */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Order detail block */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-800">Review Your Order</div>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
              {[
                ['Dispatch Date', 'Within 2 days'],
                ['Lead Time', '1–2 working days'],
                ['Service Tier', tier],
                ['Quantity', `${qty} sheets`],
                ['Grade', `${grade} · ${thickness}mm`],
                ['Delivery Zone', ZONE_NAMES[zone] || zone],
              ].map(([label, value]) => (
                <div key={label} className="px-4 py-3">
                  <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                  <div className={cn(
                    'font-semibold text-sm',
                    label === 'Service Tier' ? 'text-sw-700' : 'text-gray-800'
                  )}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
              SKU: <span className="font-mono font-medium">{sku}</span> · MR Chipboard 18mm · 2440×1220mm · E1
            </div>
          </div>

          {/* Important banners */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <strong>Important:</strong> Ensure your delivery address matches your trade licence. For orders above AED 10,000, LC/PDC payment required. VAT invoice will be issued to your registered company TRN.
            </div>
          </div>

          {/* Price Lock Upsell */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-sw-500" /> Price Protection Options
            </div>

            {/* Recommended — price lock */}
            <div
              onClick={() => setPriceLock(true)}
              className={cn(
                'p-4 border-l-4 cursor-pointer hover:bg-green-50 transition-colors',
                priceLock ? 'border-green-500 bg-green-50' : 'border-transparent'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-800">Price Lock</span>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Recommended</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">AED 110 <span className="text-sm font-normal text-gray-500">/ order</span></div>
                </div>
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  priceLock ? 'border-green-500 bg-green-500' : 'border-gray-300'
                )}>
                  {priceLock && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                {[
                  '✓ Raw material spike protection',
                  '✓ Production shift coverage',
                  '✓ Demand surge protection',
                  '✓ Currency rate protection',
                  '✓ Freight cost coverage',
                  '✓ And more ↗',
                ].map((item) => (
                  <div key={item} className="text-xs text-green-700 font-medium">{item}</div>
                ))}
              </div>
            </div>

            {/* No price lock */}
            <div
              onClick={() => setPriceLock(false)}
              className={cn(
                'p-4 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors border-t border-gray-100',
                !priceLock ? 'border-gray-400 bg-gray-50' : 'border-transparent'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="opacity-60">
                  <div className="font-semibold text-gray-700 mb-0.5">Continue without price lock</div>
                  <div className="text-xs text-gray-500">⚠ Price valid until Mar 21 only — subject to April revision</div>
                </div>
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  !priceLock ? 'border-gray-500 bg-gray-500' : 'border-gray-300'
                )}>
                  {!priceLock && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 hidden lg:block space-y-4">
          <OrderSummary
            baseAmount={baseAmount}
            deliveryAmount={deliveryAmount}
            addonsAmount={priceLockFee}
            vatAmount={vat}
            discount={discount}
            convenienceFee={0}
            total={total}
            promoCode={appliedPromo ?? undefined}
          />

          {/* Promo code */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="font-semibold text-gray-800 mb-2 text-sm">Promo Code</div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sw-500"
              />
              <button
                onClick={() => { if (['BULK100','BULKPAY','SWWALLET'].includes(promoCode)) setAppliedPromo(promoCode) }}
                className="bg-sw-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-sw-600 transition-colors"
              >
                Apply
              </button>
            </div>
            {appliedPromo && (
              <div className="text-xs text-green-600 mt-1 font-medium">✓ Promo {appliedPromo} applied</div>
            )}
            <div className="text-xs text-gray-400 mt-2">Try: BULK100 · BULKPAY · SWWALLET</div>
          </div>
        </div>
      </div>

      <ContinueBar
        label="Order Review Complete"
        total={total}
        qty={qty}
        onContinue={() => router.push(`/checkout/addons?sku=${sku}&grade=${grade}&thickness=${thickness}&zone=${zone}&tier=${tier}&qty=${qty}&priceLock=${priceLock}`)}
      />
    </div>
  )
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
      <ReviewPageContent />
    </Suspense>
  )
}
