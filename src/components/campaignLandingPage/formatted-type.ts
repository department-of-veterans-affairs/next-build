import { PublishedEntity } from '@/types/formatted/publishedEntity'

type Link = {
  href: string
  label: string
}

export interface CampaignLandingPage extends PublishedEntity {
  title: string
  hero: {
    cta: {
      primary?: Link | null
      secondary?: Link | null
    }
    blurb: string
    image: {
      url: string
    }
  }
}
