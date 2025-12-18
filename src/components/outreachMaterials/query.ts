import { QueryData, QueryFormatter, QueryParams } from 'next-drupal-query'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodePublicationListing, NodeOutreachAsset } from '@/types/drupal/node'
import {
  DrupalMediaDocument,
  DrupalMediaImage,
  DrupalMediaVideo,
  MediaResourceType,
} from '@/types/drupal/media'
import { Menu } from '@/types/drupal/menu'
import { OutreachMaterials, OutreachAsset } from './formatted-type'
import { buildSideNavDataFromMenu } from '@/lib/drupal/facilitySideNav'
import { entityBaseFields } from '@/lib/drupal/entityBaseFields'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ListingPageDataOpts } from '@/lib/drupal/listingPages'
import {
  fetchAndConcatAllResourceCollectionPages,
  fetchSingleEntityOrPreview,
} from '@/lib/drupal/query'
import { fetchMenu } from '@/components/outreachHub/query'
import { getNestedIncludes } from '@/lib/utils/queries'

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
    .addSort('-created')
}

export type OutreachMaterialsData = {
  entity: NodePublicationListing
  outreachAssets: NodeOutreachAsset[]
  menu: Menu | null
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
      RESOURCE_TYPES.OUTREACH_ASSET as any, // Type assertion needed until query module exists
      listingParams(entity.id),
      10000 // Large limit since we're fetching all assets
    )

  const menu = await fetchMenu()

  return {
    entity,
    outreachAssets,
    menu,
  }
}

export const formatter: QueryFormatter<
  OutreachMaterialsData,
  OutreachMaterials
> = ({ entity, outreachAssets, menu }) => {
  const formattedAssets: OutreachAsset[] = outreachAssets.map((asset) => {
    const categories =
      asset.field_lc_categories?.map((cat) => ({
        name: cat.name,
        topicId: cat.field_topic_id || '',
      })) || []

    const media: OutreachAsset['media'] = {
      type: MediaResourceType.Document, // default
    }

    // Determine media type and extract fields
    if (!asset.field_media) {
      // No media, keep default
    } else if (asset.field_media.type === MediaResourceType.Document) {
      const docMedia = asset.field_media as DrupalMediaDocument
      media.type = MediaResourceType.Document
      media.documentUrl = docMedia.field_document?.uri.url ?? null
      media.documentFilesize = docMedia.field_document?.filesize
    } else if (asset.field_media.type === MediaResourceType.Image) {
      const imgMedia = asset.field_media as DrupalMediaImage
      media.type = MediaResourceType.Image
      media.imageUrl = imgMedia.image?.uri.url
      media.imageAlt = imgMedia.image?.resourceIdObjMeta?.alt || ''
      media.imageFilesize = imgMedia.image?.filesize
    } else if (asset.field_media.type === MediaResourceType.Video) {
      const vidMedia = asset.field_media as DrupalMediaVideo & {
        thumbnail?: {
          derivative?: {
            url: string
          }
        }
      }
      media.type = MediaResourceType.Video
      media.videoEmbedUrl = vidMedia.field_media_video_embed_field
      media.videoThumbnailUrl = vidMedia.thumbnail?.derivative?.url
    }

    return {
      id: asset.id,
      title: asset.title,
      description: asset.field_description || '',
      format: asset.field_format?.name || '',
      categories,
      media,
    }
  })

  const formattedMenu = menu
    ? buildSideNavDataFromMenu(entity.path.alias, menu)
    : null

  return {
    ...entityBaseFields(entity),
    introText: entity.field_intro_text || null,
    outreachAssets: formattedAssets,
    menu: formattedMenu,
  }
}
