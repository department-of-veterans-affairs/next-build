import { LOVELL } from './constants'
import {
  LovellVariant,
  LovellChildVariant,
  LovellFormattedResource,
  LovellBifurcatedFormattedResource,
} from './types'
import {
  LOVELL_RESOURCE_TYPES,
  LOVELL_BIFURCATED_RESOURCE_TYPES,
} from './constants'
import { StaticPathResource } from '@/components/staticPathResources/formatted-type'
import { FormattedPageResource } from '@/lib/drupal/queries'
import { ResourceType } from '@/lib/constants/resourceTypes'
import { slugToPath } from '@/lib/utils/slug'
import { SideNavItem, SideNavMenu } from '@/types/formatted/sideNav'
import { Breadcrumb } from '@/components/breadcrumbs/formatted-types'

export function isLovellResourceType(resourceType: ResourceType): boolean {
  return (LOVELL_RESOURCE_TYPES as readonly string[]).includes(resourceType)
}

export function isLovellBifurcatedResourceType(
  resourceType: ResourceType
): boolean {
  return (LOVELL_BIFURCATED_RESOURCE_TYPES as readonly string[]).includes(
    resourceType
  )
}

export function isLovellFederalResource(
  resource: LovellFormattedResource | StaticPathResource
): boolean {
  return (
    'administration' in resource &&
    resource?.administration?.entityId ===
      LOVELL.federal.administration.entityId
  )
}
export function isLovellTricareResource(
  resource: LovellFormattedResource | StaticPathResource
): boolean {
  return (
    'administration' in resource &&
    resource?.administration?.entityId ===
      LOVELL.tricare.administration.entityId
  )
}
export function isLovellVaResource(
  resource: LovellFormattedResource | StaticPathResource
): boolean {
  return (
    'administration' in resource &&
    resource?.administration?.entityId === LOVELL.va.administration.entityId
  )
}
export function isLovellResource(
  resource: LovellFormattedResource | StaticPathResource
): boolean {
  return (
    isLovellFederalResource(resource) ||
    isLovellTricareResource(resource) ||
    isLovellVaResource(resource)
  )
}
export function isLovellChildVariantResource(
  resource: LovellFormattedResource | StaticPathResource
): boolean {
  return isLovellTricareResource(resource) || isLovellVaResource(resource)
}

function pathIsVariantPath(variant: LovellChildVariant, path: string): boolean {
  return new RegExp(`^\/?${LOVELL[variant].pathSegment}`).test(path)
}
export function isLovellTricarePath(path: string) {
  return pathIsVariantPath(LOVELL.tricare.variant, path)
}
export function isLovellVaPath(path: string) {
  return pathIsVariantPath(LOVELL.va.variant, path)
}
export function isLovellChildVariantPath(path: string) {
  return isLovellTricarePath(path) || isLovellVaPath(path)
}

function slugIsVariantSlug(
  variant: LovellChildVariant,
  slug: string | string[]
): boolean {
  const path = slugToPath(slug)
  return variant === LOVELL.tricare.variant
    ? isLovellTricarePath(path)
    : isLovellVaPath(path)
}
export function isLovellTricareSlug(slug: string | string[]) {
  return slugIsVariantSlug(LOVELL.tricare.variant, slug)
}
export function isLovellVaSlug(slug: string | string[]) {
  return slugIsVariantSlug(LOVELL.va.variant, slug)
}
export function isLovellChildVariantSlug(slug: string | string[]) {
  return isLovellTricareSlug(slug) || isLovellVaSlug(slug)
}

export function getOppositeChildVariant(
  variant: LovellChildVariant
): LovellChildVariant {
  return variant === LOVELL.tricare.variant
    ? LOVELL.va.variant
    : LOVELL.tricare.variant
}

/**
 * Replaces first occurrence of a lovell path segment according to `variant`.
 * E.g.
 * Input:
 *   path: `/lovell-federal-health-care-va/stories/story-title`
 *   variant: `tricare`
 * Output: `/lovell-federal-health-care-tricare/stories/story-title`
 * Input:
 *   path: `https://www.va.gov/lovell-federal-health-care-tricare/stories/story-title`
 *   variant: `va`
 * Output: `https://www.va.gov/lovell-federal-health-care-va/stories/story-title`
 *
 */
export function getLovellVariantOfUrl(
  url: string,
  variant: LovellVariant
): string {
  return url.replace(
    // Note: Lovell Federal path segment must be listed
    // last since it's a substring of the others and
    // we don't want to prematurely match
    new RegExp(
      [
        LOVELL.tricare.pathSegment,
        LOVELL.va.pathSegment,
        LOVELL.federal.pathSegment,
      ].join('|')
    ),
    LOVELL[variant].pathSegment
  )
}

/**
 * Replaces Lovell title string according to `variant`.
 * Returns original string if no Lovell match found.
 * E.g.
 *   Input:
 *     title: `Lovell Federal health care`
 *     variant: `va`
 *   Output: `Lovell Federal health care - VA`
 */
export function getLovellVariantOfTitle(
  title: string,
  variant: LovellVariant
): string {
  return title.replace(
    // Note: Lovell Federal title must be listed
    // last since it's a substring of the others and
    // we don't want to prematurely match
    new RegExp(
      [LOVELL.tricare.title, LOVELL.va.title, LOVELL.federal.title].join('|'),
      'i'
    ),
    LOVELL[variant].title
  )
}

/**
 * Updates breadcrumb entries according to `variant`.
 * Non-Lovell entries are unchanged. Lovell entries
 * have label and href updated.
 * E.g.
 *   Input:
 *     breadcrumbs: [
 *       {
 *         href: '/',
 *         label: 'Home',
 *         options: [],
 *       },
 *       {
 *         href: '/lovell-federal-health-care',
 *         label: 'Lovell Federal health care',
 *         options: [],
 *       },
 *     ],
 *     variant: `va`
 *   Output: [
 *     {
 *        href: '/',
 *        label: 'Home',
 *        options: [],
 *      },
 *      {
 *        href: '/lovell-federal-health-care-va',
 *        label: 'Lovell Federal health care - VA',
 *        options: [],
 *      },
 *   ]
 */
export function getLovellVariantOfBreadcrumbs(
  breadcrumbs: Breadcrumb[],
  variant: LovellVariant
): Breadcrumb[] {
  return breadcrumbs.map((breadcrumb) => ({
    ...breadcrumb,
    label: getLovellVariantOfTitle(breadcrumb.label, variant),
    href: getLovellVariantOfUrl(breadcrumb.href, variant),
  }))
}

export function isLovellBifurcatedResource(
  resource: FormattedPageResource
): boolean {
  return (
    isLovellBifurcatedResourceType(resource.type as ResourceType) &&
    isLovellChildVariantPath(resource.entityPath) &&
    isLovellFederalResource(resource as LovellBifurcatedFormattedResource)
  )
}

// This filters out two lovell-specific menu items that aren't used in side navs.
function processLovellMenuData(menu: SideNavMenu) {
  if (menu && menu.data && menu.data.links) {
    menu.data.links = menu.data.links.filter(
      (link) => link.links && link.links.length > 0
    )
  }
  return menu
}

export function getLovellVariantOfMenu(
  menu: SideNavMenu,
  variant: LovellVariant
) {
  menu = processLovellMenuData(menu)
  // Pass only the 'links' property to filterMenu.
  const filteredLinks = filterMenu(menu.data.links, variant)
  return {
    ...menu,
    data: {
      ...menu.data,
      links: filteredLinks,
    },
  }
}

// Recursive function to filter out links based on current Lovell Variant
function filterMenu(links: SideNavItem[], variant: LovellVariant) {
  return links
    .filter(
      (menuItem) =>
        menuItem.lovellSection === variant || menuItem.lovellSection === 'both'
    )
    .map((menuItem) => ({
      ...menuItem,
      links: menuItem.links ? filterMenu(menuItem.links, variant) : undefined,
    }))
}
