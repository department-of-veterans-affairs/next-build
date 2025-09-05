import { TaxonomyTermHealthCareServiceTaxonomy } from './taxonomy_term'

export interface FieldAddress {
  langcode: string
  country_code: string
  administrative_area: string
  locality: string
  dependent_locality?: string
  postal_code?: string
  sorting_code?: string
  address_line1?: string
  address_line2?: string
  organization?: string
}

export interface FieldFormattedText {
  value: string
  format: string
  processed: string
}

export interface SocialLinksProps {
  path: string
  title: string
}

export interface FieldFormattedTextWithSummary extends FieldFormattedText {
  summary: string
}

export interface FieldLink {
  uri: string //e.g. `entity:node/2424`
  url?: string //e.g. `/outreach-and-events/events/2424`
  title: string
  options: unknown[]
}

/**
 * Represents the hours of operation for an office.
 *
 * If `starthours` and `endhours` are `null` or `-1`, then the office is closed
 * on that day.
 */
export interface FieldOfficeHours {
  /** Numeric representation of the day of the week (0 is Sunday...I think...) */
  day: number
  /** Start time in military format (0–2359) or undefined; special values (0=midnight, 1200=noon). */
  starthours?: number
  /** End time in military format (0–2359) or undefined; special values (0=midnight, 1200=noon). */
  endhours?: number
  /** Optional comment about the day's hours (e.g., "Closed for lunch"). */
  comment?: string
}

export interface FieldSocialMediaLinks {
  platform: string
  value: string
  platform_values: {
    twitter: {
      value: string
    }
    facebook: {
      value: string
    }
    youtube: {
      value: string
    }
    instagram: {
      value: string
    }
    linkedin: {
      value: string
    }
  }
}

export interface FieldTable {
  value: string[][]
  caption: string
}

export interface FieldAdministration {
  drupal_internal__tid: number
  name: string
}

export interface FieldNestedLink {
  url: {
    path: string
  }
  uri: string
  title: string
}

export interface FieldCCNestedLink {
  uri: string
  title: string
  options?: {
    href?: string
    'data-entity-type'?: string
    'data-entity-uuid'?: string
    'data-entity-substitution'?: string
  }
}

export interface FieldCCNestedLinkTeaser {
  target_id: string
  target_revision_id: string
  type: string
  bundle: string
  pid: string
  label: string
  status: boolean
  langcode: string
  field_link: FieldLink[]
  field_link_summary: FieldNestedText[]
}

export interface FieldDateTimeRange {
  value: string
  end_value: string
  duration: number
  rrule: number
  rrule_index: number
  timezone: string
}

/**
 * Types for breadcrumb data
 */
export interface BreadcrumbItem {
  uri: string
  title: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any[]
}

export interface BreadCrumbLink {
  href: string
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any[]
}

/**
 * Types for services and health services
 */

export interface VetCenterFieldHealthService {
  field_body?: FieldFormattedText
  field_service_name_and_descripti: TaxonomyTermHealthCareServiceTaxonomy
}

export type VetCenterFieldHealthServicesArray = VetCenterFieldHealthService[]

export type FieldNestedText = {
  value: string
}

export type FieldNestedButton = {
  target_id: string
  target_revision_id: string
  type: string
  bundle: string
  pid: string
  label: string
  status: boolean
  langcode: string
  field_button_label: FieldNestedText[]
  field_button_link: FieldCCNestedLink[]
}
export interface FieldCCText {
  target_type: string
  target_id?: string
  fetched_bundle: string
  fetched: {
    field_wysiwyg: FieldFormattedText[]
  }
}
export interface FieldCCPhone {
  target_type: string
  target_id?: string
  target_field?: string
  fetched_bundle: string
  fetched: {
    field_phone_extension: FieldNestedText[]
    field_phone_label: FieldNestedText[]
    field_phone_number: FieldNestedText[]
    field_phone_number_type: FieldNestedText[]
  }
}

export interface FieldCCFeaturedContent {
  target_type: string
  target_id?: string
  target_field?: string
  fetched_bundle: string
  fetched: {
    field_cta: FieldNestedButton[]
    field_description: FieldFormattedText[]
    field_section_header: FieldNestedText[]
  }
}

export interface FieldCCListOfLinks {
  target_type: string
  target_id?: string
  target_field?: string
  fetched_bundle: string
  fetched: {
    field_links: FieldCCNestedLink[]
    field_section_header: FieldNestedText[]
  }
}

export interface FieldCCListOfLinkTeasers {
  target_type: string
  target_id?: string
  target_field?: string
  fetched_bundle: string
  fetched: {
    field_title: FieldNestedText[]
    field_va_paragraphs: FieldCCNestedLinkTeaser[]
  }
}

export interface FieldMissionExplainer {
  target_id?: string
  fetched_bundle: string
  fetched: {
    field_magichead_body: FieldFormattedText[]
    field_magichead_heading: Pick<FieldFormattedText, 'value'>[]
  }
}

export interface FieldVetCenterBannerImage {
  target_id?: string
  fetched_bundle: string
  fetched: {
    field_media: {
      target_id: string
    }[]
  }
}

export type FieldGeoLocation = {
  value: string
  geo_type: string
  lat: number
  lon: number
  left: number
  top: number
  right: number
  bottom: number
  geohash: string
  latlon: string
} | null
