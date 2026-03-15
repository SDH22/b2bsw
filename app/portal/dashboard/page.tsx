'use client'
import Link from 'next/link'
import { Package, Clock, Truck, CheckCircle, TrendingUp, RotateCcw, FileText, CreditCard, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const ACTIVE_ORDERS = [
  { id: '1', ref: 'SW-ORD-12345', grade: 'MR', name: 'MR 18mm × 200 sheets', status: 'IN_PRODUCTION', date: '2026-03-14', amount: 9240 },
  { id: '2', ref: 'SW-ORD-12341', grade: 'AC', name: 'Acoustic 18mm × 80 sheets', status: 'CONFIRMED', date: '2026-03-12', amount: 7476 },
  { id: '3', ref: 'SW-ORD-12338', grade: 'NFR', name: 'NFR 12mm × 300 sheets', status: 'DISPATCHED', date: '2026-03-10', amount: 9450 },
]

const STATUS_STEPS = ['CONFIRMED', 'IN_PRODUCTION', 'READY_TO_DISPATCH', 'DISPATCHED', 'DELIVERED']
const STATUS_ICONS = [Package, Clock, Package, Truck, CheckCircle]

const GRADE_COLORS: Record<string, string> = {
  MR: 'bg-blue-100 text-blue-800',
  FR: 'bg-red-100 text-red-800',
  NFR: 'bg-gray-100 text-gray-700',
  AC: 'bg-purple-100 text-purple-800',
}

const PRICE_INDEX = [
  { label: 'MR 18mm', price: 38, trend: 'stable' },
  { label: 'NFR 12mm', price: 30, trend: 'down' },
  { label: 'FR 18mm', price: 61, trend: 'up' },
  { label: 'AC 18mm', price: 85, trend: 'stable' },
]

function OrderPipeline({ status }: { status: string }) {
  const currentIdx = STATUS_STEPS.indexOf(status)
  return (
    <div className="flex items-center gap-1 mt-2">
      {STATUS_STEPS.map((step, i) => {
        const Icon = STATUS_ICONS[i]
        const done = i <= currentIdx
        return (
          <div key={step} className="flex items-center gap-1">
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
              done ? 'bg-sw-500 text-white' : 'bg-gray-100 text-gray-300'
            )}>
              <Icon className="w-3 h-3" />
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={cn('h-0.5 w-4', i < currentIdx ? 'bg-sw-400' : 'bg-gray-200')} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function PortalDashboard() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-sw-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sw-200 text-sm mb-1">Welcome back</div>
              <h1 className="text-2xl font-bold">Buyer Portal</h1>
            </div>
            <div className="text-right">
              <div className="text-xs text-sw-300">Credit Limit</div>
              <div className="text-xl font-bold">AED 50,000</div>
              <div className="text-xs text-sw-300">AED 12,460 used · AED 37,540 available</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Orders */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Active Orders</h2>
              <Link href="/portal/orders" className="text-sm text-sw-500 hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-4">
              {ACTIVE_ORDERS.map((order) => (
                <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:bg-sw-50 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={cn('text-xs font-bold px-2 py-0.5 rounded', GRADE_COLORS[order.grade])}>{order.grade}</span>
                        <span className="font-semibold text-gray-800 text-sm">{order.name}</span>
                      </div>
                      <div className="text-xs text-gray-500">{order.ref} · {order.date}</div>
                    </div>
                    <div className="font-bold text-sw-700 text-sm">AED {order.amount.toLocaleString()}</div>
                  </div>
                  <OrderPipeline status={order.status} />
                  <div className="text-xs text-sw-600 font-medium mt-1">
                    {order.status.replace(/_/g, ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Reorder */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <RotateCcw className="w-4 h-4 text-sw-500" />
              <h2 className="font-bold text-gray-800">Quick Reorder</h2>
            </div>
            <div className="space-y-2">
              {[
                { grade: 'MR', desc: '18mm × 200 sheets — Al Quoz delivery', amount: 9240 },
                { grade: 'NFR', desc: '12mm × 300 sheets — Jebel Ali pickup', amount: 9450 },
                { grade: 'AC', desc: '18mm × 80 sheets — Abu Dhabi delivery', amount: 7476 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-xs font-bold px-2 py-0.5 rounded', GRADE_COLORS[item.grade])}>{item.grade}</span>
                    <span className="text-sm text-gray-700">{item.desc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">AED {item.amount.toLocaleString()}</span>
                    <Link href="/products" className="bg-sw-500 hover:bg-sw-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                      Reorder
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Live Price Index */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-sw-500" />
              <h3 className="font-semibold text-gray-800 text-sm">My Grade Prices</h3>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div className="space-y-2">
              {PRICE_INDEX.map((p) => (
                <div key={p.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{p.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-sm">AED {p.price}/sht</span>
                    <span className={cn('text-xs', p.trend === 'up' ? 'text-amber-500' : p.trend === 'down' ? 'text-green-500' : 'text-gray-400')}>
                      {p.trend === 'up' ? '↑' : p.trend === 'down' ? '↓' : '→'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Health */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">Account Health</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Credit Limit</span>
                <span className="font-semibold">AED 50,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Used</span>
                <span className="font-semibold text-amber-600">AED 12,460</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                <div className="bg-amber-400 h-2 rounded-full" style={{ width: '24.9%' }} />
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500">PDC Outstanding</span>
                <span className="font-semibold">2 cheques</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Next payment</span>
                <span className="font-semibold text-green-600">Mar 25, 2026</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">Quick Links</h3>
            <div className="space-y-1">
              {[
                { icon: FileText, label: 'TDS Library', href: '/tds-library' },
                { icon: Package, label: 'All Orders', href: '/portal/orders' },
                { icon: CreditCard, label: 'Payment History', href: '/portal/account' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center gap-2 p-2 rounded-lg hover:bg-sw-50 text-gray-600 hover:text-sw-700 transition-colors text-sm">
                  <link.icon className="w-4 h-4" />
                  {link.label}
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
