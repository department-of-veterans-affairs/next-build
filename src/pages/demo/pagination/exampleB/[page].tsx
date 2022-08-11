import { drupalClient } from '@/lib/utils/drupalClient'
import { GetStaticPathsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/templates/common/container'
import { NewsStoryTeaser } from '@/templates/components/newsStoryTeaser'
import Pager from '@/templates/common/pager'
import { NodeResourceType } from '@/types/dataTypes/drupal/node'

export const NUMBER_OF_POSTS_PER_PAGE = 3
export const TOTAL = 20

const NewsStoryPage = ({ page, node }) => {
  if (!node) node = []

  return (
    <>
      <Container className="container">
        <h1 className="vads-u-margin--0">{node[0]?.field_listing?.title}</h1>
        <h2 className="vads-b-margin--4">
          {node[0]?.field_listing?.field_description}
        </h2>
        {/* {node.map((news) => (
          <NewsStoryTeaser
            key={news.id}
            {...NewsStoryTeaserMapping(news)}
          />
        ))} */}

        {page ? (
          <Pager
            current={page.current}
            total={page.total}
            href={(pager) =>
              pager === 0
                ? `/demo/pagination/exampleB/0`
                : `/demo/pagination/exampleB/${pager}`
            }
            className="va-pagination-b"
          />
        ) : null}
      </Container>
    </>
  )
}

export default NewsStoryPage

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  // Use SSG for the first pages, then fallback to SSR for other pages.

  const paths = Array(TOTAL)
    .fill(0)
    .map((_, page) => ({
      params: { page: page.toString() },
    }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export async function getStaticProps(context) {
  const current = parseInt(context?.params?.page)
  const params = new DrupalJsonApiParams()
    .addInclude([
      'field_media',
      'field_media.image',
      'field_author',
      'field_listing',
    ])

    .addFields(NodeResourceType.FieldListing, [
      'id',
      'drupal_internal__nid',
      'field_description',
    ])
    .addPageLimit(TOTAL)

  const node = await drupalClient.getResourceCollectionFromContext(
    NodeResourceType.NewsStory,
    context,
    {
      params: {
        ...params.getQueryObject(),
        page: {
          limit: NUMBER_OF_POSTS_PER_PAGE,
          offset:
            context.params?.page + 1 ? NUMBER_OF_POSTS_PER_PAGE * current : 0,
        },
      },
    }
  )

  return {
    props: {
      node: node || null,
      current: current,
      page: {
        current,
        total: Math.ceil(TOTAL / NUMBER_OF_POSTS_PER_PAGE),
      },
    },
  }
}
