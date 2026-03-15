import { NextRequest, NextResponse } from 'next/server'
import { ALL_PRODUCTS } from '@/lib/catalog'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categoryParam  = searchParams.get('category')
  const gradeParam     = searchParams.get('grade')
  const thicknessParam = searchParams.get('thickness')
  const inStock        = searchParams.get('inStock') === '1'

  let products = ALL_PRODUCTS.filter((p) => p.isActive)

  if (categoryParam) {
    products = products.filter((p) => p.category === categoryParam)
  }

  if (gradeParam) {
    const grades = gradeParam.split(',')
    products = products.filter((p) => grades.includes(p.grade))
  }

  if (thicknessParam) {
    const thicknesses = thicknessParam.split(',').map(Number)
    products = products.filter((p) => thicknesses.includes(p.thicknessMm))
  }

  if (inStock) {
    products = products.filter((p) => (p.inventory?.availableStock ?? 0) > 0)
  }

  return NextResponse.json(products)
}
