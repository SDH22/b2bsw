'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { StatsCard } from '@/components/admin/StatsCard'
import { DataTable, Column } from '@/components/admin/DataTable'
import { cn } from '@/lib/utils'

const REVENUE_DATA = [
  { month: 'Sep', MR: 42000, FR: 18000, NFR: 15000, AC: 8000 },
  { month: 'Oct', MR: 48000, FR: 22000, NFR: 18000, AC: 11000 },
  { month: 'Nov', MR: 45000, FR: 25000, NFR: 16000, AC: 9000 },
  { month: 'Dec', MR: 52000, FR: 28000, NFR: 20000, AC: 12000 },
  { month: 'Jan', MR: 58000, FR: 24000, NFR: 22000, AC: 14000 },
  { month: 'Feb', MR: 61000, FR: 31000, NFR: 25000, AC: 16000 },
  { month: 'Mar', MR: 55000, FR: 29000, NFR: 21000, AC: 13000 },
]

const EMIRATE_DATA = [
  { emirate: 'Dubai', orders: 142 },
  { emirate: 'Abu Dhabi', orders: 58 },
  { emirate: 'Sharjah', orders: 44 },
  { emirate: 'RAK', orders: 22 },
  { emirate: 'Ajman', orders: 18 },
  { emirate: 'Fujairah', orders: 12 },
  { emirate: 'Al Ain', orders: 9 },
]

const RECENT_ORDERS = [
  { id: '1', orderRef: 'SW-ORD-12345', company: 'Al Rashidi Joinery LLC', grade: 'MR', qty: 200, amount: 'AED 9,240', status: 'CONFIRMED', payment: 'Credit Card', date: '2026-03-14' },
  { id: '2', orderRef: 'SW-ORD-12344', company: 'Gulf Interior Design', grade: 'FR', qty: 100, amount: 'AED 6,720', status: 'IN_PRODUCTION', payment: 'PDC', date: '2026-03-14' },
  { id: '3', orderRef: 'SW-ORD-12343', company: 'Emirates Door Factory', grade: 'NFR', qty: 500, amount: 'AED 15,750', status: 'DISPATCHED', payment: 'TT', date: '2026-03-13' },
  { id: '4', orderRef: 'SW-ORD-12342', company: 'Dubai Fitout LLC', grade: 'MR', qty: 150, amount: 'AED 6,930', status: 'DELIVERED', payment: 'Tabby', date: '2026-03-13' },
  { id: '5', orderRef: 'SW-ORD-12341', company: 'Abu Dhabi Joinery Co', grade: 'AC', qty: 80, amount: 'AED 7,476', status: 'CONFIRMED', payment: 'LC', date: '2026-03-12' },
]

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-blue-100 text-blue-800',
  IN_PRODUCTION: 'bg-yellow-100 text-yellow-800',
  READY_TO_DISPATCH: 'bg-orange-100 text-orange-800',
  DISPATCHED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

type OrderRow = typeof RECENT_ORDERS[0]

const ORDER_COLUMNS: Column<OrderRow>[] = [
  { key: 'orderRef', label: 'Order Ref', sortable: true },
  { key: 'company', label: 'Company', sortable: true },
  { key: 'grade', label: 'Grade', render: (r) => <span className="font-bold text-xs">{r.grade}</span> },
  { key: 'qty', label: 'Qty', render: (r) => `${r.qty} sht` },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'payment', label: 'Payment' },
  {
    key: 'status', label: 'Status',
    render: (r) => (
      <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', STATUS_COLORS[r.status] || 'bg-gray-100 text-gray-700')}>
        {r.status.replace('_', ' ')}
      </span>
    )
  },
  { key: 'date', label: 'Date', sortable: true },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Steel Wood Industries FZCO · Live overview</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Today's Orders" value="AED 32,420" sub="8 orders today" trend={12} trendLabel="vs yesterday" icon="🛒" color="green" />
        <StatsCard title="Pending Dispatch" value="14 orders" sub="3 overdue" icon="📦" color="amber" />
        <StatsCard title="Low Stock SKUs" value="3 SKUs" sub="FR 18mm: 33 sheets" icon="⚠️" color="red" />
        <StatsCard title="Active Trade Accounts" value="127" sub="12 pending approval" trend={8} trendLabel="this month" icon="🏢" color="blue" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Revenue by grade */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-4">Revenue by Grade — Last 7 Months</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={REVENUE_DATA} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => `AED ${Number(v).toLocaleString()}`} />
              <Legend iconSize={10} />
              <Bar dataKey="MR" stackId="a" fill="#3b82f6" />
              <Bar dataKey="FR" stackId="a" fill="#ef4444" />
              <Bar dataKey="NFR" stackId="a" fill="#6b7280" />
              <Bar dataKey="AC" stackId="a" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by emirate */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-4">Orders by Emirate</h3>
          <div className="space-y-2">
            {EMIRATE_DATA.map((e) => (
              <div key={e.emirate}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-gray-600">{e.emirate}</span>
                  <span className="font-semibold">{e.orders}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full">
                  <div
                    className="h-full bg-sw-400 rounded-full"
                    style={{ width: `${(e.orders / 142) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Recent Orders</h3>
          <a href="/admin/orders" className="text-sm text-sw-500 hover:underline">View all →</a>
        </div>
        <DataTable
          data={RECENT_ORDERS}
          columns={ORDER_COLUMNS}
          searchable={false}
          pageSize={10}
        />
      </div>
    </div>
  )
}
