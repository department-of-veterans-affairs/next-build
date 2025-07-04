/**
 * This is the top-level page template that drives the static generation of all CMS pages.
 *
 * For more information on this file, see READMEs/[[...slug]].md
 */
import * as React from 'react'
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
} from 'next'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { getGlobalElements } from '@/lib/drupal/getGlobalElements'
import { shouldHideHomeBreadcrumb } from '@/lib/utils/breadcrumbs'
import { getStaticPathsByResourceType } from '@/lib/drupal/staticPaths'
import {
  RESOURCE_TYPES,
  PAGE_RESOURCE_TYPES,
} from '@/lib/constants/resourceTypes'
import {
  getExpandedStaticPropsContext,
  getStaticPropsResource,
} from '@/lib/drupal/staticProps'
import { StaticPropsResource } from '@/lib/drupal/staticProps'
import { FormattedPageResource } from '@/data/queries'
import {
  deflateObjectGraph,
  inflateObjectGraph,
  FlattenedGraph,
} from '@/lib/utils/object-graph'

// Config
const isExport = process.env.BUILD_OPTION === 'static'

// Types
import { Event as FormattedEvent } from '@/products/event/formatted-type'
import { EventListing as FormattedEventListing } from '@/products/eventListing/formatted-type'
import { LocationsListing as FormattedLocationsListing } from '@/types/formatted/locationsListing'
import { NewsStory as FormattedNewsStory } from '@/products/newsStory/formatted-type'
import { PressRelease as FormattedPressRelease } from '@/products/pressRelease/formatted-type'
import { PressReleaseListing as FormattedPressReleaseListing } from '@/products/pressReleaseListing/formatted-type'
import { ResourcesSupport as FormattedResourcesSupport } from '@/types/formatted/resourcesSupport'
import { StaffProfile as FormattedStaffProfile } from '@/products/staffProfile/formatted-type'
import { StoryListing as FormattedStoryListing } from '@/products/storyListing/formatted-type'
import { VetCenter as FormattedVetCenter } from '@/types/formatted/vetCenter'
import { HealthCareLocalFacility as FormattedHealthCareLocalFacility } from '@/types/formatted/healthCareLocalFacility'
import { VamcSystem as FormattedVamcSystem } from '@/types/formatted/vamcSystem'
import { VamcSystemVaPolice as FormattedVamcSystemVaPolice } from '@/types/formatted/vamcSystemVaPolice'
import { LeadershipListing as FormattedLeadershipListing } from '@/types/formatted/leadershipListing'
// Templates
import HTMLComment from '@/templates/common/util/HTMLComment'
import { Event } from '@/products/event/template'
import { EventListing } from '@/products/eventListing/template'
import { LayoutProps } from '@/templates/layouts/wrapper'
import { LocationsListing } from '@/templates/layouts/locationsListing'
import { Meta } from '@/templates/common/meta'
import { NewsStory } from '@/products/newsStory/template'
import { PressRelease } from '@/products/pressRelease/template'
import { PressReleaseListing } from '@/products/pressReleaseListing/template'
import { PreviewCrumb } from '@/templates/common/preview'
import { ResourcesSupport } from '@/templates/layouts/resourcesSupport'
import { StaffProfile } from '@/products/staffProfile/template'
import { StoryListing } from '@/products/storyListing/template'
import { VetCenter } from '@/templates/layouts/vetCenter'
import { Wrapper } from '@/templates/layouts/wrapper'
import { HealthCareLocalFacility } from '@/templates/layouts/healthCareLocalFacility'
import { DoNotPublishError } from '@/lib/drupal/query'
import { VamcSystem } from '@/templates/layouts/vamcSystem'
import { VamcSystemVaPolice } from '@/templates/layouts/vamcSystemVaPolice'
import { LeadershipListing } from '@/templates/layouts/leadershipListing'

// IMPORTANT: in order for a content type to build in Next Build, it must have an appropriate
// environment variable set in one of two places:
// 1. The CMS feature flags for the target environment
// 2. The .env file for the given environment (i.e. .env.local)
//
// Please see READMEs/layout-rollout.md for more detailed information.

// RESOURCE_TYPES_TO_BUILD technically is not guaranteed to be reassigned.
// eslint-disable-next-line prefer-const
let RESOURCE_TYPES_TO_BUILD = []
// FEATURE_NEXT_BUILD_CONTENT_ALL is checked to allow local developers to bypass flag checks.
if (process.env.FEATURE_NEXT_BUILD_CONTENT_ALL === 'true') {
  RESOURCE_TYPES_TO_BUILD = PAGE_RESOURCE_TYPES
} else {
  // Check the env variables loaded from the CMS feature flags and env files to determine what
  // content types to build.
  for (let x = 0; x < PAGE_RESOURCE_TYPES.length; x++) {
    const typeName = PAGE_RESOURCE_TYPES[x].replace(/^node--/, '').toUpperCase()
    const flagName = `FEATURE_NEXT_BUILD_CONTENT_${typeName}`
    // Note 'true' as a string is correct here. Env variables are always strings.
    if (process.env[flagName] === 'true') {
      RESOURCE_TYPES_TO_BUILD.push(PAGE_RESOURCE_TYPES[x])
    }
  }
}

export const DynamicBreadcrumbs = dynamic(
  () => import('@/templates/common/breadcrumbs'),
  { ssr: false }
)

// [[...slug]] is a catchall route. We build the appropriate layout based on the resource returned for a given path.
export default function ResourcePage({
  serializedResource,
  bannerData,
  headerFooterData,
  preview,
}: {
  serializedResource: FlattenedGraph<StaticPropsResource<FormattedPageResource>>
  bannerData: LayoutProps['bannerData']
  headerFooterData: LayoutProps['headerFooterData']
  preview: boolean
}) {
  if (!serializedResource) return null
  const resource =
    inflateObjectGraph<StaticPropsResource<FormattedPageResource>>(
      serializedResource
    )
  const comment = `
      --
      | resourceType: ${resource?.type || 'N/A'}
      | path: ${resource?.entityPath || 'N/A'}
      | entityId: ${resource?.entityId || 'N/A'}
      |
    `

  return (
    <Wrapper
      bannerData={bannerData}
      headerFooterData={headerFooterData}
      preview={preview}
      resource={resource}
    >
      <Meta resource={resource} />
      <HTMLComment position="head" content={comment} />

      {preview && <PreviewCrumb entityId={resource.entityId} />}

      <DynamicBreadcrumbs
        breadcrumbs={resource.breadcrumbs}
        entityPath={resource.entityPath}
        hideHomeBreadcrumb={shouldHideHomeBreadcrumb(resource.type)}
      />

      <main>
        <div id="content" className="interior">
          {resource.type === RESOURCE_TYPES.EVENT && (
            <Event {...(resource as FormattedEvent)} />
          )}
          {resource.type === RESOURCE_TYPES.EVENT_LISTING && (
            <EventListing {...(resource as FormattedEventListing)} />
          )}
          {resource.type === RESOURCE_TYPES.LOCATIONS_LISTING && (
            <LocationsListing {...(resource as FormattedLocationsListing)} />
          )}
          {resource.type === RESOURCE_TYPES.STORY && (
            <NewsStory {...(resource as FormattedNewsStory)} />
          )}
          {resource.type === RESOURCE_TYPES.PRESS_RELEASE && (
            <PressRelease {...(resource as FormattedPressRelease)} />
          )}
          {resource.type === RESOURCE_TYPES.PRESS_RELEASE_LISTING && (
            <PressReleaseListing
              {...(resource as FormattedPressReleaseListing)}
            />
          )}
          {/* {resource.type === RESOURCE_TYPES.QA && (
            <QuestionAnswer {...resource} />
          )} */}
          {resource.type === RESOURCE_TYPES.RESOURCES_SUPPORT && (
            <ResourcesSupport {...(resource as FormattedResourcesSupport)} />
          )}
          {resource.type === RESOURCE_TYPES.STAFF_PROFILE && (
            <StaffProfile {...(resource as FormattedStaffProfile)} />
          )}
          {resource.type === RESOURCE_TYPES.STORY_LISTING && (
            <StoryListing {...(resource as FormattedStoryListing)} />
          )}
          {resource.type === RESOURCE_TYPES.VET_CENTER && (
            <VetCenter {...(resource as FormattedVetCenter)} />
          )}
          {resource.type === RESOURCE_TYPES.VAMC_FACILITY && (
            <HealthCareLocalFacility
              {...(resource as FormattedHealthCareLocalFacility)}
            />
          )}
          {resource.type === RESOURCE_TYPES.VAMC_SYSTEM && (
            <VamcSystem {...(resource as FormattedVamcSystem)} />
          )}
          {resource.type === RESOURCE_TYPES.VAMC_SYSTEM_VA_POLICE && (
            <VamcSystemVaPolice
              {...(resource as FormattedVamcSystemVaPolice)}
            />
          )}
          {resource.type === RESOURCE_TYPES.LEADERSHIP_LISTING && (
            <LeadershipListing {...(resource as FormattedLeadershipListing)} />
          )}
        </div>
      </main>

      {/* Loads widgets built from vets-website after data has been added to window */}
      <Script
        id="staticPages"
        strategy="afterInteractive"
        src={`${process.env.NEXT_PUBLIC_ASSETS_URL}static-pages.entry.js`}
      />
    </Wrapper>
  )
}

// This gathers all published paths for content types in RESOURCE_TYPES_TO_BUILD to generate static pages.
export async function getStaticPaths(
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  // `getStaticPaths` is called on every request in dev mode (`next dev`). We don't need this,
  // so we set SSG=false (default) for `next dev` and set SSG=true on `next build/export`.
  // `getStaticPaths` will never be called during runtime (`next start`), but SSG will default
  // to false there as well.
  if (process.env.SSG === 'false') {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
  /* eslint-disable no-console */

  if (!RESOURCE_TYPES_TO_BUILD.length) {
    console.error('No resource types returned')
    process.exit(1)
  }
  console.log(
    `\n\nBuilding ${RESOURCE_TYPES_TO_BUILD.length} resource types:`,
    RESOURCE_TYPES_TO_BUILD,
    '\n\n'
  )

  console.time('Fetching page paths')

  const resources = await Promise.all(
    RESOURCE_TYPES_TO_BUILD.map(getStaticPathsByResourceType)
  )

  console.timeEnd('Fetching page paths')

  console.log('\n')
  console.table(
    RESOURCE_TYPES_TO_BUILD.reduce((resourceTable, resourceName, index) => {
      return {
        ...resourceTable,
        [resourceName]: { 'Page Count': resources[index].length },
      }
    }, {})
  )
  console.log('\n')
  /* eslint-enable no-console */

  return {
    paths: resources.flat(),
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
      console.warn('No path info found, returning notFound')
      return {
        notFound: true,
      }
    }

    // If the requested path isn't a type we're building, 404
    const resourceType = pathInfo.jsonapi.resourceName

    if (!RESOURCE_TYPES_TO_BUILD.includes(resourceType)) {
      console.warn(
        `Resource type ${resourceType} not in RESOURCE_TYPES_TO_BUILD, returning notFound`
      )
      return {
        notFound: true,
      }
    }
    try {
      let resource
      try {
        resource = await getStaticPropsResource(
          resourceType,
          pathInfo,
          expandedContext
        )
      } catch (e) {
        const util = await import('util')
        console.error('\n\nFailed to fetch resource:')
        console.error(
          util.inspect(
            { resourceType, pathInfo, expandedContext },
            { colors: true, depth: null }
          )
        )
        throw e
      }
      // If we're not in preview mode and the resource is not published,
      // Return page not found.
      if (!expandedContext.preview && !resource?.published) {
        console.warn(
          'Resource not published and not in preview mode, returning notFound'
        )
        return {
          notFound: true,
        }
      }

      // If resource is good, gather additional data for global elements.
      // The headerFooter data is cached, banner content is requested per page
      const { bannerData, headerFooterData } = await getGlobalElements(
        expandedContext.drupalPath
      )

      return {
        props: {
          preview: expandedContext.preview || false,
          serializedResource: deflateObjectGraph(resource),
          bannerData,
          headerFooterData,
        },
        revalidate: isExport ? false : 20, // revalidation, false for static export or 20 seconds for runtime
      }
    } catch (error) {
      if (error instanceof DoNotPublishError) {
        return { notFound: true }
      } else {
        throw error
      }
    }
  } catch (err) {
    console.error('Error in getStaticProps:', err)
    console.error(`SSG env var: ${process.env.SSG} (${typeof process.env.SSG})`)
    if (process.env.SSG === 'true') {
      const fs = await import('fs')
      const path = await import('path')
      const chalk = await import('chalk').then((mod) => mod.default)
      const exitCodePath = path.join(process.cwd(), 'exit_code')

      // Kill the `next build` process to stop the build
      try {
        // If another child process has done this, we don't need to do it again
        if (!fs.existsSync(exitCodePath)) {
          console.error(
            chalk.red('Exiting static site generation to avoid partial build')
          )

          // Pass along the exit code to processEnv(); without this, it'll still
          // exit with a 0, causing CI to continue.
          fs.writeFileSync(exitCodePath, '1')
          const nextBuildPID = parseInt(
            fs.readFileSync(path.join(process.cwd(), 'build_id')).toString(),
            10
          )
          process.kill(nextBuildPID, 'SIGINT')
        } else {
          console.warn(
            chalk.yellow(`file exists at ${exitCodePath}. Contents:`)
          )
          console.warn(fs.readFileSync(exitCodePath).toString())
        }
      } catch (deathThrow) {
        // Couldn't kill the process; probably because it's already been killed
        console.error(
          chalk.red('Failed to exit without killing the process:'),
          deathThrow
        )
      } finally {
        process.exit(1)
      }
    }
    return {
      notFound: true,
    }
  }
}
