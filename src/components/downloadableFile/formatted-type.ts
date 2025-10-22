import { PublishedParagraph } from '@/types/formatted/publishedEntity'

export type DownloadableFile = PublishedParagraph & {
  title: string
  mediaType: 'image' | 'document' | 'video'
  url: string
  extension?: string
}
