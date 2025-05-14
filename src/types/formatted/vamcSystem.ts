import { ParagraphListOfLinks } from '@/types/drupal/paragraph'
import { MediaImage } from '@/types/formatted/media'
import { Administration } from '@/types/formatted/administration'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { PublishedEntity } from './publishedEntity'
import { FieldAddress } from '../drupal/field_type'
import { ParagraphPhoneNumber } from '../drupal/paragraph'
import { FacilityOperatingStatusFlags } from '../drupal/node'

export type MinimalLocalFacility = {
  title: string
  path: string
  operatingStatusFacility: FacilityOperatingStatusFlags
  address: FieldAddress
  phoneNumber: string
  fieldTelephone: ParagraphPhoneNumber | null
  vaHealthConnectPhoneNumber: string | null
  image: MediaImage
}

export type VamcSystem = PublishedEntity & {
  title: string
  introText: string
  image: MediaImage
  administration: Administration
  menu: SideNavMenu
  path: string
  fieldRelatedLinks: ParagraphListOfLinks
  mainFacilities: MinimalLocalFacility[]
}
