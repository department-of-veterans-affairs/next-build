export type ContactInfo = {
  contactType: string // 'DC' or 'BHC'
  defaultContact?: Contact
  additionalContact?: AdditionalContact
  benefitHubContacts?: Contact[]
}

export type Contact = {
  title: string
  value: string
  href: string
}

type PhoneContact = {
  label: string
  number: string
  extension: string
}

export type EmailContact = {
  label: string
  address: string
}

export type AdditionalContact = {
  email?: EmailContact
  phone?: PhoneContact
}

export type BenefitHubContact = {
  services: Contact[]
}
