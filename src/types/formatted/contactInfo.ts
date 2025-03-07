import { PublishedParagraph } from '@/types/formatted/publishedEntity'

/*
 * An individual contact (phone number or email address) used
 * by Resources & Support templates (Need more help? section) and
 * Benefit Hub Landing Pages ("Ask questions" section in sidebar)
 */
export type ContactInfo = PublishedParagraph & {
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

/*
 * When used as the default contact, represents the MyVA411 main info line.
 * For any type of contact, follows this format:
 * {Label}: {number} where the {number} is a link to the href
 * Example:
 *   <p>
 *     <span>MyVA411 main information line: </span> // label
 *     <va-link
 *       text="800-698-2411" // number
 *       href="tel:+18006982411" // href
 *     />
 *   </p>
 */
export type Contact = {
  /** The description for the phone number ("MyVA411 main information line") */
  label: string
  /** The user-friendly phone number used as the link text ("800-698-2411") */
  number: string
  /** The href used as the link for the phone number ("tel:+18006982411") */
  href: string
}

export type PhoneContact = PublishedParagraph & {
  type: 'paragraph--phone_number'
  /** The description for the phone number ("MyVA411 main information line") */
  label: string
  /** The phone number used as the link text and the href ("8006982411") */
  number: string
  /** Optional phone number extension ("4985") */
  extension: string
}

export type EmailContact = PublishedParagraph & {
  type: 'paragraph--email_contact'
  /** The description for the email address (e.g. person or department) */
  label: string
  /** The email address  used both for the link text and the href */
  address: string
}

export type AdditionalContact = PhoneContact | EmailContact

export type Phone = {
  id: string
  type: 'phone' | 'tty' | 'sms' | 'fax'
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
