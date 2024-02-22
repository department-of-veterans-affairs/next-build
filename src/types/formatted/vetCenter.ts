import {
  FieldGeoLocation,
  FieldOfficeHours,
  FieldAdministration,
  FieldAddress,
} from '../drupal/field_type'
import { PublishedEntity } from './publishedEntity'
import { HealthServices as FormattedHealthServices } from './healthServices'
import { FeaturedContent as FormattedFeaturedContent } from './featuredContent'
import { MediaImage as FormattedMediaImage } from './media'
import { Accordion as FormattedAccordion } from './accordion'

type ccWysiwyg = {
  contentType: string
  content: {
    html: string
  }
}

export type VetCenter = PublishedEntity & {
  address: FieldAddress
  ccNonTraditionalHours: ccWysiwyg
  ccVetCenterCallCenter: ccWysiwyg
  // TODO with q_a
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ccVetCenterFaqs: any
  geolocation: FieldGeoLocation
  introText: string
  lastSavedByAnEditor: string | null
  officeHours: FieldOfficeHours[]
  officialName: string
  operatingStatusFacility: string
  operatingStatusMoreInfo: string | null
  phoneNumber: string
  timezone: string
  administration: FieldAdministration
  healthServices: FormattedHealthServices
  featuredContent: FormattedFeaturedContent[]
  counselingHealthServices: FormattedHealthServices
  referralHealthServices: FormattedHealthServices
  otherHealthServices: FormattedHealthServices
  image: FormattedMediaImage
  prepareForVisit: FormattedAccordion[]
  fieldFacilityLocatorApiId: string
  path: string
}
