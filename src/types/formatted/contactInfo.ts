import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type ContactInfo = PublishedParagraph & {
  type: 'paragraph--contact_information'
  contactType: 'DC' | 'BHC'
  defaultContact?: Contact
  additionalContact?: AdditionalContact
  benefitHubContacts?: Contact[]
}

export type Contact = {
  title: string
  value: string
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

export type BenefitHubContact = {
  services: AdditionalContact[]
}

export type PressContact = {
  id: string
  name: string
  description: string
  phone: string
  email: string
}
