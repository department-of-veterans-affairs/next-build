import { NextApiRequest, NextApiResponse } from 'next'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

interface Filter {
  field: string
  operator: string
  value?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { resourceType, includes, pageLimit, filters } = req.body

    if (!resourceType) {
      return res.status(400).json({ error: 'Resource type is required' })
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

    const data = await drupalClient.getResourceCollection(resourceType, {
      params: params.getQueryObject(),
      withAuth: {
        clientId: process.env.DRUPAL_CLIENT_ID,
        clientSecret: process.env.DRUPAL_CLIENT_SECRET,
      },
    })

    return res.status(200).json(data)
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({
      error: error.message || 'An error occurred while fetching data',
    })
  }
}
