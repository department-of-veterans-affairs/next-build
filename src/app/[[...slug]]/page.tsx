import dynamic from 'next/dynamic'
import Script from 'next/script'
import Debug from 'debug'
import chalk from 'chalk'
import {
  RESOURCE_TYPES,
  PAGE_RESOURCE_TYPES,
} from '@/lib/constants/resourceTypes'
import { getStaticPathsByResourceType } from '@/lib/drupal/staticPaths'
import { getGlobalElements } from '@/lib/drupal/getGlobalElements'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { FormattedPageResource, queries } from '@/data/queries'
import { shouldHideHomeBreadcrumb } from '@/lib/utils/breadcrumbs'
import HTMLComment from '@/templates/common/util/HTMLComment'
import { Event } from '@/products/event/template'
import { EventListing } from '@/products/eventListing/template'
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
import { VamcSystem } from '@/templates/layouts/vamcSystem'
import { VamcSystemVaPolice } from '@/products/vamcSystemVaPolice/template'
import { LeadershipListing } from '@/products/leadershipListing/template'
import { VbaFacility } from '@/templates/layouts/vbaFacility'

// Import types
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
import { VamcSystemVaPolice as FormattedVamcSystemVaPolice } from '@/products/vamcSystemVaPolice/formatted-type'
import { LeadershipListing as FormattedLeadershipListing } from '@/products/leadershipListing/formatted-type'
import { VbaFacility as FormattedVbaFacility } from '@/types/formatted/vbaFacility'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'

const DynamicBreadcrumbs = dynamic(
  () => import('@/templates/common/breadcrumbs'),
  { ssr: false }
)

export async function generateStaticParams() {
  const debug = Debug('next-build:slug')
  const log = debug.extend('log')
  const errorLog = debug.extend('error')

  // Determine which resource types to build based on environment variables
  let resourceTypesToBuild = []
  if (process.env.FEATURE_NEXT_BUILD_CONTENT_ALL === 'true') {
    resourceTypesToBuild = PAGE_RESOURCE_TYPES
  } else {
    for (const resourceType of PAGE_RESOURCE_TYPES) {
      const typeName = resourceType.replace(/^node--/, '').toUpperCase()
      const flagName = `FEATURE_NEXT_BUILD_CONTENT_${typeName}`
      if (process.env[flagName] === 'true') {
        resourceTypesToBuild.push(resourceType)
      }
    }
  }

  if (resourceTypesToBuild.length === 0) {
    errorLog('No resource types to build.')
    return []
  }

  log(
    `Building ${chalk.green(resourceTypesToBuild.length)} resource types:`,
    resourceTypesToBuild
  )

  const paths = await Promise.all(
    resourceTypesToBuild.map(getStaticPathsByResourceType)
  )

  // Log the number of paths per resource type
  resourceTypesToBuild.forEach((resourceType, index) => {
    const count = paths[index].length
    log(
      `Building ${chalk.green(count)} paths for resource type: ${chalk.blue(resourceType)}`
    )
  })

  return paths.flat()
}

// [[...slug]] is a catchall route.
export default async function ResourcePage({
  params,
}: {
  params: { slug?: string[] }
}) {
  const debug = Debug('next-build:slug')
  const log = debug.extend('log')
  const verbose = debug.extend('verbose')
  const errorLog = debug.extend('error')

  const { isEnabled: preview } = draftMode()
  const slug = params.slug || []
  const path = slug.length > 0 ? `/${slug.join('/')}` : '/'

  verbose('Processing path:', path)

  let pathInfo
  try {
    // For preview mode, we need to handle unpublished content differently
    if (preview) {
      // Create a minimal context-like object for translatePathFromContext
      const contextForTranslation = {
        params: { slug },
        preview: true,
        previewData: {},
      }
      pathInfo = await drupalClient.translatePathFromContext(
        contextForTranslation
      )
    } else {
      pathInfo = await drupalClient.translatePath(path)
    }
  } catch (error) {
    if (error.cause.status === 403) {
      log('403 error translating path:', path, 'returning 404')
      notFound()
    }
    errorLog('Error translating path:', error)
    notFound()
  }

  if (!pathInfo) {
    errorLog('Path info not found for path:', path)
    notFound()
  }

  const resourceType = pathInfo.jsonapi.resourceName
  verbose('Resource type:', resourceType)

  let resource
  try {
    // Get the resource ID from pathInfo
    const id = pathInfo.entity?.uuid
    if (!id) {
      throw new Error('No entity UUID found in pathInfo')
    }

    // Build query options directly instead of using the old context pattern
    const queryOpts = {
      id,
      context: {
        preview,
        params: { slug },
      },
    }

    verbose('Fetching resource for type:', resourceType, 'with ID:', id)
    resource = await queries.getData(resourceType, queryOpts)

    if (!resource) {
      throw new Error(`No resource found for ${resourceType} with ID ${id}`)
    }
  } catch (error) {
    errorLog('Error fetching resource:', error)
    notFound()
  }

  if (!resource) {
    notFound()
  }

  const { bannerData, headerFooterData } = await getGlobalElements(path)
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
            <VamcSystem
              {...(resource as LovellStaticPropsResource<FormattedVamcSystem>)}
            />
          )}
          {resource.type === RESOURCE_TYPES.VAMC_SYSTEM_VA_POLICE && (
            <VamcSystemVaPolice
              {...(resource as FormattedVamcSystemVaPolice)}
            />
          )}
          {resource.type === RESOURCE_TYPES.LEADERSHIP_LISTING && (
            <LeadershipListing {...(resource as FormattedLeadershipListing)} />
          )}
          {resource.type === RESOURCE_TYPES.VBA_FACILITY && (
            <VbaFacility {...(resource as FormattedVbaFacility)} />
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
