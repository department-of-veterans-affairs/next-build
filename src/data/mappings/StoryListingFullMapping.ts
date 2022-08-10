import { StoryListingFullType } from '@/types/index'
import { NodeStoryListing } from '@/types/data-types/drupal/node'
import { queries } from '../queries'

export const StoryListingFullMapping = async function (
  entity: NodeStoryListing
): Promise<StoryListingFullType> {
  const stories = await queries.getData('story_listing--news_stories', {
    listingId: entity.id,
  })
  return {
    id: entity.id,
    type: entity.type,
    published: entity.status,
    title: entity.title,
    introText: entity.field_intro_text,
    stories: stories,
  }
}
