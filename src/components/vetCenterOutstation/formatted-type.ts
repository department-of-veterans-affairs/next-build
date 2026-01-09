import {
  FieldGeoLocation,
  FieldOfficeHours,
  FieldAdministration,
  FieldAddress,
} from '@/types/drupal/field_type'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { VetCenterHealthServices as FormattedHealthServices } from '@/components/vetCenterHealthServices/formatted-type'
import { FacilityOperatingStatusFlags } from '@/types/drupal/node'
import { MediaImage as FormattedMediaImage } from '@/components/mediaDocument/formatted-type'
import { FeaturedContent as FormattedFeaturedContent } from '@/components/featuredContent/formatted-type'
import { AccordionItem as FormattedAccordionItem } from '@/components/accordion/formatted-type'
import { Wysiwyg as FormattedWysiwyg } from '@/components/wysiwyg/formatted-type'
import { QaSection as FormattedQaSection } from '@/components/qaSection/formatted-type'

export type VetCenterOutstation = PublishedEntity & {
  address: FieldAddress
  geolocation: FieldGeoLocation | null
  introText: string | null
  lastSavedByAnEditor: string | null
  officeHours: FieldOfficeHours[] | null
  officialName: string | null
  operatingStatusFacility: FacilityOperatingStatusFlags | null
  operatingStatusMoreInfo: string | null
  phoneNumber: string
  timezone: string | null
  administration: FieldAdministration | null
  healthServices: FormattedHealthServices
  counselingHealthServices: FormattedHealthServices
  referralHealthServices: FormattedHealthServices
  otherHealthServices: FormattedHealthServices
  image: FormattedMediaImage | null
  fieldFacilityLocatorApiId: string
  path: string
  prepareForVisit: FormattedAccordionItem[] | null
  featuredContent: FormattedFeaturedContent[] | null
  ccNonTraditionalHours: FormattedWysiwyg | null
  ccVetCenterCallCenter: FormattedWysiwyg | null
  ccVetCenterFaqs: FormattedQaSection | null
}
