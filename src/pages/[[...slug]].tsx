import * as React from 'react'
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
} from 'next'
import Head from 'next/head'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { getGlobalElements } from '@/lib/drupal/getGlobalElements'
import { queries } from '@/data/queries'
import { Wrapper } from '@/templates/layouts/wrapper'
import { NewsStory } from '@/templates/layouts/newsStory'
import { StoryListing } from '@/templates/layouts/storyListing'
import { QuestionAnswer } from '@/templates/layouts/questionAnswer'
import HTMLComment from '@/templates/common/HTMLComment'
import { getStaticPathsByResourceType } from '@/lib/drupal/staticPaths'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import {
  getExpandedStaticPropsContext,
  getExpandedStaticPropsResource,
  getStaticPropsQueryOpts,
} from '@/lib/drupal/staticProps'

const RESOURCE_TYPES_TO_BUILD = [
  RESOURCE_TYPES.STORY_LISTING,
  RESOURCE_TYPES.STORY,
  // RESOURCE_TYPES.QA,
] as const

export type BuiltResourceTypeType = (typeof RESOURCE_TYPES_TO_BUILD)[number]

// [[...slug]] is a catchall route. We build the appropriate layout based on the resource returned for a given path.
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
      <main>
        <div id="content" className="interior">
          {resource.type === RESOURCE_TYPES.STORY_LISTING && (
            <StoryListing {...resource} />
          )}
          {resource.type === RESOURCE_TYPES.STORY && (
            <NewsStory {...resource} />
          )}
          {resource.type === RESOURCE_TYPES.QA && (
            <QuestionAnswer {...resource} />
          )}
        </div>
      </main>
    </Wrapper>
  )
}

// This gathers all published paths for content types in RESOURCE_TYPES_TO_BUILD to generate static pages.
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

// Given some context (path, slug, locale, etc), get all props for the path.
export async function getStaticProps(context: GetStaticPropsContext) {
  try {
    const expandedContext = getExpandedStaticPropsContext(context)

    // Now that we have a path, translate for resource endpoint
    const pathInfo = await drupalClient.translatePath(
      expandedContext.drupalPath
    )
    if (!pathInfo) {
      return {
        notFound: true,
      }
    }

    // If the requested path isn't a type we're building, 404
    const resourceType = pathInfo.jsonapi.resourceName as BuiltResourceTypeType
    if (!Object.values(RESOURCE_TYPES).includes(resourceType)) {
      return {
        notFound: true,
      }
    }

    // Set up query for resource at the given path
    const id = pathInfo.entity?.uuid
    const queryOpts = getStaticPropsQueryOpts(resourceType, id, expandedContext)

    // Request resource based on type
    const resource = await queries.getData(resourceType, queryOpts)
    if (!resource) {
      throw new Error(
        `Failed to fetch resource: ${pathInfo.jsonapi.individual}`
      )
    }

    // If we're not in preview mode and the resource is not published,
    // Return page not found.
    if (!context.preview && resource?.published === false) {
      return {
        notFound: true,
      }
    }

    // Apply business logic to resource (e.g. Lovell)
    const expandedResource = getExpandedStaticPropsResource(
      resource,
      expandedContext
    )

    // If resource is good, gather additional data for global elements.
    // This will be cached in the future so the header isn't re-requested a million times.
    const { bannerData, headerFooterData } = await getGlobalElements(
      pathInfo.jsonapi?.entryPoint,
      expandedContext.drupalPath
    )

    return {
      props: {
        resource: expandedResource,
        bannerData,
        headerFooterData,
      },
    }
  } catch (err) {
    return {
      notFound: true,
    }
  }
}
