import { PhoneNumber } from '@/components/phoneNumber/template'
import { PhoneNumber as PhoneNumberType } from '@/components/phoneNumber/formatted-type'

export interface PhoneProps {
  mainPhoneString?: string
  vaHealthConnectPhoneNumber?: string
  mentalHealthPhoneNumber?: PhoneNumberType | null
}

export const Phone = ({
  mainPhoneString,
  vaHealthConnectPhoneNumber,
  mentalHealthPhoneNumber,
}: PhoneProps) => {
  if (
    !mainPhoneString &&
    !vaHealthConnectPhoneNumber &&
    !mentalHealthPhoneNumber
  ) {
    return null
  }

  return (
    <div data-testid="phone" className="vads-u-margin-bottom--0">
      {mainPhoneString && (
        <PhoneNumber
          className="main-phone vads-u-margin-bottom--1 vads-u-margin-top--0"
          label="Main phone"
          number={mainPhoneString}
        />
      )}

      {vaHealthConnectPhoneNumber && (
        <PhoneNumber
          className="vads-u-margin-bottom--1 vads-u-margin-top--0"
          label="VA health connect"
          number={vaHealthConnectPhoneNumber}
        />
      )}

      {mentalHealthPhoneNumber?.number && (
        <PhoneNumber
          className="vads-u-margin--0"
          {...mentalHealthPhoneNumber}
          // Note that this label is hardcoded for certain node types, like `node--health_care_local_facility`
          label="Mental health care"
        />
      )}
    </div>
  )
}
