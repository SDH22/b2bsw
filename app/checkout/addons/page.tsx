'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, ChevronDown } from 'lucide-react'
import { StepNav } from '@/components/checkout/StepNav'
import { ContinueBar } from '@/components/checkout/ContinueBar'
import { cn } from '@/lib/utils'

const ADDONS = [
  {
    id: 'cutting',
    icon: '✂️',
    title: 'Factory Cut-to-Size',
    description: 'CNC precision cutting at our JAFZA factory. Panels cut to your exact specifications, ready for immediate installation.',
    price: 8,
    unit: '/sheet',
    alwaysIncluded: false,
    includedIn: ['CLASSIC', 'TRADE_PLUS'],
  },
  {
    id: 'wa_status',
    icon: '💬',
    title: 'WhatsApp Order Status',
    description: 'Receive real-time order updates via WhatsApp — production start, dispatch notification, and delivery confirmation.',
    price: 0,
    unit: '— included',
    alwaysIncluded: false,
    includedIn: ['VALUE', 'CLASSIC', 'TRADE_PLUS'],
  },
  {
    id: 'signed_tds',
    icon: '📋',
    title: 'Signed TDS on Official Letterhead',
    description: 'Original signed Technical Data Sheet on Steel Wood Industries official letterhead. Required for Civil Defence, Estidama, and LEED submissions.',
    price: 50,
    unit: '/order',
    alwaysIncluded: false,
    includedIn: [],
  },
]

function AddonsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tier      = searchParams.get('tier')      || 'VALUE'
  const qty       = Number(searchParams.get('qty') || 100)
  const sku       = searchParams.get('sku')        || 'SW-MR-18-2440'
  const grade     = searchParams.get('grade')      || 'MR'
  const thickness = searchParams.get('thickness')  || '18'
  const zone      = searchParams.get('zone')       || 'al-quoz'
  const priceLock = searchParams.get('priceLock')  || 'true'

  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id])
  }

  const baseTotal = (() => {
    const BASE_PRICES: Record<string, number> = { NFR: 30, MR: 38, FR: 61, AC: 85 }
    const ZONE_COSTS:  Record<string, number> = { 'jebel-ali': 4, 'al-quoz': 6, 'sharjah': 9, 'abu-dhabi': 22, 'al-ain': 28 }
    const base = (BASE_PRICES[grade] ?? 38) * qty
    const delivery = tier !== 'LITE' ? (ZONE_COSTS[zone] ?? 6) * qty : 0
    const addonsTotal = (selectedAddons.includes('cutting') && !['CLASSIC', 'TRADE_PLUS'].includes(tier) ? 8 * qty : 0)
      + (selectedAddons.includes('signed_tds') ? 50 : 0)
    const sub = base + delivery + addonsTotal
    return Math.round((sub + sub * 0.05) * 100) / 100
  })()

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <StepNav currentStep={5} />

      <div className="max-w-3xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Add-on Services</h2>
        <p className="text-sm text-gray-500 mb-6">Enhance your order with optional services</p>

        <div className="space-y-4">
          {ADDONS.map((addon) => {
            const isIncluded = addon.includedIn.includes(tier)
            const isSelected = selectedAddons.includes(addon.id)
            const isExpanded = expandedId === addon.id

            return (
              <div
                key={addon.id}
                className={cn(
                  'bg-white rounded-xl border overflow-hidden transition-all',
                  isIncluded ? 'border-green-200' : isSelected ? 'border-sw-400' : 'border-gray-200'
                )}
              >
                <div className="p-4 flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{addon.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-800">{addon.title}</span>
                      {isIncluded && (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          ✓ Included in {tier}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{addon.description}</p>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : addon.id)}
                      className="text-xs text-sw-500 flex items-center gap-1 hover:underline"
                    >
                      View Details <ChevronDown className={cn('w-3 h-3 transition-transform', isExpanded && 'rotate-180')} />
                    </button>
                    {isExpanded && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                        {addon.id === 'cutting' && 'CNC precision to ±1mm tolerance. Maximum panel size 2440×1220mm. Minimum cut size 100×100mm. Cutting layout plan required for orders above 50 sheets.'}
                        {addon.id === 'wa_status' && 'WhatsApp messages sent to the number registered on your order. Messages include: order confirmation, production start, dispatch with driver contact, and delivery confirmation.'}
                        {addon.id === 'signed_tds' && 'Original document with wet signature and company stamp. Suitable for Civil Defence permit applications, Estidama submissions, and LEED documentation packages.'}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="font-bold text-gray-800 mb-2">
                      {addon.price === 0 ? <span className="text-green-600">FREE</span> : `AED ${addon.price}`}
                      <span className="text-xs font-normal text-gray-500 ml-1">{addon.unit}</span>
                    </div>
                    {isIncluded ? (
                      <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                        <Check className="w-4 h-4" /> Included
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleAddon(addon.id)}
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm font-bold transition-all border',
                          isSelected
                            ? 'bg-sw-500 text-white border-sw-500'
                            : 'border-gray-200 text-gray-700 hover:border-sw-400 hover:bg-sw-50'
                        )}
                      >
                        {isSelected ? '✓ Added' : 'ADD'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <ContinueBar
        label={`${selectedAddons.length} add-on${selectedAddons.length !== 1 ? 's' : ''} selected`}
        total={baseTotal}
        qty={qty}
        onContinue={() => router.push(`/checkout/company?sku=${sku}&grade=${grade}&thickness=${thickness}&zone=${zone}&tier=${tier}&qty=${qty}&priceLock=${priceLock}&addons=${selectedAddons.join(',')}`)}
      />
    </div>
  )
}

export default function AddonsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
      <AddonsPageContent />
    </Suspense>
  )
}
