// import { MediaImage } from '@/components/mediaDocument/formatted-type'
import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type Media = PublishedParagraph & {
  type: 'paragraph--media'
  // image: MediaImage
  image: {
    url: string
    alt: string
    title: string | null
  }
  allowClicksOnThisImage: boolean
}
