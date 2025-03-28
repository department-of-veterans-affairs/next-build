import { PhoneNumber } from '@/types/formatted/phoneNumber'

export function VaPoliceContactInfo({
  phoneNumber,
  fieldOfficeName,
}: {
  phoneNumber: PhoneNumber
  fieldOfficeName: string
}) {
  if (!phoneNumber?.number || !fieldOfficeName) {
    return null
  }
  return (
    <div
      className="vads-u-margin-bottom--4"
      id="field-phone-numbers"
      data-testid="va-police-contact-info"
    >
      <h2 id="how-to-contact-us-police">How to contact us</h2>
      <p data-testid="va-police-contact-info-name">
        Use our non-emergency phone number to request more information about VA
        police at {fieldOfficeName}.
      </p>
      <p>
        You can call us at{' '}
        <va-telephone
          data-testid="va-police-contact-info-phone-number"
          contact={phoneNumber.number}
          extension={phoneNumber.extension}
          // Commenting out for now as unsure what the expectation is for the label property that editors are using
          // message-aria-describedby={phoneNumber.label}
        />
        . We&apos;re here 24/7.
      </p>
    </div>
  )
}
