import { recordEvent } from '@/lib/analytics/recordEvent'
import Link from 'next/link'
import {
  Contact,
  AdditionalContact as FormattedAdditionalContact,
  BenefitHubContact,
  ContactInfo as FormattedContactInfo,
  EmailContact as FormattedEmailContact,
  PhoneContact as FormattedPhoneContact,
  PressContact,
} from '@/types/formatted/contactInfo'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ParagraphComponent } from '@/types/formatted/paragraph'

const analytic = (header) => {
  return {
    event: 'nav-linkslist',
    'links-list-header': `${encodeURIComponent(header)}`,
    'links-list-section-header': 'Need more help?',
  }
}

// simple contact info base component
export const DefaultContact = ({ title, value, href }: Contact) => {
  return (
    <>
      <strong>{title} </strong>
      <Link
        onClick={() => recordEvent(analytic(value))}
        href={href}
        rel="noreferrer noopener"
        passHref
      >
        {value}
      </Link>
    </>
  )
}

export const EmailContact = (
  email: ParagraphComponent<FormattedEmailContact>
) => {
  return (
    <li className="vads-u-margin-top--1">
      <DefaultContact
        title={email.label}
        value={email.address}
        href={`mailto:${email.address}`}
      />
    </li>
  )
}

export const PhoneContact = (
  phone: ParagraphComponent<FormattedPhoneContact>
) => {
  const phoneNumber = phone.extension
    ? `${phone.number}p${phone.extension}`
    : phone.number

  return (
    <li className="vads-u-margin-top--1">
      <DefaultContact
        title={phone.label}
        value={phoneNumber}
        href={`tel:${phoneNumber}`}
      />
    </li>
  )
}

// nested paragraphs
const AdditionalContact = (contact: FormattedAdditionalContact) => {
  switch (contact.type) {
    case PARAGRAPH_RESOURCE_TYPES.EMAIL_CONTACT:
      return <EmailContact {...(contact as FormattedEmailContact)} />

    case PARAGRAPH_RESOURCE_TYPES.PHONE_CONTACT:
      return <PhoneContact {...(contact as FormattedPhoneContact)} />
  }
}

// node--support-service nodes that get included
const BenefitHubContacts = ({ services }: BenefitHubContact) => {
  return services.map((s) => (
    <li className="vads-u-margin-top--1" key={s.title}>
      <DefaultContact {...s} />
    </li>
  ))
}

// wrapper around all types of contact info
// content-build/src/site/paragraphs/contact_information.drupal.liquid
export function ContactInfo({
  contactType,
  defaultContact,
  additionalContact,
  benefitHubContacts,
}: ParagraphComponent<FormattedContactInfo>) {
  const useDefaultContact =
    contactType === 'DC' && defaultContact && !additionalContact

  return (
    <div className="vads-u-background-color--gray-light-alt">
      <div className="usa-grid usa-grid-full">
        <div className="usa-width-three-fourths">
          <div className="usa-content vads-u-padding-x--1 desktop-lg:vads-u-padding-x--0">
            <section
              className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-y--2"
              data-template="paragraphs/contact_information"
            >
              <h2 className="vads-u-font-size--h3 vads-u-border-bottom--4px vads-u-border-color--primary vads-u-margin--0 vads-u-margin-y--1 vads-u-padding-bottom--1">
                Need more help?
              </h2>
              {useDefaultContact ? (
                <DefaultContact {...defaultContact} />
              ) : (
                <ul
                  className="usa-unstyled-list vads-u-display--flex vads-u-flex-direction--column"
                  role="list"
                >
                  {additionalContact && (
                    <AdditionalContact {...additionalContact} />
                  )}

                  {contactType === 'BHC' && benefitHubContacts && (
                    <BenefitHubContacts services={benefitHubContacts} />
                  )}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
