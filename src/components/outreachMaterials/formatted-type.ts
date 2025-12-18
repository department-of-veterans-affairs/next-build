import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { MediaResourceType } from '@/types/drupal/media'

export type OutreachAssetCategory = {
  name: string
  topicId: string
}

export type OutreachAssetMedia = {
  type: MediaResourceType
  // For document media
  documentUrl?: string
  documentFilesize?: number
  // For image media
  imageUrl?: string
  imageAlt?: string
  imageFilesize?: number
  // For video media
  videoEmbedUrl?: string
  videoThumbnailUrl?: string
}

export type OutreachAsset = {
  id: string
  title: string
  description: string
  format: string
  categories: OutreachAssetCategory[]
  media: OutreachAssetMedia
  // Derived fields (added during build)
  absoluteUrl?: string
  fileSize?: number
}

export type OutreachMaterials = PublishedEntity & {
  introText: string | null
  outreachAssets: OutreachAsset[]
  menu: SideNavMenu | null
}
