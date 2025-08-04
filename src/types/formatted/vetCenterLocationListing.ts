import { VetCenter } from './vetCenter'
import { PublishedEntity } from './publishedEntity'

export type VetCenterLocationListing = PublishedEntity & {
  title: string
  fieldOffice: VetCenter
  fieldNearbyMobileVetCenters: {
    title: string
    fieldPhoneNumber: string
  }[]
}
