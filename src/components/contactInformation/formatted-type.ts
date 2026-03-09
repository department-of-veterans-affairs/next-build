import { PublishedParagraph } from '@/types/formatted/publishedEntity'

/*
 * Formatted data for paragraph--contact_information.
 * Used by the "Need more help?" section across q_a, support_resources_detail_page,
 * faq_multiple_q_a, step_by_step, checklist, and other layouts.
 */
export type ContactInformation = PublishedParagraph & {
  type: 'paragraph--contact_information'
  /** Indicator of default contact or benefit hub contact */
  contactType: 'DC' | 'BHC'
  /** Default contact uses basic label/number/href formatting */
  defaultContact?: Contact
  /** Additional contact can be either a PhoneContact or EmailContact */
  additionalContact?: AdditionalContact
  /** Benefit Hub contacts use label/number/href (Contact) formatting */
  benefitHubContacts?: Contact[]
}

export type Contact = {
  label: string
  number: string
  href: string
}

export type PhoneContact = PublishedParagraph & {
  type: 'paragraph--phone_number'
  label: string
  number: string
  extension: string
}

export type EmailContact = PublishedParagraph & {
  type: 'paragraph--email_contact'
  label: string
  address: string
}

export type AdditionalContact = PhoneContact | EmailContact

export type Phone = {
  id: string
  type: 'phone' | 'tty' | 'sms' | 'fax' | string
  number: string
  ext: string
}

export type PressContact = {
  id: string
  name: string
  description: string
  numbers: Phone[]
  email: string
}
