import * as React from 'react'
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
} from 'next'
import Head from 'next/head'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { getGlobalElements } from '@/lib/drupal/getGlobalElements'
import { Wrapper } from '@/templates/globals/wrapper'
import { NewsStory } from '@/templates/layouts/newsStory'
import { StoryListing } from '@/templates/layouts/storyListing'
import { QuestionAnswer } from '@/templates/layouts/questionAnswer'
import HTMLComment from '@/templates/globals/util/HTMLComment'
import { getStaticPathsByResourceType } from '@/lib/drupal/staticPaths'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import {
  getExpandedStaticPropsContext,
  getStaticPropsResource,
} from '@/lib/drupal/staticProps'
import Breadcrumbs from '@/templates/common/breadcrumbs'

const RESOURCE_TYPES_TO_BUILD = [
  RESOURCE_TYPES.STORY_LISTING,
  RESOURCE_TYPES.STORY,
] as const

export type BuiltResourceType = (typeof RESOURCE_TYPES_TO_BUILD)[number]

// [[...slug]] is a catchall route. We build the appropriate layout based on the resource returned for a given path.
export default function ResourcePage({
  resource,
  bannerData,
  headerFooterData,
  preview,
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

      {preview && (
        <div className="usa-grid-full">
          <div className="usa-width-one-whole">
            <div className="vads-u-margin-top--2">
              <a
                data-same-tab=""
                href={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/node/${resource?.entityId}/edit`}
              >
                « Edit this page in the CMS (requires a CMS account with
                appropriate permissions)
              </a>
            </div>
          </div>
        </div>
      )}

      <Breadcrumbs
        breadcrumbs={resource.breadcrumbs}
        entityPath={resource.entityPath}
        hideHomeBreadcrumb
      />
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
    let pathInfo
    // need to use translatePathFromContext for previewing unpublished revisions
    if (expandedContext.preview) {
      pathInfo = await drupalClient.translatePathFromContext(expandedContext)
    } else {
      pathInfo = await drupalClient.translatePath(expandedContext.drupalPath)
    }

    if (!pathInfo) {
      return {
        notFound: true,
      }
    }

    // If the requested path isn't a type we're building, 404
    const resourceType = pathInfo.jsonapi.resourceName as BuiltResourceType
    if (!Object.values(RESOURCE_TYPES).includes(resourceType)) {
      return {
        notFound: true,
      }
    }

    const resource = await getStaticPropsResource(
      resourceType,
      pathInfo,
      expandedContext
    )

    // If we're not in preview mode and the resource is not published,
    // Return page not found.
    if (!expandedContext.preview && !resource?.published) {
      return {
        notFound: true,
      }
    }

    // If resource is good, gather additional data for global elements.
    // This will be cached in the future so the header isn't re-requested a million times.
    const { bannerData, headerFooterData } = await getGlobalElements(
      pathInfo.jsonapi?.entryPoint,
      expandedContext.drupalPath
    )

    return {
      props: {
        preview: expandedContext.preview || false,
        resource,
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
