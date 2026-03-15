import { NextRequest, NextResponse } from 'next/server'

/* ── TDS data (mirrors tds-library/page.tsx) ─────────────────── */
const TDS_DATA: Record<string, {
  ref: string; revision: number; name: string; issueDate: string
  certifications: string[]; applications: string[]
  specs: Record<string, string>
  category: string
}> = {
  'MR-18':  {
    ref: 'SW-TDS-MR-18', revision: 3, name: 'MR Chipboard 18mm — Moisture Resistant',
    issueDate: '2025-01-15', category: 'Chipboard',
    certifications: ['ISO 9001', 'EN 312 P3', 'E1', 'ESMA'],
    applications: ['Kitchen carcass', 'Bathroom vanities', 'Wet area joinery'],
    specs: { Density: '680 kg/m³', Formaldehyde: 'E1', 'Fire Class': 'D-s2,d0', 'Internal Bond': '0.45 N/mm²', MOR: '14 N/mm²' },
  },
  'FR-18':  {
    ref: 'SW-TDS-FR-18', revision: 2, name: 'FR Chipboard 18mm — Fire Retardant',
    issueDate: '2025-02-01', category: 'Chipboard',
    certifications: ['ISO 9001', 'EN 13501-1', 'DCD', 'E1', 'ESMA'],
    applications: ['Hotel corridors', 'Civil Defence compliance', 'LEED projects'],
    specs: { Density: '720 kg/m³', Formaldehyde: 'E1', 'Fire Class': 'B-s1,d0', 'Internal Bond': '0.50 N/mm²', MOR: '16 N/mm²' },
  },
  'NFR-12': {
    ref: 'SW-TDS-NFR-12', revision: 4, name: 'NFR Chipboard 12mm — Standard Grade',
    issueDate: '2025-01-01', category: 'Chipboard',
    certifications: ['ISO 9001', 'EN 312 P2', 'E1'],
    applications: ['General joinery', 'Furniture carcass', 'Exhibition stands'],
    specs: { Density: '640 kg/m³', Formaldehyde: 'E1', 'Fire Class': 'D-s2,d0', 'Internal Bond': '0.35 N/mm²', MOR: '11 N/mm²' },
  },
  'AC-18':  {
    ref: 'SW-TDS-AC-18', revision: 1, name: 'Acoustic Chipboard 18mm — Sound Absorbing',
    issueDate: '2025-03-01', category: 'Chipboard',
    certifications: ['ISO 9001', 'ISO 14001', 'E1'],
    applications: ['Recording studios', 'Cinema halls', 'Conference rooms'],
    specs: { Density: '600 kg/m³', Formaldehyde: 'E1', 'Fire Class': 'D-s2,d0', 'Internal Bond': '0.30 N/mm²', MOR: '10 N/mm²' },
  },
  'MR-12':  {
    ref: 'SW-TDS-MR-12', revision: 2, name: 'MR Chipboard 12mm — Moisture Resistant',
    issueDate: '2025-01-15', category: 'Chipboard',
    certifications: ['ISO 9001', 'EN 312 P3', 'E1'],
    applications: ['Thin panel joinery', 'Drawer bases', 'Cabinet backs'],
    specs: { Density: '670 kg/m³', Formaldehyde: 'E1', 'Fire Class': 'D-s2,d0', 'Internal Bond': '0.42 N/mm²', MOR: '13 N/mm²' },
  },
  'FR-25':  {
    ref: 'SW-TDS-FR-25', revision: 1, name: 'FR Chipboard 25mm — Fire Retardant',
    issueDate: '2025-03-01', category: 'Chipboard',
    certifications: ['ISO 9001', 'EN 13501-1', 'DCD', 'E1'],
    applications: ['Heavy-duty fire doors', 'High-rise partitions', 'Civil Defence spec'],
    specs: { Density: '730 kg/m³', Formaldehyde: 'E1', 'Fire Class': 'B-s1,d0', 'Internal Bond': '0.52 N/mm²', MOR: '17 N/mm²' },
  },
  /* ── MDF ── */
  'STD-18': {
    ref: 'SW-TDS-MDF-STD-18', revision: 1, name: 'MDF STD 18mm — Standard Grade',
    issueDate: '2025-01-01', category: 'MDF',
    certifications: ['ISO 9001', 'EN 622-5', 'E1'],
    applications: ['Interior furniture', 'Cabinet doors', 'General millwork'],
    specs: { Density: '720 kg/m³', Formaldehyde: 'E1', 'Fire Class': 'D-s2,d0', 'Internal Bond': '0.60 N/mm²', MOR: '28 N/mm²' },
  },
  'MR-MDF-18': {
    ref: 'SW-TDS-MDF-MR-18', revision: 1, name: 'MDF MR 18mm — Moisture Resistant',
    issueDate: '2025-01-15', category: 'MDF',
    certifications: ['ISO 9001', 'EN 622-5 MR', 'E1', 'ESMA'],
    applications: ['Wet area millwork', 'Bathroom cabinets', 'Kitchen doors'],
    specs: { Density: '740 kg/m³', Formaldehyde: 'E1', 'Fire Class': 'D-s2,d0', 'Internal Bond': '0.65 N/mm²', MOR: '30 N/mm²' },
  },
  /* ── Plywood ── */
  'BB-18':  {
    ref: 'SW-TDS-PLY-BB-18', revision: 1, name: 'Plywood BB 18mm — Birch Face',
    issueDate: '2025-02-01', category: 'Plywood',
    certifications: ['ISO 9001', 'EN 636', 'E1'],
    applications: ['High-end furniture', 'Decorative paneling', 'Formwork'],
    specs: { Density: '680 kg/m³', Formaldehyde: 'E1', 'Fire Class': 'D-s2,d0', 'Internal Bond': '0.80 N/mm²', MOR: '35 N/mm²' },
  },
  /* ── OSB ── */
  'OSB3-18': {
    ref: 'SW-TDS-OSB3-18', revision: 1, name: 'OSB/3 18mm — Load-Bearing Humid Conditions',
    issueDate: '2025-01-01', category: 'OSB',
    certifications: ['ISO 9001', 'EN 300 OSB/3', 'CE'],
    applications: ['Structural decking', 'Hoarding', 'Sheathing'],
    specs: { Density: '630 kg/m³', Formaldehyde: 'E1', 'Fire Class': 'D-s2,d0', 'Internal Bond': '0.34 N/mm²', MOR: '20 N/mm²' },
  },
}

function getTds(grade: string, thickness: string) {
  // Try exact key first, then grade-only fallback
  const exact = TDS_DATA[`${grade}-${thickness}`]
  if (exact) return exact
  // Fallback: find first entry matching grade
  const fallback = Object.values(TDS_DATA).find(d => d.ref.includes(grade))
  return fallback ?? null
}

function buildHtml(grade: string, thickness: string, doc: NonNullable<ReturnType<typeof getTds>>) {
  const today = new Date().toLocaleDateString('en-AE', { day: 'numeric', month: 'long', year: 'numeric' })
  const specsRows = Object.entries(doc.specs)
    .map(([k, v]) => `<tr><td>${k}</td><td><strong>${v}</strong></td></tr>`)
    .join('')
  const certs = doc.certifications.map(c => `<span class="cert">${c}</span>`).join('')
  const apps  = doc.applications.map(a => `<li>${a}</li>`).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>TDS — ${doc.ref}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #1a1a1a; background: #fff; }
  .page { max-width: 794px; margin: 0 auto; padding: 32px 40px; }

  /* Header */
  .header { display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 3px solid #1a5c3c; padding-bottom: 16px; margin-bottom: 20px; }
  .brand { display: flex; flex-direction: column; }
  .brand-name { font-size: 20px; font-weight: 900; color: #1a5c3c; letter-spacing: 0.5px; }
  .brand-sub  { font-size: 9px; color: #666; margin-top: 2px; }
  .doc-meta { text-align: right; font-size: 10px; color: #555; }
  .doc-meta strong { color: #1a1a1a; }

  /* Title strip */
  .title-strip { background: #1a5c3c; color: #fff; padding: 10px 16px; border-radius: 4px; margin-bottom: 20px; }
  .title-strip h1 { font-size: 16px; font-weight: 800; }
  .title-strip p  { font-size: 10px; opacity: 0.8; margin-top: 2px; }

  /* Section */
  h2 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #1a5c3c; border-bottom: 1px solid #cce8da; padding-bottom: 4px; margin-bottom: 10px; margin-top: 20px; }

  /* Specs table */
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  tr:nth-child(even) { background: #f5fbf8; }
  td { padding: 6px 10px; border: 1px solid #e2f0e8; }
  td:first-child { width: 40%; color: #444; }

  /* Certs */
  .certs { display: flex; flex-wrap: wrap; gap: 6px; }
  .cert { background: #e8f5ee; color: #1a5c3c; border: 1px solid #b6dfc8; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 700; }

  /* Apps */
  .apps { padding-left: 18px; }
  .apps li { margin-bottom: 4px; }

  /* Footer */
  .footer { margin-top: 32px; border-top: 1px solid #e0e0e0; padding-top: 12px; font-size: 9px; color: #888; display: flex; justify-content: space-between; }

  /* Warning */
  .warning { background: #fff8e1; border: 1px solid #ffe082; border-radius: 4px; padding: 8px 12px; font-size: 10px; color: #795548; margin-top: 16px; }

  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div class="brand">
      <div class="brand-name">STEEL WOOD INDUSTRIES FZCO</div>
      <div class="brand-sub">JAFZA · NIP Dubai · UAE · steelwood.ae</div>
    </div>
    <div class="doc-meta">
      <div><strong>Document Ref:</strong> ${doc.ref}</div>
      <div><strong>Revision:</strong> ${doc.revision}</div>
      <div><strong>Issued:</strong> ${doc.issueDate}</div>
      <div><strong>Printed:</strong> ${today}</div>
    </div>
  </div>

  <div class="title-strip">
    <h1>${doc.name}</h1>
    <p>${doc.category} · ${thickness}mm · 2440 × 1220mm · Grade ${grade}</p>
  </div>

  <h2>Technical Specifications</h2>
  <table>
    <tbody>
      ${specsRows}
      <tr><td>Dimensions</td><td><strong>2440 × 1220 × ${thickness} mm</strong></td></tr>
      <tr><td>Grade</td><td><strong>${grade}</strong></td></tr>
      <tr><td>Category</td><td><strong>${doc.category}</strong></td></tr>
    </tbody>
  </table>

  <h2>Certifications &amp; Standards</h2>
  <div class="certs">${certs}</div>

  <h2>Typical Applications</h2>
  <ul class="apps">${apps}</ul>

  <div class="warning">
    <strong>Disclaimer:</strong> This TDS is issued for guidance purposes only. Actual properties may vary by production batch.
    Contact Steel Wood Industries FZCO for project-specific or officially stamped documentation.
  </div>

  <div class="footer">
    <span>Steel Wood Industries FZCO · JAFZA · Dubai · UAE · ISO 9001 Certified</span>
    <span>${doc.ref} Rev.${doc.revision} — Printed ${today}</span>
  </div>

</div>
</body>
</html>`
}

export async function GET(req: NextRequest) {
  const grade     = req.nextUrl.searchParams.get('grade')     ?? ''
  const thickness = req.nextUrl.searchParams.get('thickness') ?? ''

  const doc = getTds(grade.toUpperCase(), thickness)

  if (!doc) {
    return NextResponse.json({ error: 'TDS not found' }, { status: 404 })
  }

  const html = buildHtml(grade.toUpperCase(), thickness, doc)
  const filename = `TDS-${grade.toUpperCase()}-${thickness}mm.html`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
