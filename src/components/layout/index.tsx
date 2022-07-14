import Footer from '@/components/footer'
import { NodeBanner } from '@/types/node'
import { Node } from '@/components/node'
import Banner from '@/components/node/banner'
export interface LayoutProps {
  children?: React.ReactNode
  data?: NodeBanner[]
  props?: {
    bannerData?: any
    footerData?: object
  }
}

export default function Layout({ children, props }: LayoutProps) {
  if (!props?.bannerData) return null
  if (!props?.footerData) return null

  return (
    <>
      {props.bannerData &&
        props.bannerData.map((banner) => (
          <Node key={banner.id} node={banner} />
        ))}
      <main>{children}</main>
      <Footer links={props?.footerData} />
    </>
  )
}
