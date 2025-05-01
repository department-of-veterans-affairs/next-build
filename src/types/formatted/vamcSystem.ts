import { FieldLink } from '@/types/drupal/field_type'
import { NodeRegionalHealthCareServiceDes } from '@/types/drupal/node'
import { ParagraphListOfLinks } from '@/types/drupal/paragraph'
import { MediaImage } from '@/types/formatted/media'
import { Administration } from '@/types/formatted/administration'
import { SideNavMenu } from '@/types/formatted/sideNav'

export type VamcSystem = {
  title: string
  introText: string
  image: MediaImage
  administration: Administration
  menu: SideNavMenu
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
