import { Banner } from '@/templates/globals/banners/banner'
import { isEmpty } from 'lodash'
export interface LayoutProps {
  children?: React.ReactNode
  props?: any
  bannerData?: any
}

export function Wrapper({ props, bannerData, children }: LayoutProps) {
  if (isEmpty(bannerData)) bannerData = props?.bannerData

  return (
    <>
      {bannerData &&
        bannerData?.map((banner) => <Banner key={banner.id} {...banner} />)}
      {children}
    </>
  )
}
