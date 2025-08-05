import { FieldAddress, FieldOfficeHours } from '@/types/drupal/field_type'
import { FacilityOperatingStatusFlags } from '@/types/drupal/node'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { Wysiwyg as FormattedWysiwyg } from '@/types/formatted/wysiwyg'
import { PhoneContact as FormattedPhoneContact } from '@/types/formatted/contactInfo'
import { MediaImage as FormattedMediaImage } from '@/types/formatted/media'
import { AccordionItem as FormattedAccordionItem } from '@/types/formatted/accordion'
import { FeaturedContent as FormattedFeaturedContent } from '@/types/formatted/featuredContent'

type CantFindBenefits = {
  header: string | null
  description: string | null
  link: {
    label: string | null
    url: string | null
  }
}

export type VbaFacility = PublishedEntity & {
  title: string
  ccBenefitsHotline: FormattedPhoneContact
  ccVBAFacilityOverview: FormattedWysiwyg
  facilityLocatorApiId: string
  featuredContent: FormattedFeaturedContent[]
  fieldFacilityLocatorApiId: string
  image: FormattedMediaImage
  officeHours: FieldOfficeHours[]
  operatingStatusFacility: FacilityOperatingStatusFlags
  operatingStatusMoreInfo: string | null
  prepareForVisit: FormattedAccordionItem[]
  phoneNumber: string
  address: FieldAddress
  ccCantFindBenefits: CantFindBenefits | null
}
