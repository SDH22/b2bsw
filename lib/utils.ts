import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAED(amount: number): string {
  return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`
}

export function formatAEDFull(amount: number): string {
  return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function generateOrderRef(): string {
  const num = Math.floor(10000 + Math.random() * 90000)
  return `SW-ORD-${num}`
}

export function getStockStatus(available: number): { label: string; color: string; dotColor: string } {
  if (available <= 0) return { label: 'Out of stock', color: 'text-red-600', dotColor: 'bg-red-500' }
  if (available < 50) return { label: `Only ${available} left`, color: 'text-amber-600', dotColor: 'bg-amber-500' }
  if (available < 200) return { label: `${available} in stock`, color: 'text-green-600', dotColor: 'bg-green-500' }
  return { label: `${available}+ in stock`, color: 'text-green-700', dotColor: 'bg-green-500' }
}

export function getGradeBadgeClass(grade: string): string {
  switch (grade) {
    case 'MR': return 'bg-blue-100 text-blue-800'
    case 'FR': return 'bg-red-100 text-red-800'
    case 'AC': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-700'
  }
}
