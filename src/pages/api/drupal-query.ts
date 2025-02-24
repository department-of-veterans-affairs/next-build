import { NextApiRequest, NextApiResponse } from 'next'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { resourceType, includes, pageLimit } = req.body

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
