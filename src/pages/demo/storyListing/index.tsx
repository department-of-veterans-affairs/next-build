import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalNode } from 'next-drupal'
import StoryListing from '@/components/node/story_listing'
import { NodeNewsStory } from '@/types/node'
import { filter } from 'lodash'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

interface StoryListingPageProps {
  nodeStoryListing: DrupalNode[]
  nodeNewsStoryTeasers: NodeNewsStory
}

const StoryListingPage = ({
  nodeStoryListing,
  nodeNewsStoryTeasers,
}: StoryListingPageProps) => {
  if (!nodeStoryListing) return null

  return (
    <>
      <StoryListing
        nodeStoryListing={nodeStoryListing}
        nodeNewsStoryTeasers={nodeNewsStoryTeasers}
      />
    </>
  )
}

export default StoryListingPage

function filterNewsStoryTeasersById(nodeStoryListing, nodeNewsStoryTeasers) {
  let matchingNewsStories: NodeNewsStory = null

  nodeStoryListing.map((storyListing) => {
    const storyListingId = storyListing.drupal_internal__nid

    matchingNewsStories = filter(nodeNewsStoryTeasers, function (newsStory) {
      const newsStoryTeaserId =
        newsStory.field_listing.resourceIdObjMeta.drupal_internal__target_id

      return newsStoryTeaserId === storyListingId
    })
  })

  return matchingNewsStories
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<StoryListingPageProps>> {
  const storyListingParams = new DrupalJsonApiParams()

  storyListingParams
    .addFilter('status', '1')
    .addFilter('drupal_internal__nid', '2806')
    .addSort('created', 'DESC')

  const nodeStoryListing = await drupalClient.getResourceCollectionFromContext<
    DrupalNode[]
  >('node--story_listing', context, {
    params: storyListingParams.getQueryObject(),
  })

  const newsStoryTeaserParams = new DrupalJsonApiParams()
  newsStoryTeaserParams
    .addFilter('status', '1')
    .addInclude(['field_media, field_media.image, field_listing'])
    .addPageLimit(100)

  const nodeNewsStoryTeasers =
    await drupalClient.getResourceCollectionFromContext<NodeNewsStory>(
      'node--news_story',
      context,
      {
        params: newsStoryTeaserParams.getQueryObject(),
      }
    )

  return {
    props: {
      nodeStoryListing: nodeStoryListing || null,
      nodeNewsStoryTeasers:
        filterNewsStoryTeasersById(nodeStoryListing, nodeNewsStoryTeasers) ||
        null,
    },
  }
}
