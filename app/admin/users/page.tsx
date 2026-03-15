'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, CheckCircle, XCircle, Clock } from 'lucide-react'
import { DataTable, Column } from '@/components/admin/DataTable'
import { cn } from '@/lib/utils'

const COMPANIES = [
  { id: '1', name: 'Al Rashidi Joinery LLC', contact: 'Ahmed Al Rashidi', trn: '100234567000003', tradeLicence: 'TL-20230145', registered: '2025-08-01', orders: 12, lifetime: 98400, creditLimit: 50000, status: 'ACTIVE' },
  { id: '2', name: 'Gulf Interior Design', contact: 'Mohammed Salem', trn: '100345678000004', tradeLicence: 'TL-20220890', registered: '2025-09-15', orders: 8, lifetime: 54600, creditLimit: 30000, status: 'ACTIVE' },
  { id: '3', name: 'Emirates Door Factory', contact: 'Khalid Hassan', trn: '100456789000005', tradeLicence: 'TL-20210234', registered: '2025-07-22', orders: 24, lifetime: 187500, creditLimit: 100000, status: 'VIP' },
  { id: '4', name: 'Dubai Fitout LLC', contact: 'Sarah Johnson', trn: '100567890000006', tradeLicence: 'TL-20240567', registered: '2026-01-10', orders: 3, lifetime: 22400, creditLimit: 20000, status: 'ACTIVE' },
  { id: '5', name: 'Abu Dhabi Joinery Co', contact: 'Ali Hassan', trn: '100678901000007', tradeLicence: 'TL-20221456', registered: '2025-11-05', orders: 6, lifetime: 43200, creditLimit: 25000, status: 'ACTIVE' },
  { id: '6', name: 'RAK Furniture FZCO', contact: 'Wang Fang', trn: '', tradeLicence: 'TL-20241234', registered: '2026-02-28', orders: 0, lifetime: 0, creditLimit: 0, status: 'PENDING' },
  { id: '7', name: 'Sharjah Woodcraft', contact: 'Priya Nair', trn: '100789012000008', tradeLicence: 'TL-20200789', registered: '2024-05-15', orders: 0, lifetime: 15600, creditLimit: 0, status: 'SUSPENDED' },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.FC<{ className?: string }> }> = {
  PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-800', icon: Clock },
  ACTIVE: { label: 'Active', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  VIP: { label: 'VIP Trade', color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
  SUSPENDED: { label: 'Suspended', color: 'bg-red-100 text-red-700', icon: XCircle },
}

type CompanyRow = typeof COMPANIES[0]

export default function AdminUsers() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'ACTIVE' | 'VIP' | 'SUSPENDED'>('ALL')

  const filtered = activeTab === 'ALL' ? COMPANIES : COMPANIES.filter(c => c.status === activeTab)

  const columns: Column<CompanyRow>[] = [
    { key: 'name', label: 'Company', sortable: true, render: (r) => <span className="font-semibold text-gray-800">{r.name}</span> },
    { key: 'contact', label: 'Contact', sortable: true },
    { key: 'trn', label: 'TRN', render: (r) => r.trn ? <span className="font-mono text-xs">{r.trn}</span> : <span className="text-gray-300">—</span> },
    { key: 'tradeLicence', label: 'Trade Licence', render: (r) => <span className="font-mono text-xs">{r.tradeLicence}</span> },
    { key: 'registered', label: 'Registered', sortable: true },
    { key: 'orders', label: 'Orders', sortable: true, render: (r) => <span className="font-semibold">{r.orders}</span> },
    { key: 'lifetime', label: 'Lifetime AED', sortable: true, render: (r) => `AED ${r.lifetime.toLocaleString()}` },
    { key: 'creditLimit', label: 'Credit Limit', render: (r) => r.creditLimit > 0 ? `AED ${r.creditLimit.toLocaleString()}` : '—' },
    {
      key: 'status', label: 'Status', render: (r) => {
        const cfg = STATUS_CONFIG[r.status]
        return (
          <span className={cn('inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full', cfg.color)}>
            <cfg.icon className="w-3 h-3" /> {cfg.label}
          </span>
        )
      }
    },
  ]

  const pendingCount = COMPANIES.filter(c => c.status === 'PENDING').length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Companies & Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{COMPANIES.length} registered companies</p>
        </div>
        <button className="flex items-center gap-2 bg-sw-500 hover:bg-sw-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Add Company
        </button>
      </div>

      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="text-sm text-amber-800 font-medium">
            {pendingCount} company awaiting trade licence verification
          </span>
          <button onClick={() => setActiveTab('PENDING')} className="ml-auto text-sm text-amber-700 font-semibold hover:underline">
            Review now →
          </button>
        </div>
      )}

      <div className="flex gap-2">
        {(['ALL', 'PENDING', 'ACTIVE', 'VIP', 'SUSPENDED'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('px-3 py-1.5 rounded-lg text-sm font-medium border transition-all',
              activeTab === tab ? 'bg-sw-500 text-white border-sw-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50')}>
            {tab === 'ALL' ? 'All' : STATUS_CONFIG[tab].label}
            <span className="ml-1.5 text-xs opacity-70">
              {tab === 'ALL' ? COMPANIES.length : COMPANIES.filter(c => c.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <DataTable
          data={filtered}
          columns={columns}
          searchKeys={['name', 'contact', 'tradeLicence'] as (keyof CompanyRow)[]}
          onRowClick={(row) => router.push(`/admin/users/${row.id}`)}
        />
      </div>
    </div>
  )
}
