import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import { NodeHealthCareRegionPage } from '@/types/drupal/node'
import { Menu } from '@/types/drupal/menu'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { ExpandedStaticPropsContext } from '@/lib/drupal/staticProps'
import { fetchSingleEntityOrPreview, getMenu } from '../../lib/drupal/query'

export type ShallowVamcSystem = Pick<
  NodeHealthCareRegionPage,
  'id' | 'title' | 'field_system_menu' | 'field_vamc_ehr_system' | 'path'
>

/**
 * Fetches a VAMC system entity and its associated menu.
 * The VAMC system is cached separately so it can be reused across all pages that need it.
 *
 * @param vamcSystemId - The UUID of the VAMC system entity
 * @param context - Optional context for preview support
 * @returns An object containing the VAMC system entity and its menu
 */
export async function getVamcSystemAndMenu(
  vamcSystemId: string,
  context?: ExpandedStaticPropsContext
): Promise<{ vamcSystem: ShallowVamcSystem; menu: Menu | null }> {
  // Fetch the VAMC system separately so it can be cached across all pages that need it.
  const vamcSystem = (await fetchSingleEntityOrPreview(
    {
      id: vamcSystemId,
      context,
      useCache: true,
    },
    RESOURCE_TYPES.VAMC_SYSTEM,
    () => new DrupalJsonApiParams()
  )) as NodeHealthCareRegionPage

  // Fetch the menu name dynamically off of the field_region_page reference if available.
  const menu = await getMenu(
    vamcSystem.field_system_menu.resourceIdObjMeta
      .drupal_internal__target_id as string
  )

  return { vamcSystem, menu }
}
