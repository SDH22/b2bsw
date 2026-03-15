'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Download, Package, MessageSquare, ArrowRight } from 'lucide-react'

export default function ConfirmationPage() {
  const { orderId } = useParams()
  const orderRef = orderId ? `SW-ORD-${String(orderId).slice(-5).toUpperCase()}` : 'SW-ORD-12345'

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Confirmation banner */}
        <div className="bg-white rounded-2xl border border-green-200 p-8 text-center mb-6 shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Order Confirmed!</h1>
          <p className="text-gray-500 text-sm mb-4">Your order has been placed successfully</p>

          <div className="bg-sw-50 border border-sw-100 rounded-xl py-3 px-6 inline-block">
            <div className="text-xs text-sw-600 font-medium uppercase tracking-wider mb-0.5">Order Reference</div>
            <div className="text-2xl font-bold font-mono text-sw-700">{orderRef}</div>
          </div>
        </div>

        {/* Details card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">What happens next?</h3>
          <div className="space-y-3">
            {[
              { icon: '📧', title: 'Confirmation email sent', desc: 'Invoice and order details sent to your email' },
              { icon: '💬', title: 'WhatsApp updates enabled', desc: 'You\'ll receive status updates via WhatsApp' },
              { icon: '🏭', title: 'Production starting', desc: 'Estimated dispatch within 1–2 working days' },
              { icon: '🚚', title: 'Delivery to your site', desc: 'Driver contact shared before delivery' },
            ].map((step) => (
              <div key={step.title} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-sw-50 rounded-lg flex items-center justify-center text-base flex-shrink-0">{step.icon}</div>
                <div>
                  <div className="font-medium text-gray-800 text-sm">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button className="flex flex-col items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-4 hover:bg-sw-50 hover:border-sw-300 transition-all text-center">
            <Download className="w-5 h-5 text-sw-500" />
            <span className="text-xs font-medium text-gray-700">Download Invoice</span>
          </button>
          <Link href="/tds-library" className="flex flex-col items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-4 hover:bg-sw-50 hover:border-sw-300 transition-all text-center">
            <Package className="w-5 h-5 text-sw-500" />
            <span className="text-xs font-medium text-gray-700">View TDS Library</span>
          </Link>
          <Link href="/products" className="flex flex-col items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-4 hover:bg-sw-50 hover:border-sw-300 transition-all text-center">
            <ArrowRight className="w-5 h-5 text-sw-500" />
            <span className="text-xs font-medium text-gray-700">Place Another Order</span>
          </Link>
        </div>

        {/* Track order */}
        <div className="bg-sw-800 rounded-xl p-5 text-white flex items-center justify-between">
          <div>
            <div className="font-semibold mb-0.5">Track your order live</div>
            <div className="text-sw-200 text-xs">WhatsApp updates sent to your registered number</div>
          </div>
          <Link href="/portal/dashboard" className="bg-sw-500 hover:bg-sw-400 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap">
            <MessageSquare className="w-4 h-4" /> Portal →
          </Link>
        </div>
      </div>
    </div>
  )
}
