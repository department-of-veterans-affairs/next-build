import { PhoneNumber } from '@/templates/common/phoneNumber'
import { ParagraphPhoneNumber } from '@/types/drupal/paragraph'
import { formatter as formatParagraphPhoneNumber } from '@/data/queries/phoneNumber'

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
        <PhoneNumber
          className="main-phone vads-u-margin-bottom--1 vads-u-margin-top--0"
          label="Main phone"
          number={phoneNumber}
        />
      )}

      {vaHealthConnectPhoneNumber && (
        <PhoneNumber
          className="vads-u-margin-bottom--1 vads-u-margin-top--0"
          label="VA health connect"
          number={vaHealthConnectPhoneNumber}
        />
      )}

      {fieldTelephone?.field_phone_number && (
        <PhoneNumber
          className="vads-u-margin--0"
          {...formatParagraphPhoneNumber(fieldTelephone)}
        />
      )}
    </div>
  )
}
