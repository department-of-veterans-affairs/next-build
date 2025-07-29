import { NextRequest, NextResponse } from 'next/server'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { DrupalClientAuth } from 'next-drupal'

interface Filter {
  field: string
  operator: string
  value?: string
}

export async function POST(request: NextRequest) {
  try {
    const { resourceType, includes, pageLimit, filters } = await request.json()

    if (!resourceType) {
      return NextResponse.json(
        { error: 'Resource type is required' },
        { status: 400 }
      )
    }

    const params = new DrupalJsonApiParams()

    if (includes?.length) {
      params.addInclude(includes)
    }

    if (pageLimit) {
      params.addPageLimit(pageLimit)
    }

    // Add filters to the query parameters
    filters.forEach((filter: Filter) => {
      if (filter.field && filter.operator) {
        // The IS NULL and IS NOT NULL operators need null as the value.
        // Everything else should have a proper value supplied
        params.addFilter(filter.field, filter.value ?? null, filter.operator)
      }
    })

    // The username & password will let us apply filters, so prefer that
    // Fall back to the client ID and secret otherwise
    const withAuth: DrupalClientAuth = process.env.DRUPAL_USERNAME
      ? {
          username: process.env.DRUPAL_USERNAME,
          password: process.env.DRUPAL_PASSWORD,
        }
      : {
          clientId: process.env.DRUPAL_CLIENT_ID,
          clientSecret: process.env.DRUPAL_CLIENT_SECRET,
        }

    const data = await drupalClient.getResourceCollection(resourceType, {
      params: params.getQueryObject(),
      withAuth,
    })

    // Avoid circular references in the health_care_region_page node. Every item in its
    // `field_clinical_health_services` has a 'field_region_page', and we need to set it
    // to "[\"Circular Reference]\". Circular references will cause the json output to
    // fail. While this is a hack, this endpoint isn't used for production, so it's fine.
    const safeData = data.map((item) => {
      if (
        item.type === 'node--health_care_region_page' &&
        'field_clinical_health_services' in item
      ) {
        return {
          ...item,
          field_clinical_health_services:
            item.field_clinical_health_services.map((service) => ({
              ...service,
              field_region_page: '[Circular Reference]',
            })),
        }
      }
      return item
    })

    return NextResponse.json(safeData)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        error: error.message || 'An error occurred while fetching data',
      },
      { status: 500 }
    )
  }
}
