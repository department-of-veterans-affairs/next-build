import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { DrupalFile } from 'next-drupal'
import { MediaImage } from '@/components/mediaDocument/formatted-type'

type Link = {
  href: string
  label: string
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
}
