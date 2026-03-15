'use client'
import Link from 'next/link'

const GRADES = [
  {
    grade: 'MR',
    icon: '💧',
    name: 'MR Moisture Resistant',
    app: 'Bathrooms · Kitchens · Wet areas',
    price: 38,
    accent: '#1e40af',
    bg: 'from-blue-50 to-white',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
    pill: 'bg-blue-500',
  },
  {
    grade: 'FR',
    icon: '🔥',
    name: 'FR Fire Retardant',
    app: 'Hotels · Civil Defence · LEED projects',
    price: 61,
    accent: '#991b1b',
    bg: 'from-red-50 to-white',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-800',
    pill: 'bg-red-500',
  },
  {
    grade: 'NFR',
    icon: '🪵',
    name: 'NFR Standard',
    app: 'Joinery · Furniture · General fitout',
    price: 30,
    accent: '#374151',
    bg: 'from-gray-50 to-white',
    border: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-800',
    pill: 'bg-gray-500',
  },
  {
    grade: 'AC',
    icon: '🔇',
    name: 'Acoustic Board',
    app: 'Studios · Cinemas · Sound insulation',
    price: 85,
    accent: '#6d28d9',
    bg: 'from-purple-50 to-white',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-800',
    pill: 'bg-purple-500',
  },
]

export function QuickGrid() {
  return (
    <div className="bg-gray-50/60 py-10 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Shop by Grade</h2>
          <Link href="/products" className="text-sm font-semibold text-sw-500 hover:text-sw-700 transition-colors flex items-center gap-1">
            View all products →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {GRADES.map((g) => (
            <Link
              key={g.grade}
              href={`/products?grade=${g.grade}`}
              className={`relative bg-gradient-to-br ${g.bg} border ${g.border} rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 group overflow-hidden`}
            >
              {/* Decorative circle */}
              <div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10"
                style={{ backgroundColor: g.accent }}
              />

              {/* Grade badge */}
              <span className={`inline-block text-[11px] font-black px-2 py-0.5 rounded-md mb-3 uppercase tracking-wider ${g.badge}`}>
                {g.grade}
              </span>

              {/* Icon */}
              <div className="text-4xl mb-3">{g.icon}</div>

              {/* Name */}
              <div className="font-bold text-gray-800 text-sm mb-1 leading-tight">{g.name}</div>

              {/* Applications */}
              <div className="text-[11px] text-gray-500 mb-3 leading-relaxed">{g.app}</div>

              {/* Price row */}
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <span className="text-xs text-gray-400 block">from</span>
                  <span className="font-black text-base text-gray-900">AED {g.price}</span>
                  <span className="text-[11px] text-gray-400">/sht</span>
                </div>
                <span className={`w-8 h-8 ${g.pill} rounded-full flex items-center justify-center text-white text-sm group-hover:scale-110 transition-transform shadow-sm`}>
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
