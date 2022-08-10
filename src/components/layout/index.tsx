import { Node } from '@/lib/delegators/Node'
import { Banner, BannerProps } from '@/components/banner'
export interface LayoutProps {
  children?: React.ReactNode
  props?: any
  bannerData?: any
}

export default function Layout({ props, bannerData, children }: LayoutProps) {
  if(!bannerData) bannerData = props.bannerData || null

  return (
    <>
      {bannerData?.map((banner) => <Banner key={banner.id} {...banner} />) || null}
      {children}
    </>
  )
}
