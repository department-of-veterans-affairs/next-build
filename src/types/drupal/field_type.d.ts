export interface FieldAddress {
  langcode: string
  country_code: string
  administrative_area: string
  locality: string
  dependent_locality?: string
  postal_code?: string
  sorting_code?: string
  address_line1: string
  address_line2: string
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
  url: string //e.g. `/outreach-and-events/events/2424`
  title: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any[]
}
export interface FieldOfficeHours {
  day: number
  starthours: number
  endhours: number
  comment: string
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
  value: [string[]]
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
