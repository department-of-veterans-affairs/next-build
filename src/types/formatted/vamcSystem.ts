import { FieldLink } from '@/types/drupal/field_type'
import { DrupalMediaImage } from '@/types/drupal/media'
import { NodeRegionalHealthCareServiceDes } from '@/types/drupal/node'
import { ParagraphListOfLinks } from '@/types/drupal/paragraph'

export type VamcSystem = {
  title: string
  fieldDescription: string
  fieldIntroText: string
  fieldMedia: DrupalMediaImage
  fieldAdministration: {
    entityId: string
  }
  fieldVaHealthConnectPhone: string
  fieldVamcEhrSystem: string
  fieldVamcSystemOfficialName: string
  fieldFacebook: FieldLink
  fieldTwitter: FieldLink
  fieldInstagram: FieldLink | null
  fieldFlickr: FieldLink
  fieldYoutube: FieldLink | null
  fieldAppointmentsOnline: boolean
  fieldClinicalHealthServices: NodeRegionalHealthCareServiceDes[]
  fieldRelatedLinks: ParagraphListOfLinks
  path: string
}
