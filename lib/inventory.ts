import { prisma } from './prisma'
import { getCached, setCached, CACHE_TTL, redis } from './redis'

export interface StockInfo {
  currentStock: number
  reservedStock: number
  availableStock: number
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
  statusLabel: string
}

export function getStockStatus(available: number): StockInfo['status'] {
  if (available <= 0) return 'out-of-stock'
  if (available <= 50) return 'low-stock'
  return 'in-stock'
}

export async function getStockBySku(skuCode: string): Promise<StockInfo | null> {
  const cacheKey = `stock:${skuCode}`
  const cached = await getCached<StockInfo>(cacheKey)
  if (cached) return cached

  const product = await prisma.product.findUnique({
    where: { skuCode },
    include: { inventory: true },
  })

  if (!product?.inventory) return null

  const inv = product.inventory
  const available = inv.currentStock - inv.reservedStock
  const status = getStockStatus(available)

  const result: StockInfo = {
    currentStock: inv.currentStock,
    reservedStock: inv.reservedStock,
    availableStock: available,
    status,
    statusLabel:
      status === 'out-of-stock'
        ? 'Out of stock'
        : status === 'low-stock'
        ? `Only ${available} left`
        : `${available} sheets available`,
  }

  await setCached(cacheKey, result, CACHE_TTL.STOCK_LEVEL)
  return result
}

// Reserve stock when buyer enters checkout (30-min hold)
export async function reserveStock(productId: string, quantity: number): Promise<boolean> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { inventory: true },
  })

  if (!product?.inventory) return false

  const available = product.inventory.currentStock - product.inventory.reservedStock
  if (available < quantity) return false

  await prisma.inventory.update({
    where: { productId },
    data: { reservedStock: { increment: quantity } },
  })

  // Broadcast stock update via Redis
  await redis.publish(`stock:update:${product.skuCode}`, JSON.stringify({
    skuCode: product.skuCode,
    available: available - quantity,
  }))

  return true
}

// Release reservation on abandonment or expiry
export async function releaseStock(productId: string, quantity: number): Promise<void> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { skuCode: true, inventory: true },
  })

  if (!product?.inventory) return

  const newReserved = Math.max(0, product.inventory.reservedStock - quantity)
  await prisma.inventory.update({
    where: { productId },
    data: { reservedStock: newReserved },
  })
}

// Confirm stock deduction on order completion
export async function deductStock(productId: string, quantity: number): Promise<void> {
  await prisma.inventory.update({
    where: { productId },
    data: {
      currentStock: { decrement: quantity },
      reservedStock: { decrement: quantity },
      lastUpdated: new Date(),
    },
  })
}
