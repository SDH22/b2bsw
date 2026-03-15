import { SearchWidget } from '@/components/home/SearchWidget'
import { PriceIndexStrip } from '@/components/home/PriceIndexStrip'
import { HomeTrustBar } from '@/components/home/TrustBar'
import { QuickGrid } from '@/components/home/QuickGrid'
import { DealsCarousel } from '@/components/home/DealsCarousel'
import { WhySteelWood } from '@/components/home/WhySteelWood'

export default function HomePage() {
  return (
    <>
      <SearchWidget />
      <PriceIndexStrip />
      <HomeTrustBar />
      <QuickGrid />
      <DealsCarousel />
      <WhySteelWood />
    </>
  )
}
