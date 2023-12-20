export const BannerDisplayType = {
  PROMO_BANNER: 'promoBanner',
  FACILITY_BANNER: 'facilityBanner',
  BANNER: 'banner',
}

export const BannerTypeMapping = {
  [BannerDisplayType.PROMO_BANNER]: 'node--promo_banner',
  [BannerDisplayType.FACILITY_BANNER]: 'node--full_width_banner_alert',
  [BannerDisplayType.BANNER]: 'node--banner',
}

export type BannersData = Array<Banner | PromoBanner | FacilityBanner>

export type Banner = {
  id: string
  title: string
  body?: string
  alertType?: string
  dismiss?: boolean
  type?: string
}

export type PromoBanner = {
  id: string
  title?: string
  href?: string
  alertType?: string
  dismiss?: boolean
  type?: string
}

export type BannerAlertVamcs = {
  id: string
  path?: string
  office?: { path: string }
}

export type FacilityBanner = {
  id: string
  title: string
  body?: string
  fieldAlertType?: string
  dismiss?: boolean
  path?: string
  type?: string
  operatingStatus?: boolean
  findFacilities?: string
  inheritanceSubpages?: boolean
  bannerAlertVamcs?: BannerAlertVamcs[]
}
