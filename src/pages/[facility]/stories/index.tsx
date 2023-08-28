import * as React from 'react'
import { GetStaticPathsResult } from 'next'
import Head from 'next/head'

import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '@/data/queries'
import { getGlobalElements } from '@/lib/context/getGlobalElements'
import { Wrapper } from '@/templates/globals/wrapper'
import { StoryListing } from '@/templates/layouts/storyListing'

export const RESOURCE_TYPES = ['node--story_listing'] as const

export default function ResourcePage({ resource, props }) {
  if (!resource) return null

  const title = `${resource.title} | Veterans Affairs`

  return (
    <Wrapper {...props}>
      <Head>
        <title>{title}</title>
      </Head>
      <StoryListing {...resource} />
    </Wrapper>
  )
}

export async function getStaticPaths(context): Promise<GetStaticPathsResult> {
  const results = await drupalClient.getStaticPathsFromContext(
    Array.from(RESOURCE_TYPES),
    context
  )

  const paths = results.map((path) => {
    if (typeof path === 'string') {
      return {
        params: {
          facility: path,
        },
      }
    }

    return {
      params: {
        facility: path.params.slug[0],
      },
    }
  })

  const paginated = []

  paths.forEach(async (path) => {
    try {
      // push the existing path into the new array
      paginated.push({
        params: {
          facility: path.params.facility,
        },
      })

      // Gross, but need to do this in order to determine # of pagination pages that should be generated
      context.params = {}
      context.params.slug = `${path.params.facility}/stories`
      const resourcePath = await drupalClient.translatePathFromContext(context)

      const resource = await queries.getData('node--story_listing', {
        context,
        id: resourcePath.entity.uuid,
        page: 1,
      })

      const pages = resource.totalPages

      // add additional pages to array based on response above
      if (pages > 1) {
        for (let i = 1; i < pages; i++) {
          paginated.push({
            params: {
              facility: path.params.facility,
              page: i,
            },
          })
        }
      }
    } catch (e) {
      console.error(`Error: ${e}`)
    }
  }, Error())

  return {
    paths: paginated,
    fallback: 'blocking',
  }
}

export async function getStaticProps(context) {
  context.params.slug = `${context.params.facility}/stories`
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
    page: 1,
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
