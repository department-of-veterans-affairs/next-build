import { QueryFormatter, QueryParams } from 'next-drupal-query'
import { ParagraphDownloadableFile } from '@/types/drupal/paragraph'
import { DownloadableFile } from '@/components/downloadableFile/formatted-type'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

export const params: QueryParams<null> = () =>
  new DrupalJsonApiParams().addInclude([
    'field_media',
    'field_media.field_document',
    'field_media.image',
  ])

export const formatter: QueryFormatter<
  ParagraphDownloadableFile,
  DownloadableFile
> = (entity: ParagraphDownloadableFile) => {
  const media = entity.field_media

  // Determine media type and extract URL
  let mediaType: 'image' | 'document' | 'video'
  let url: string
  let extension: string | null = null

  if (media.type === 'media--image') {
    mediaType = 'image'
    url = media.image.url
    extension = url.split('.').pop()?.toUpperCase()
  } else if (media.type === 'media--document') {
    mediaType = 'document'
    url = media.field_document.uri.url
    extension = url.split('.').pop()?.toUpperCase()
  } else if (media.type === 'media--video') {
    mediaType = 'video'
    url = media.field_media_video_embed_field
  } else {
    // Fallback for unknown media types
    mediaType = 'document'
    url = ''
  }

  return {
    id: entity.id,
    entityId: entity.drupal_internal__id,
    title: entity.field_title,
    type: entity.type,
    mediaType,
    url,
    extension,
  }
}
