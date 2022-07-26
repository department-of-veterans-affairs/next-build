import Footer from '@/components/footer'
import { Node } from '@/lib/delegators/Node'
import { isEmpty } from 'lodash'

export interface LayoutProps {
  children?: React.ReactNode
  props?: {
    // eslint-disable-next-line
    bannerData?: any
    footerData: object
  }
}

export default function Layout({ children, props }: LayoutProps) {
  return (
    <>
      {props?.bannerData &&
        !isEmpty(props?.bannerData) &&
        props.bannerData.map((banner) => (
          <Node key={banner.id} node={banner} />
        ))}

      <main>{children}</main>


      {props?.footerData && !isEmpty(props?.footerData) &&
          <Footer links={props?.footerData} />
      }
    </>
  )
}
