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
import { Wysiwyg as FormattedWysiwyg } from './wysiwyg'
import { QaSection as PublishedQaSection } from './qaSection'

export type VetCenter = PublishedEntity & {
  address: FieldAddress
  ccNonTraditionalHours: FormattedWysiwyg
  ccVetCenterCallCenter: FormattedWysiwyg
  ccVetCenterFaqs: PublishedQaSection
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
