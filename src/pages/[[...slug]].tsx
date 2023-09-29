import * as React from 'react'
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
} from 'next'
import Head from 'next/head'
import { QueryOpts } from 'next-drupal-query'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { getGlobalElements } from '@/lib/drupal/getGlobalElements'
import { queries } from '@/data/queries'
import { Wrapper } from '@/templates/globals/wrapper'
import { NewsStory } from '@/templates/layouts/newsStory'
import { StoryListing } from '@/templates/layouts/storyListing'
import { QuestionAnswer } from '@/templates/layouts/questionAnswer'
import HTMLComment from '@/templates/globals/util/HTMLComment'
import { getStaticPathsByResourceType } from '@/lib/drupal/staticPaths'
import { RESOURCE_TYPES, ResourceTypeType } from '@/lib/constants/resourceTypes'
import { isListingPageSlug } from '@/lib/drupal/listingPages'

const RESOURCE_TYPES_TO_BUILD = [
  RESOURCE_TYPES.STORY_LISTING,
  RESOURCE_TYPES.STORY,
  // RESOURCE_TYPES.QA,
] as const

export default function ResourcePage({
  resource,
  bannerData,
  headerFooterData,
}) {
  if (!resource) return null

  const title = `${resource.title} | Veterans Affairs`
  const comment = `
      --
      | resourceType: ${resource?.type || 'N/A'}
      | path: ${resource?.entityPath || 'N/A'}
      | entityId: ${resource?.entityId || 'N/A'}
      |
    `

  return (
    <Wrapper bannerData={bannerData} headerFooterData={headerFooterData}>
      <HTMLComment position="head" content={comment} />
      <Head>
        <title>{title}</title>
        {/* todo: do all meta tags correctly, currently this fixes an error on news story */}
        <meta property="og:url" content="foo" />
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
  if (process.env.SSG === 'false') {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }

  return {
    paths: (
      await Promise.all(
        RESOURCE_TYPES_TO_BUILD.map(getStaticPathsByResourceType)
      )
    ).flat(),
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

  const resourceType = pathInfo.jsonapi.resourceName as ResourceTypeType

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

  const { bannerData, headerFooterData } = await getGlobalElements(
    pathInfo.jsonapi?.entryPoint,
    path
  )

  return {
    props: {
      resource,
      bannerData,
      headerFooterData,
    },
  }
}
