/**
 * Development-only route for testing Vet Center Outstation pages
 *
 * This route bypasses the Drupal CMS system entirely and uses mock data.
 * Once CMS integration is complete, this route will be removed and
 * the functionality will be handled by the main [[...slug]].tsx route.
 *
 * To test: http://localhost:3999/dev-vet-center-outstation/sepulveda-outstation
 */

import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import { VetCenterOutstationPage } from '@/components/vetCenterOutstationPage/template'
import { VetCenterOutstationPage as FormattedVetCenterOutstationPage } from '@/components/vetCenterOutstationPage/formatted-type'
import { PageLayout, PageLayoutProps } from '@/components/pageLayout/template'
import { Meta } from '@/components/meta/template'
import HTMLComment from '@/components/htmlComment/template'
import {
  data,
  formatter,
  getAvailableOutstationSlugs,
} from '@/components/vetCenterOutstationPage/query'
import dynamic from 'next/dynamic'

// Dynamic breadcrumbs component
export const DynamicBreadcrumbs = dynamic(
  () => import('@/components/breadcrumbs/template'),
  { ssr: false }
)

interface DevVetCenterOutstationPageProps {
  outstation: FormattedVetCenterOutstationPage
  bannerData: PageLayoutProps['bannerData']
  footerData: PageLayoutProps['footerData']
  megaMenuData: PageLayoutProps['megaMenuData']
}

export default function DevVetCenterOutstationPage({
  outstation,
  bannerData,
  footerData,
  megaMenuData,
}: DevVetCenterOutstationPageProps) {
  const comment = `
    --
    | DEV ROUTE: Development-only Vet Center Outstation page
    | This route will be removed when CMS integration is complete
    | resourceType: vet-center-outstation-page-dev
    | path: ${outstation?.path || 'N/A'}
    | entityId: ${outstation?.id || 'N/A'}
    | 
  `

  return (
    <PageLayout
      bannerData={bannerData}
      footerData={footerData}
      megaMenuData={megaMenuData}
    >
      <Meta resource={outstation} />
      <HTMLComment position="head" content={comment} />

      <DynamicBreadcrumbs
        breadcrumbs={outstation.breadcrumbs}
        entityPath={outstation.path}
        hideHomeBreadcrumb={false}
      />

      <main>
        <div id="content" className="interior">
          <VetCenterOutstationPage {...outstation} />
        </div>
      </main>
    </PageLayout>
  )
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  // Only build paths when the feature flag is enabled
  if (
    process.env.FEATURE_NEXT_BUILD_CONTENT_VET_CENTER_OUTSTATION_PAGE !== 'true'
  ) {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }

  // Get available outstation slugs from mock data
  const slugs = getAvailableOutstationSlugs()

  const paths = slugs.map((slug) => ({
    params: { slug },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<DevVetCenterOutstationPageProps>> {
  // Check if feature is enabled
  if (
    process.env.FEATURE_NEXT_BUILD_CONTENT_VET_CENTER_OUTSTATION_PAGE !== 'true'
  ) {
    return {
      notFound: true,
    }
  }

  const { slug } = context.params as { slug: string }

  try {
    // Load and format mock data
    const mockData = await data({ slug })
    const formattedOutstation = formatter(mockData)

    // Mock banner, footer, and menu data (in real implementation, these would be fetched)
    const bannerData = []
    const footerData = []
    const megaMenuData = []

    return {
      props: {
        outstation: formattedOutstation,
        bannerData,
        footerData,
        megaMenuData,
      },
    }
  } catch (error) {
    console.error(`Error loading outstation data for slug ${slug}:`, error)
    return {
      notFound: true,
    }
  }
}
