'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Chipboard', icon: '🪵', href: '/products?category=chipboard' },
  { label: 'MDF',       icon: '🧱', href: '/products?category=mdf'       },
  { label: 'Plywood',   icon: '🏗️', href: '/products?category=plywood'   },
  { label: 'OSB',       icon: '🔲', href: '/products?category=osb'        },
]

export function CategoryTabs() {
  const pathname = usePathname()

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-stretch overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const isActive =
              pathname === tab.href ||
              (tab.href !== '#' && pathname.startsWith(tab.href.split('?')[0]))
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-1 px-5 py-3 text-[11px] font-semibold whitespace-nowrap transition-all flex-shrink-0 border-b-2 min-w-[72px]',
                  isActive
                    ? 'border-sw-500 text-sw-600 bg-sw-50/60'
                    : 'border-transparent text-gray-500 hover:text-sw-600 hover:bg-gray-50'
                )}
              >
                <span className="text-xl leading-none">{tab.icon}</span>
                <span className="tracking-wide">{tab.label}</span>
                {tab.hot && (
                  <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm leading-none uppercase tracking-wider">
                    HOT
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
