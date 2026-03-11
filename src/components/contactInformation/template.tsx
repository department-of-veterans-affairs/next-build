import React from 'react'
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import {
  ContactInformation as FormattedContactInformation,
  EmailContact as FormattedEmailContact,
  PhoneContact as FormattedPhoneContact,
} from '@/components/contactInformation/formatted-type'
import { PARAGRAPH_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

const canUseTelephone = (number: string) => {
  if (!number || /[a-zA-Z+]/.test(number)) return false
  return true
}

const toDigits = (n: string) => n.replace(/\D/g, '')

/** Standalone email contact paragraph (paragraph--email_contact) */
export function EmailContact({
  label,
  address,
}: {
  label: string
  address: string
}) {
  if (!label || !address) return null
  return (
    <p>
      <strong>{label}:</strong>{' '}
      <va-link href={`mailto:${address}`} text={address} />
    </p>
  )
}

/** Standalone phone contact paragraph (paragraph--phone_number) */
export function PhoneContact({
  label,
  number,
  extension,
}: {
  label?: string
  number: string
  extension?: string
}) {
  if (!number) return null
  const labelToShow = label || 'Phone'
  const useTelephone = canUseTelephone(number)
  return (
    <p>
      <strong>{labelToShow}:</strong>{' '}
      {useTelephone ? (
        <va-telephone
          contact={toDigits(number)}
          extension={extension || undefined}
        />
      ) : (
        <va-link href={`tel:${number}`} text={number} />
      )}
    </p>
  )
}

const DefaultContactBlock = ({
  defaultContact,
}: {
  defaultContact: NonNullable<FormattedContactInformation['defaultContact']>
}) => {
  const { label, number, href } = defaultContact
  const useTelephone = canUseTelephone(number)

  return (
    <p>
      Call <strong>{label}</strong> at{' '}
      {useTelephone ? (
        <va-telephone contact={toDigits(number)} />
      ) : (
        <va-link href={href} text={number} />
      )}
      . If you have hearing loss, call <VaTelephone contact="711" tty="true" />
    </p>
  )
}

const hasAdditionalContactContent = (
  contact: FormattedEmailContact | FormattedPhoneContact | null | undefined
): boolean => {
  if (!contact) return false
  if (contact.type === PARAGRAPH_RESOURCE_TYPES.EMAIL_CONTACT) {
    return !!(contact.label && contact.address)
  }
  return !!(contact.label && contact.number)
}

const AdditionalContactBlock = (
  contact: FormattedEmailContact | FormattedPhoneContact
) => {
  switch (contact.type) {
    case PARAGRAPH_RESOURCE_TYPES.EMAIL_CONTACT: {
      const { address, label } = contact as FormattedEmailContact
      if (!label || !address) return null
      return (
        <p>
          <strong>{label}:</strong>{' '}
          <va-link href={`mailto:${address}`} text={address} />
        </p>
      )
    }
    case PARAGRAPH_RESOURCE_TYPES.PHONE_CONTACT: {
      const { extension, label, number } = contact as FormattedPhoneContact
      if (!label || !number) return null
      const useTelephone = canUseTelephone(number)
      return (
        <p>
          <strong>{label}:</strong>{' '}
          {useTelephone ? (
            <va-telephone
              contact={toDigits(number)}
              extension={extension || undefined}
            />
          ) : (
            <va-link href={`tel:${number}`} text={number} />
          )}
        </p>
      )
    }
    default:
      return null
  }
}

const BenefitHubContactBlock = ({
  contact,
}: {
  contact: { label: string; number: string; href: string }
}) => {
  const { href, label, number } = contact
  const useTelephone = number && canUseTelephone(number)
  let contactEl: React.ReactNode = null
  if (number) {
    contactEl = useTelephone ? (
      <va-telephone contact={toDigits(number)} />
    ) : (
      <va-link href={href} text={number} />
    )
  }

  return (
    <p>
      <strong>{label}</strong> {contactEl}
    </p>
  )
}

/**
 * ContactInformation component for rendering a `paragraph--contact_information`.
 *
 * Shows a "Need more help?" section with contact info. Uses <section>, <p> tags,
 * <va-telephone> for phone numbers, and <va-link> for email addresses.
 */
export function ContactInformation({
  contactType,
  defaultContact,
  additionalContact,
  benefitHubContacts,
}: FormattedContactInformation) {
  const useDefaultContactOnly =
    contactType === 'DC' &&
    defaultContact &&
    !hasAdditionalContactContent(additionalContact)

  const section = (
    <section
      className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-y--2"
      data-template="paragraphs/contact_information"
    >
      <va-need-help>
        <div slot="content">
          {useDefaultContactOnly ? (
            <DefaultContactBlock defaultContact={defaultContact} />
          ) : (
            <>
              {contactType === 'DC' && defaultContact && (
                <DefaultContactBlock defaultContact={defaultContact} />
              )}

              {defaultContact &&
                additionalContact &&
                hasAdditionalContactContent(additionalContact) && (
                  <AdditionalContactBlock {...additionalContact} />
                )}

              {contactType === 'BHC' &&
                benefitHubContacts?.map((contact) => (
                  <BenefitHubContactBlock
                    key={contact.label}
                    contact={contact}
                  />
                ))}
            </>
          )}
        </div>
      </va-need-help>
    </section>
  )

  return (
    <div className="usa-content vads-u-padding-x--1 desktop-lg:vads-u-padding-x--0">
      {section}
    </div>
  )
}
