import {
  FieldAddress,
  FieldGeoLocation,
  FieldOfficeHours,
} from '../drupal/field_type'
import { FacilityOperatingStatusFlags } from '../drupal/node'
import { ParagraphPhoneNumber } from '../drupal/paragraph'
import { VamcEhr } from '../drupal/vamcEhr'
import { PublishedEntity } from './publishedEntity'
import { FormattedRelatedLinks } from './relatedLinks'
import { SideNavMenu } from './sideNav'
import { MediaImage } from '@/types/formatted/media'
import { FacilitySocialLinksProps } from '@/templates/layouts/healthCareLocalFacility/FacilitySocialLinks'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'

export type HealthCareLocalFacility = PublishedEntity & {
  introText: string | null
  operatingStatusFacility: FacilityOperatingStatusFlags
  menu: SideNavMenu | null
  path: string
  administration?: { entityId: number }
  vamcEhrSystem: VamcEhr['field_region_page']['field_vamc_ehr_system']
  officeHours: FieldOfficeHours[]
  address: FieldAddress
  phoneNumber: string
  image: MediaImage
  facilityLocatorApiId: string
  geoLocation: FieldGeoLocation
  fieldTelephone: ParagraphPhoneNumber | null
  vaHealthConnectPhoneNumber: string | null
  relatedLinks: FormattedRelatedLinks
  locationServices: Array<{
    title: string
    /**
     * The HTML output of the WYSIWYG editor, processed through `getHtmlFromField()`
     */
    wysiwigContents: string
  }>
  socialLinks: FacilitySocialLinksProps
  lovellVariant?: LovellChildVariant
  lovellSwitchPath?: string
}
