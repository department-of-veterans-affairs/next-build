import { NewsStoryFullType } from '@/types/index'
import { NodeNewsStory } from '@/types/data-types/drupal/node'
import { mediaImageDataService } from '@/templates/common/media/dataService'
import { generalEntityDataService } from '@/data/delegators/generalEntityDataService'

export const NewsStoryFullMapping = function (
  entity: NodeNewsStory
): NewsStoryFullType {
  return {
    id: entity.id,
    type: entity.type,
    published: entity.status,
    title: entity.title,
    image: mediaImageDataService(entity.field_media),

    caption: entity.field_image_caption,
    author: generalEntityDataService(entity.field_author, 'teaser'),
    introText: entity.field_intro_text,
    bodyContent: entity.field_full_story?.processed,
    date: entity.created,
    socialLinks: {
      path: entity.path.alias,
      title: entity.title,
    },
    listing: entity.field_listing.path.alias,
  }
}
