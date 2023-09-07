import * as React from 'react'
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
} from 'next'
import Head from 'next/head'
import { QueryOpts } from 'next-drupal-query'
import { drupalClient } from '@/lib/utils/drupalClient'
import { queries } from '@/data/queries'
import { getGlobalElements } from '@/lib/context/getGlobalElements'
import { Wrapper } from '@/templates/globals/wrapper'
import { NewsStory } from '@/templates/layouts/newsStory'
import { StoryListing } from '@/templates/layouts/storyListing'
import { QuestionAnswer } from '@/templates/layouts/questionAnswer'
import RESOURCE_TYPES from '@/lib/constants/resourceTypes'
import { isListingPageSlug } from '@/lib/utils/listingPages'
import HeadComment from '@/templates/globals/util/HeadComment'
import {
  getAllStoryListingStaticPaths,
  getStaticPathsByResourceType,
} from '@/lib/utils/staticPaths'

export default function ResourcePage({ resource, globalElements }) {
  if (!resource) return null

  const title = `${resource.title} | Veterans Affairs`
  // console.log(`RESOURCE: ${JSON.stringify(globalElements, null, "\t")}`)

  return (
    <Wrapper bannerData={globalElements.bannerData}>
      <HeadComment
        resourceType={resource?.type}
        entityId={resource?.meta?.entityId}
        path={globalElements.path}
      />
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

export async function getStaticPaths(
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  // `getStaticPaths` is run on every request in dev mode (`next dev`). We don't need this,
  // so we set SSG=true on `next build/export` and SSG=false on `next dev`.
  // `getStaticPaths` will never be called during runtime (`next start`), but we could set
  // SSG=false there as well, for good measure.
  if (!process.env.SSG) {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }

  const storyListingPaths = await getAllStoryListingStaticPaths(context)
  const storyPaths = await getStaticPathsByResourceType(
    RESOURCE_TYPES.STORY,
    context
  )
  const qaPaths = await getStaticPathsByResourceType(RESOURCE_TYPES.QA, context)

  return {
    paths: [...storyListingPaths, ...storyPaths, ...qaPaths],
    fallback: 'blocking',
  }
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const isListingPage: { path: string; page: number } | false =
    isListingPageSlug(context.params?.slug)
  const path =
    isListingPage === false
      ? drupalClient.getPathFromContext(context)
      : isListingPage.path

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

  const id = pathInfo.entity?.uuid
  const queryOpts: QueryOpts<{
    id: string
    page?: number
  }> =
    isListingPage === false
      ? {
          context,
          id,
        }
      : {
          context,
          id,
          page: isListingPage.page,
        }

  const resource = await queries.getData(resourceType, queryOpts)
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
      globalElements: await getGlobalElements(
        pathInfo.jsonapi?.entryPoint,
        path
      ),
    },
  }
}
