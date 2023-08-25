import * as React from 'react'
import { GetStaticPathsResult } from 'next'
import Head from 'next/head'

import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '@/data/queries'
import { getGlobalElements } from '@/lib/context/getGlobalElements'
import { Wrapper } from '@/templates/globals/wrapper'
import { StoryListing } from '@/templates/layouts/storyListing'
import { NewsStory } from '@/templates/layouts/newsStory'

export const RESOURCE_TYPES = [
  'node--news_story',
  'node--story_listing',
  // 'node--q_a',
] as const

export default function ResourcePage({ resource, props }) {
  if (!resource) return null

  const title = `${resource.title} | Veterans Affairs`

  return (
    <Wrapper {...props}>
      <Head>
        <title>{title}</title>
      </Head>
      {resource.type === 'node--news_story' && <NewsStory {...resource} />}
      {resource.type === 'node--story_listing' && (
        <StoryListing {...resource} />
      )}
    </Wrapper>
  )
}

export async function getStaticPaths(context): Promise<GetStaticPathsResult> {
  const results = await drupalClient.getStaticPathsFromContext(
    Array.from(RESOURCE_TYPES),
    context
  )

  const paths = results.map((path) => {
    // Never seems to happen for these two content types but typescript thinks path can be a string sometimes
    if (typeof path === 'string') {
      return {
        params: {
          facility: path,
          page: '1',
        },
      }
    }

    return {
      params: {
        facility: path.params.slug[0],
        page: '1', // this seems to get overwritten before getStaticProps
      },
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export async function getStaticProps(context) {
  // If the page param is a # get base story listing node otherwise load the news story
  // Drupal doesn't have nodes for .../stories/2/ etc. Paginate the list of stories in the query
  // See @data/queries/storyListing.ts
  context.params.slug = Number(context.params?.page)
    ? `${context.params.facility}/stories`
    : `${context.params.facility}/stories/${context.params.page}`

  // redirect /stories/1 to /stories/
  if (Number(context.params.page) === 1) {
    return {
      redirect: {
        destination: `/${context.params.facility}/stories/`,
        permanent: false,
      },
    }
  }

  const path = await drupalClient.translatePathFromContext(context)

  if (!path) {
    return {
      notFound: true,
    }
  }

  const type = path.jsonapi.resourceName as (typeof RESOURCE_TYPES)[number]

  if (!RESOURCE_TYPES.includes(type)) {
    return {
      notFound: true,
    }
  }

  const resource = await queries.getData(type, {
    context,
    id: path.entity.uuid,
    page: Number(context.params?.page), // this is where storyListing gets paginated
  })

  if (!resource) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`)
  }

  // If we're not in preview mode and the resource is not published,
  // Return page not found.
  if (!context.preview && resource?.published === false) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      resource,
      ...(await getGlobalElements(context)),
    },
  }
}
