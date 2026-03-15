import { formatAED } from '@/lib/utils'

interface OrderSummaryProps {
  baseAmount: number
  deliveryAmount: number
  addonsAmount: number
  vatAmount: number
  discount: number
  convenienceFee: number
  total: number
  promoCode?: string
}

export function OrderSummary({
  baseAmount, deliveryAmount, addonsAmount, vatAmount,
  discount, convenienceFee, total, promoCode
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-bold text-gray-800 mb-3">Order Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Base rate</span>
          <span className="font-medium">{formatAED(baseAmount)}</span>
        </div>
        {deliveryAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery</span>
            <span className="font-medium">{formatAED(deliveryAmount)}</span>
          </div>
        )}
        {addonsAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Add-ons</span>
            <span className="font-medium">{formatAED(addonsAmount)}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount {promoCode && `(${promoCode})`}</span>
            <span className="font-medium">-{formatAED(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">VAT (5%)</span>
          <span className="font-medium">{formatAED(vatAmount)}</span>
        </div>
        {convenienceFee > 0 && (
          <div className="flex justify-between text-xs text-gray-500">
            <span>Convenience fee (1.1%)</span>
            <span>{formatAED(convenienceFee)}</span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-base">
          <span>Total</span>
          <span className="text-sw-700">{formatAED(total)}</span>
        </div>
      </div>

      {/* Need help */}
      <div className="mt-4 p-3 bg-sw-50 rounded-lg border border-sw-100">
        <div className="text-xs font-semibold text-sw-700 mb-1">Need Help?</div>
        <div className="text-xs text-gray-600">+971 4 XXX XXXX</div>
        <button className="text-xs text-sw-500 hover:underline mt-0.5">Chat with our team ↗</button>
      </div>
    </div>
  )
}
