import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodePublicationListing, NodeOutreachAsset } from '@/types/drupal/node'
import {
  DrupalMediaDocument,
  DrupalMediaImage,
  DrupalMediaVideo,
  MediaResourceType,
} from '@/types/drupal/media'
import { OutreachMaterials, OutreachAsset } from './formatted-type'
import { entityBaseFields } from '@/lib/drupal/entityBaseFields'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ListingPageDataOpts } from '@/lib/drupal/listingPages'
import {
  fetchAndConcatAllResourceCollectionPages,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { getNestedIncludes } from '@/lib/utils/queries'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'

// Define the query params for fetching node--publication_listing.
export const params: QueryParams<null> = () => {
  return new DrupalJsonApiParams()
}

// Define params for fetching outreach assets filtered by listing
const listingParams: QueryParams<string> = (listingEntityId: string) => {
  return new DrupalJsonApiParams()
    .addFilter('field_listing.id', listingEntityId)
    .addInclude([
      ...getNestedIncludes('field_media', [
        'media--document',
        'media--image',
        'media--video',
      ]),
      'field_lc_categories',
    ])
}

export type OutreachMaterialsData = {
  entity: NodePublicationListing
  outreachAssets: NodeOutreachAsset[]
}

// Implement the data loader.
export const data: QueryData<
  ListingPageDataOpts,
  OutreachMaterialsData
> = async (opts) => {
  const entity = (await fetchSingleEntityOrPreview(
    opts,
    RESOURCE_TYPES.PUBLICATION_LISTING,
    params
  )) as NodePublicationListing

  // Fetch list of outreach assets related to this listing
  // Note: Using direct Drupal query since OUTREACH_ASSET doesn't have a query module yet
  const { data: outreachAssets } =
    await fetchAndConcatAllResourceCollectionPages<NodeOutreachAsset>(
      RESOURCE_TYPES.OUTREACH_ASSET,
      listingParams(entity.id),
      PAGE_SIZES.MAX
    )

  return {
    entity,
    outreachAssets,
  }
}

export const formatter: QueryFormatter<
  OutreachMaterialsData,
  OutreachMaterials
> = ({ entity, outreachAssets }) => {
  // Build unique topic map first (topicId -> name)
  const topicMap = new Map<string, string>()

  outreachAssets.forEach((asset) => {
    asset.field_lc_categories?.forEach((cat) => {
      const topicId = cat.field_topic_id || ''
      if (topicId && !topicMap.has(topicId)) {
        topicMap.set(topicId, cat.name)
      }
    })
  })

  // Convert topic map to sorted array
  const topics = Array.from(topicMap.entries())
    .map(([topicId, name]) => ({ name, topicId }))
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))

  const formattedAssets: OutreachAsset[] = outreachAssets.map((asset) => {
    // Store only topic IDs as strings to reduce duplication
    const categories =
      asset.field_lc_categories
        ?.map((cat) => cat.field_topic_id || '')
        .filter((topicId) => topicId !== '') || []

    // Determine media type and extract fields
    let media: OutreachAsset['media']
    if (!asset.field_media) {
      // No media, default to document with empty values
      media = {
        type: MediaResourceType.Document,
        documentUrl: '',
        documentFilesize: 0,
      }
    } else if (asset.field_media.type === MediaResourceType.Document) {
      const docMedia = asset.field_media as DrupalMediaDocument
      media = {
        type: MediaResourceType.Document,
        documentUrl: docMedia.field_document?.uri.url ?? '',
        documentFilesize: docMedia.field_document?.filesize ?? 0,
      }
    } else if (asset.field_media.type === MediaResourceType.Image) {
      const imgMedia = asset.field_media as DrupalMediaImage
      media = {
        type: MediaResourceType.Image,
        imageUrl: imgMedia.image?.uri.url ?? '',
        imageAlt: imgMedia.image?.resourceIdObjMeta?.alt || '',
        imageFilesize: imgMedia.image?.filesize ?? 0,
      }
    } else if (asset.field_media.type === MediaResourceType.Video) {
      const vidMedia = asset.field_media as DrupalMediaVideo & {
        thumbnail?: {
          derivative?: {
            url: string
          }
        }
      }
      media = {
        type: MediaResourceType.Video,
        videoEmbedUrl: vidMedia.field_media_video_embed_field || '',
        videoThumbnailUrl: vidMedia.thumbnail?.derivative?.url || '',
      }
    } else {
      // Fallback to document type
      media = {
        type: MediaResourceType.Document,
        documentUrl: '',
        documentFilesize: 0,
      }
      console.error('Unknown media type', asset.field_media)
    }

    return {
      id: asset.id,
      title: asset.title,
      description: asset.field_description || '',
      format: asset.field_format || '',
      categories,
      media,
    }
  })

  return {
    ...entityBaseFields(entity),
    introText: entity.field_intro_text || null,
    topics,
    outreachAssets: formattedAssets,
  }
}
