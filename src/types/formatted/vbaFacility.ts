import { FieldAddress, FieldOfficeHours } from '@/types/drupal/field_type'
import { FacilityOperatingStatusFlags } from '@/types/drupal/node'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { Wysiwyg as FormattedWysiwyg } from '@/types/formatted/wysiwyg'
import { PhoneContact as FormattedPhoneContact } from '@/types/formatted/contactInfo'

export type VbaFacility = PublishedEntity & {
  title: string
  ccBenefitsHotline: FormattedPhoneContact
  ccVBAFacilityOverview: FormattedWysiwyg
  officeHours: FieldOfficeHours[]
  operatingStatusFacility: FacilityOperatingStatusFlags
  operatingStatusMoreInfo: string | null
  phoneNumber: string
  address: FieldAddress
}
