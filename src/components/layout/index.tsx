import Footer from '@/components/footer'
import { NodeBanner } from '@/types/node'
import { Node } from '@/components/node'

export interface LayoutProps {
  children?: React.ReactNode
  data?: NodeBanner[]
  props?: {
    bannerData?: any
    footerData?: object
    facilitySideNavData?: any
  }
}

export default function Layout({ children, props }: LayoutProps) {
  if (!props?.bannerData) return null
  if (!props?.footerData) return null
  if (!props?.facilitySideNavData) return null

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
