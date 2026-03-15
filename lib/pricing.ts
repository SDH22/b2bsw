import Decimal from 'decimal.js'
import { prisma } from './prisma'
import { getCached, setCached, CACHE_TTL } from './redis'

Decimal.set({ precision: 10, rounding: Decimal.ROUND_HALF_UP })

export interface PriceCalculation {
  basePrice: number
  deliveryCost: number
  tierUplift: number
  subtotalPerSheet: number
  vatPerSheet: number
  totalPerSheet: number
  totalOrder: number
  discount: number
  convenienceFee: number
  finalTotal: number
  savedVsMaxZone: number
  vatAmount: number
  baseAmount: number
  deliveryAmount: number
  addonsAmount: number
}

export type ServiceTier = 'LITE' | 'VALUE' | 'CLASSIC' | 'TRADE_PLUS'

const TIER_DELIVERY_INCLUDED: Record<ServiceTier, boolean> = {
  LITE: false,
  VALUE: true,
  CLASSIC: true,
  TRADE_PLUS: true,
}

const TIER_CUTTING_INCLUDED: Record<ServiceTier, boolean> = {
  LITE: false,
  VALUE: false,
  CLASSIC: true,
  TRADE_PLUS: true,
}

const ADDON_PRICES = {
  cutting: 8,      // per sheet
  signed_tds: 50,  // per order (flat)
  wa_status: 0,    // included in VALUE+
}

const CONVENIENCE_FEE_RATE = 0.011 // 1.1% for card payments
const VAT_RATE = 0.05

function getQtyTierKey(quantity: number): string {
  if (quantity < 50) return '1-49'
  if (quantity < 100) return '50-99'
  if (quantity < 200) return '100-199'
  if (quantity < 500) return '200-499'
  return '500+'
}

async function getZonePricing(zoneId: string): Promise<Record<string, number>> {
  const cacheKey = `zone:pricing:${zoneId}`
  const cached = await getCached<Record<string, number>>(cacheKey)
  if (cached) return cached

  const zone = await prisma.zone.findUnique({ where: { id: zoneId } })
  if (!zone) throw new Error(`Zone ${zoneId} not found`)

  const tiers = zone.pricingTiers as Record<string, number>
  await setCached(cacheKey, tiers, CACHE_TTL.ZONE_PRICING)
  return tiers
}

async function getProductBasePrice(skuCode: string): Promise<number> {
  const cacheKey = `product:price:${skuCode}`
  const cached = await getCached<number>(cacheKey)
  if (cached !== null) return cached

  const product = await prisma.product.findUnique({
    where: { skuCode },
    select: { basePrice: true },
  })
  if (!product) throw new Error(`Product ${skuCode} not found`)

  const price = Number(product.basePrice)
  await setCached(cacheKey, price, CACHE_TTL.PRICE_INDEX)
  return price
}

export async function calculatePrice(params: {
  skuCode: string
  tier: ServiceTier
  zoneId: string
  quantity: number
  promoCode?: string
  addons?: string[]
  paymentMethod?: 'card' | 'pdc' | 'lc' | 'bnpl'
}): Promise<PriceCalculation> {
  const { skuCode, tier, zoneId, quantity, promoCode, addons = [], paymentMethod = 'card' } = params

  const basePrice = new Decimal(await getProductBasePrice(skuCode))
  const zoneTiers = await getZonePricing(zoneId)
  const tierKey = getQtyTierKey(quantity)
  const deliveryCostPerSheet = new Decimal(
    TIER_DELIVERY_INCLUDED[tier] ? (zoneTiers[tierKey] ?? 0) : 0
  )

  // Tier uplift (VALUE adds delivery, CLASSIC adds cutting)
  let tierUpliftPerSheet = new Decimal(0)
  if (TIER_CUTTING_INCLUDED[tier] && !addons.includes('cutting')) {
    tierUpliftPerSheet = tierUpliftPerSheet.plus(ADDON_PRICES.cutting)
  }

  const subtotalPerSheet = basePrice.plus(deliveryCostPerSheet).plus(tierUpliftPerSheet)
  const vatPerSheet = subtotalPerSheet.mul(VAT_RATE).toDecimalPlaces(2)
  const totalPerSheet = subtotalPerSheet.plus(vatPerSheet).toDecimalPlaces(1)

  // Order totals
  const baseAmount = basePrice.mul(quantity)
  const deliveryAmount = deliveryCostPerSheet.mul(quantity)

  // Addons
  let addonsAmount = new Decimal(0)
  if (addons.includes('cutting') && !TIER_CUTTING_INCLUDED[tier]) {
    addonsAmount = addonsAmount.plus(new Decimal(ADDON_PRICES.cutting).mul(quantity))
  }
  if (addons.includes('signed_tds')) {
    addonsAmount = addonsAmount.plus(ADDON_PRICES.signed_tds)
  }

  const subtotalOrder = baseAmount.plus(deliveryAmount).plus(addonsAmount)

  // Promo discount
  let discount = new Decimal(0)
  if (promoCode) {
    const promo = await prisma.promoCode.findFirst({
      where: { code: promoCode, isActive: true, validUntil: { gte: new Date() } },
    })
    if (promo) {
      if (promo.type === 'PERCENTAGE') {
        discount = subtotalOrder.mul(new Decimal(promo.value.toString()).div(100)).toDecimalPlaces(2)
      } else if (promo.type === 'FIXED') {
        discount = new Decimal(promo.value.toString())
      } else if (promo.type === 'FREE_DELIVERY') {
        discount = deliveryAmount
      }
    }
  }

  const afterDiscount = subtotalOrder.minus(discount)
  const vatAmount = afterDiscount.mul(VAT_RATE).toDecimalPlaces(2)
  const beforeFee = afterDiscount.plus(vatAmount)

  // Convenience fee only for card
  const convenienceFee = ['card'].includes(paymentMethod)
    ? beforeFee.mul(CONVENIENCE_FEE_RATE).toDecimalPlaces(2)
    : new Decimal(0)

  const finalTotal = beforeFee.plus(convenienceFee).toDecimalPlaces(2)

  // Max zone delivery cost for "saves" badge
  const maxZoneDeliveryCost = new Decimal(40) // Fujairah Port base
  const savedVsMaxZone = TIER_DELIVERY_INCLUDED[tier]
    ? maxZoneDeliveryCost.minus(deliveryCostPerSheet).toNumber()
    : 0

  return {
    basePrice: basePrice.toNumber(),
    deliveryCost: deliveryCostPerSheet.toNumber(),
    tierUplift: tierUpliftPerSheet.toNumber(),
    subtotalPerSheet: subtotalPerSheet.toNumber(),
    vatPerSheet: vatPerSheet.toNumber(),
    totalPerSheet: totalPerSheet.toNumber(),
    totalOrder: beforeFee.toNumber(),
    discount: discount.toNumber(),
    convenienceFee: convenienceFee.toNumber(),
    finalTotal: finalTotal.toNumber(),
    savedVsMaxZone,
    vatAmount: vatAmount.toNumber(),
    baseAmount: baseAmount.toNumber(),
    deliveryAmount: deliveryAmount.toNumber(),
    addonsAmount: addonsAmount.toNumber(),
  }
}

// Quick price estimate (no DB, uses passed-in values)
export function estimatePrice(
  basePrice: number,
  deliveryCostPerSheet: number,
  quantity: number,
  tierIncludesDelivery: boolean
): { perSheet: number; total: number } {
  const bp = new Decimal(basePrice)
  const del = tierIncludesDelivery ? new Decimal(deliveryCostPerSheet) : new Decimal(0)
  const sub = bp.plus(del)
  const vat = sub.mul(VAT_RATE).toDecimalPlaces(2)
  const perSheet = sub.plus(vat).toDecimalPlaces(1).toNumber()
  const total = new Decimal(perSheet).mul(quantity).toDecimalPlaces(2).toNumber()
  return { perSheet, total }
}

// Price index data for homepage strip
export async function getPriceIndex() {
  const cacheKey = 'price:index'
  const cached = await getCached<unknown[]>(cacheKey)
  if (cached) return cached

  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { inventory: true },
    orderBy: [{ grade: 'asc' }, { thicknessMm: 'asc' }],
  })

  const index = [
    { label: 'MR 18mm', price: 38, trend: 'stable', note: '' },
    { label: 'NFR 12mm', price: 30, trend: 'down', note: '' },
    { label: 'FR 18mm', price: 61, trend: 'up', note: 'revision Apr' },
    { label: 'Acoustic', price: 85, trend: 'stable', note: '' },
    {
      label: 'Stock Alert',
      price: 0,
      trend: 'alert',
      note: `FR ${products.find((p: { grade: string; thicknessMm: number; inventory?: { currentStock: number } | null }) => p.grade === 'FR' && p.thicknessMm === 18)?.inventory?.currentStock ?? 38} sheets`,
    },
    { label: 'Best Deal', price: 34, trend: 'deal', note: 'NFR 12mm delivered' },
  ]

  await setCached(cacheKey, index, CACHE_TTL.PRICE_INDEX)
  return index
}
