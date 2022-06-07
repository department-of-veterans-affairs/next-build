export interface FieldAddress {
  langcode: string
  country_code: string
  administrative_area: string
  locality: string
  dependent_locality: string
  postal_code: string
  sorting_code: string
  address_line1: string
  address_line2: string
}

export interface FieldFormattedText {
  value: string
  format: string
  processed: string
}

export interface FieldFormattedTextWithSummary extends FieldFormattedText {
  summary: string
}

export interface FieldLink {
  uri: string
  title: string
  options: [string[]]
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
