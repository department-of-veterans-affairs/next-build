import {
  FieldGeoLocation,
  FieldOfficeHours,
  FieldAdministration,
  FieldAddress,
} from '../drupal/field_type'
import { PublishedEntity } from './publishedEntity'
import { VetCenterHealthServices as FormattedHealthServices } from './vetCenterHealthServices'
import { FeaturedContent as FormattedFeaturedContent } from './featuredContent'
import { MediaImage as FormattedMediaImage } from './media'
import { AccordionItem as FormattedAccordionItem } from './accordion'
import { Wysiwyg as FormattedWysiwyg } from './wysiwyg'
import { QaSection as PublishedQaSection } from './qaSection'
import { FacilityOperatingStatusFlags } from '../drupal/node'

export type VetCenter = PublishedEntity & {
  address: FieldAddress
  ccNonTraditionalHours: FormattedWysiwyg
  ccVetCenterCallCenter: FormattedWysiwyg
  ccVetCenterFaqs: PublishedQaSection
  geolocation: FieldGeoLocation
  introText: string
  missionExplainer: {
    heading: string
    body: string
  }
  lastSavedByAnEditor: string | null
  officeHours: FieldOfficeHours[]
  officialName: string
  operatingStatusFacility: FacilityOperatingStatusFlags
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
  prepareForVisit: FormattedAccordionItem[]
  fieldFacilityLocatorApiId: string
  path: string
}
