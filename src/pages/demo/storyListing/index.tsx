import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import StoryListing from '@/components/node/story_listing'
import { NodeNewsStory, NodeStoryListing } from '@/types/node'
import { filter, forEach } from 'lodash'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

interface StoryListingPageProps {
  nodeStoryListings: NodeStoryListing
  nodeNewsStoryTeasers: NodeNewsStory
}

const StoryListingPage = ({
  nodeStoryListings,
  nodeNewsStoryTeasers,
}: StoryListingPageProps) => {
  if (!nodeStoryListings) return null

  return (
    <>
      <StoryListing
        nodeStoryListings={nodeStoryListings}
        nodeNewsStoryTeasers={nodeNewsStoryTeasers}
      />
    </>
  )
}

export default StoryListingPage

function filterNewsStoryTeasersById(nodeStoryListings, nodeNewsStoryTeasers) {
  let matchingNewsStories: NodeNewsStory = null
  const storyListing = nodeStoryListings[0]

  // TODO should we be returning the story listings with their associated news stories? Currently this doesnt do that.
  const storyListingId = storyListing.drupal_internal__nid

  matchingNewsStories = filter(nodeNewsStoryTeasers, function (newsStory) {
    const newsStoryTeaserId =
      newsStory.field_listing.resourceIdObjMeta.drupal_internal__target_id

    return newsStoryTeaserId === storyListingId
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
    .addPageLimit(1)

  const nodeStoryListings =
    await drupalClient.getResourceCollectionFromContext<NodeStoryListing>(
      'node--story_listing',
      context,
      {
        params: storyListingParams.getQueryObject(),
      }
    )

  const newsStoryTeaserParams = new DrupalJsonApiParams()
  newsStoryTeaserParams
    .addFilter('status', '1')
    .addInclude(['field_media, field_media.image, field_listing'])
    .addPageLimit(5)

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
      nodeStoryListings: nodeStoryListings || null,
      nodeNewsStoryTeasers:
        filterNewsStoryTeasersById(nodeStoryListings, nodeNewsStoryTeasers) ||
        null,
    },
  }
}
