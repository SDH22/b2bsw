export type OrderStatus =
  | 'CONFIRMED'
  | 'IN_PRODUCTION'
  | 'READY_TO_DISPATCH'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'ISSUE'

export type PaymentMethod =
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'PDC'
  | 'LC'
  | 'TABBY'
  | 'TAMARA'
  | 'CARD_EMI'
  | 'BANK_TRANSFER'

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'PDC_PENDING'
  | 'LC_PROCESSING'

export interface OrderItem {
  productId: string
  skuCode: string
  name: string
  grade: string
  thicknessMm: number
  quantity: number
  unitPrice: number
  total: number
}

export interface Order {
  id: string
  orderRef: string
  companyId: string
  companyName: string
  items: OrderItem[]
  serviceTier: string
  zoneName: string
  deliveryAddress: string
  baseAmount: number
  deliveryAmount: number
  addonsAmount: number
  vatAmount: number
  discountAmount: number
  convenienceFee: number
  totalAmount: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  status: OrderStatus
  priceLocked: boolean
  priceLockExpiry?: string
  promoCode?: string
  projectName?: string
  consultantName?: string
  dispatchedAt?: string
  deliveredAt?: string
  createdAt: string
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  CONFIRMED: 'Confirmed',
  IN_PRODUCTION: 'In Production',
  READY_TO_DISPATCH: 'Ready to Dispatch',
  DISPATCHED: 'Dispatched',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  ISSUE: 'Issue',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  CONFIRMED: 'bg-blue-100 text-blue-800',
  IN_PRODUCTION: 'bg-yellow-100 text-yellow-800',
  READY_TO_DISPATCH: 'bg-orange-100 text-orange-800',
  DISPATCHED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  ISSUE: 'bg-red-200 text-red-900',
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CREDIT_CARD: 'Credit Card',
  DEBIT_CARD: 'Debit Card',
  PDC: 'Post-Dated Cheque',
  LC: 'Letter of Credit',
  TABBY: 'Tabby (4 payments)',
  TAMARA: 'Tamara (3 payments)',
  CARD_EMI: 'Card EMI',
  BANK_TRANSFER: 'Bank Transfer',
}
