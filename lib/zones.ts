import { prisma } from './prisma'
import { getCached, setCached, CACHE_TTL } from './redis'

export interface ZoneOption {
  id: string
  name: string
  emirate: string
  leadTimeDays: number
  deliveryCost: Record<string, number>
  nearestBadge?: boolean
}

export async function getAllZones(): Promise<ZoneOption[]> {
  const cacheKey = 'zones:all'
  const cached = await getCached<ZoneOption[]>(cacheKey)
  if (cached) return cached

  const zones = await prisma.zone.findMany({
    where: { isActive: true },
    orderBy: { distanceKm: 'asc' },
  })

  const result: ZoneOption[] = zones.map((z, i) => ({
    id: z.id,
    name: z.name,
    emirate: z.emirate,
    leadTimeDays: z.leadTimeDays,
    deliveryCost: z.pricingTiers as Record<string, number>,
    nearestBadge: i === 0,
  }))

  await setCached(cacheKey, result, CACHE_TTL.ZONE_PRICING)
  return result
}

export async function getZoneById(id: string): Promise<ZoneOption | null> {
  const zones = await getAllZones()
  return zones.find((z) => z.id === id) ?? null
}

export async function getZoneByName(name: string): Promise<ZoneOption | null> {
  const zones = await getAllZones()
  return zones.find((z) => z.name.toLowerCase() === name.toLowerCase()) ?? null
}

export function getDeliveryCostForQty(pricingTiers: Record<string, number>, quantity: number): number {
  if (quantity < 50) return pricingTiers['1-49'] ?? 0
  if (quantity < 100) return pricingTiers['50-99'] ?? 0
  if (quantity < 200) return pricingTiers['100-199'] ?? 0
  if (quantity < 500) return pricingTiers['200-499'] ?? 0
  return pricingTiers['500+'] ?? 0
}

export function getLeadTimeLabel(leadTimeDays: number): string {
  if (leadTimeDays <= 1) return 'Same day / next day'
  if (leadTimeDays <= 2) return `${leadTimeDays} working days`
  return `${leadTimeDays} working days`
}
