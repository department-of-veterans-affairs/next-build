import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type AdditionalContact = PhoneContact | EmailContact

// TODO: Is this being used? benefitHubContacts is typed as Contact[] not BenefitHubcontact[]
export type BenefitHubContact = {
  services: Contact[]
}

export type Contact = {
  title: string
  value: string
  href: string
}

export type ContactInfo = PublishedParagraph & {
  type: 'paragraph--contact_information'
  contactType: 'DC' | 'BHC'
  defaultContact?: Contact
  additionalContact?: AdditionalContact
  benefitHubContacts?: Contact[]
}

export type EmailContact = PublishedParagraph & {
  type: 'paragraph--email_contact'
  label: string
  address: string
}

export type PhoneContact = PublishedParagraph & {
  type: 'paragraph--phone_number'
  label: string
  number: string
  extension: string
}

export type PressContact = {
  id: string
  name: string
  description: string
  phone: string
  email: string
}
