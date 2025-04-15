import { ParagraphPhoneNumber } from '@/types/drupal/paragraph'

export interface SeparatedPhoneNumber {
  phoneNumber: string
  extension: string
  processed: boolean
}

export const separatePhoneNumberExtension = (
  phoneNumber: string
): SeparatedPhoneNumber | null => {
  if (!phoneNumber) {
    return null
  }

  const phoneRegex =
    /\(?(\d{3})\)?[- ]*(\d{3})[- ]*(\d{4}),?(?: ?x\.? ?(\d*)| ?ext\.? ?(\d*))?(?!([^<]*>)|(((?!<v?a).)*<\/v?a.*>))/i

  const match = phoneRegex.exec(phoneNumber)

  if (!match || !match[1] || !match[2] || !match[3]) {
    // Short number, invalid format, or not a full US number
    return {
      phoneNumber,
      extension: '',
      processed: false,
    }
  }

  const phone = `${match[1]}-${match[2]}-${match[3]}`
  const extension = match[4] || match[5] || ''

  return {
    phoneNumber: phone,
    extension,
    processed: true,
  }
}

export const processPhoneToVaTelephoneOrFallback = (
  phoneNumber: string = ''
) => {
  const internationalPattern = /\(?(\+1)\)?[- ]?/gi

  if (!phoneNumber) {
    return null
  }

  const separated = separatePhoneNumberExtension(phoneNumber)

  if (separated.processed) {
    return (
      <va-telephone
        contact={separated.phoneNumber}
        extension={separated.extension}
        international={internationalPattern.test(phoneNumber)}
      />
    )
  }

  return <a href={`tel:+1${phoneNumber}`}>{phoneNumber}</a>
}

const PhoneNumberNoHeader = ({
  phoneNumber,
  phoneExtension,
  phoneNumberType,
  phoneLabel = 'Mental health care',
}: {
  phoneNumber: string
  phoneExtension?: string
  phoneNumberType?: string
  phoneLabel?: string
}) => {
  if (!phoneNumber) return null

  const isSms = phoneNumberType === 'sms'
  const isTty = phoneNumberType === 'tty'
  const isFax = phoneNumberType === 'fax'

  let partialPhoneNumber = phoneNumber
  let partialPhoneExtension = phoneExtension

  if (!phoneExtension) {
    const separated = separatePhoneNumberExtension(phoneNumber)
    partialPhoneNumber = separated.phoneNumber
    partialPhoneExtension = separated.extension
  }

  return (
    <p className="vads-u-margin-bottom--0 vads-u-margin-top--0">
      <strong>{phoneLabel}: </strong>
      <va-telephone
        contact={partialPhoneNumber.replace(/-/g, '')}
        extension={partialPhoneExtension || ''}
        {...(!isFax &&
          !isTty &&
          !isSms && {
            'message-aria-describedby': phoneLabel,
          })}
        {...(isFax && { 'not-clickable': true })}
        {...(isSms && { sms: true })}
        {...(isTty && { tty: true })}
      />
    </p>
  )
}

export const Phone = ({
  phoneNumber,
  vaHealthConnectPhoneNumber,
  fieldTelephone,
}: {
  phoneNumber?: string
  vaHealthConnectPhoneNumber?: string
  fieldTelephone?: ParagraphPhoneNumber | null
}) => {
  return (
    <div className="vads-u-margin-bottom--0">
      {phoneNumber && (
        <p className="main-phone vads-u-margin-bottom--1 vads-u-margin-top--0">
          <strong>Main phone: </strong>
          {processPhoneToVaTelephoneOrFallback(phoneNumber)}
        </p>
      )}

      {vaHealthConnectPhoneNumber && (
        <p className="vads-u-margin-bottom--1 vads-u-margin-top--0">
          <strong>VA health connect: </strong>
          {processPhoneToVaTelephoneOrFallback(vaHealthConnectPhoneNumber)}
        </p>
      )}

      {fieldTelephone?.field_phone_number && (
        <PhoneNumberNoHeader
          phoneNumber={fieldTelephone.field_phone_number}
          phoneExtension={fieldTelephone.field_phone_extension}
          phoneNumberType={fieldTelephone.field_phone_number_type}
          phoneLabel={fieldTelephone.field_phone_label}
        />
      )}
    </div>
  )
}
