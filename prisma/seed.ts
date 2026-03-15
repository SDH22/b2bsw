import 'dotenv/config'
import { PrismaClient, Grade, Emirate, Industry, CompanyStatus, UserRole } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pool = new Pool({ connectionString: process.env.DATABASE_URL }) as any
const adapter = new PrismaPg(pool)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any)

// ─── Zone Data ───────────────────────────────────────────────────────────────

const ZONES = [
  { name: 'Jebel Ali', emirate: Emirate.DUBAI, distanceKm: 5, leadTimeDays: 1, pricingTiers: { '1-49': 6, '50-99': 4, '100-199': 3, '200-499': 2, '500+': 1.5 } },
  { name: 'Al Quoz', emirate: Emirate.DUBAI, distanceKm: 15, leadTimeDays: 1, pricingTiers: { '1-49': 9, '50-99': 6, '100-199': 5, '200-499': 4, '500+': 3 } },
  { name: 'Business Bay', emirate: Emirate.DUBAI, distanceKm: 22, leadTimeDays: 1, pricingTiers: { '1-49': 10, '50-99': 7, '100-199': 6, '200-499': 5, '500+': 4 } },
  { name: 'Sharjah Industrial', emirate: Emirate.SHARJAH, distanceKm: 35, leadTimeDays: 1, pricingTiers: { '1-49': 12, '50-99': 9, '100-199': 7, '200-499': 6, '500+': 5 } },
  { name: 'Ajman', emirate: Emirate.AJMAN, distanceKm: 48, leadTimeDays: 2, pricingTiers: { '1-49': 14, '50-99': 11, '100-199': 9, '200-499': 7, '500+': 6 } },
  { name: 'RAK', emirate: Emirate.RAK, distanceKm: 110, leadTimeDays: 2, pricingTiers: { '1-49': 18, '50-99': 14, '100-199': 11, '200-499': 9, '500+': 7 } },
  { name: 'Mussafah AD', emirate: Emirate.ABU_DHABI, distanceKm: 140, leadTimeDays: 2, pricingTiers: { '1-49': 22, '50-99': 18, '100-199': 15, '200-499': 12, '500+': 10 } },
  { name: 'Abu Dhabi City', emirate: Emirate.ABU_DHABI, distanceKm: 160, leadTimeDays: 2, pricingTiers: { '1-49': 26, '50-99': 22, '100-199': 18, '200-499': 15, '500+': 12 } },
  { name: 'Al Ain', emirate: Emirate.ABU_DHABI, distanceKm: 200, leadTimeDays: 3, pricingTiers: { '1-49': 32, '50-99': 28, '100-199': 22, '200-499': 18, '500+': 15 } },
  { name: 'Fujairah Port', emirate: Emirate.FUJAIRAH, distanceKm: 240, leadTimeDays: 3, pricingTiers: { '1-49': 40, '50-99': 35, '100-199': 28, '200-499': 22, '500+': 18 } },
]

// ─── SKU Data ─────────────────────────────────────────────────────────────────

interface SKUDef {
  grade: Grade
  thicknessMm: number
  basePrice: number
  densityKgM3: number
  stock: number
  certifications: string[]
  applications: string[]
  specs: Record<string, unknown>
}

function buildSKUs(): SKUDef[] {
  const skus: SKUDef[] = []

  const config: { grade: Grade; thicknesses: number[]; basePrice: (t: number) => number; density: number; certs: string[]; apps: string[]; stock: (t: number) => number }[] = [
    {
      grade: Grade.NFR,
      thicknesses: [9, 12, 16, 18, 25],
      basePrice: (t) => ({ 9: 26, 12: 30, 16: 34, 18: 36, 25: 44 }[t] ?? 30),
      density: 640,
      certs: ['ISO 9001', 'EN 312 P2', 'E1 Formaldehyde'],
      apps: ['Kitchen carcass', 'Wardrobe carcass', 'Office furniture', 'Shelving'],
      stock: (t) => ({ 9: 500, 12: 1240, 16: 380, 18: 320, 25: 190 }[t] ?? 200),
    },
    {
      grade: Grade.MR,
      thicknesses: [9, 12, 16, 18, 25],
      basePrice: (t) => ({ 9: 30, 12: 34, 16: 38, 18: 38, 25: 48 }[t] ?? 34),
      density: 660,
      certs: ['ISO 9001', 'EN 312 P3', 'E1 Formaldehyde', 'ISO 14001'],
      apps: ['Kitchen carcass', 'Bathroom vanities', 'Wet area joinery', 'Hotel furniture', 'Marine applications'],
      stock: (t) => ({ 9: 420, 12: 680, 16: 520, 18: 847, 25: 220 }[t] ?? 300),
    },
    {
      grade: Grade.FR,
      thicknesses: [12, 16, 18, 25],
      basePrice: (t) => ({ 12: 52, 16: 56, 18: 61, 25: 74 }[t] ?? 56),
      density: 680,
      certs: ['ISO 9001', 'EN 13501-1 Class B', 'DCD Approved', 'ESMA Certified', 'E1 Formaldehyde'],
      apps: ['Hotel corridors', 'Civil Defence compliant joinery', 'Healthcare facilities', 'Educational buildings', 'High-rise residential'],
      stock: (t) => ({ 12: 150, 16: 95, 18: 38, 25: 60 }[t] ?? 80),
    },
    {
      grade: Grade.AC,
      thicknesses: [12, 16, 18, 25],
      basePrice: (t) => ({ 12: 72, 16: 78, 18: 85, 25: 98 }[t] ?? 78),
      density: 700,
      certs: ['ISO 9001', 'ISO 14001', 'ESMA Certified', 'E1 Formaldehyde'],
      apps: ['Recording studios', 'Home theatre', 'Conference rooms', 'Hotel rooms', 'Acoustic ceiling panels'],
      stock: (t) => ({ 12: 120, 16: 95, 18: 200, 25: 80 }[t] ?? 100),
    },
  ]

  for (const c of config) {
    for (const t of c.thicknesses) {
      skus.push({
        grade: c.grade,
        thicknessMm: t,
        basePrice: c.basePrice(t),
        densityKgM3: c.density,
        stock: c.stock(t),
        certifications: c.certs,
        applications: c.apps,
        specs: {
          density: c.density,
          thickness: t,
          size: '2440 × 1220 mm',
          moisture: c.grade === Grade.MR ? '≤ 10%' : '≤ 13%',
          surface: 'Sanded both sides',
          edgeProfile: 'Square edge',
          formaldehyde: 'E1 (≤ 0.1 ppm)',
          fireClass: c.grade === Grade.FR ? 'B-s1,d0' : 'D-s2,d0',
          internalBond: c.grade === Grade.FR ? 0.45 : c.grade === Grade.MR ? 0.40 : 0.35,
          mor: c.grade === Grade.FR ? 15.5 : c.grade === Grade.MR ? 14.0 : 12.5,
          moe: c.grade === Grade.FR ? 2200 : c.grade === Grade.MR ? 2000 : 1800,
          screwWithdrawalFace: c.grade === Grade.FR ? 1350 : 1200,
          thicknessSwelling: c.grade === Grade.MR ? '≤ 10%' : '≤ 14%',
          performanceBars: {
            ib: c.grade === Grade.FR ? 90 : c.grade === Grade.MR ? 80 : 70,
            mor: c.grade === Grade.FR ? 85 : c.grade === Grade.MR ? 75 : 65,
            moe: c.grade === Grade.FR ? 88 : c.grade === Grade.MR ? 78 : 68,
            screw: c.grade === Grade.FR ? 92 : c.grade === Grade.MR ? 82 : 72,
            swell: c.grade === Grade.MR ? 95 : 75,
          },
        },
      })
    }
  }

  return skus
}

// ─── Deals Data ───────────────────────────────────────────────────────────────

const DEALS = [
  {
    position: 1,
    typeTag: 'HOT DEAL',
    gradientFrom: '#7f1d1d',
    gradientTo: '#450a0a',
    emoji: '🔥',
    titleEn: 'MR 18mm Bulk Deal',
    description: '500+ sheets at AED 34/sheet delivered to Dubai zones',
    pricingText: 'Save AED 8/sheet',
    ctaText: 'Grab Deal',
    ctaLink: '/products?grade=MR&thickness=18&qty=500',
    isActive: true,
  },
  {
    position: 2,
    typeTag: 'PRICE LOCK',
    gradientFrom: '#1e3a5f',
    gradientTo: '#0f2318',
    emoji: '🔒',
    titleEn: 'Lock April Price Now',
    description: 'Secure current MR & NFR prices for 30 days before April revision',
    pricingText: 'AED 110 price lock fee',
    ctaText: 'Lock Price',
    ctaLink: '/checkout/review?priceLock=true',
    isActive: true,
  },
  {
    position: 3,
    typeTag: 'NEW',
    gradientFrom: '#14532d',
    gradientTo: '#052e16',
    emoji: '✨',
    titleEn: 'FR Acoustic Combo',
    description: 'Fire-retardant acoustic boards for hotels — dual compliance',
    pricingText: 'From AED 85/sheet',
    ctaText: 'View Specs',
    ctaLink: '/products?grade=AC',
    isActive: true,
  },
  {
    position: 4,
    typeTag: 'BULK OFFER',
    gradientFrom: '#713f12',
    gradientTo: '#431407',
    emoji: '📦',
    titleEn: '100+ Sheets Free Delivery',
    description: 'Order 100+ sheets to any Dubai zone, delivery included',
    pricingText: 'Save up to AED 6/sheet',
    ctaText: 'Order Now',
    ctaLink: '/products?minQty=100',
    isActive: true,
  },
  {
    position: 5,
    typeTag: 'SERVICE',
    gradientFrom: '#1e4d38',
    gradientTo: '#0f2318',
    emoji: '✂️',
    titleEn: 'Factory Cut-to-Size',
    description: 'Precision CNC cutting — AED 8/sheet, same dispatch day',
    pricingText: 'From AED 8/sheet',
    ctaText: 'Add Cutting',
    ctaLink: '/checkout/addons',
    isActive: true,
  },
  {
    position: 6,
    typeTag: 'CLEARANCE',
    gradientFrom: '#4a044e',
    gradientTo: '#2e1065',
    emoji: '⚡',
    titleEn: 'NFR 9mm Clearance',
    description: 'Limited stock NFR 9mm at factory price — 200 sheets only',
    pricingText: 'AED 24/sheet',
    ctaText: 'Buy Now',
    ctaLink: '/products?grade=NFR&thickness=9&clearance=true',
    isActive: true,
  },
]

// ─── Promo Codes ─────────────────────────────────────────────────────────────

const PROMOS = [
  {
    code: 'BULK100',
    type: 'PERCENTAGE' as const,
    value: 5,
    minOrder: 4000,
    grades: [Grade.NFR, Grade.MR, Grade.FR, Grade.AC],
    maxUses: 500,
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2026-12-31'),
    isActive: true,
  },
  {
    code: 'BULKPAY',
    type: 'FREE_DELIVERY' as const,
    value: 0,
    minOrder: 5000,
    grades: [Grade.NFR, Grade.MR, Grade.FR, Grade.AC],
    maxUses: 200,
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2026-12-31'),
    isActive: true,
  },
  {
    code: 'SWWALLET',
    type: 'FIXED' as const,
    value: 200,
    minOrder: 2000,
    grades: [Grade.NFR, Grade.MR, Grade.FR, Grade.AC],
    maxUses: 100,
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2026-06-30'),
    isActive: true,
  },
]

// ─── Site Settings ────────────────────────────────────────────────────────────

const SETTINGS = [
  { key: 'company_name', value: 'Steel Wood Industries FZCO' },
  { key: 'company_address', value: 'JAFZA / National Industries Park, Dubai, UAE' },
  { key: 'company_phone', value: '+971 4 XXX XXXX' },
  { key: 'company_whatsapp', value: '+971 50 XXX XXXX' },
  { key: 'company_email', value: 'orders@steelwood.ae' },
  { key: 'company_trn', value: 'TRN100XXXXXXX' },
  { key: 'company_jafza_reg', value: 'JAFZA-XXXXXXXX' },
  { key: 'invoice_prefix', value: 'SW-INV-' },
  { key: 'order_prefix', value: 'SW-ORD-' },
  { key: 'vat_rate', value: 0.05 },
  { key: 'convenience_fee_rate', value: 0.011 },
  { key: 'price_lock_fee', value: 110 },
  { key: 'price_lock_duration_hours', value: 720 },
  { key: 'pdc_bank_name', value: 'Emirates NBD' },
  { key: 'pdc_account_name', value: 'Steel Wood Industries FZCO' },
  { key: 'pdc_account_number', value: 'XXXXXXXXXX' },
  { key: 'pdc_iban', value: 'AE07 0260 0010 XXXXXXXXXX' },
  { key: 'lc_swift', value: 'EBILAEAD' },
  { key: 'lc_min_amount', value: 20000 },
  { key: 'trust_bar_items', value: [
    { icon: '🏭', text: 'Direct from factory · JAFZA/NIP' },
    { icon: '📦', text: '847 sheets in stock · next-day Dubai' },
    { icon: '💳', text: 'LC · PDC · TT · Split payment' },
    { icon: '📋', text: 'TDS & certs on every SKU' },
  ]},
  { key: 'why_steelwood', value: [
    { icon: '🏭', title: 'JAFZA Factory', desc: 'Direct from our Dubai manufacturing facility' },
    { icon: '📋', title: 'TDS on every SKU', desc: 'Full technical data sheet included with every order' },
    { icon: '💳', title: 'Flexible B2B Payment', desc: 'LC, PDC, TT, Tabby, Tamara and more' },
  ]},
  { key: 'whatsapp_templates', value: {
    ORDER_CONFIRMED: 'sw_order_confirmed',
    ORDER_DISPATCHED: 'sw_order_dispatched',
    ORDER_DELIVERED: 'sw_order_delivered',
    PRICE_LOCK_EXPIRY: 'sw_price_expiry',
    LOW_STOCK_ALERT: 'sw_low_stock',
    PDC_REMINDER: 'sw_pdc_reminder',
  }},
]

// ─── Main Seed ────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting seed...')

  // Zones
  console.log('  → Seeding zones...')
  for (const z of ZONES) {
    await prisma.zone.upsert({
      where: { name: z.name },
      update: z,
      create: z,
    })
  }
  console.log(`  ✓ ${ZONES.length} zones seeded`)

  // SKUs + Inventory
  console.log('  → Seeding products and inventory...')
  const skus = buildSKUs()
  let productCount = 0

  for (const sku of skus) {
    const gradeStr = sku.grade
    const skuCode = `SW-${gradeStr}-${sku.thicknessMm}-2440`
    const tdsRef = `SW-TDS-${gradeStr}-${sku.thicknessMm}`

    const product = await prisma.product.upsert({
      where: { skuCode },
      update: {
        basePrice: sku.basePrice,
        specs: sku.specs as object,
        certifications: sku.certifications,
        applications: sku.applications,
      },
      create: {
        skuCode,
        grade: sku.grade,
        thicknessMm: sku.thicknessMm,
        densityKgM3: sku.densityKgM3,
        nameEn: `${gradeStr} Chipboard ${sku.thicknessMm}mm`,
        nameAr: `لوح ${gradeStr} ${sku.thicknessMm}مم`,
        moq: 50,
        basePrice: sku.basePrice,
        specs: sku.specs as object,
        certifications: sku.certifications,
        applications: sku.applications,
        tdsRevision: 1,
        tdsIssueDate: new Date('2026-01-01'),
        tdsDocumentRef: tdsRef,
        isActive: true,
      },
    })

    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: { currentStock: sku.stock },
      create: {
        productId: product.id,
        currentStock: sku.stock,
        reservedStock: 0,
        reorderLevel: 100,
      },
    })

    productCount++
  }
  console.log(`  ✓ ${productCount} products + inventory seeded`)

  // Deals
  console.log('  → Seeding deals...')
  for (let i = 0; i < DEALS.length; i++) {
    const d = DEALS[i]
    await prisma.deal.upsert({
      where: { id: `deal-${i + 1}` },
      update: d,
      create: { id: `deal-${i + 1}`, ...d },
    })
  }
  console.log(`  ✓ ${DEALS.length} deals seeded`)

  // Promo codes
  console.log('  → Seeding promo codes...')
  for (const p of PROMOS) {
    await prisma.promoCode.upsert({
      where: { code: p.code },
      update: p,
      create: p,
    })
  }
  console.log(`  ✓ ${PROMOS.length} promo codes seeded`)

  // Site settings
  console.log('  → Seeding site settings...')
  for (const s of SETTINGS) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value as never },
      create: { key: s.key, value: s.value as never, updatedBy: 'seed' },
    })
  }
  console.log(`  ✓ ${SETTINGS.length} settings seeded`)

  // Super admin user
  console.log('  → Seeding admin user...')
  const hashedPassword = await bcrypt.hash('SteelWood@Admin2026!', 12)
  await prisma.user.upsert({
    where: { email: 'admin@steelwood.ae' },
    update: {},
    create: {
      email: 'admin@steelwood.ae',
      name: 'Steel Wood Admin',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
    },
  })
  console.log('  ✓ Super admin user created')

  // Sample trade companies
  console.log('  → Seeding sample companies...')
  const companies = [
    { name: 'Al Futtaim Joinery LLC', tradeLicenceNo: 'DED-1234567', trnVat: 'TRN100001234', industry: Industry.JOINERY, status: CompanyStatus.ACTIVE, creditLimit: 50000 },
    { name: 'Emirates Fitout Contractors', tradeLicenceNo: 'JAFZA-2345678', trnVat: 'TRN100002345', industry: Industry.FITOUT_CONTRACTOR, status: CompanyStatus.VIP, creditLimit: 100000 },
    { name: 'Dubai Door Manufacturing Co.', tradeLicenceNo: 'DED-3456789', trnVat: 'TRN100003456', industry: Industry.DOOR_MANUFACTURER, status: CompanyStatus.ACTIVE, creditLimit: 30000 },
    { name: 'Gulf Board Distributors FZE', tradeLicenceNo: 'JAFZA-4567890', trnVat: 'TRN100004567', industry: Industry.DISTRIBUTOR, status: CompanyStatus.ACTIVE, creditLimit: 200000 },
    { name: 'Sharjah Hotel Projects LLC', tradeLicenceNo: 'SED-5678901', trnVat: 'TRN100005678', industry: Industry.HOSPITALITY, status: CompanyStatus.PENDING, creditLimit: 0 },
  ]

  for (const co of companies) {
    const existing = await prisma.company.findFirst({ where: { tradeLicenceNo: co.tradeLicenceNo } })
    if (!existing) {
      const company = await prisma.company.create({ data: co })
      const userEmail = co.name.toLowerCase().replace(/[^a-z]/g, '') + '@steelwood-test.ae'
      const pw = await bcrypt.hash('Test@1234', 10)
      await prisma.user.upsert({
        where: { email: userEmail },
        update: {},
        create: {
          email: userEmail,
          name: 'Test Buyer',
          password: pw,
          role: UserRole.BUYER,
          companyId: company.id,
        },
      })
    }
  }
  console.log(`  ✓ ${companies.length} sample companies seeded`)

  console.log('\n✅ Seed complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
