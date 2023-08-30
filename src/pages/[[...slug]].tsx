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
import { PAGE_SIZE as STORY_LISTING_PAGE_SIZE } from '@/data/queries/storyListing'

export const RESOURCE_TYPES = {
  STORY_LISTING: 'node--story_listing',
  STORY: 'node--news_story',
  QA: 'node--q_a',
} as const

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

async function getListingPageCount(
  listingPagePath,
  resourceType
): Promise<number> {
  const resourcePath = listingPagePath?.params?.slug?.join?.('/') || ''
  const pathInfo = await drupalClient.translatePath(resourcePath)
  if (pathInfo?.entity?.uuid) {
    const resource = await queries.getData(resourceType, {
      id: pathInfo.entity.uuid,
    })

    return resource?.totalPages || 0
  }

  return 0
}

async function getListingPagePathsWithPageData(listingPagePaths) {
  return Promise.all(
    listingPagePaths.map(async (listingPagePath) => {
      const path =
        typeof listingPagePath === 'string'
          ? {
              params: {
                slug: [listingPagePath],
              },
            }
          : listingPagePath

      const totalPages = await getListingPageCount(
        path,
        RESOURCE_TYPES.STORY_LISTING
      )

      return {
        ...path,
        pageData: {
          totalPages,
          pageSize: STORY_LISTING_PAGE_SIZE,
        },
      }
    })
  )
}

function getAllPagedListingPaths(pathsWithPageData) {
  return pathsWithPageData.reduce((acc, storyListingPath) => {
    // We always build the first page
    const firstPagePath = {
      params: {
        slug: [storyListingPath?.params?.slug[0], 'stories'],
      },
    }

    // There might be additional pages
    if (storyListingPath.pageData.totalPages <= 1) {
      return [...acc, firstPagePath]
    } else {
      const additionalPagePaths = Array.from({
        length: storyListingPath.pageData.totalPages - 1,
      }).map((_, i) => ({
        params: {
          slug: [storyListingPath?.params?.slug[0], 'stories', `page-${i + 2}`],
        },
      }))

      return [...acc, firstPagePath, ...additionalPagePaths]
    }
  }, [])
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

  // Paging step 1: Determine the number of pages for each listing
  const storyListingPathsWithPageData = await getListingPagePathsWithPageData(
    storyListingPaths
  )
  // Paging step 2: Each listing path will become multiple paths, one for each of its pages
  const allStoryListingPaths = getAllPagedListingPaths(
    storyListingPathsWithPageData
  )

  return allStoryListingPaths
}

async function getAllStoryStaticPaths(
  context: GetStaticPathsContext
): ReturnType<typeof drupalClient.getStaticPathsFromContext> {
  const storyPaths = (
    await drupalClient.getStaticPathsFromContext(
      [RESOURCE_TYPES.STORY],
      context
    )
  ).slice(0, 10)

  return storyPaths
}

async function getAllQaStaticPaths(
  context: GetStaticPathsContext
): ReturnType<typeof drupalClient.getStaticPathsFromContext> {
  const qaPaths = (
    await drupalClient.getStaticPathsFromContext([RESOURCE_TYPES.QA], context)
  ).slice(0, 10)

  return qaPaths
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

const PAGE_NUMBER_REGEX = /^page-(\d)+$/ as RegExp

function isAdditionalStoryListingPath(slug: string[]): boolean {
  return slug?.[1] === 'stories' && PAGE_NUMBER_REGEX.test(slug?.[2])
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
    pageNumber = slug[2].match(PAGE_NUMBER_REGEX)?.[1]
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
