import { GetStaticPropsContext } from 'next'
import { DrupalTranslatedPath } from 'next-drupal'
import { drupalClient } from '@/lib/drupal/drupalClient'
import {
  ExpandedStaticPropsContext,
  fetchSingleStaticPropsResource,
  getDefaultStaticPropsResource,
} from '@/lib/drupal/staticProps'
import {
  ListingResourceType,
  LISTING_RESOURCE_TYPE_URL_SEGMENTS,
  LISTING_RESOURCE_TYPE_DATA_FIELDS,
} from '@/lib/drupal/listingPages'
import { PAGE_SIZES } from '@/lib/constants/pageSizes'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import {
  LovellStaticPropsContextProps,
  LovellChildVariant,
  LovellResourceType,
  LovellFormattedResource,
  LovellBifurcatedFormattedResource,
  LovellStaticPropsResource,
  LovellListingPageFormattedResource,
} from './types'
import { LOVELL } from './constants'
import {
  isLovellTricareSlug,
  isLovellVaSlug,
  getLovellVariantOfUrl,
  getOppositeChildVariant,
  isLovellBifurcatedResource,
  getLovellVariantOfMenu,
  getLovellVariantOfBreadcrumbs,
} from './utils'

export function getLovellStaticPropsContext(
  context: GetStaticPropsContext
): LovellStaticPropsContextProps {
  const slug = context.params?.slug
  if (isLovellTricareSlug(slug)) {
    return {
      isLovellVariantPage: true,
      variant: LOVELL.tricare.variant,
    }
  }

  if (isLovellVaSlug(slug)) {
    return {
      isLovellVariantPage: true,
      variant: LOVELL.va.variant,
    }
  }

  return {
    isLovellVariantPage: false,
    variant: null,
  }
}

/**
 * Converts resource properties according to variant
 * and adds lovell-specific properties.
 *
 * @param resource
 * @param variant
 */
export function getLovellChildVariantOfResource(
  resource: LovellBifurcatedFormattedResource,
  variant: LovellChildVariant
): LovellStaticPropsResource<typeof resource> {
  const variantPaths = {
    tricare: getLovellVariantOfUrl(resource.entityPath, LOVELL.tricare.variant),
    va: getLovellVariantOfUrl(resource.entityPath, LOVELL.va.variant),
  }

  return {
    ...resource,
    breadcrumbs: getLovellVariantOfBreadcrumbs(resource.breadcrumbs, variant),
    entityPath: variantPaths[variant],
    socialLinks: {
      ...resource.socialLinks,
      path: variantPaths[variant],
    },
    administration: LOVELL[variant].administration,
    listing: getLovellVariantOfUrl(resource.listing, variant),
    canonicalLink: variantPaths.va,
    lovellVariant: variant,
    lovellSwitchPath: variantPaths[getOppositeChildVariant(variant)],
  }
}

async function getLovellListingPageStaticPropsResource(
  resourceType: ListingResourceType,
  pathInfo: DrupalTranslatedPath,
  context: ExpandedStaticPropsContext
): Promise<LovellStaticPropsResource<LovellListingPageFormattedResource>> {
  const id = pathInfo.entity?.uuid
  const childVariantPage = (await fetchSingleStaticPropsResource(
    resourceType,
    pathInfo,
    {
      id,
      // Do not pass a page number; we need all of the pages
      // so we can merge and then calculate page data
    }
  )) as LovellListingPageFormattedResource
  const childVariantPageWithProperBreadcrumbs = {
    ...childVariantPage,
    breadcrumbs: getLovellVariantOfBreadcrumbs(
      childVariantPage.breadcrumbs,
      context.lovell.variant
    ),
  }

  const federalPagePathInfo = await drupalClient.translatePath(
    getLovellVariantOfUrl(context.drupalPath, LOVELL.federal.variant)
  )
  if (!federalPagePathInfo) {
    return childVariantPageWithProperBreadcrumbs
  }
  const federalPageId = federalPagePathInfo.entity?.uuid
  const federalPage = (await fetchSingleStaticPropsResource(
    resourceType,
    federalPagePathInfo,
    {
      id: federalPageId,
      // Again, do not pass specific page number
    }
  )) as LovellListingPageFormattedResource

  const itemProp = LISTING_RESOURCE_TYPE_DATA_FIELDS[resourceType]
  const allMergedItems = [
    ...childVariantPage[itemProp],
    ...federalPage[itemProp].map((item) => {
      // Event Listing pages have the list items constructed a little differently.
      // See queries/eventTeaser.ts
      if (
        itemProp ===
        LISTING_RESOURCE_TYPE_URL_SEGMENTS[RESOURCE_TYPES.EVENT_LISTING]
      ) {
        return {
          ...item,
          link: getLovellVariantOfUrl(
            item.entityUrl.path,
            context.lovell.variant
          ),
        }
      }
      // See queries/newsStoryTeaser.ts
      return {
        ...item,
        link: getLovellVariantOfUrl(item.link, context.lovell.variant),
      }
    }),
  ]
  const pageSize = PAGE_SIZES[resourceType]
  const sliceStart = (context.listing.page - 1) * pageSize
  const sliceEnd = sliceStart + pageSize
  const pagedMergedItems = allMergedItems.slice(sliceStart, sliceEnd)
  const totalItems = childVariantPage.totalItems + federalPage.totalItems
  const totalPages = Math.ceil(totalItems / pageSize) || 0

  return {
    ...childVariantPageWithProperBreadcrumbs,
    [itemProp]: pagedMergedItems,
    currentPage: context.listing.page,
    totalItems,
    totalPages,
    canonicalLink: childVariantPage.entityPath,
    lovellVariant: context.lovell.variant,
    lovellSwitchPath: getLovellVariantOfUrl(
      childVariantPage.entityPath,
      getOppositeChildVariant(context.lovell.variant)
    ),
  }
}

export async function getLovellStaticPropsResource(
  resourceType: LovellResourceType,
  pathInfo: DrupalTranslatedPath,
  context: ExpandedStaticPropsContext
): Promise<LovellStaticPropsResource<LovellFormattedResource>> {
  // Lovell listing pages need Federal items merged
  if (context.lovell.isLovellVariantPage && context.listing.isListingPage) {
    const resource = await getLovellListingPageStaticPropsResource(
      resourceType as ListingResourceType,
      pathInfo,
      context
    )

    return {
      ...resource,
      menu: getLovellVariantOfMenu(resource.menu, context.lovell.variant),
    }
  }

  // Other Lovell pages depend on base resource
  const baseResource = (await getDefaultStaticPropsResource(
    resourceType,
    pathInfo,
    context
  )) as LovellFormattedResource

  // Other: bifurcated pages
  if (isLovellBifurcatedResource(baseResource)) {
    return getLovellChildVariantOfResource(
      baseResource as LovellBifurcatedFormattedResource,
      context.lovell.variant
    )
  }

  // Other: no special treatment
  return baseResource
}
