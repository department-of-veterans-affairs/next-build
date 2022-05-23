import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { drupalClient } from '@/utils/drupalClient'
import { GetStaticPathsResult } from 'next'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import Container from '@/components/container'
import { NewsStory } from '@/components/node/news_story'
import Pagination from '@department-of-veterans-affairs/component-library/Pagination'

export const NUMBER_OF_POSTS_PER_PAGE = 3
export const TOTAL = 20

const NewsStoryPage = ({ node, page }) => {
  const router = useRouter()
  if (!node) node = []

  return (
    <>
      <Container className="container">
        {node.map((news) => (
          <NewsStory key={news.id} node={news} viewMode="teaser" />
        ))}

        {page ? (
          <Pagination
            page={page?.current}
            pages={page?.total}
            onPageSelect={(paginate) =>
              router.push(`/demo/newsStory/${paginate}`)
            }
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
      params: {
        page: `${page + 1}`,
      },
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
    .addPageLimit(TOTAL)

  const node = await drupalClient.getResourceCollectionFromContext(
    'node--news_story',
    context,
    {
      params: {
        ...params.getQueryObject(),
        page: {
          limit: NUMBER_OF_POSTS_PER_PAGE,
          offset: context.params?.page ? NUMBER_OF_POSTS_PER_PAGE * current : 0,
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
