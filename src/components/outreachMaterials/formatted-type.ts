import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { MediaResourceType } from '@/types/drupal/media'

export type OutreachTopic = {
  name: string
  topicId: string
}

export type OutreachAssetDocumentMedia = {
  type: MediaResourceType.Document
  documentUrl: string
  documentFilesize: number
}

export type OutreachAssetImageMedia = {
  type: MediaResourceType.Image
  imageUrl: string
  imageAlt: string
  imageFilesize: number
}

export type OutreachAssetVideoMedia = {
  type: MediaResourceType.Video
  videoEmbedUrl: string
  videoThumbnailUrl: string
}

export type OutreachAssetMedia =
  | OutreachAssetDocumentMedia
  | OutreachAssetImageMedia
  | OutreachAssetVideoMedia

export type OutreachAsset = {
  id: string
  title: string
  description: string
  format: string
  categories: string[] // Array of topic IDs only
  media: OutreachAssetMedia
  // Derived fields (added during build)
  absoluteUrl?: string
  fileSize?: number
}

export type OutreachMaterials = PublishedEntity & {
  introText: string | null
  topics: OutreachTopic[] // Unique list of topics with names and IDs
  outreachAssets: OutreachAsset[]
}
