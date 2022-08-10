import { NewsStoryTeaserType } from '@/types/index'
import { NodeNewsStory } from '@/types/data-types/drupal/node'
import { mediaImageDataService } from '@/templates/common/media/dataService'

export const NewsStoryTeaserMapping = function (
  entity: NodeNewsStory
): NewsStoryTeaserType {
  return {
    id: entity.id,
    type: entity.type,
    published: entity.status,
    headingLevel: 'foo', //headingLevel,
    title: entity.title,
    image: mediaImageDataService(entity.field_media),
    link: entity.path.alias,
    introText: entity.field_intro_text,
  }
}
