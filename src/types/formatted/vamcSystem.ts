import { ParagraphListOfLinks } from '@/types/drupal/paragraph'
import { MediaImage } from '@/types/formatted/media'
import { Administration } from '@/types/formatted/administration'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { PublishedEntity } from './publishedEntity'

export type VamcSystem = PublishedEntity & {
  title: string
  introText: string
  image: MediaImage
  administration: Administration
  menu: SideNavMenu
  path: string
  fieldRelatedLinks: ParagraphListOfLinks
}
