import { MediaImage } from '@/types/formatted/media'
import { Administration } from '@/types/formatted/administration'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { HealthCareLocalFacility } from '../healthCareLocalFacility/formatted-type'
import { FormattedRelatedLinks } from '@/types/formatted/relatedLinks'
import { NodeHealthCareRegionPage } from '@/types/drupal/node'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'
import { NewsStoryTeaser } from '../newsStory/formatted-type'
import { EventWidgetTeaser } from '../event/formatted-type'
import { SocialLink } from '@/lib/utils/social'

export type MinimalLocalFacility = Pick<
  HealthCareLocalFacility,
  | 'title'
  | 'path'
  | 'operatingStatusFacility'
  | 'address'
  | 'mainPhoneString'
  | 'mentalHealthPhoneNumber'
  | 'vaHealthConnectPhoneNumber'
  | 'image'
>

export type VamcSystemSocialLinks = {
  regionNickname: string
  links: SocialLink[]
}

export type VamcSystem = PublishedEntity & {
  title: string
  introText: string
  image: MediaImage
  administration: Administration
  menu: SideNavMenu
  path: string
  mainFacilities: MinimalLocalFacility[]
  featuredStories: NewsStoryTeaser[]
  featuredEvents: EventWidgetTeaser[]
  fallbackEvent: EventWidgetTeaser | null
  relatedLinks: FormattedRelatedLinks
  vamcEhrSystem: NodeHealthCareRegionPage['field_vamc_ehr_system']
  lovellVariant?: LovellChildVariant | null
  lovellSwitchPath?: string | null
  socialLinks: VamcSystemSocialLinks
}
