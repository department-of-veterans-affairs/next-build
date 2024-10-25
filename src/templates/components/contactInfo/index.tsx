import {
  Contact,
  ContactInfo as FormattedContactInfo,
  EmailContact as FormattedEmailContact,
  PhoneContact as FormattedPhoneContact,
} from '@/types/formatted/contactInfo'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ParagraphComponent } from '@/types/formatted/paragraph'

const canUseWebComponent = telephone => {
  if (!telephone || /[a-zA-Z+]/.test(telephone)) {
    return false
  }

  return true
}

export const EmailContact = (
  email: ParagraphComponent<FormattedEmailContact>
) => {
  const { address, label } = email

  if (label && address) {
    return (
      <li className="vads-u-margin-top--1">
        <strong>{label}&nbsp;</strong>
        <va-link
          href={`mailto:${address}`}
          text={address}
        />
      </li>
    )
  }

  return null
}

export const PhoneContact = (
  phone: ParagraphComponent<FormattedPhoneContact>
) => {
  const { extension, label, number } = phone

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

  return null
}

// nested paragraphs
const AdditionalContact = (contact: FormattedEmailContact | FormattedPhoneContact) => {
  switch (contact.type) {
    case PARAGRAPH_RESOURCE_TYPES.EMAIL_CONTACT:
      return <EmailContact {...(contact as FormattedEmailContact)} />

    case PARAGRAPH_RESOURCE_TYPES.PHONE_CONTACT:
      return <PhoneContact {...(contact as FormattedPhoneContact)} />
  }
}

// node--support-service nodes that get included
const BenefitHubContacts = ({ contacts }) => {
  return contacts.map(contact => {
    const { href, label, number } = contact;

    if (number && canUseWebComponent(number)) {
      const phone = {
        extension: null,
        label,
        number
      }

      return <PhoneContact {...phone} id={label} key={label} />
    }

    return (
      <li className="vads-u-margin-top--1" key={label}>
        <strong>{label}&nbsp;</strong>
        <va-link
          href={href}
          text={number}
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
                <>
                  <strong>{defaultContact.label}&nbsp;</strong>
                  <va-link
                    href={defaultContact.href}
                    text={defaultContact.label}
                  />
                </>
              ) : (
                <ul className="usa-unstyled-list vads-u-display--flex vads-u-flex-direction--column">
                  {additionalContact && (
                    <AdditionalContact {...additionalContact} />
                  )}

                  {contactType === 'BHC' && benefitHubContacts && (
                    <BenefitHubContacts contacts={benefitHubContacts} />
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
