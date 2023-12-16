import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { drupalClient } from '@/lib/drupal/drupalClient'
import { QueryParams } from 'next-drupal-query'

export async function getMenu(name: string, params: QueryParams<null>) {
  const menu = await drupalClient.getMenu(name, {
    params: params().getQueryObject(),

    // Cache resource during build, not dev.
    // withCache: process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD,
    // cacheKey: `menu:${name}`,
  })

  return menu
}
