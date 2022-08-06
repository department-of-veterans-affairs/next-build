import Footer from '@/components/footer'
import { Banner } from '@/components/banner'
import { transformBannerDataService } from '@/components/banner/dataService'
import { isEmpty } from 'lodash'
export interface LayoutProps {
  children?: React.ReactNode
  props?: any
  bannerData?: any
  footerData: object
}

export default function Layout({
  bannerData,
  footerData,
  children,
}: LayoutProps) {
  const banner =
    bannerData && !isEmpty(bannerData) ? (
      <Banner {...transformBannerDataService({ bannerData })} />
    ) : null

  const footer =
    footerData && !isEmpty(footerData) ? <Footer links={footerData} /> : null

  return (
    <>
      {banner}
      <main>{children}</main>
      {footer}
    </>
  )
}
