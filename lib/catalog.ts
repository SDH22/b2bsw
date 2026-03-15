import type { Product } from '@/types/product'

/* ── helpers ──────────────────────────────────────────────────── */
function inv(cur: number, res = 0): Product['inventory'] {
  const avail = cur - res
  return {
    currentStock: cur, reservedStock: res, availableStock: avail,
    status: avail === 0 ? 'out-of-stock' : avail < 50 ? 'low-stock' : 'in-stock',
  }
}

/* ── CHIPBOARD (existing 4) ────────────────────────────────────── */
const CHIPBOARD: Product[] = [
  {
    id: '1', skuCode: 'SW-MR-18-2440', grade: 'MR', category: 'chipboard',
    thicknessMm: 18, widthMm: 2440, heightMm: 1220, densityKgM3: 680,
    nameEn: 'MR Chipboard 18mm — Moisture Resistant', moq: 50, basePrice: 38, isActive: true,
    tdsRevision: 3, tdsIssueDate: '2025-01-15', tdsDocumentRef: 'SW-TDS-MR-18',
    certifications: ['ISO 9001', 'EN 312 P3', 'E1', 'ESMA'],
    applications: ['Kitchen carcass', 'Bathroom vanities', 'Wet area joinery', 'Commercial fitout'],
    inventory: inv(847, 20),
    specs: { density: 680, thickness: 18, size: '2440×1220mm', moisture: '6–10%', surface: 'Sanded both sides',
      edgeProfile: 'Square / Raw', formaldehyde: 'E1', fireClass: 'D-s2,d0',
      internalBond: 0.45, mor: 14, moe: 1800, screwWithdrawalFace: 850, thicknessSwelling: '≤12%',
      performanceBars: { ib: 45, mor: 70, moe: 60, screw: 85, swell: 88 } }
  },
  {
    id: '2', skuCode: 'SW-FR-18-2440', grade: 'FR', category: 'chipboard',
    thicknessMm: 18, widthMm: 2440, heightMm: 1220, densityKgM3: 720,
    nameEn: 'FR Chipboard 18mm — Fire Retardant', moq: 50, basePrice: 61, isActive: true,
    tdsRevision: 2, tdsIssueDate: '2025-02-01', tdsDocumentRef: 'SW-TDS-FR-18',
    certifications: ['ISO 9001', 'EN 13501-1', 'DCD', 'E1', 'ESMA'],
    applications: ['Hotel corridors', 'Civil Defence compliance', 'LEED projects', 'High-rise fitout'],
    inventory: inv(38, 5),
    specs: { density: 720, thickness: 18, size: '2440×1220mm', moisture: '6–9%', surface: 'Sanded both sides',
      edgeProfile: 'Square / Raw', formaldehyde: 'E1', fireClass: 'B-s1,d0',
      internalBond: 0.50, mor: 16, moe: 2000, screwWithdrawalFace: 900, thicknessSwelling: '≤10%',
      performanceBars: { ib: 50, mor: 80, moe: 67, screw: 90, swell: 90 } }
  },
  {
    id: '3', skuCode: 'SW-NFR-12-2440', grade: 'NFR', category: 'chipboard',
    thicknessMm: 12, widthMm: 2440, heightMm: 1220, densityKgM3: 640,
    nameEn: 'NFR Chipboard 12mm — Standard Grade', moq: 50, basePrice: 30, isActive: true,
    tdsRevision: 4, tdsIssueDate: '2025-01-01', tdsDocumentRef: 'SW-TDS-NFR-12',
    certifications: ['ISO 9001', 'EN 312 P2', 'E1'],
    applications: ['General joinery', 'Furniture carcass', 'Exhibition stands', 'Internal partitions'],
    inventory: inv(1240, 50),
    specs: { density: 640, thickness: 12, size: '2440×1220mm', moisture: '5–10%', surface: 'Sanded both sides',
      edgeProfile: 'Square / Raw', formaldehyde: 'E1', fireClass: 'D-s2,d0',
      internalBond: 0.35, mor: 11, moe: 1600, screwWithdrawalFace: 750, thicknessSwelling: '≤14%',
      performanceBars: { ib: 35, mor: 55, moe: 53, screw: 75, swell: 86 } }
  },
  {
    id: '4', skuCode: 'SW-AC-18-2440', grade: 'AC', category: 'chipboard',
    thicknessMm: 18, widthMm: 2440, heightMm: 1220, densityKgM3: 600,
    nameEn: 'Acoustic Chipboard 18mm — Sound Absorbing', moq: 50, basePrice: 85, isActive: true,
    tdsRevision: 1, tdsIssueDate: '2025-03-01', tdsDocumentRef: 'SW-TDS-AC-18',
    certifications: ['ISO 9001', 'ISO 14001', 'E1'],
    applications: ['Recording studios', 'Cinema halls', 'Conference rooms', 'Hospitality'],
    inventory: inv(200, 10),
    specs: { density: 600, thickness: 18, size: '2440×1220mm', moisture: '6–10%', surface: 'Textured / Perforated',
      edgeProfile: 'Square / Raw', formaldehyde: 'E1', fireClass: 'D-s2,d0',
      internalBond: 0.30, mor: 10, moe: 1400, screwWithdrawalFace: 700, thicknessSwelling: '≤15%',
      performanceBars: { ib: 30, mor: 50, moe: 47, screw: 70, swell: 85 } }
  },
]

/* ── MDF-FSC-STD — 11 SKUs ─────────────────────────────────────── */
const MDF_STD_DATA: [string, number, number, number, number][] = [
  // [sku-suffix, thicknessMm, basePrice, density, stock]
  ['03', 3,  14, 765, 320],
  ['04', 4,  17, 760, 280],
  ['06', 6,  22, 755, 450],
  ['09', 9,  28, 750, 520],
  ['12', 12, 36, 745, 680],
  ['15', 15, 43, 740, 500],
  ['16', 16, 46, 738, 400],
  ['18', 18, 52, 735, 750],
  ['22', 22, 63, 730, 360],
  ['25', 25, 72, 725, 290],
  ['30', 30, 88, 720, 180],
]
const MDF_STD: Product[] = MDF_STD_DATA.map(([sfx, t, price, density, stock], i) => ({
  id: `mdf-std-${sfx}`, skuCode: `MDF-FSC-STD-${sfx}`, grade: 'STD', category: 'mdf',
  thicknessMm: t, widthMm: 2440, heightMm: 1220, densityKgM3: density,
  nameEn: `FSC MDF Standard ${t}mm`, moq: 25, basePrice: price, isActive: true,
  tdsRevision: 2, tdsIssueDate: '2025-01-10', tdsDocumentRef: `MDF-TDS-STD-${sfx}`,
  certifications: ['FSC C002647', 'EN 622-5', 'CARB P2', 'E1', 'ISO 9001'],
  applications: ['Furniture carcass', 'Cabinet doors', 'Interior panelling', 'Shopfitting', 'Exhibition stands'],
  inventory: inv(stock, Math.round(stock * 0.04)),
  specs: {
    density, thickness: t, size: '2440×1220mm', moisture: '4–9%',
    surface: 'Fine sanded both sides', edgeProfile: 'Square / Raw', formaldehyde: 'E1 (CARB P2)',
    fireClass: 'D-s2,d0', internalBond: 0.55, mor: Math.max(18, 30 - i), moe: 2400 - i * 50,
    screwWithdrawalFace: 950, thicknessSwelling: '≤8%',
    performanceBars: { ib: 55, mor: Math.max(50, 85 - i * 3), moe: Math.max(55, 80 - i * 2), screw: 95, swell: 92 }
  }
}))

/* ── MDF-FSC-MR — 8 SKUs ───────────────────────────────────────── */
const MDF_MR_DATA: [string, number, number, number, number][] = [
  ['06', 6,  29, 760, 280],
  ['09', 9,  37, 755, 340],
  ['12', 12, 46, 750, 420],
  ['15', 15, 55, 748, 300],
  ['16', 16, 58, 746, 260],
  ['18', 18, 65, 744, 480],
  ['22', 22, 78, 740, 220],
  ['25', 25, 89, 736, 170],
]
const MDF_MR: Product[] = MDF_MR_DATA.map(([sfx, t, price, density, stock], i) => ({
  id: `mdf-mr-${sfx}`, skuCode: `MDF-FSC-MR-${sfx}`, grade: 'MR', category: 'mdf',
  thicknessMm: t, widthMm: 2440, heightMm: 1220, densityKgM3: density,
  nameEn: `FSC MDF Moisture Resistant ${t}mm`, moq: 25, basePrice: price, isActive: true,
  tdsRevision: 2, tdsIssueDate: '2025-01-10', tdsDocumentRef: `MDF-TDS-MR-${sfx}`,
  certifications: ['FSC C002647', 'EN 622-5 MDF.H', 'CARB P2', 'E1', 'ISO 9001'],
  applications: ['Kitchens', 'Bathrooms', 'Wet areas', 'Humid-environment joinery', 'Marine interiors'],
  inventory: inv(stock, Math.round(stock * 0.05)),
  specs: {
    density, thickness: t, size: '2440×1220mm', moisture: '3–8%',
    surface: 'Fine sanded both sides', edgeProfile: 'Square / Raw', formaldehyde: 'E1 (CARB P2)',
    fireClass: 'D-s2,d0', internalBond: 0.60, mor: Math.max(20, 32 - i), moe: 2600 - i * 50,
    screwWithdrawalFace: 1000, thicknessSwelling: '≤7%',
    performanceBars: { ib: 60, mor: Math.max(55, 88 - i * 3), moe: Math.max(58, 82 - i * 2), screw: 98, swell: 93 }
  }
}))

/* ── MDF-FSC-FR — 4 SKUs ───────────────────────────────────────── */
const MDF_FR_DATA: [string, number, number, number, number][] = [
  ['09',  9,  68, 760, 120],
  ['12', 12,  84, 758, 180],
  ['15', 15, 100, 756, 140],
  ['18', 18, 116, 754, 200],
]
const MDF_FR: Product[] = MDF_FR_DATA.map(([sfx, t, price, density, stock], i) => ({
  id: `mdf-fr-${sfx}`, skuCode: `MDF-FSC-FR-${sfx}`, grade: 'FR', category: 'mdf',
  thicknessMm: t, widthMm: 2440, heightMm: 1220, densityKgM3: density,
  nameEn: `FSC MDF Fire Retardant ${t}mm`, moq: 25, basePrice: price, isActive: true,
  tdsRevision: 2, tdsIssueDate: '2025-02-01', tdsDocumentRef: `MDF-TDS-FR-${sfx}`,
  certifications: ['FSC C002647', 'EN 622-5', 'EN 13501-1 B-s1,d0', 'DCD Approved', 'E1', 'ISO 9001'],
  applications: ['Hotel corridors', 'Civil Defence compliance', 'High-rise interiors', 'LEED projects', 'Hospitals'],
  inventory: inv(stock, Math.round(stock * 0.06)),
  specs: {
    density, thickness: t, size: '2440×1220mm', moisture: '4–8%',
    surface: 'Fine sanded both sides', edgeProfile: 'Square / Raw', formaldehyde: 'E1',
    fireClass: 'B-s1,d0', internalBond: 0.60, mor: Math.max(22, 34 - i), moe: 2700 - i * 80,
    screwWithdrawalFace: 980, thicknessSwelling: '≤8%',
    performanceBars: { ib: 60, mor: Math.max(60, 90 - i * 3), moe: Math.max(60, 85 - i * 3), screw: 96, swell: 92 }
  }
}))

/* ── MDF-FSC-ACS — 6 SKUs ──────────────────────────────────────── */
const MDF_ACS_DATA: [string, number, string, string, number, number, number][] = [
  // [sku-suffix, thickness, pattern-code, pattern-label, price, density, stock]
  ['12-SQ', 12, 'SQ', '8×8mm @ 32 pitch', 98,  720, 160],
  ['15-SQ', 15, 'SQ', '8×8mm @ 32 pitch', 114, 718, 130],
  ['18-SQ', 18, 'SQ', '8×8mm @ 32 pitch', 130, 716, 180],
  ['12-SL', 12, 'SL', '8×18mm @ 32 pitch', 102, 720, 140],
  ['15-SL', 15, 'SL', '8×18mm @ 32 pitch', 118, 718, 110],
  ['18-SL', 18, 'SL', '8×18mm @ 32 pitch', 135, 716, 160],
]
const MDF_ACS: Product[] = MDF_ACS_DATA.map(([sfx, t, patCode, patLabel, price, density, stock]) => ({
  id: `mdf-acs-${sfx.toLowerCase()}`, skuCode: `MDF-FSC-ACS-${sfx}`, grade: 'ACS', category: 'mdf',
  thicknessMm: t as number, widthMm: 2440, heightMm: 1220, densityKgM3: density as number,
  nameEn: `FSC MDF Acoustic ${patCode === 'SQ' ? 'Square' : 'Slot'} Perf ${t}mm`,
  moq: 20, basePrice: price as number, isActive: true,
  tdsRevision: 1, tdsIssueDate: '2025-03-01', tdsDocumentRef: `MDF-TDS-ACS-${sfx}`,
  certifications: ['FSC C002647', 'EN 622-5', 'ISO 10534-2', 'E1', 'ISO 9001'],
  applications: ['Acoustic panels', 'Recording studios', 'Conference rooms', 'Auditoriums', 'Offices', 'Hotels'],
  inventory: inv(stock as number, Math.round((stock as number) * 0.05)),
  specs: {
    density: density as number, thickness: t as number, size: '2440×1220mm', moisture: '4–9%',
    surface: `Perforated ${patLabel} — fine sanded back`, edgeProfile: 'Square / Raw', formaldehyde: 'E1',
    fireClass: 'D-s2,d0', internalBond: 0.50, mor: 22, moe: 2300,
    screwWithdrawalFace: 920, thicknessSwelling: '≤9%',
    performanceBars: { ib: 50, mor: 65, moe: 70, screw: 92, swell: 90 }
  }
}))

/* ── MDF-FSC-ULF — 7 SKUs ──────────────────────────────────────── */
const MDF_ULF_DATA: [string, number, number, number, number][] = [
  ['09',  9,  32, 750, 260],
  ['12', 12,  41, 745, 380],
  ['15', 15,  49, 742, 300],
  ['16', 16,  52, 740, 240],
  ['18', 18,  58, 738, 420],
  ['22', 22,  70, 734, 190],
  ['25', 25,  80, 730, 150],
]
const MDF_ULF: Product[] = MDF_ULF_DATA.map(([sfx, t, price, density, stock], i) => ({
  id: `mdf-ulf-${sfx}`, skuCode: `MDF-FSC-ULF-${sfx}`, grade: 'ULF', category: 'mdf',
  thicknessMm: t, widthMm: 2440, heightMm: 1220, densityKgM3: density,
  nameEn: `FSC MDF Ultra Low Formaldehyde ${t}mm`, moq: 25, basePrice: price, isActive: true,
  tdsRevision: 1, tdsIssueDate: '2025-01-20', tdsDocumentRef: `MDF-TDS-ULF-${sfx}`,
  certifications: ['FSC C002647', 'EN 622-5', 'CARB Super-E0', 'E0 (<3 mg/100g)', 'ISO 9001', 'GREENGUARD Gold'],
  applications: ['Children\'s furniture', 'Healthcare', 'Schools', 'Residential interiors', 'Sensitive environments'],
  inventory: inv(stock, Math.round(stock * 0.04)),
  specs: {
    density, thickness: t, size: '2440×1220mm', moisture: '4–8%',
    surface: 'Fine sanded both sides', edgeProfile: 'Square / Raw', formaldehyde: 'E0 (<3 mg/100g)',
    fireClass: 'D-s2,d0', internalBond: 0.55, mor: Math.max(20, 32 - i), moe: 2500 - i * 50,
    screwWithdrawalFace: 960, thicknessSwelling: '≤8%',
    performanceBars: { ib: 55, mor: Math.max(55, 86 - i * 3), moe: Math.max(58, 80 - i * 2), screw: 96, swell: 93 }
  }
}))

/* ── PLY-FSC-BB — 6 SKUs ───────────────────────────────────────── */
const PLY_BB_DATA: [string, number, number, number, number][] = [
  ['04',  4,  36, 550, 200],
  ['06',  6,  48, 555, 280],
  ['09',  9,  62, 560, 350],
  ['12', 12,  78, 565, 320],
  ['15', 15,  94, 570, 250],
  ['18', 18, 110, 575, 300],
]
const PLY_BB: Product[] = PLY_BB_DATA.map(([sfx, t, price, density, stock]) => ({
  id: `ply-bb-${sfx}`, skuCode: `PLY-FSC-BB-${sfx}`, grade: 'BB', category: 'plywood',
  thicknessMm: t, widthMm: 2440, heightMm: 1220, densityKgM3: density,
  nameEn: `FSC Plywood BB/CC Interior ${t}mm`, moq: 20, basePrice: price, isActive: true,
  tdsRevision: 1, tdsIssueDate: '2025-01-15', tdsDocumentRef: `PLY-TDS-BB-${sfx}`,
  certifications: ['FSC C002647', 'EN 636-1', 'E1', 'ISO 9001'],
  applications: ['Interior furniture', 'Cabinet backs', 'Flooring substrate', 'Wall panelling', 'General construction'],
  inventory: inv(stock, Math.round(stock * 0.04)),
  specs: {
    density, thickness: t, size: '2440×1220mm', moisture: '6–12%',
    surface: 'BB/CC face-back', edgeProfile: 'Sanded / Sealed', formaldehyde: 'E1',
    fireClass: 'D-s2,d0', internalBond: 0.40, mor: 28, moe: 6000,
    screwWithdrawalFace: 800, thicknessSwelling: '≤4%',
    performanceBars: { ib: 40, mor: 75, moe: 80, screw: 80, swell: 95 }
  }
}))

/* ── PLY-FSC-MR — 5 SKUs ───────────────────────────────────────── */
const PLY_MR_DATA: [string, number, number, number, number][] = [
  ['06',  6,  58, 580, 160],
  ['09',  9,  76, 585, 200],
  ['12', 12,  95, 590, 240],
  ['15', 15, 114, 595, 180],
  ['18', 18, 132, 600, 220],
]
const PLY_MR: Product[] = PLY_MR_DATA.map(([sfx, t, price, density, stock]) => ({
  id: `ply-mr-${sfx}`, skuCode: `PLY-FSC-MR-${sfx}`, grade: 'MR', category: 'plywood',
  thicknessMm: t, widthMm: 2440, heightMm: 1220, densityKgM3: density,
  nameEn: `FSC Plywood Marine/MR WBP ${t}mm`, moq: 20, basePrice: price, isActive: true,
  tdsRevision: 1, tdsIssueDate: '2025-01-15', tdsDocumentRef: `PLY-TDS-MR-${sfx}`,
  certifications: ['FSC C002647', 'EN 636-2', 'BS 1088', 'WBP Phenolic Glue', 'E1', 'ISO 9001'],
  applications: ['Marine applications', 'Wet areas', 'Boat building', 'Exterior cladding substrate', 'Structural panels'],
  inventory: inv(stock, Math.round(stock * 0.05)),
  specs: {
    density, thickness: t, size: '2440×1220mm', moisture: '5–10%',
    surface: 'BB/BB face-back sanded', edgeProfile: 'Sealed edge', formaldehyde: 'E1',
    fireClass: 'D-s2,d0', internalBond: 0.55, mor: 35, moe: 7500,
    screwWithdrawalFace: 900, thicknessSwelling: '≤3%',
    performanceBars: { ib: 55, mor: 88, moe: 90, screw: 90, swell: 97 }
  }
}))

/* ── OSB-FSC-3 — 5 SKUs ────────────────────────────────────────── */
const OSB_DATA: [string, number, number, number, number][] = [
  ['09',  9,  30, 610, 400],
  ['11', 11,  37, 620, 350],
  ['15', 15,  48, 630, 300],
  ['18', 18,  58, 635, 280],
  ['22', 22,  72, 640, 200],
]
const OSB: Product[] = OSB_DATA.map(([sfx, t, price, density, stock]) => ({
  id: `osb-3-${sfx}`, skuCode: `OSB-FSC-3-${sfx}`, grade: 'OSB3', category: 'osb',
  thicknessMm: t, widthMm: 2440, heightMm: 1220, densityKgM3: density,
  nameEn: `FSC OSB/3 Structural ${t}mm`, moq: 20, basePrice: price, isActive: true,
  tdsRevision: 1, tdsIssueDate: '2025-02-01', tdsDocumentRef: `OSB-TDS-3-${sfx}`,
  certifications: ['FSC C002647', 'EN 300 OSB/3', 'CE Marked', 'E1', 'ISO 9001'],
  applications: ['Structural sheathing', 'Flooring', 'Roof decking', 'Wall bracing', 'Site hoarding', 'Packaging'],
  inventory: inv(stock, Math.round(stock * 0.04)),
  specs: {
    density, thickness: t, size: '2440×1220mm', moisture: '4–8%',
    surface: 'Textured OSB face / Smooth back', edgeProfile: 'Square / Raw', formaldehyde: 'E1',
    fireClass: 'D-s2,d0', internalBond: 0.32, mor: 20, moe: 3500,
    screwWithdrawalFace: 780, thicknessSwelling: '≤15%',
    performanceBars: { ib: 32, mor: 60, moe: 65, screw: 78, swell: 85 }
  }
}))

/* ── EXPORT ────────────────────────────────────────────────────── */
export const ALL_PRODUCTS: Product[] = [
  ...CHIPBOARD,
  ...MDF_STD,
  ...MDF_MR,
  ...MDF_FR,
  ...MDF_ACS,
  ...MDF_ULF,
  ...PLY_BB,
  ...PLY_MR,
  ...OSB,
]
