/**
 * Dev-only preview page for testing the VetCenterOutstation component with mock data.
 * This page will only be accessible in development environments.
 */
import * as React from 'react'
import { GetStaticPropsContext } from 'next'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import { queries } from '@/lib/drupal/queries'
import { PageLayout, PageLayoutProps } from '@/components/pageLayout/template'
import { Meta } from '@/components/meta/template'
import HTMLComment from '@/components/htmlComment/template'
import { VetCenterOutstation } from '@/components/vetCenterOutstation/template'
import { mockResponse } from '@/components/vetCenterOutstation/mock'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import {
  deflateObjectGraph,
  inflateObjectGraph,
  FlattenedGraph,
} from '@/lib/utils/object-graph'
import { VetCenterOutstation as FormattedVetCenterOutstation } from '@/components/vetCenterOutstation/formatted-type'

export const DynamicBreadcrumbs = dynamic(
  () => import('@/components/breadcrumbs/template'),
  { ssr: false }
)

type DevPreviewPageProps = {
  serializedResource: FlattenedGraph<FormattedVetCenterOutstation>
  bannerData: PageLayoutProps['bannerData']
  footerData: PageLayoutProps['footerData']
  megaMenuData: PageLayoutProps['megaMenuData']
}

export default function DevPreviewVetCenterOutstation({
  serializedResource,
  bannerData,
  footerData,
  megaMenuData,
}: DevPreviewPageProps) {
  // Runtime guard - return null if not in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  if (!serializedResource) return null

  const resource =
    inflateObjectGraph<FormattedVetCenterOutstation>(serializedResource)

  const comment = `
      --
      | DEV PREVIEW PAGE
      | resourceType: ${RESOURCE_TYPES.VET_CENTER_OUTSTATION}
      | Mock Data: Yes
      | path: /dev-preview/vet-center-outstation
      |
    `

  // Create a simple breadcrumb structure for the dev preview
  const breadcrumbs = [
    {
      uri: '/',
      title: 'Home',
      options: [],
    },
    {
      uri: '/dev-preview',
      title: 'Dev Preview',
      options: [],
    },
    {
      uri: '/dev-preview/vet-center-outstation',
      title: 'Vet Center Outstation',
      options: [],
    },
  ]

  return (
    <PageLayout
      bannerData={bannerData}
      footerData={footerData}
      megaMenuData={megaMenuData}
      preview={true}
      resource={{
        ...resource,
        type: RESOURCE_TYPES.VET_CENTER_OUTSTATION,
        entityPath: '/dev-preview/vet-center-outstation',
        entityId: parseInt(resource.id),
        breadcrumbs,
      }}
    >
      <Meta
        resource={{
          ...resource,
          type: RESOURCE_TYPES.VET_CENTER_OUTSTATION,
          entityPath: '/dev-preview/vet-center-outstation',
          entityId: parseInt(resource.id),
          breadcrumbs,
        }}
      />
      <HTMLComment position="head" content={comment} />

      <div
        style={{
          background: '#f0f0f0',
          padding: '10px',
          borderLeft: '4px solid #0071bb',
          marginBottom: '20px',
        }}
      >
        <strong>🛠️ Development Preview Mode</strong>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
          This page is only visible in development and displays mock data for
          testing the Vet Center Outstation template.
        </p>
      </div>

      <DynamicBreadcrumbs
        breadcrumbs={breadcrumbs}
        entityPath="/dev-preview/vet-center-outstation"
        hideHomeBreadcrumb={false}
      />

      <main>
        <div id="content" className="interior">
          <VetCenterOutstation {...resource} />
        </div>
      </main>

      {/* Loads widgets built from vets-website after data has been added to window */}
      <Script
        id="staticPages"
        strategy="afterInteractive"
        src={`${process.env.NEXT_PUBLIC_ASSETS_URL}static-pages.entry.js`}
      />
    </PageLayout>
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {
  // Build-time guard - return 404 if not in development
  if (process.env.NODE_ENV !== 'development') {
    return {
      notFound: true,
    }
  }

  try {
    // Fetch global layout data (header, footer, banner)
    const [footerData, megaMenuData, bannerData] = await Promise.all([
      queries.getData('footer-data'),
      queries.getData('header-data'),
      queries.getData('banner-data', {
        itemPath: '/dev-preview/vet-center-outstation',
      }),
    ])

    // Use mock data for the component and ensure it's serializable
    // Next.js cannot serialize undefined values, so we need to sanitize the data
    const sanitizeForSerialization = (obj: unknown): unknown => {
      if (obj === null || obj === undefined) {
        return null
      }
      if (Array.isArray(obj)) {
        return obj.map(sanitizeForSerialization)
      }
      if (typeof obj === 'object' && obj !== null) {
        const sanitized: Record<string, unknown> = {}
        for (const key in obj) {
          const value = (obj as Record<string, unknown>)[key]
          if (value !== undefined) {
            sanitized[key] = sanitizeForSerialization(value)
          }
        }
        return sanitized
      }
      return obj
    }

    const resource = {
      ...(sanitizeForSerialization(
        mockResponse
      ) as FormattedVetCenterOutstation),
      prepareForVisit: mockResponse.prepareForVisit || [],
    }

    return {
      props: {
        serializedResource: deflateObjectGraph(resource),
        bannerData,
        footerData,
        megaMenuData,
      },
      revalidate: false, // No revalidation needed for dev preview
    }
  } catch (error) {
    console.error('Error in dev preview getStaticProps:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    return {
      notFound: true,
    }
  }
}
