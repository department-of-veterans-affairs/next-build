import { FieldLink } from '@/types/drupal/field_type'
import { NodeRegionalHealthCareServiceDes } from '@/types/drupal/node'
import { ParagraphListOfLinks } from '@/types/drupal/paragraph'
import { MediaImage } from '@/types/formatted/media'

export type VamcSystem = {
  title: string
  fieldIntroText: string
  fieldMedia: MediaImage
  fieldAdministration: {
    entityId: string
  }
  // fieldVaHealthConnectPhone: string
  // fieldVamcEhrSystem: string
  // fieldVamcSystemOfficialName: string
  // fieldFacebook: FieldLink
  // fieldTwitter: FieldLink
  // fieldInstagram: FieldLink | null
  // fieldFlickr: FieldLink
  // fieldYoutube: FieldLink | null
  // fieldAppointmentsOnline: boolean
  // fieldClinicalHealthServices: NodeRegionalHealthCareServiceDes[]
  fieldRelatedLinks: ParagraphListOfLinks
  path: string
}
