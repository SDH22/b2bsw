'use client'
import { useState, useCallback, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal } from 'lucide-react'
import { DatePricingStrip } from '@/components/products/DatePricingStrip'
import { ProductCard } from '@/components/products/ProductCard'
import type { Product, Grade, ProductCategory } from '@/types/product'
import { ALL_PRODUCTS } from '@/lib/catalog'
import { cn } from '@/lib/utils'

const SORT_TABS = [
  { key: 'price',    label: 'Lowest price',      sub: 'from AED 14/sht'   },
  { key: 'dispatch', label: 'Fastest dispatch',   sub: 'from 1 working day' },
  { key: 'stock',    label: 'Best availability',  sub: '750+ sheets ready'  },
]

/* Grade filters per category */
const GRADE_FILTERS_BY_CATEGORY: Record<string, Grade[]> = {
  chipboard: ['NFR', 'MR', 'FR', 'AC'],
  mdf:       ['STD', 'MR', 'FR', 'ACS', 'ULF'],
  plywood:   ['BB', 'MR'],
  osb:       ['OSB3'],
  all:       ['NFR', 'MR', 'FR', 'AC', 'STD', 'ULF', 'ACS', 'BB', 'OSB3'],
}

/* Thickness filters per category */
const THICKNESS_FILTERS_BY_CATEGORY: Record<string, number[]> = {
  chipboard: [9, 12, 16, 18, 25],
  mdf:       [3, 4, 6, 9, 12, 15, 16, 18, 22, 25, 30],
  plywood:   [4, 6, 9, 12, 15, 18],
  osb:       [9, 11, 15, 18, 22],
  all:       [3, 4, 6, 9, 11, 12, 15, 16, 18, 22, 25, 30],
}

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All Products', chipboard: 'Chipboard', mdf: 'MDF', plywood: 'Plywood', osb: 'OSB',
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryParam = (searchParams.get('category') ?? 'all') as ProductCategory | 'all'

  const [selectedZoneId] = useState('al-quoz')
  const deliveryCost     = 6   // default preview; user picks zone at checkout
  const [dateIdx,        setDateIdx]        = useState(0)
  const [priceDelta,     setPriceDelta]     = useState(0)
  const [sortKey,        setSortKey]        = useState('price')
  const [gradeFilter,    setGradeFilter]    = useState<Grade | null>(null)
  const [thicknessFilter,setThicknessFilter]= useState<number | null>(null)
  const [inStockOnly,    setInStockOnly]    = useState(false)

  const gradeOptions     = GRADE_FILTERS_BY_CATEGORY[categoryParam] ?? GRADE_FILTERS_BY_CATEGORY.all
  const thicknessOptions = THICKNESS_FILTERS_BY_CATEGORY[categoryParam] ?? THICKNESS_FILTERS_BY_CATEGORY.all

  const { data: products = ALL_PRODUCTS } = useQuery({
    queryKey: ['products', categoryParam, gradeFilter, thicknessFilter, inStockOnly],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (categoryParam !== 'all') params.set('category', categoryParam)
      if (gradeFilter)             params.set('grade', gradeFilter)
      if (thicknessFilter)         params.set('thickness', String(thicknessFilter))
      if (inStockOnly)             params.set('inStock', '1')
      const res = await fetch(`/api/products?${params}`)
      if (!res.ok) return ALL_PRODUCTS
      return res.json()
    },
    staleTime: 60 * 1000,
  })

  const handleDateSelect = useCallback((idx: number, delta: number) => {
    setDateIdx(idx)
    setPriceDelta(delta)
  }, [])

  const toggleGrade     = (g: Grade)  => setGradeFilter(prev => prev === g ? null : g)
  const toggleThickness = (t: number) => setThicknessFilter(prev => prev === t ? null : t)

  // Client-side filters
  let filtered = products as Product[]
  if (categoryParam !== 'all')   filtered = filtered.filter(p => p.category === categoryParam)
  if (gradeFilter)               filtered = filtered.filter(p => p.grade === gradeFilter)
  if (thicknessFilter)           filtered = filtered.filter(p => p.thicknessMm === thicknessFilter)
  if (inStockOnly)               filtered = filtered.filter(p => (p.inventory?.availableStock ?? 0) > 0)

  if (sortKey === 'price') filtered = [...filtered].sort((a, b) => a.basePrice - b.basePrice)
  else if (sortKey === 'stock') filtered = [...filtered].sort((a, b) => (b.inventory?.availableStock ?? 0) - (a.inventory?.availableStock ?? 0))

  return (
    <div className="bg-gray-50 min-h-screen">
      <DatePricingStrip selectedIdx={dateIdx} onSelect={handleDateSelect} />

      {/* Offer banners */}
      <div className="max-w-7xl mx-auto px-4 pt-4 space-y-2">
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-800">
          📦 <strong>Order 100+ sheets</strong> — delivery drops to AED {Math.max(3, deliveryCost - 1)}/sheet
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-sm text-blue-800">
          🔒 <strong>Lock today&apos;s price for 30 days</strong> — 25% PDC secures current rates · April revision expected
        </div>
        {deliveryCost >= 18 && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm text-green-800">
            💳 <strong>Split your invoice:</strong> 4 post-dated cheques, 0% markup on orders above AED 5,000
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex gap-6">

        {/* Sidebar filters */}
        <aside className="w-56 flex-shrink-0 hidden lg:block">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-[120px]">
            <div className="flex items-center gap-2 mb-4 font-semibold text-gray-700">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              <span className="ml-auto text-xs font-normal text-sw-600 bg-sw-50 px-2 py-0.5 rounded-full">
                {CATEGORY_LABELS[categoryParam] ?? 'All'}
              </span>
            </div>

            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Grade</div>
              <div className="flex flex-wrap gap-1">
                {gradeOptions.map((g) => (
                  <button key={g} onClick={() => toggleGrade(g)}
                    className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border transition-all',
                      gradeFilter === g ? 'bg-sw-500 text-white border-sw-500' : 'border-gray-200 text-gray-600 hover:border-sw-300')}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Thickness</div>
              <div className="flex flex-wrap gap-1">
                {thicknessOptions.map((t) => (
                  <button key={t} onClick={() => toggleThickness(t)}
                    className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border transition-all',
                      thicknessFilter === t ? 'bg-sw-500 text-white border-sw-500' : 'border-gray-200 text-gray-600 hover:border-sw-300')}>
                    {t}mm
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-sw-500" />
                <span className="text-sm text-gray-700">In-stock only</span>
              </label>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment</div>
              {['All', 'LC', 'PDC', 'TT'].map((pm) => (
                <label key={pm} className="flex items-center gap-2 cursor-pointer mb-1">
                  <input type="checkbox" defaultChecked={pm === 'All'} className="accent-sw-500" />
                  <span className="text-sm text-gray-700">{pm}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Sort tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {SORT_TABS.map((tab) => (
              <button key={tab.key} onClick={() => setSortKey(tab.key)}
                className={cn('flex-shrink-0 px-4 py-2.5 rounded-lg border text-left transition-all',
                  sortKey === tab.key ? 'bg-sw-500 text-white border-sw-500' : 'bg-white border-gray-200 text-gray-700 hover:border-sw-300')}>
                <div className="font-semibold text-sm">{tab.label}</div>
                <div className={cn('text-xs', sortKey === tab.key ? 'text-sw-100' : 'text-gray-500')}>{tab.sub}</div>
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="text-sm text-gray-500 mb-3">
            {filtered.length} products · all prices to{' '}
            <strong>{selectedZoneId.replace(/-/g, ' ')}</strong> incl. delivery + VAT
          </div>

          {/* Product list */}
          <div className="space-y-4">
            {filtered.map((product: Product) => (
              <ProductCard key={product.id} product={product} deliveryCostPerSheet={deliveryCost} priceDelta={priceDelta} />
            ))}
            {filtered.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                No products match your current filters. Try removing some filters.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading products…</div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
