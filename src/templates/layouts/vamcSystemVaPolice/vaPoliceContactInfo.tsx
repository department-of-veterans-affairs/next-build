import { PhoneNumber } from '@/templates/components/phoneNumber'
import type { PhoneNumber as PhoneNumberType } from '@/data/processors/phoneNumber'
import type { NodeHealthCareRegionPage } from '@/types/drupal/node'

export type VaPoliceContactInfoProps = {
  className?: string
  fieldOffice: NodeHealthCareRegionPage
  phoneNumber: PhoneNumberType
}

export function VaPoliceContactInfo({
  className,
  fieldOffice,
  phoneNumber,
}: VaPoliceContactInfoProps) {
  if (!phoneNumber?.number || !fieldOffice) {
    return null
  }

  return (
    <div className={className || undefined} id="field-phone-numbers">
      <h2 id="how-to-contact-us-police">How to contact us</h2>
      <p>
        Use our non-emergency phone number to request more information about VA
        police at {fieldOffice.title}.
      </p>
      <p>
        You can call us at <PhoneNumber phoneNumber={phoneNumber} />. We’re here
        24/7.
      </p>
    </div>
  )
}
