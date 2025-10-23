import { NextApiRequest, NextApiResponse } from 'next'
import { drupalClient } from '@/lib/drupal/drupalClient'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { resourcePath } = req.body

    if (!resourcePath) {
      return res.status(400).json({ error: 'Resource path is required' })
    }

    try {
      const pathInfo = await drupalClient.translatePath(resourcePath)

      if (!pathInfo) {
        return res.status(404).json({ error: 'Path not found' })
      }

      return res.status(200).json(pathInfo)
    } catch (error) {
      // If we're using proxy-fetcher, it'll actually throw an error for 404s
      if ([404, 403].includes(error.cause?.status)) {
        return res.status(404).json({ error: 'Path not found' })
      }
      throw error
    }
  } catch (error) {
    console.error('Entity Lookup Error:', error)
    return res.status(500).json({
      error: error.message || 'An error occurred while looking up the entity',
    })
  }
}
