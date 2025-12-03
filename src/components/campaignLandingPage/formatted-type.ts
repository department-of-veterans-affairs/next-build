import { SocialLink } from '@/lib/utils/social'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { DrupalFile } from 'next-drupal'
import {
  MediaImage,
  MediaVideo,
} from '@/components/mediaDocument/formatted-type'
import { ParagraphLinkTeaser } from '@/types/drupal/paragraph'
import { Button } from '../button/formatted-type'
import { LinkTeaser } from '../linkTeaser/formatted-type'
import { LinkTeaserWithImage } from '../linkTeaserWithImage/formatted-type'
import { MediaDocumentExternal } from '../mediaDocumentExternal/formatted-type'
import { Event } from '../event/formatted-type'

type Link = {
  href: string
  label: string
}

type Panel = {
  show: boolean
  header: string | null
  intro: string | null
}

export interface CampaignLandingPage extends PublishedEntity {
  title: string
  hero: {
    blurb: string
    image: MediaImage
  }
  cta: {
    primary?: Link | null
    secondary?: Link | null
  }
  whyThisMatters: string
  audience: { name: string }[]
  socialLinks: SocialLink[]
  whatYouCanDo: {
    header: string
    intro: string
    promos: {
      image: MediaImage
      link: ParagraphLinkTeaser
    }[]
  }
  video: {
    show: boolean
    header: string
    media: MediaVideo
    button: Button
  }
  spotlight: Panel & {
    cta: Button | null
    teasers: LinkTeaser[]
  }
  stories: Panel & {
    cta: {
      url: string
      label: string
    } | null
    teasers: LinkTeaserWithImage[]
  }
  resources: Panel & {
    cta: Button | null
    documents: MediaDocumentExternal[]
  }
  events: Omit<Panel, 'intro'> & {
    events: Event[]
  }
}
