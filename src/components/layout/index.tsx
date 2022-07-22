import Footer from '@/components/footer'
import { NodeBannerAlert } from '@/types/node'
import { Node } from '@/components/node'

export interface LayoutProps {
  children?: React.ReactNode
  props?: {
    // eslint-disable-next-line
    bannerData?: any 
    footerData: object
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
