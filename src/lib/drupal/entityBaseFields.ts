import { NodeTypes } from '@/types/drupal/node'
import { PublishedEntity } from '@/types/formatted/publishedEntity'
import { LovellStaticPropsContextProps } from '@/lib/drupal/lovell/types'
import {
  getLovellVariantOfTitle,
  getLovellVariantOfBreadcrumbs,
} from '@/lib/drupal/lovell/utils'
import {
  formatBreadcrumbs,
  normalizeBreadcrumbs,
  replaceLastBreadcrumbWithTitle,
} from '@/components/breadcrumbs/breadcrumbs'
import { Breadcrumb } from '@/components/breadcrumbs/formatted-types'

// Helper function to return a consistent set of base fields for resources.
export const entityBaseFields = (
  entity: NodeTypes,
  lovell?: LovellStaticPropsContextProps
): PublishedEntity | null => {
  if (!entity) {
    return null
  }

  // Determine the final title, handling Lovell variant transformation
  let title = entity.title
  if (lovell?.isLovellVariantPage) {
    title = getLovellVariantOfTitle(title, lovell.variant)
  }

  // Process breadcrumbs:
  // 1. Format breadcrumbs to final form
  // 2. Normalize breadcrumbs (set current path to empty href, filter invalid)
  // 3. Replace last breadcrumb with page title
  // 4. Apply Lovell variant transformation if needed
  let breadcrumbs: Breadcrumb[] | null = null
  // NOTE: This function is sometimes used on entities that don't have a path.alias, like
  // processing entities on some listing pages. We don't want to process breadcrumbs then
  if (entity.breadcrumbs && entity.path.alias) {
    // Step 1: Format breadcrumbs
    breadcrumbs = formatBreadcrumbs(entity.breadcrumbs)
    // Step 2: Normalize breadcrumbs
    breadcrumbs = normalizeBreadcrumbs(breadcrumbs, entity.path.alias)
    // Step 3: Replace last breadcrumb with page title
    breadcrumbs = replaceLastBreadcrumbWithTitle(breadcrumbs, title)
    // Step 4: Apply Lovell variant transformation if needed
    if (lovell?.isLovellVariantPage) {
      breadcrumbs = getLovellVariantOfBreadcrumbs(breadcrumbs, lovell.variant)
    }
  }

  const result: PublishedEntity = {
    id: entity.id,
    entityId: entity.drupal_internal__nid,
    entityPath: entity.path.alias,
    type: entity.type,
    published: entity.status,
    moderationState: entity.moderation_state,
    title,
    metatags: entity.metatag,
    breadcrumbs,
    lastUpdated:
      entity.field_last_saved_by_an_editor || entity.changed || entity.created,
  }
  return result
}
