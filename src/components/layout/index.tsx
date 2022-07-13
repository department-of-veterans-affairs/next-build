import Footer from '@/components/footer'
import { NodeBanner } from '@/types/node'
import BannerComponent from '@/components/node/banner'

export interface LayoutProps {
  children?: React.ReactNode
  data?: NodeBanner[]
  props?: {
    bannerData?: NodeBanner[]
    footerData?: object
  }
}

export default function Layout({
  children,
  props: { bannerData, footerData },
}: LayoutProps) {
  if (!bannerData) return null
  if (!footerData) return null

  return (
    <>
      <main>{children}</main>
      <Footer links={footerData} />
    </>
  )
}
