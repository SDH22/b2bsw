export type Grade = 'NFR' | 'MR' | 'FR' | 'AC' | 'STD' | 'ULF' | 'ACS' | 'BB' | 'OSB3'
export type ProductCategory = 'chipboard' | 'mdf' | 'plywood' | 'osb'
export type ServiceTier = 'LITE' | 'VALUE' | 'CLASSIC' | 'TRADE_PLUS'

export interface ProductSpecs {
  density: number
  thickness: number
  size: string
  moisture: string
  surface: string
  edgeProfile: string
  formaldehyde: string
  fireClass: string
  internalBond: number
  mor: number
  moe: number
  screwWithdrawalFace: number
  thicknessSwelling: string
  performanceBars: {
    ib: number
    mor: number
    moe: number
    screw: number
    swell: number
  }
}

export interface Product {
  id: string
  skuCode: string
  grade: Grade
  category: ProductCategory
  thicknessMm: number
  widthMm: number
  heightMm: number
  densityKgM3: number
  nameEn: string
  nameAr?: string
  moq: number
  basePrice: number
  isActive: boolean
  specs: ProductSpecs
  certifications: string[]
  applications: string[]
  tdsRevision: number
  tdsIssueDate: string
  tdsDocumentUrl?: string
  tdsDocumentRef: string
  inventory?: {
    currentStock: number
    reservedStock: number
    availableStock: number
    status: 'in-stock' | 'low-stock' | 'out-of-stock'
  }
}

export interface PriceDisplay {
  basePrice: number
  deliveryCost: number
  subtotalPerSheet: number
  vatPerSheet: number
  totalPerSheet: number
  totalOrder: number
  finalTotal: number
  discount: number
  savedVsMaxZone: number
}

export const GRADE_LABELS: Record<Grade, string> = {
  NFR:  'NFR Standard',
  MR:   'MR Moisture Resistant',
  FR:   'FR Fire Retardant',
  AC:   'Acoustic',
  STD:  'STD Standard',
  ULF:  'ULF Ultra Low Formaldehyde',
  ACS:  'ACS Acoustic Perforated',
  BB:   'BB/CC Interior',
  OSB3: 'OSB/3 Structural',
}

export const GRADE_COLORS: Record<Grade, string> = {
  NFR:  'bg-gray-100 text-gray-800',
  MR:   'bg-blue-100 text-blue-800',
  FR:   'bg-red-100 text-red-800',
  AC:   'bg-purple-100 text-purple-800',
  STD:  'bg-stone-100 text-stone-800',
  ULF:  'bg-teal-100 text-teal-800',
  ACS:  'bg-violet-100 text-violet-800',
  BB:   'bg-amber-100 text-amber-800',
  OSB3: 'bg-orange-100 text-orange-800',
}

export const GRADE_ICONS: Record<Grade, string> = {
  NFR:  '🪵',
  MR:   '💧',
  FR:   '🔥',
  AC:   '🔇',
  STD:  '🪵',
  ULF:  '🌿',
  ACS:  '🎵',
  BB:   '🏗️',
  OSB3: '🏗️',
}

export const TIER_LABELS: Record<ServiceTier, string> = {
  LITE:       'LITE',
  VALUE:      'VALUE',
  CLASSIC:    'CLASSIC',
  TRADE_PLUS: 'TRADE PLUS',
}

export const THICKNESS_OPTIONS = [3, 4, 6, 9, 11, 12, 15, 16, 18, 22, 25, 30] as const
export const GRADE_OPTIONS: Grade[] = ['NFR', 'MR', 'FR', 'AC', 'STD', 'ULF', 'ACS', 'BB', 'OSB3']
export const QTY_OPTIONS = [50, 100, 200, 500] as const
