import Link from 'next/link'

const CARDS = [
  {
    icon: '🏭',
    tag: 'SOURCE',
    title: 'JAFZA Factory Direct',
    desc: 'No middlemen. Order directly from our manufacturing facility at Jebel Ali Free Zone / National Industries Park, Dubai.',
    cta: 'View factory certifications',
    href: '/tds-library',
    accent: 'border-sw-200 bg-sw-50',
    tagColor: 'bg-sw-100 text-sw-700',
  },
  {
    icon: '📋',
    tag: 'COMPLIANCE',
    title: 'TDS on Every SKU',
    desc: 'Full Technical Data Sheet with EN 312, ISO, and DCD compliance for every board. Download PDF or request a signed copy.',
    cta: 'Browse TDS library',
    href: '/tds-library',
    accent: 'border-blue-200 bg-blue-50',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    icon: '💳',
    tag: 'PAYMENT',
    title: 'Flexible B2B Payment',
    desc: 'LC, PDC, TT bank transfer, Tabby split payments, and card. Credit terms available for verified trade accounts.',
    cta: 'See payment options',
    href: '/checkout/payment',
    accent: 'border-purple-200 bg-purple-50',
    tagColor: 'bg-purple-100 text-purple-700',
  },
]

export function WhySteelWood() {
  return (
    <div className="bg-white py-14 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Why Steel Wood Industries?</h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">Trusted B2B supplier for contractors, fitout companies, and traders across the UAE</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className={`rounded-2xl p-6 border-2 ${card.accent} hover:shadow-lg transition-all duration-200 flex flex-col`}
            >
              {/* Tag */}
              <span className={`self-start text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest mb-4 ${card.tagColor}`}>
                {card.tag}
              </span>

              {/* Icon */}
              <div className="text-5xl mb-4">{card.icon}</div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 text-base mb-2">{card.title}</h3>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">{card.desc}</p>

              {/* CTA */}
              <Link
                href={card.href}
                className="flex items-center gap-1.5 text-sm font-bold text-sw-600 hover:text-sw-800 transition-colors"
              >
                {card.cta} <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
