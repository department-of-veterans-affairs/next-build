import { ComponentType } from 'react'
import { PersonProfileTeaserProps } from '@/templates/components/staffNewsProfile'
import { SocialLinksProps } from '@/types/drupal/field_type'
import { Administration } from '@/types/formatted/administration'
import { PublishedEntity } from './publishedEntity'
import { MediaImage } from './media'

export type NewsStoryTeaser = PublishedEntity & {
  headingLevel?: ComponentType | keyof JSX.IntrinsicElements
  link: string
  image: MediaImage
  introText: string
}

export type NewsStory = PublishedEntity & {
  image: MediaImage
  caption: string
  author: PersonProfileTeaserProps
  introText: string
  bodyContent: string
  date: string
  socialLinks: SocialLinksProps
  listing: string
  administration: Administration
}
