import {
  FieldGeoLocation,
  FieldOfficeHours,
  FieldAdministration,
  FieldAddress,
} from '@/types/drupal/field_type'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { VetCenterHealthServices as FormattedHealthServices } from '@/components/vetCenterHealthServices/formatted-type'
import { FeaturedContent as FormattedFeaturedContent } from '@/components/featuredContent/formatted-type'
import { MediaImage as FormattedMediaImage } from '@/components/mediaDocument/formatted-type'
import { AccordionItem as FormattedAccordionItem } from '@/components/accordion/formatted-type'
import { Wysiwyg as FormattedWysiwyg } from '@/components/wysiwyg/formatted-type'
import { QaSection as PublishedQaSection } from '@/components/qaSection/formatted-type'

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
