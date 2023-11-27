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
