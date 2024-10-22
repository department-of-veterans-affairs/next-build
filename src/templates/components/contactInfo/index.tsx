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

const analytic = header => {
  return {
    event: 'nav-linkslist',
    'links-list-header': `${encodeURIComponent(header)}`,
    'links-list-section-header': 'Need more help?',
  }
}

const canUseWebComponent = telephone => {
  if (!telephone || /[a-zA-Z+]/.test(telephone)) {
    return false
  }

  return true
}

// simple contact info base component
export const BasicContact = ({ title, value, href }: Contact) => {
  if (!title || !value || !href) {
    return null
  }

  return (
    <>
      <strong>{title}&nbsp;</strong>
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
      <BasicContact
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
  const {
    extension,
    label,
    number
  } = phone

  if (label && number) {
    return (
      <li className="vads-u-margin-top--1">
        <strong>{label}&nbsp;</strong>
        <va-telephone
          contact={number}
          extension={extension || null}
        />
      </li>
    )
  }

  return null;
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
  return services.map(service => {
    if ('value' in service && canUseWebComponent(service.value)) {
      const phone = {
        extension: null,
        label: service.title,
        number: service.value
      }

      return <PhoneContact {...phone} id={service.title} key={service.title} />
    }

    return (
      <li className="vads-u-margin-top--1" key={service.title}>
        <BasicContact
          title={service.title}
          value={service.value}
          href={service.href}
        />
      </li>
    )
  })
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
    <div
      data-next-component="templates/components/contactInfo"
      className="vads-u-background-color--gray-light-alt"
    >
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
                <BasicContact {...defaultContact} />
              ) : (
                <ul className="usa-unstyled-list vads-u-display--flex vads-u-flex-direction--column">
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
