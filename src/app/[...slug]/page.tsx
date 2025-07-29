import dynamic from 'next/dynamic'
import Script from 'next/script'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { StaticPropsResource } from '@/lib/drupal/staticProps'
import { FormattedPageResource } from '@/data/queries'
import {
  inflateObjectGraph,
  FlattenedGraph,
} from '@/lib/utils/object-graph'
import { shouldHideHomeBreadcrumb } from '@/lib/utils/breadcrumbs'
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

const DynamicBreadcrumbs = dynamic(
  () => import('@/templates/common/breadcrumbs'),
  { ssr: false }
)

// [[...slug]] is a catchall route.
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
          {resource.type === RESOURCE_TYPES.VBA_FACILITY && (
            <VbaFacility {...(resource as FormattedPageResource)} />
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
