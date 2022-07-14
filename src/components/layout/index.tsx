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

export default function Layout({ children, props }: LayoutProps) {
  if (!props?.bannerData) return null
  if (!props?.footerData) return null

  return (
    <>
      <main>{children}</main>
      <Footer links={props?.footerData} />
    </>
  )
}
