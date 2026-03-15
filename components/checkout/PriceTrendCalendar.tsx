'use client'

/* ── Date slot definitions ────────────────────────────────────────
   delta = AED/sht adjustment above (positive) or below (negative)
   today's live rate.

   SPOT  — order now, request earliest dispatch.
           Sooner = best rate; price risk increases after ~5 days.

   STANDING — order now, pay now, schedule a future delivery date.
              Committing further ahead = advance-booking discount.
              Rewards customers who plan their project supply chain.
──────────────────────────────────────────────────────────────────── */
/* ── PRICING PRINCIPLE ────────────────────────────────────────────
   More lead time you give the factory → better rate for customer.
   Urgency (Today/Tomorrow) costs more; patience earns a discount.
   This applies to BOTH order types — Spot and Standing.
──────────────────────────────────────────────────────────────────── */

export const SPOT_DATE_SLOTS = [
  { offsetDays: 0,  delta:  2 },   // Today       — urgent premium +2
  { offsetDays: 1,  delta:  1 },   // Tomorrow    — slight premium +1
  { offsetDays: 2,  delta:  0 },   // +2d         — base rate
  { offsetDays: 3,  delta: -1 },   // +3d         — AED 1 off/sht
  { offsetDays: 5,  delta: -2 },   // +5d         — AED 2 off/sht
  { offsetDays: 7,  delta: -3 },   // +7d         — AED 3 off/sht
]

export const STANDING_DATE_SLOTS = [
  { offsetDays: 7,  delta:  0 },   // 1 week      — base rate
  { offsetDays: 14, delta: -1 },   // 2 weeks     — AED 1 off/sht
  { offsetDays: 21, delta: -2 },   // 3 weeks     — AED 2 off/sht
  { offsetDays: 30, delta: -3 },   // 1 month     — AED 3 off/sht
  { offsetDays: 45, delta: -4 },   // 6 weeks     — AED 4 off/sht
  { offsetDays: 60, delta: -5 },   // 2 months    — AED 5 off/sht
]

// Legacy export
export const DATE_SLOTS = SPOT_DATE_SLOTS
