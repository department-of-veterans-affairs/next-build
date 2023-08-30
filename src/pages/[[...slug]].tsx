import * as React from 'react'
import { GetStaticPathsContext, GetStaticPathsResult } from 'next'
import Head from 'next/head'

import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '@/data/queries'
import { getGlobalElements } from '@/lib/context/getGlobalElements'
import { Wrapper } from '@/templates/globals/wrapper'
import { NewsStory } from '@/templates/layouts/newsStory'
import { StoryListing } from '@/templates/layouts/storyListing'
import { QuestionAnswer } from '@/templates/layouts/questionAnswer'
import RESOURCE_TYPES from '@/lib/constants/resourceTypes'
import {
  getAllPagedListingPaths,
  isAdditionalStoryListingPath,
  LISTING_PAGE_NUMBER_REGEX,
} from '@/lib/utils/listingPages'

export default function ResourcePage({ resource, globalElements }) {
  if (!resource) return null

  const title = `${resource.title} | Veterans Affairs`

  return (
    <Wrapper bannerData={globalElements.bannerData}>
      <Head>
        <title>{title}</title>
      </Head>
      {resource.type === RESOURCE_TYPES.STORY_LISTING && (
        <StoryListing {...resource} />
      )}
      {resource.type === RESOURCE_TYPES.STORY && <NewsStory {...resource} />}
      {resource.type === RESOURCE_TYPES.QA && <QuestionAnswer {...resource} />}
    </Wrapper>
  )
}

async function getAllStoryListingStaticPaths(
  context: GetStaticPathsContext
): ReturnType<typeof drupalClient.getStaticPathsFromContext> {
  const storyListingPaths = (
    await drupalClient.getStaticPathsFromContext(
      [RESOURCE_TYPES.STORY_LISTING],
      context
    )
  ).slice(0, 10)

  // Setup paging for listing pages
  return await getAllPagedListingPaths(
    storyListingPaths,
    RESOURCE_TYPES.STORY_LISTING
  )
}

async function getAllStoryStaticPaths(
  context: GetStaticPathsContext
): ReturnType<typeof drupalClient.getStaticPathsFromContext> {
  return (
    await drupalClient.getStaticPathsFromContext(
      [RESOURCE_TYPES.STORY],
      context
    )
  ).slice(0, 10)
}

async function getAllQaStaticPaths(
  context: GetStaticPathsContext
): ReturnType<typeof drupalClient.getStaticPathsFromContext> {
  return (
    await drupalClient.getStaticPathsFromContext([RESOURCE_TYPES.QA], context)
  ).slice(0, 10)
}

export async function getStaticPaths(context): Promise<GetStaticPathsResult> {
  if (!process.env.SSG) {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }

  const storyListingPaths = await getAllStoryListingStaticPaths(context)
  const storyPaths = await getAllStoryStaticPaths(context)
  const qaPaths = await getAllQaStaticPaths(context)

  return {
    paths: [...storyListingPaths, ...storyPaths, ...qaPaths],
    fallback: 'blocking',
  }
}

export async function getStaticProps(context) {
  const { slug } = context.params
  let path = slug.join('/')
  let pageNumber = 1

  // If this is a story listing path and not the first page, it's a generated path and
  // Drupal will not know about it. We need to set the path to the first page and pass the
  // page number
  if (isAdditionalStoryListingPath(slug)) {
    path = `${slug[0]}/${slug[1]}`
    pageNumber = slug[2].match(LISTING_PAGE_NUMBER_REGEX)?.[1]
  }

  const pathInfo = await drupalClient.translatePath(path)
  if (!pathInfo) {
    return {
      notFound: true,
    }
  }

  const resourceType = pathInfo.jsonapi
    .resourceName as (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES]
  if (!Object.values(RESOURCE_TYPES).includes(resourceType)) {
    return {
      notFound: true,
    }
  }

  const resource = await queries.getData(resourceType, {
    context,
    id: pathInfo?.entity?.uuid,
    page: pageNumber,
  })

  if (!resource) {
    throw new Error(`Failed to fetch resource: ${pathInfo.jsonapi.individual}`)
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
      globalElements: await getGlobalElements(context),
    },
  }
}
