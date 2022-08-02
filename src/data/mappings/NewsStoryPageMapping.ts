import { NewsStoryPageProps } from "@/types/index"
import { NodeNewsStory } from "data/types/drupal"
import { mediaImageDataService } from "@/components/media/dataService"
import { generalEntityDataService } from "@/lib/delegators/generalEntityDataService"

const NewsStoryPageMapping = function(node: NodeNewsStory): NewsStoryPageProps {
      return {
        type: node.type,
        published: node.status,
        title: node.title,
        image: mediaImageDataService(node.field_media),

        caption: node.field_image_caption,
        author: generalEntityDataService(node.field_author, 'teaser'),
        introText: node.field_intro_text,
        bodyContent: node.field_full_story?.processed,
        date: node.created,
        socialLinks: {
          path: node.path.alias,
          title: node.title,
        },
        listing: node.field_listing.path.alias,
      }
}

export default NewsStoryPageMapping
