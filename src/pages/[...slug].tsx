/**
 * This is the top-level page template that drives the static generation of all CMS pages.
 *
 * For more information on this file, see READMEs/[[...slug]].md
 */
import Debug from 'debug'
import * as React from 'react'
import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
} from 'next'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { queries } from '@/lib/drupal/queries'
import { writeWarningToFile } from '@/lib/utils/writeWarningToFile'
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
import { FormattedPageResource } from '@/lib/drupal/queries'
import {
  deflateObjectGraph,
  inflateObjectGraph,
  FlattenedGraph,
} from '@/lib/utils/object-graph'
import Head from 'next/head'

const slugLogger = Debug('next-build:slug')
const log = slugLogger.extend('log')
const warn = slugLogger.extend('warn')
const error = slugLogger.extend('error')

// Preview domain check - matches preview-*.cms.va.gov
const previewDomainPattern = /^preview-[a-z-]+\.cms\.va\.gov$/

// Config
const isExport = process.env.BUILD_OPTION === 'static'

// Types
import { Event as FormattedEvent } from '../components/event/formatted-type'
import { EventListing as FormattedEventListing } from '../components/eventListing/formatted-type'
import { BenefitsDetailPage as FormattedBenefitsDetailPage } from '../components/benefitsDetailPage/formatted-type'
import { LocationsListing as FormattedLocationsListing } from '../components/locationsListing/formatted-type'
import { NewsStory as FormattedNewsStory } from '../components/newsStory/formatted-type'
import { PressRelease as FormattedPressRelease } from '../components/pressRelease/formatted-type'
import { PressReleaseListing as FormattedPressReleaseListing } from '../components/pressReleaseListing/formatted-type'
import { ResourcesSupport as FormattedResourcesSupport } from '../components/resourcesSupport/formatted-type'
import { StaffProfile as FormattedStaffProfile } from '../components/staffProfile/formatted-type'
import { StoryListing as FormattedStoryListing } from '../components/storyListing/formatted-type'
import { VetCenter as FormattedVetCenter } from '../components/vetCenter/formatted-type'
import { VamcFacility as FormattedVamcFacility } from '../components/vamcFacility/formatted-type'
import { VamcSystem as FormattedVamcSystem } from '../components/vamcSystem/formatted-type'
import { VamcSystemRegisterForCare as FormattedVamcSystemRegisterForCare } from '../components/vamcSystemRegisterForCare/formatted-type'
import { VamcSystemBillingAndInsurance as FormattedVamcSystemBillingAndInsurance } from '../components/vamcSystemBillingAndInsurance/formatted-type'
import { VamcSystemMedicalRecordsOffice as FormattedVamcSystemMedicalRecordsOffice } from '../components/vamcSystemMedicalRecordsOffice/formatted-type'
import { VamcSystemVaPolice as FormattedVamcSystemVaPolice } from '../components/vamcSystemVaPolice/formatted-type'
import { LeadershipListing as FormattedLeadershipListing } from '../components/leadershipListing/formatted-type'
import { VetCenterLocationListing as FormattedVetCenterLocationListing } from '../components/vetCenterLocationListing/formatted-type'
import { VamcHealthServicesListing as FormattedVamcHealthServicesListing } from '../components/vamcHealthServicesListing/formatted-type'
import { VbaFacility as FormattedVbaFacility } from '../components/vbaFacility/formatted-type'
import { VamcOperatingStatusAndAlerts as FormattedVamcOperatingStatusAndAlerts } from '../components/vamcOperatingStatusAndAlerts/formatted-type'
import { VamcSystemPoliciesPage as FormattedVamcSystemPoliciesPage } from '../components/vamcSystemPoliciesPage/formatted-type'
import { BenefitsHub as FormattedBenefitsHub } from '../components/benefitsHub/formatted-type'
import { VamcSystemDetailPage as FormattedVamcSystemDetailPage } from '../components/vamcSystemDetailPage/formatted-type'
import { VaForm as FormattedVaForm } from '../components/vaForm/formatted-type'
import { CampaignLandingPage as FormattedCampaignLandingPage } from '@/components/campaignLandingPage/formatted-type'
import { OutreachHub as FormattedOutreachHub } from '../components/outreachHub/formatted-type'
import { OutreachMaterials as FormattedOutreachMaterials } from '../components/outreachMaterials/formatted-type'

// Templates
import HTMLComment from '@/components/htmlComment/template'
import { BenefitsDetailPage } from '../components/benefitsDetailPage/template'
import { Event } from '../components/event/template'
import { EventListing } from '../components/eventListing/template'
import { LocationsListing } from '../components/locationsListing/template'
import { Meta } from '@/components/meta/template'
import { NewsStory } from '../components/newsStory/template'
import { PressRelease } from '../components/pressRelease/template'
import { PressReleaseListing } from '../components/pressReleaseListing/template'
import { PreviewCrumb } from '@/components/preview/template'
import { ResourcesSupport } from '../components/resourcesSupport/template'
import { StaffProfile } from '../components/staffProfile/template'
import { StoryListing } from '../components/storyListing/template'
import { VetCenter } from '../components/vetCenter/template'
import { PageLayout, PageLayoutProps } from '@/components/pageLayout/template'
import { VamcFacility } from '../components/vamcFacility/template'
import { DoNotPublishError } from '@/lib/drupal/query'
import { VamcSystem } from '../components/vamcSystem/template'
import { VamcSystemRegisterForCare } from '../components/vamcSystemRegisterForCare/template'
import { VamcSystemBillingAndInsurance } from '../components/vamcSystemBillingAndInsurance/template'
import { VamcSystemMedicalRecordsOffice } from '../components/vamcSystemMedicalRecordsOffice/template'
import { VamcSystemVaPolice } from '../components/vamcSystemVaPolice/template'
import { LeadershipListing } from '../components/leadershipListing/template'
import { VbaFacility } from '../components/vbaFacility/template'
import { VetCenterLocationListing } from '../components/vetCenterLocationListing/template'
import { VamcHealthServicesListing } from '../components/vamcHealthServicesListing/template'
import { VamcOperatingStatusAndAlerts } from '../components/vamcOperatingStatusAndAlerts/template'
import { VamcSystemPoliciesPage } from '../components/vamcSystemPoliciesPage/template'
import { BenefitsHub } from '../components/benefitsHub/template'
import { VamcSystemDetailPage } from '../components/vamcSystemDetailPage/template'
import { VaForm } from '../components/vaForm/template'
import { CampaignLandingPage } from '@/components/campaignLandingPage/template'
import { OutreachHub } from '../components/outreachHub/template'
import { OutreachMaterials } from '@/components/outreachMaterials/template'

// IMPORTANT: in order for a content type to build in Next Build, it must have an appropriate
// environment variable set in one of two places:
// 1. The CMS feature flags for the target environment
// 2. The .env file for the given environment (i.e. .env.local)
//
// Please see READMEs/layout-rollout.md for more detailed information.

// RESOURCE_TYPES_TO_BUILD technically is not guaranteed to be reassigned.

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
  () => import('@/components/breadcrumbs/template')
  // { ssr: false }
)

// [[...slug]] is a catchall route. We build the appropriate layout based on the resource returned for a given path.
export default function ResourcePage({
  serializedResource,
  bannerData,
  footerData,
  megaMenuData,
  preview,
}: {
  serializedResource: FlattenedGraph<StaticPropsResource<FormattedPageResource>>
  bannerData: PageLayoutProps['bannerData']
  footerData: PageLayoutProps['footerData']
  megaMenuData: PageLayoutProps['megaMenuData']
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
  let contentBanner = []
  if ('banner' in resource && resource.banner && resource.banner.showBanner) {
    contentBanner = [
      {
        ...resource.banner,
        id: 'contentBanner',
        type: 'banner',
      },
    ]
  }

  const isPreviewDomain =
    typeof window !== 'undefined' &&
    previewDomainPattern.test(window.location.hostname)

  const jsEntryName =
    resource.type === RESOURCE_TYPES.PUBLICATION_LISTING
      ? // We don't actually use the extra script that is included in the public outreach
        // materials bundle, but this bundle is way smaller than the static-pages bundle.
        // Eventually we want to strip these down to only what we need for specific pages.
        'public-outreach-materials.entry.js'
      : 'static-pages.entry.js'

  return (
    <PageLayout
      bannerData={[...bannerData, ...contentBanner]}
      footerData={footerData}
      megaMenuData={megaMenuData}
      preview={preview}
      resource={resource}
    >
      <Head>
        <Meta resource={resource} />
      </Head>
      <HTMLComment position="head" content={comment} />

      {/* We want preview to always have the edit link if the domain is right. */}
      {(preview || isPreviewDomain) && (
        <PreviewCrumb entityId={resource.entityId} />
      )}

      <DynamicBreadcrumbs breadcrumbs={resource.breadcrumbs} />

      <main>
        <div id="content" className="interior">
          {resource.type === RESOURCE_TYPES.BENEFITS_DETAIL_PAGE && (
            <BenefitsDetailPage
              {...(resource as FormattedBenefitsDetailPage)}
            />
          )}
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
            <VamcFacility {...(resource as FormattedVamcFacility)} />
          )}
          {resource.type === RESOURCE_TYPES.VAMC_SYSTEM && (
            <VamcSystem {...(resource as FormattedVamcSystem)} />
          )}
          {resource.type === RESOURCE_TYPES.VAMC_SYSTEM_REGISTER_FOR_CARE && (
            <VamcSystemRegisterForCare
              {...(resource as FormattedVamcSystemRegisterForCare)}
            />
          )}
          {resource.type === RESOURCE_TYPES.VAMC_SYSTEM_BILLING_INSURANCE && (
            <VamcSystemBillingAndInsurance
              {...(resource as FormattedVamcSystemBillingAndInsurance)}
            />
          )}
          {resource.type ===
            RESOURCE_TYPES.VAMC_SYSTEM_MEDICAL_RECORDS_OFFICE && (
            <VamcSystemMedicalRecordsOffice
              {...(resource as FormattedVamcSystemMedicalRecordsOffice)}
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
          {resource.type === RESOURCE_TYPES.VET_CENTER_LOCATION_LISTING && (
            <VetCenterLocationListing
              {...(resource as FormattedVetCenterLocationListing)}
            />
          )}
          {resource.type === RESOURCE_TYPES.VAMC_HEALTH_SERVICES_LISTING && (
            <VamcHealthServicesListing
              {...(resource as FormattedVamcHealthServicesListing)}
            />
          )}
          {resource.type ===
            RESOURCE_TYPES.VAMC_OPERATING_STATUS_AND_ALERTS && (
            <VamcOperatingStatusAndAlerts
              {...(resource as FormattedVamcOperatingStatusAndAlerts)}
            />
          )}
          {resource.type === RESOURCE_TYPES.VAMC_SYSTEM_POLICIES_PAGE && (
            <VamcSystemPoliciesPage
              {...(resource as FormattedVamcSystemPoliciesPage)}
            />
          )}
          {resource.type === RESOURCE_TYPES.BENEFITS_HUB && (
            <BenefitsHub {...(resource as FormattedBenefitsHub)} />
          )}
          {resource.type === RESOURCE_TYPES.VAMC_SYSTEM_DETAIL_PAGE && (
            <VamcSystemDetailPage
              {...(resource as FormattedVamcSystemDetailPage)}
            />
          )}
          {resource.type === RESOURCE_TYPES.VA_FORM && (
            <VaForm {...(resource as FormattedVaForm)} />
          )}
          {resource.type === RESOURCE_TYPES.CAMPAIGN_LANDING_PAGE && (
            <CampaignLandingPage
              {...(resource as FormattedCampaignLandingPage)}
            />
          )}
          {resource.type === RESOURCE_TYPES.OFFICE && (
            <OutreachHub {...(resource as FormattedOutreachHub)} />
          )}
          {resource.type === RESOURCE_TYPES.PUBLICATION_LISTING && (
            <OutreachMaterials {...(resource as FormattedOutreachMaterials)} />
          )}
        </div>
      </main>

      {/* Loads widgets built from vets-website after data has been added to window */}
      <Script
        id="staticPages"
        strategy="afterInteractive"
        src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${jsEntryName}`}
      />
    </PageLayout>
  )
}

// This gathers all published paths for content types in RESOURCE_TYPES_TO_BUILD to generate static pages.
export async function getStaticPaths(
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  log('getStaticPaths called')
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

  if (process.env.SSG_CHERRY_PICKED_PATHS) {
    log(
      `SSG_CHERRY_PICKED_PATHS is set to ${process.env.SSG_CHERRY_PICKED_PATHS}.`
    )
    const paths = process.env.SSG_CHERRY_PICKED_PATHS.split(';')
    log(`Building cherry-picked paths:\n  ${paths.join('\n  ')}\n`)
    return {
      // Turn /alexandria-va-vet-center/locations/ into ['alexandria-va-vet-center', 'locations']
      paths: paths.map((path) => ({
        params: { slug: path.split('/').filter(Boolean) },
      })),
      fallback: 'blocking',
    }
  }

  log(
    `\n\nBuilding ${RESOURCE_TYPES_TO_BUILD.length} resource types:`,
    RESOURCE_TYPES_TO_BUILD,
    '\n\n'
  )

  log('Fetching page paths...')

  const resources = await Promise.all(
    RESOURCE_TYPES_TO_BUILD.map(getStaticPathsByResourceType)
  )

  log('Finished fetching page paths')

  /* eslint-disable no-console */
  console.log('\n')
  console.table(
    RESOURCE_TYPES_TO_BUILD.reduce((resourceTable, resourceName, index) => {
      return {
        ...resourceTable,
        [resourceName]: { 'Page Count': resources[index].length },
      }
    }, {})
  )
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
      warn('No path info found, returning notFound')
      return {
        notFound: true,
      }
    }

    // If the requested path isn't a type we're building, 404
    const resourceType = pathInfo.jsonapi.resourceName

    if (!RESOURCE_TYPES_TO_BUILD.includes(resourceType)) {
      warn(
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
        error('\n\nFailed to fetch resource:')
        error(
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
        warn(
          'Resource not published and not in preview mode, returning notFound'
        )
        return {
          notFound: true,
        }
      }

      // If resource is good, gather additional data for global elements.
      // Fetch header, footer, and banner data separately
      const [footerData, megaMenuData, bannerData] = await Promise.all([
        queries.getData('footer-data'),
        queries.getData('header-data'),
        queries.getData('banner-data', {
          itemPath: expandedContext.drupalPath,
        }),
      ])

      return {
        props: {
          preview: expandedContext.preview || false,
          serializedResource: deflateObjectGraph(resource),
          bannerData,
          footerData,
          megaMenuData,
        },
        revalidate: isExport ? false : 20, // revalidation, false for static export or 20 seconds for runtime
      }
    } catch (error) {
      if (error instanceof DoNotPublishError) {
        log('getStaticProps: DoNotPublishError, returning notFound')
        return { notFound: true }
      } else {
        throw error
      }
    }
  } catch (err) {
    error('Error in getStaticProps:', err)
    error(`SSG env var: ${process.env.SSG} (${typeof process.env.SSG})`)

    // If we get a 403, it's probably because we're trying to preview an unpublished page.
    // Return a 404 instead of failing the build.
    //
    // NOTE: The cause is added to the AbortError message in our fetch wrapper
    if (err.cause?.status === 403) {
      log('getStaticProps: 403 received; returning notFound')
      writeWarningToFile(
        `- **\`403\` status code received** from Drupal for \`${err.cause?.url}\``
      )
      return {
        notFound: true,
      }
    }

    // If we're in SSG mode, exit the build process. Otherwise, return a 404.
    if (process.env.SSG === 'true') {
      const fs = await import('fs')
      const path = await import('path')
      const chalk = await import('chalk').then((mod) => mod.default)
      const exitCodePath = path.join(process.cwd(), 'exit_code')

      // Kill the `next build` process to stop the build
      try {
        // If another child process has done this, we don't need to do it again
        if (!fs.existsSync(exitCodePath)) {
          error(
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
          warn(chalk.yellow(`file exists at ${exitCodePath}. Contents:`))
          warn(fs.readFileSync(exitCodePath).toString())
        }
      } catch (deathThrow) {
        // Couldn't kill the process; probably because it's already been killed
        error(
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
