import { Banner } from 'templates/banner'
import Footer from 'templates/footer'
import { Node } from 'data/delegators/Node'
import { isEmpty } from 'lodash'
export interface LayoutProps {
  children?: React.ReactNode
  props?: any
  bannerData?: any
}

export default function Layout({ props, bannerData, children }: LayoutProps) {
  if (isEmpty(bannerData)) bannerData = props.bannerData

  return (
    <>
      {bannerData &&
        bannerData?.map((banner) => <Banner key={banner.id} {...banner} />)}

      {children}
    </>
  )
}
