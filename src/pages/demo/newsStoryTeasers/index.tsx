import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/components/container'
import { NewsStoryTeaser } from '@/components/node/news_story/index'
import { NodeNewsStory } from '@/types/node'

type NewsStoryTeaserPageProps = {
  nodes: NodeNewsStory
}

const NewsStoryTeaserPage = ({ nodes }: NewsStoryTeaserPageProps) => {
  if (!nodes) return null

  return (
    <>
      <Container className="container">
        <ul className="usa-unstyled-list">
          {nodes.map((node) => (
            <NewsStoryTeaser key={node.id} node={node} viewMode={'teaser'} />
          ))}
        </ul>
      </Container>
    </>
  )
}

export default NewsStoryTeaserPage

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<NewsStoryTeaserPageProps>> {
  const params = new DrupalJsonApiParams()
  params.addPageLimit(10)

  const nodeNewsStory =
    await drupalClient.getResourceCollectionFromContext<NodeNewsStory>(
      'node--news_story',
      context,
      {
        params: params.getQueryObject(),
      }
    )
  return {
    props: {
      nodes: nodeNewsStory || null,
    },
  }
}
