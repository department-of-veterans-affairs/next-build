import { PublishedParagraph } from '@/types/formatted/publishedEntity'
import { LinkTeaser } from '../linkTeaser/formatted-type'
import { MediaImage } from '../mediaDocument/formatted-type'

export type LinkTeaserWithImage = PublishedParagraph & {
  type: 'paragraph--link_teaser_with_image'
  teaser: LinkTeaser
  image: MediaImage
}
