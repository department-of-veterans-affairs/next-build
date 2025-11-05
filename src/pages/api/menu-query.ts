import { NextApiRequest, NextApiResponse } from 'next'
import { getMenu } from '@/lib/drupal/query'
import { DrupalClientAuth } from 'next-drupal'
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
    const { menuName, useAuthentication } = req.body

    if (!menuName) {
      return res.status(400).json({ error: 'Menu name is required' })
    }

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

    const defaultMenuParams = new DrupalJsonApiParams()
      .addFields('menu_items', ['title,url'])
      .getQueryObject()

    const menuData = await drupalClient.getMenu(menuName, {
      params: defaultMenuParams,

      // Cache resource if redis is available
      withCache: process.env.USE_REDIS === 'true',
      withAuth: useAuthentication ? withAuth : false,
      cacheKey: `menu:${menuName}`,
    })

    // Call getMenu with the provided menu name
    // Using default params (no custom params for now)
    // const menuData = await getMenu(menuName)

    return res.status(200).json(menuData)
  } catch (error) {
    console.error('Menu Query API Error:', error)
    return res.status(500).json({
      error: error.message || 'An error occurred while fetching menu data',
    })
  }
}
