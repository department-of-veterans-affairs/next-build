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
import { FacilityOperatingStatusFlags } from '@/types/drupal/node'

/**
 * Formatted data type for Vet Center Outstation pages.
 *
 * This mirrors the VetCenter formatted type structure to ensure
 * compatibility with the same component patterns and layouts.
 * Outstation pages should look and behave like Main Vet Center pages
 * but with some content differences.
 */
export type VetCenterOutstationPage = PublishedEntity & {
  // Location and contact information
  address: FieldAddress
  geolocation: FieldGeoLocation
  phoneNumber: string
  officeHours: FieldOfficeHours[]
  timezone: string
  fieldFacilityLocatorApiId: string

  // Basic information
  title: string
  officialName: string
  introText: string

  // Mission/commitment (reused from parent Vet Center)
  missionExplainer: {
    heading: string
    body: string
  } | null

  // Operating status
  operatingStatusFacility: FacilityOperatingStatusFlags
  operatingStatusMoreInfo: string | null

  // Images
  image: FormattedMediaImage
  bannerImage: FormattedMediaImage | null

  // Interactive sections
  prepareForVisit: FormattedAccordionItem[]
  featuredContent: FormattedFeaturedContent[]

  // Health services (grouped like Main VC)
  healthServices: FormattedHealthServices
  counselingHealthServices: FormattedHealthServices
  referralHealthServices: FormattedHealthServices
  otherHealthServices: FormattedHealthServices

  // Centralized content (CC) components
  ccNonTraditionalHours: FormattedWysiwyg
  ccVetCenterCallCenter: FormattedWysiwyg
  ccVetCenterFaqs: PublishedQaSection

  // Metadata
  lastSavedByAnEditor: string | null
  administration: FieldAdministration
  path: string

  // Parent Vet Center information for navigation
  parentVetCenter: {
    title: string
    path: string
  }
}
