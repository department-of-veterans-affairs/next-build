import { QueryParams } from 'next-drupal-query'
import { drupalClient } from './drupalClient'
import { NodeTypes } from '@/types/drupal/node'
import { PublishedEntity } from '@/types/formatted/publishedEntity'

// Fetch drupal menu resource with cache
export async function getMenu(name: string, params: QueryParams<null>) {
  const menu = await drupalClient.getMenu(name, {
    params: params().getQueryObject(),

    // Cache resource during build, not dev.
    // withCache: process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD,
    // cacheKey: `menu:${name}`,
  })

  return menu
}

// Consistent handler to fetch a node entity from a normal route or a preview route
export async function fetchSingleEntityOrPreview(opts, type, params) {
  const entity = opts?.context?.preview
    ? // need to use getResourceFromContext for unpublished revisions
      await drupalClient.getResourceFromContext(type, opts.context, {
        params: params().getQueryObject(),
      })
    : // otherwise just lookup by uuid
      await drupalClient.getResource(type, opts.id, {
        params: params().getQueryObject(),
      })

  return entity
}

// Helper function to return a consistent set of base fields for resources
export const entityBaseFields = (entity: NodeTypes): PublishedEntity => {
  return {
    id: entity.id,
    entityId: entity.drupal_internal__nid,
    entityPath: entity.path.alias,
    type: entity.type,
    published: entity.status,
    moderationState: entity.moderation_state,
    title: entity.title,
    metatags: entity.metatag,
    breadcrumbs: entity.breadcrumbs,
  }
}
