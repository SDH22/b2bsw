'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Warehouse, DollarSign, ShoppingCart,
  Megaphone, Users, Settings, BarChart3, ChevronRight, ChevronDown,
  Bell, Globe, ChevronLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  {
    label: 'Products', icon: Package, children: [
      { label: 'Products & SKUs', href: '/admin/products' },
      { label: 'TDS Documents', href: '/admin/tds' },
      { label: 'Certifications', href: '/admin/certifications' },
    ]
  },
  {
    label: 'Inventory', icon: Warehouse, children: [
      { label: 'Live Stock Levels', href: '/admin/inventory' },
      { label: 'Stock Alerts', href: '/admin/inventory/alerts' },
    ]
  },
  {
    label: 'Pricing', icon: DollarSign, children: [
      { label: 'Grade Pricing', href: '/admin/pricing' },
      { label: 'Zone Matrix', href: '/admin/pricing/zones' },
      { label: 'Delivery Rules', href: '/admin/pricing/rules' },
    ]
  },
  {
    label: 'Orders', icon: ShoppingCart, children: [
      { label: 'Order Pipeline', href: '/admin/orders' },
      { label: 'Fulfillment', href: '/admin/orders/fulfillment' },
      { label: 'Dispatch', href: '/admin/orders/dispatch' },
    ]
  },
  {
    label: 'Marketing', icon: Megaphone, children: [
      { label: 'Deals & Offers', href: '/admin/deals' },
      { label: 'Promo Codes', href: '/admin/promos' },
      { label: 'Price Lock Offers', href: '/admin/pricelocks' },
    ]
  },
  {
    label: 'Users', icon: Users, children: [
      { label: 'Companies', href: '/admin/users' },
      { label: 'Accounts', href: '/admin/users/accounts' },
      { label: 'Trade Approvals', href: '/admin/users/approvals' },
    ]
  },
  {
    label: 'Site', icon: Globe, children: [
      { label: 'Homepage Settings', href: '/admin/settings/homepage' },
      { label: 'Zone Editor', href: '/admin/zones' },
      { label: 'Payment Settings', href: '/admin/settings/payment' },
      { label: 'Notification Templates', href: '/admin/notifications' },
    ]
  },
  {
    label: 'Analytics', icon: BarChart3, children: [
      { label: 'Revenue Dashboard', href: '/admin/analytics' },
      { label: 'Funnel Analysis', href: '/admin/analytics/funnel' },
      { label: 'Zone Performance', href: '/admin/analytics/zones' },
    ]
  },
  {
    label: 'Settings', icon: Settings, children: [
      { label: 'Admin Users', href: '/admin/settings/users' },
      { label: 'API Keys', href: '/admin/settings/api' },
      { label: 'Audit Log', href: '/admin/settings/audit' },
    ]
  },
]

function NavItem({ item, collapsed }: { item: typeof NAV[0]; collapsed: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(() => {
    if ('children' in item && item.children) return item.children.some((c) => pathname.startsWith(c.href))
    return false
  })

  if (!('children' in item)) {
    const active = pathname === item.href
    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
          active ? 'bg-sw-600 text-white' : 'text-sw-100 hover:bg-sw-700 hover:text-white'
        )}
      >
        <item.icon className="w-4 h-4 flex-shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    )
  }

  const hasActive = (item.children ?? []).some((c) => pathname.startsWith(c.href))

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
          hasActive ? 'text-white' : 'text-sw-200 hover:bg-sw-700 hover:text-white'
        )}
      >
        <item.icon className="w-4 h-4 flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </>
        )}
      </button>
      {open && !collapsed && (
        <div className="ml-6 mt-0.5 space-y-0.5 border-l border-sw-600 pl-2">
          {(item.children ?? []).map((child) => {
            const active = pathname === child.href || pathname.startsWith(child.href + '/')
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  'block px-2 py-1.5 rounded text-xs transition-all',
                  active ? 'text-white font-semibold' : 'text-sw-300 hover:text-white'
                )}
              >
                {child.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={cn(
        'bg-sw-800 flex flex-col flex-shrink-0 transition-all duration-200',
        collapsed ? 'w-14' : 'w-60'
      )}>
        {/* Logo */}
        <div className="px-3 py-4 flex items-center justify-between border-b border-sw-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-sw-500 rounded-lg flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
              SW
            </div>
            {!collapsed && <span className="text-white font-bold text-sm">SW Admin</span>}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="text-sw-300 hover:text-white p-0.5">
            <ChevronLeft className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => (
            <NavItem key={item.label} item={item as typeof NAV[0]} collapsed={collapsed} />
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 border-t border-sw-700">
          <Link href="/" className="text-xs text-sw-300 hover:text-white flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            {!collapsed && 'View Store'}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-500">Steel Wood Industries FZCO — Admin Panel</div>
          <div className="flex items-center gap-3">
            <button className="relative text-gray-500 hover:text-gray-700">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
            </button>
            <div className="w-8 h-8 bg-sw-500 rounded-full flex items-center justify-center text-white text-xs font-bold">SA</div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
