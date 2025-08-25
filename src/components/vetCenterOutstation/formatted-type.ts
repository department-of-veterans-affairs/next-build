import {
  FieldGeoLocation,
  FieldOfficeHours,
  FieldAdministration,
  FieldAddress,
} from '@/types/drupal/field_type'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { VetCenterHealthServices as FormattedHealthServices } from '@/types/formatted/vetCenterHealthServices'
import { FeaturedContent as FormattedFeaturedContent } from '@/types/formatted/featuredContent'
import { MediaImage as FormattedMediaImage } from '@/types/formatted/media'
import { AccordionItem as FormattedAccordionItem } from '@/types/formatted/accordion'
import { Wysiwyg as FormattedWysiwyg } from '@/types/formatted/wysiwyg'
import { QaSection as PublishedQaSection } from '@/types/formatted/qaSection'

export type VetCenterOutstation = PublishedEntity & {
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
  prepareForVisit: FormattedAccordionItem[]
  fieldFacilityLocatorApiId: string
  path: string
}
