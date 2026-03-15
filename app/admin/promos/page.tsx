'use client'
import { useState } from 'react'
import { Plus, Tag, ToggleLeft, ToggleRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const PROMOS = [
  { id: '1', code: 'BULK100', type: 'FIXED', value: 100, minOrder: 2000, grades: 'All', maxUses: 500, usedCount: 87, validFrom: '2026-01-01', validUntil: '2026-12-31', isActive: true },
  { id: '2', code: 'BULKPAY', type: 'FREE_DELIVERY', value: 0, minOrder: 3000, grades: 'All', maxUses: 200, usedCount: 34, validFrom: '2026-01-01', validUntil: '2026-06-30', isActive: true },
  { id: '3', code: 'SWWALLET', type: 'PERCENTAGE', value: 3, minOrder: 1000, grades: 'All', maxUses: 1000, usedCount: 156, validFrom: '2025-10-01', validUntil: '2026-09-30', isActive: true },
  { id: '4', code: 'FRSPEC25', type: 'PERCENTAGE', value: 5, minOrder: 5000, grades: 'FR', maxUses: 50, usedCount: 12, validFrom: '2026-03-01', validUntil: '2026-03-31', isActive: false },
]

const TYPE_LABELS: Record<string, string> = {
  FIXED: 'Fixed AED',
  PERCENTAGE: 'Percentage %',
  FREE_DELIVERY: 'Free Delivery',
}

const TYPE_COLORS: Record<string, string> = {
  FIXED: 'bg-green-100 text-green-700',
  PERCENTAGE: 'bg-blue-100 text-blue-700',
  FREE_DELIVERY: 'bg-purple-100 text-purple-700',
}

export default function AdminPromos() {
  const [promos, setPromos] = useState(PROMOS)
  const [showCreate, setShowCreate] = useState(false)

  const toggle = (id: string) => {
    setPromos(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Promo Codes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{promos.filter(p => p.isActive).length} active codes</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 bg-sw-500 hover:bg-sw-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Promo
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl border border-sw-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">New Promo Code</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              ['Code', 'text', 'e.g. SUMMER25'],
              ['Type', 'select', ''],
              ['Value', 'number', '0'],
              ['Min Order (AED)', 'number', '0'],
              ['Max Uses', 'number', '100'],
              ['Valid Until', 'date', ''],
            ].map(([label, type]) => (
              <div key={label as string}>
                <label className="text-xs font-medium text-gray-500 mb-1 block">{label as string}</label>
                {type === 'select' ? (
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sw-500">
                    <option>FIXED</option>
                    <option>PERCENTAGE</option>
                    <option>FREE_DELIVERY</option>
                  </select>
                ) : (
                  <input type={type as string} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sw-500" />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button className="px-4 py-2 bg-sw-500 text-white rounded-lg text-sm font-semibold hover:bg-sw-600 transition-colors">Create Code</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Code', 'Type', 'Value', 'Min Order', 'Usage', 'Valid Until', 'Active', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {promos.map(p => (
              <tr key={p.id} className="hover:bg-sw-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-sw-400" />
                    <span className="font-mono font-bold text-sw-700">{p.code}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', TYPE_COLORS[p.type])}>{TYPE_LABELS[p.type]}</span>
                </td>
                <td className="px-4 py-3 font-semibold">
                  {p.type === 'FIXED' ? `AED ${p.value}` : p.type === 'PERCENTAGE' ? `${p.value}%` : 'Free delivery'}
                </td>
                <td className="px-4 py-3 text-gray-600">AED {p.minOrder.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-700">{p.usedCount}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-500">{p.maxUses}</span>
                    <div className="w-16 bg-gray-100 rounded-full h-1.5 ml-1">
                      <div className="bg-sw-400 h-full rounded-full" style={{ width: `${Math.min(100, p.usedCount / p.maxUses * 100)}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.validUntil}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggle(p.id)}>
                    {p.isActive
                      ? <ToggleRight className="w-6 h-6 text-green-500" />
                      : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button className="text-xs text-sw-500 hover:underline font-medium">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
