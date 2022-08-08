import { Banner, BannerProps } from '@/components/banner'
export interface LayoutProps {
  children?: React.ReactNode
  props?: any
  bannerData?: BannerProps
}

export default function Layout({ bannerData, children }: LayoutProps) {
  return (
    <>
      {bannerData && <Banner {...bannerData} />}
      {children}
    </>
  )
}
