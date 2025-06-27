import { PhoneNumber } from '@/templates/common/phoneNumber'
import { PhoneNumber as PhoneNumberType } from '@/types/formatted/phoneNumber'

export interface PhoneProps {
  phoneNumber?: string
  vaHealthConnectPhoneNumber?: string
  fieldTelephone?: PhoneNumberType | null
}

export const Phone = ({
  phoneNumber,
  vaHealthConnectPhoneNumber,
  fieldTelephone,
}: PhoneProps) => {
  if (!phoneNumber && !vaHealthConnectPhoneNumber && !fieldTelephone) {
    return null
  }

  return (
    <div data-testid="phone" className="vads-u-margin-bottom--0">
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

      <pre>{JSON.stringify(fieldTelephone, null, 2)}</pre>
      {fieldTelephone?.number && (
        <PhoneNumber
          className="vads-u-margin--0"
          {...fieldTelephone}
          // Note that this label is hardcoded for certain node types, like `node--health_care_local_facility`
          label="Mental health care"
        />
      )}
    </div>
  )
}
