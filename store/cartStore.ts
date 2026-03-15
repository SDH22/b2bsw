'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Grade, ServiceTier } from '@/types/product'

export interface CartItem {
  skuCode: string
  productId: string
  grade: Grade
  thicknessMm: number
  nameEn: string
  quantity: number
  unitPrice: number
  tier: ServiceTier
}

interface CartStore {
  items: CartItem[]
  zoneId: string
  zoneName: string
  addons: string[]
  promoCode: string
  addItem: (item: CartItem) => void
  removeItem: (skuCode: string) => void
  updateQty: (skuCode: string, qty: number) => void
  setZone: (id: string, name: string) => void
  toggleAddon: (addon: string) => void
  setPromoCode: (code: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      zoneId: '',
      zoneName: '',
      addons: [],
      promoCode: '',

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.skuCode === item.skuCode)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.skuCode === item.skuCode ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),

      removeItem: (skuCode) =>
        set((state) => ({ items: state.items.filter((i) => i.skuCode !== skuCode) })),

      updateQty: (skuCode, qty) =>
        set((state) => ({
          items: state.items.map((i) => (i.skuCode === skuCode ? { ...i, quantity: qty } : i)),
        })),

      setZone: (id, name) => set({ zoneId: id, zoneName: name }),
      toggleAddon: (addon) =>
        set((state) => ({
          addons: state.addons.includes(addon)
            ? state.addons.filter((a) => a !== addon)
            : [...state.addons, addon],
        })),
      setPromoCode: (code) => set({ promoCode: code }),
      clearCart: () => set({ items: [], addons: [], promoCode: '' }),
    }),
    { name: 'sw-cart' }
  )
)
