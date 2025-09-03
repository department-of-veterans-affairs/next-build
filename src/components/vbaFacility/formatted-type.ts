import { FieldAddress, FieldOfficeHours } from '@/types/drupal/field_type'
import { FacilityOperatingStatusFlags } from '@/types/drupal/node'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { Wysiwyg as FormattedWysiwyg } from '@/components/wysiwyg/formatted-type'
import { PhoneContact as FormattedPhoneContact } from '@/components/contactInfo/formatted-type'
import { MediaImage as FormattedMediaImage } from '@/components/mediaDocument/formatted-type'
import { AccordionItem as FormattedAccordionItem } from '@/components/accordion/formatted-type'
import { FeaturedContent as FormattedFeaturedContent } from '@/components/featuredContent/formatted-type'
import { VamcFacilityServiceLocation } from '../healthCareLocalFacility/formatted-type'
import { SocialLink } from '@/lib/utils/social'

type CantFindBenefits = {
  header: string | null
  description: string | null
  link: {
    label: string | null
    url: string | null
  }
}
type VbaSocialLinksProps = {
  links: SocialLink[]
  heading: string
}
type VbaBanner = {
  showBanner: boolean | null
  alertType: 'information' | 'warning' | null
  title: string | null
  content: string | null
  dismissible: 'perm' | 'dismiss' | null
}
export type VbaFacilityService = {
  type: string
  name: string
  facilityHeader: string
  facilityDescription: string
  onlineSelfService: {
    title: string
    url: string
  } | null
  serviceDescription: string
  serviceLocations: VamcFacilityServiceLocation[]
}

export type VbaFacility = PublishedEntity & {
  title: string
  ccBenefitsHotline: FormattedPhoneContact
  ccVBAFacilityOverview: FormattedWysiwyg
  facilityLocatorApiId: string
  ccGetUpdates: VbaSocialLinksProps
  featuredContent: FormattedFeaturedContent[]
  image: FormattedMediaImage
  officeHours: FieldOfficeHours[]
  operatingStatusFacility: FacilityOperatingStatusFlags
  operatingStatusMoreInfo: string | null
  prepareForVisit: FormattedAccordionItem[]
  phoneNumber: string
  address: FieldAddress
  ccCantFindBenefits: CantFindBenefits | null
  banner: VbaBanner
  allServices: VbaFacilityService[]
}
