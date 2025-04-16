import { PhoneNumber, separateExtension } from '@/templates/common/phoneNumber'
import { ParagraphPhoneNumber } from '@/types/drupal/paragraph'
import { formatter as formatParagraphPhoneNumber } from '@/data/queries/phoneNumber'

export const processPhoneToVaTelephoneOrFallback = (
  phoneNumber: string = ''
) => {
  const internationalPattern = /\(?(\+1)\)?[- ]?/gi

  if (!phoneNumber) {
    return null
  }

  const separated = separateExtension(phoneNumber)

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

export const Phone = ({
  phoneNumber,
  vaHealthConnectPhoneNumber,
  fieldTelephone,
}: {
  phoneNumber?: string
  vaHealthConnectPhoneNumber?: string
  fieldTelephone?: ParagraphPhoneNumber | null
}) => {
  if (!phoneNumber && !vaHealthConnectPhoneNumber && !fieldTelephone) {
    return null
  }

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
        <PhoneNumber {...formatParagraphPhoneNumber(fieldTelephone)} />
      )}
    </div>
  )
}
