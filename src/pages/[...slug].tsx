import * as React from 'react'
import { GetStaticPathsResult } from 'next'

import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '@/data/queries'
import { getGlobalElements } from '@/lib/context/getGlobalElements'
import { Wrapper } from '@/templates/globals/wrapper'
import { NewsStory } from '@/templates/layouts/NewsStory'
import { StoryListing } from '@/templates/layouts/StoryListing'

const RESOURCE_TYPES = ['node--news_story', 'node--story_listing'] as const

export default function ResourcePage({ resource, props }) {
  if (!resource) return null

  return (
    <Wrapper {...props}>
      {resource.type === 'node--news_story' && <NewsStory {...resource} />}
      {resource.type === 'node--story_listing' && (
        <StoryListing {...resource} />
      )}
    </Wrapper>
  )
}

export async function getStaticPaths(context): Promise<GetStaticPathsResult> {
  return {
    paths: await drupalClient.getStaticPathsFromContext(
      Array.from(RESOURCE_TYPES),
      context
    ),
    fallback: 'blocking',
  }
}

export async function getStaticProps(context) {
  const path = await drupalClient.translatePathFromContext(context)

  if (!path) {
    return {
      notFound: true,
    }
  }

  const type = path.jsonapi.resourceName as typeof RESOURCE_TYPES[number]

  if (!RESOURCE_TYPES.includes(type)) {
    return {
      notFound: true,
    }
  }

  const formattedResource = await queries.getData(type, {
    context,
    id: path.entity.uuid,
  })

  if (!formattedResource) {
    throw new Error(`Failed to fetch resource: ${path.jsonapi.individual}`)
  }

  // If we're not in preview mode and the resource is not published,
  // Return page not found.
  if (!context.preview && formattedResource?.published === false) {
    return {
      notFound: true,
    }
  }
  // getStaticProps fails if any values returned are undefined, but undefined
  // values are a reality. This JSON dance converts undefined to null.
  // See discussion: https://github.com/vercel/next.js/discussions/11209
  const resource = JSON.parse(JSON.stringify(formattedResource))
  return {
    props: {
      resource,
      ...(await getGlobalElements(context)),
    },
  }
}
