import { ServiceLocation } from '@/components/serviceLocation/formatted-type'
import { FieldAddress } from '@/types/drupal/field_type'

export interface VhaFacilityNonclinicalService {
  id: string
  title: string
  path: string
  serviceLocations: ServiceLocation[]
  address: FieldAddress
  phoneNumber: string
}
