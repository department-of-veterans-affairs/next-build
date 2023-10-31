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
import { StaticPathResourceType } from '@/types/index'
import { FormattedResource } from '@/data/queries'
import { ResourceTypeType } from '@/lib/constants/resourceTypes'
import { slugToPath } from '@/lib/utils/slug'

export function isLovellResourceType(resourceType: ResourceTypeType): boolean {
  return (LOVELL_RESOURCE_TYPES as readonly string[]).includes(resourceType)
}

export function isLovellBifurcatedResourceType(
  resourceType: ResourceTypeType
): boolean {
  return (LOVELL_BIFURCATED_RESOURCE_TYPES as readonly string[]).includes(
    resourceType
  )
}

export function isLovellFederalResource(
  resource: LovellFormattedResource | StaticPathResourceType
): boolean {
  return (
    'administration' in resource &&
    resource?.administration?.id === LOVELL.federal.administration.id
  )
}
export function isLovellTricareResource(
  resource: LovellFormattedResource | StaticPathResourceType
): boolean {
  return (
    'administration' in resource &&
    resource?.administration?.id === LOVELL.tricare.administration.id
  )
}
export function isLovellVaResource(
  resource: LovellFormattedResource | StaticPathResourceType
): boolean {
  return (
    'administration' in resource &&
    resource?.administration?.id === LOVELL.va.administration.id
  )
}
export function isLovellResource(
  resource: LovellFormattedResource | StaticPathResourceType
): boolean {
  return (
    isLovellFederalResource(resource) ||
    isLovellTricareResource(resource) ||
    isLovellVaResource(resource)
  )
}
export function isLovellChildVariantResource(
  resource: LovellFormattedResource | StaticPathResourceType
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
 * Replaces first segment (system name) in a path according to `variant`.
 * E.g.
 * Input:
 *   path: `/lovell-federal-health-care-va/stories/story-title`
 *   variant: `tricare`
 * Output: `/lovell-federal-health-care-tricare/stories/story-title`
 */
export function getLovellVariantOfUrl(
  path: string,
  variant: LovellVariant
): string {
  return `/${LOVELL[variant].pathSegment}/${path
    .split('/')
    .filter((slug) => slug !== '')
    .slice(1)
    .join('/')}`
}

export function isLovellBifurcatedResource(
  resource: FormattedResource
): boolean {
  return (
    isLovellBifurcatedResourceType(resource.type as ResourceTypeType) &&
    isLovellChildVariantPath(resource.entityPath) &&
    isLovellFederalResource(resource as LovellBifurcatedFormattedResource)
  )
}

export function getLovellVariantOfMenu(menu, variant: LovellVariant) {
  if (!menu || typeof menu !== 'object') return menu

  // Check if the object has the fieldMenuSection and it doesn't match the variant or is 'both'
  if (
    menu.fieldMenuSection &&
    menu.fieldMenuSection !== variant &&
    menu.fieldMenuSection !== 'both'
  ) {
    return null
  }

  // Filter arrays
  if (Array.isArray(menu)) {
    return menu
      .map((item) => getLovellVariantOfMenu(item, variant))
      .filter((item) => item !== null)
  }

  // Filter objects
  const newData = {}
  for (const key in menu) {
    const filteredData = getLovellVariantOfMenu(menu[key], variant)
    if (filteredData !== null) {
      newData[key] = filteredData
    }
  }

  return newData
}
