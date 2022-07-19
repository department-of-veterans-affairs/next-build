import Footer from '@/components/footer'
import { NodeBanner } from '@/types/node'
import { Node } from '@/components/node'

export interface LayoutProps {
  children?: React.ReactNode
  data?: NodeBanner[]
  props?: {
    bannerData?: any
    footerData?: object
    sideNavData?: any
  }
}

export default function Layout({ children, props }: LayoutProps) {
  if (!props?.bannerData) return null
  if (!props?.footerData) return null
  if (!props?.sideNavData) return null

  console.log('LAYOUT SECONDARY MENU', props.sideNavData)
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
