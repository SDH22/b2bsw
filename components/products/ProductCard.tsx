'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Clock } from 'lucide-react'
import { TDSPanel } from './TDSPanel'
import { cn, formatAED, getGradeBadgeClass } from '@/lib/utils'
import type { Product } from '@/types/product'

// Default zone for card-level price preview (user picks zone properly on order-details step)
const PREVIEW_ZONE     = 'al-quoz'
const PREVIEW_ZONE_COST = 6

interface ProductCardProps {
  product: Product
  deliveryCostPerSheet: number
  priceDelta?: number
  onAddToCart?: (product: Product, tier: string, qty: number) => void
}

export function ProductCard({ product, deliveryCostPerSheet, priceDelta = 0, onAddToCart }: ProductCardProps) {
  const router = useRouter()
  const qty = 100
  const [priceFlash] = useState(false)

  const available = (product.inventory?.currentStock ?? 0) - (product.inventory?.reservedStock ?? 0)
  void available

  // Use PREVIEW_ZONE_COST for card display; user picks their real zone in Step 1
  const sub = product.basePrice + priceDelta + PREVIEW_ZONE_COST
  const vat = Math.round(sub * 0.05 * 10) / 10
  const totalPerSheet = Math.round((sub + vat) * 10) / 10
  const totalOrder = Math.round(totalPerSheet * qty * 100) / 100
  const perM2 = Math.round((totalPerSheet / (2.44 * 1.22)) * 10) / 10

  const gradeBg = getGradeBadgeClass(product.grade)

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={cn('text-xs font-bold px-2 py-0.5 rounded', gradeBg)}>
                {product.grade}
              </span>
              <h3 className="font-bold text-gray-800 truncate">{product.nameEn}</h3>
              <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                <Clock className="w-3 h-3" />
                1-2 working days
              </span>
            </div>

            <div className="text-xs text-gray-500 mb-2 flex items-center gap-2 flex-wrap">
              <span>SKU: <span className="font-mono font-medium text-gray-700">{product.skuCode}</span></span>
              <span>{product.thicknessMm}mm · {product.widthMm}×{product.heightMm}mm · E1 · ρ{product.densityKgM3} kg/m³</span>
              {priceDelta < 0 && (
                <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                  ↓ AED {Math.abs(priceDelta)}/sht early-booking discount
                </span>
              )}
            </div>

            {/* BNPL badges */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="bg-pink-50 border border-pink-200 text-pink-700 px-2 py-0.5 rounded font-medium">tabby</span>
              <span className="bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded font-medium">tamara</span>
              <span>4 payments · 0% markup</span>
            </div>
          </div>

          {/* Price column */}
          <div className="flex-shrink-0 text-right">
            {/* Old price strikethrough (if deal) */}
            {product.grade === 'FR' && product.thicknessMm === 16 && (
              <div className="text-xs text-gray-400 line-through mb-0.5">AED 61/sht</div>
            )}

            <div className={cn(
              'text-3xl font-bold text-sw-700 transition-colors duration-300',
              priceFlash && 'text-sw-400'
            )}>
              AED {totalPerSheet}
            </div>
            <div className="text-xs text-gray-500">/sheet incl. VAT</div>
            <div className="text-xs text-gray-500 mt-0.5">AED {perM2}/m²</div>

            <div className="mt-1">
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                Pick zone at checkout →
              </span>
            </div>

            {/* Mini price breakdown */}
            <div className="mt-2 text-xs text-gray-500 space-y-0.5 text-right">
              <div>Base: AED {product.basePrice}</div>
              <div>Delivery: AED {deliveryCostPerSheet}</div>
              <div>VAT (5%): AED {vat}</div>
              <div className="font-semibold text-gray-700 border-t border-gray-200 pt-0.5">
                {qty} sheets: {formatAED(totalOrder)}
              </div>
            </div>
          </div>
        </div>

        {/* CTA row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            🔒 Price locked until Mar 21 · LC/PDC/TT accepted
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs text-gray-500 hover:text-sw-600 font-medium">Compare</button>
            <button className="text-xs text-gray-500 hover:text-sw-600 font-medium">Request quote</button>
            <button
              onClick={() => {
                if (onAddToCart) {
                  onAddToCart(product, 'VALUE', qty)
                } else {
                  // Send to Step 1 — user picks qty & zone properly before tier selection
                  router.push(
                    `/checkout/order-details?sku=${product.skuCode}&grade=${product.grade}&thickness=${product.thicknessMm}&zone=${PREVIEW_ZONE}&qty=${qty}`
                  )
                }
              }}
              className="flex items-center gap-1.5 bg-sw-500 hover:bg-sw-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* TDS Panel */}
      <TDSPanel product={product} />
    </div>
  )
}
