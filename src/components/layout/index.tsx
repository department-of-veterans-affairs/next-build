import { Node } from '@/lib/delegators/Node'
import { Banner, BannerProps } from '@/components/banner'
export interface LayoutProps {
  children?: React.ReactNode
  props?: any
  bannerData?: any
}

export default function Layout({ bannerData, children }: LayoutProps) {
  const banners = bannerData
    ? bannerData.map((banner) => <Banner key={banner.id} {...banner} />)
    : null
  return (
    <>
      {banners}
      {children}
    </>
  )
}
