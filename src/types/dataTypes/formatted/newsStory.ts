import { ComponentType } from 'react'
import { PersonProfileTeaserProps } from '@/templates/components/personProfile'
import { SocialLinksProps } from '@/types/drupal/field_type'
import { Administration } from '@/types/formatted/administration'
import { BreadcrumbItem } from '@/types/drupal/field_type'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { MetaTag } from '@/types/formatted/metatags'
import { MediaImage } from '@/templates/common/mediaImage'

export type NewsStoryTeaser = PublishedEntity & {
  headingLevel?: ComponentType | keyof JSX.IntrinsicElements
  link: string
  title: string
  image: MediaImage
  introText: string
}

export type NewsStory = PublishedEntity & {
  title: string
  image: MediaImage
  caption: string
  author: PersonProfileTeaserProps
  introText: string
  bodyContent: string
  date: string
  socialLinks: SocialLinksProps
  listing: string
  entityId: number
  entityPath: string
  administration: Administration
  breadcrumbs: BreadcrumbItem[]
  metatags: MetaTag[]
}
