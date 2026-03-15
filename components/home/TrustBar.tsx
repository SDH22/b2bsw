export function HomeTrustBar() {
  const items = [
    { icon: '🏭', label: 'Factory Direct', sub: 'JAFZA / NIP Dubai' },
    { icon: '📦', label: '847 sheets in stock', sub: 'Next-day Dubai delivery' },
    { icon: '💳', label: 'LC · PDC · TT', sub: 'Split & credit payments' },
    { icon: '📋', label: 'TDS on every SKU', sub: 'EN 312 · ISO certified' },
  ]

  return (
    <div className="bg-sw-800 border-y border-sw-700">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-sw-700">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-3.5 bg-sw-800 hover:bg-sw-700/60 transition-colors"
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <div className="text-sm font-bold text-white leading-tight">{item.label}</div>
                <div className="text-[11px] text-sw-300 font-medium leading-tight mt-0.5">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
