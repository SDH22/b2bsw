'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Download, FileText } from 'lucide-react'
import { CertBadges } from './CertBadges'
import { cn } from '@/lib/utils'

interface TDSPanelProps {
  product: {
    skuCode: string
    grade: string
    thicknessMm: number
    tdsDocumentRef: string
    tdsRevision: number
    tdsDocumentUrl?: string
    certifications: string[]
    applications: string[]
    specs: {
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
      performanceBars: { ib: number; mor: number; moe: number; screw: number; swell: number }
    }
  }
  defaultOpen?: boolean
}

function PerformanceBar({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="font-bold text-gray-800">{value} {unit}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-sw-400 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  )
}

export function TDSPanel({ product, defaultOpen = false }: TDSPanelProps) {
  const [open, setOpen] = useState(defaultOpen)
  const { specs } = product

  return (
    <div className="border-t border-gray-100">
      {/* TDS Toggle Bar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-sw-500" />
          <span className="text-sm font-medium text-gray-700">
            Technical Data Sheet · <span className="text-sw-600 font-semibold">{product.tdsDocumentRef}</span> Rev.{product.tdsRevision}
          </span>
          <CertBadges certifications={product.certifications} />
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {/* TDS Panel Content */}
      {open && (
        <div className="px-4 pb-4 bg-gray-50">
          {/* Actions row */}
          <div className="flex items-center gap-3 mb-4 py-2 border-b border-gray-200">
            <a
              href={`/api/tds?grade=${product.grade}&thickness=${product.thicknessMm}`}
              download
              className="flex items-center gap-1.5 text-sm text-sw-600 hover:text-sw-700 font-medium"
            >
              <Download className="w-3.5 h-3.5" /> Download TDS
            </a>
            <span className="text-gray-300">|</span>
            <button className="flex items-center gap-1.5 text-sm text-sw-600 hover:text-sw-700 font-medium">
              <FileText className="w-3.5 h-3.5" /> Request signed copy ↗
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Physical Properties */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Physical Properties</h4>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['Density', `${specs.density} kg/m³`],
                    ['Thickness', `${specs.thickness} mm`],
                    ['Size', specs.size],
                    ['Moisture Content', specs.moisture],
                    ['Surface', specs.surface],
                    ['Edge / Colour', specs.edgeProfile],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td className="py-1 pr-2 text-gray-500 font-medium">{k}</td>
                      <td className="py-1 text-gray-800 font-semibold">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Column 2: Mechanical Strength */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mechanical Strength</h4>
              <PerformanceBar label="Internal Bond (IB)" value={specs.performanceBars.ib} unit="N/mm²" />
              <PerformanceBar label="Bending Strength (MOR)" value={specs.performanceBars.mor} unit="N/mm²" />
              <PerformanceBar label="Modulus of Elasticity (MOE)" value={specs.performanceBars.moe / 100} unit="×100 N/mm²" />
              <PerformanceBar label="Screw Withdrawal (Face)" value={specs.performanceBars.screw / 10} unit="×10 N" />
              <PerformanceBar label="Thickness Swelling" value={100 - specs.performanceBars.swell} unit="% compliance" />
            </div>

            {/* Column 3: Compliance */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Compliance</h4>
              <table className="w-full text-xs mb-3">
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['Standard', 'EN 312', 'pass'],
                    ['Formaldehyde', specs.formaldehyde, specs.formaldehyde === 'E1' ? 'pass' : 'warn'],
                    ['Fire Class', specs.fireClass, specs.fireClass.includes('B') || specs.fireClass.includes('C') ? 'pass' : 'neutral'],
                    ['QMS', 'ISO 9001:2015', 'pass'],
                  ].map(([k, v, status]) => (
                    <tr key={k}>
                      <td className="py-1 pr-2 text-gray-500">{k}</td>
                      <td className="py-1 font-semibold">
                        <span className={cn(
                          'flex items-center gap-1',
                          status === 'pass' ? 'text-green-700' : status === 'warn' ? 'text-amber-600' : 'text-gray-700'
                        )}>
                          {status === 'pass' ? '✓' : status === 'warn' ? '⚠' : '·'} {v}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Certifications */}
              <div className="mb-2">
                <div className="text-xs font-semibold text-gray-500 mb-1">Certifications</div>
                <CertBadges certifications={product.certifications} />
              </div>

              {/* Applications */}
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-1">Typical Applications</div>
                <div className="flex flex-wrap gap-1">
                  {product.applications.map((app) => (
                    <span key={app} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
            Technical data is based on production batch averages. Values may vary ±5%. For project-specific certification, request a signed copy. Store boards flat, covered, off the ground. Steel Wood Industries FZCO · JAFZA · NIP Dubai.
          </p>
        </div>
      )}
    </div>
  )
}
