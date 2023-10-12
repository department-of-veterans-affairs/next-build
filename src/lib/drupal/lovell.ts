import { GetStaticPropsContext } from 'next'
import {
  NewsStoryType,
  StaticPathResourceType,
  StoryListingType,
} from '@/types/index'
import { ExpandedStaticPropsContextType } from '@/lib/drupal/staticProps'
import { RESOURCE_TYPES, ResourceTypeType } from '@/lib/constants/resourceTypes'
import { slugToPath } from '@/lib/utils/slug'

export const LOVELL = {
  federal: {
    administration: {
      id: 347,
      name: 'Lovell Federal health care',
    },
    pathSegment: 'lovell-federal-health-care',
    variant: 'federal',
  },
  tricare: {
    administration: {
      id: 1039,
      name: 'Lovell - TRICARE',
    },
    pathSegment: 'lovell-federal-health-care-tricare',
    variant: 'tricare',
  },
  va: {
    administration: {
      id: 1040,
      name: 'Lovell - VA',
    },
    pathSegment: 'lovell-federal-health-care-va',
    variant: 'va',
  },
} as const

const LOVELL_RESOURCE_TYPES = [
  RESOURCE_TYPES.STORY,
  // RESOURCE_TYPES.STORY_LISTING,
]

const LOVELL_BIFURCATED_RESOURCE_TYPES = [RESOURCE_TYPES.STORY]

export type LovellVariant =
  | typeof LOVELL.federal.variant
  | typeof LOVELL.tricare.variant
  | typeof LOVELL.va.variant

export type LovellChildVariant =
  | typeof LOVELL.tricare.variant
  | typeof LOVELL.va.variant

type LovellResourceTypeMap = {
  [K in (typeof LOVELL_RESOURCE_TYPES)[number]]: K extends typeof RESOURCE_TYPES.STORY
    ? NewsStoryType
    : K extends typeof RESOURCE_TYPES.STORY_LISTING
    ? StoryListingType
    : never
}

export type LovellResourceTypeType =
  LovellResourceTypeMap[keyof LovellResourceTypeMap]

type LovellBifurcatedResourceTypeMap = Pick<
  LovellResourceTypeMap,
  (typeof LOVELL_BIFURCATED_RESOURCE_TYPES)[number]
>

export type LovellBifurcatedResourceTypeType =
  LovellBifurcatedResourceTypeMap[keyof LovellBifurcatedResourceTypeMap]

export type LovellPageExpandedStaticPropsContextType = {
  isLovellVariantPage: boolean
  variant: LovellChildVariant
}

export type LovellPageExpandedStaticPropsResourceType = {
  canonicalLink?: string
  lovellVariant?: LovellChildVariant
  lovellSwitchPath?: string
}

export type LovellExpandedResourceTypeType<T extends LovellResourceTypeType> =
  T & LovellPageExpandedStaticPropsResourceType

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
  resource: LovellResourceTypeType | StaticPathResourceType
): boolean {
  return (
    'administration' in resource &&
    resource?.administration?.id === LOVELL.federal.administration.id
  )
}
export function isLovellTricareResource(
  resource: LovellResourceTypeType | StaticPathResourceType
): boolean {
  return (
    'administration' in resource &&
    resource?.administration?.id === LOVELL.tricare.administration.id
  )
}
export function isLovellVaResource(
  resource: LovellResourceTypeType | StaticPathResourceType
): boolean {
  return (
    'administration' in resource &&
    resource?.administration?.id === LOVELL.va.administration.id
  )
}
export function isLovellResource(
  resource: LovellResourceTypeType | StaticPathResourceType
): boolean {
  return (
    isLovellFederalResource(resource) ||
    isLovellTricareResource(resource) ||
    isLovellVaResource(resource)
  )
}

function isLovellChildVariantPath(
  variant: LovellChildVariant,
  path: string
): boolean {
  return new RegExp(`^\/?${LOVELL[variant].pathSegment}`).test(path)
}
export function isLovellTricarePath(path: string) {
  return isLovellChildVariantPath(LOVELL.tricare.variant, path)
}
export function isLovellVaPath(path: string) {
  return isLovellChildVariantPath(LOVELL.va.variant, path)
}

function isLovellChildVariantSlug(
  variant: LovellChildVariant,
  slug: string | string[]
): boolean {
  const path = slugToPath(slug)
  return variant === LOVELL.tricare.variant
    ? isLovellTricarePath(path)
    : isLovellVaPath(path)
}
export function isLovellTricareSlug(slug: string | string[]) {
  return isLovellChildVariantSlug(LOVELL.tricare.variant, slug)
}
export function isLovellVaSlug(slug: string | string[]) {
  return isLovellChildVariantSlug(LOVELL.va.variant, slug)
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
function getLovellVariantOfUrl(path: string, variant: LovellVariant): string {
  return `/${LOVELL[variant].pathSegment}/${path
    .split('/')
    .filter((slug) => slug !== '')
    .slice(1)
    .join('/')}`
}

/**
 * Returns a static-path resource adjusted for `variant`
 */
export function getLovellVariantOfStaticPathResource(
  resource: StaticPathResourceType,
  variant: LovellVariant
): StaticPathResourceType {
  return {
    path: {
      ...resource.path,
      alias: getLovellVariantOfUrl(
        resource.path.alias,
        LOVELL[variant].variant
      ),
    },
    administration: LOVELL[variant].administration,
  }
}

/**
 * Converts resource properties according to variant
 * and adds lovell-specific properties.
 *
 * @param resource
 * @param variant
 */
function getLovellChildVariantOfResource(
  resource: LovellBifurcatedResourceTypeType,
  variant: LovellChildVariant
): LovellExpandedResourceTypeType<typeof resource> {
  const variantPaths = {
    tricare: getLovellVariantOfUrl(resource.entityPath, LOVELL.tricare.variant),
    va: getLovellVariantOfUrl(resource.entityPath, LOVELL.va.variant),
  }

  return {
    ...resource,
    entityPath: variantPaths[variant],
    socialLinks: {
      ...resource.socialLinks,
      path: variantPaths[variant],
    },
    administration: LOVELL[variant].administration,
    canonicalLink: variantPaths.va,
    lovellVariant: variant,
    lovellSwitchPath: variantPaths[getOppositeChildVariant(variant)],
  }
}

/**
 * Path resources assigned to Lovell Federal system become two distinct path resources;
 * one for TRICARE and one for VA.
 */
function bifurcateLovellFederalPathResource(
  resource: StaticPathResourceType
): StaticPathResourceType[] {
  const tricareResource = getLovellVariantOfStaticPathResource(
    resource,
    LOVELL.tricare.variant
  )

  const vaResource = getLovellVariantOfStaticPathResource(
    resource,
    LOVELL.va.variant
  )

  return [tricareResource, vaResource]
}
export function bifurcateLovellFederalPathResources(
  resources: StaticPathResourceType[]
): StaticPathResourceType[] {
  // Split resources into Lovell Federal and others.
  // Note: This could be done with two filter calls,
  // but that would require two passes over the array.
  const { lovellFederalResources, otherResources } = resources.reduce(
    (acc, resource) => {
      if (isLovellFederalResource(resource)) {
        acc.lovellFederalResources.push(resource)
      } else {
        acc.otherResources.push(resource)
      }
      return acc
    },
    {
      lovellFederalResources: [],
      otherResources: [],
    }
  )

  return [
    ...lovellFederalResources.flatMap(bifurcateLovellFederalPathResource),
    ...otherResources,
  ]
}

export function removeLovellFederalPathResources(
  resources: StaticPathResourceType[]
): StaticPathResourceType[] {
  return resources.filter((resource) => !isLovellFederalResource(resource))
}

export function getLovellPageExpandedStaticPropsContext(
  context: GetStaticPropsContext
): LovellPageExpandedStaticPropsContextType {
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

export function getLovellPageExpandedStaticPropsResource<
  T extends LovellResourceTypeType
>(
  resource: T,
  context: ExpandedStaticPropsContextType
): LovellExpandedResourceTypeType<LovellResourceTypeType> | T {
  const isBifurcatedPage =
    isLovellBifurcatedResourceType(resource.type as ResourceTypeType) &&
    context.lovell.isLovellVariantPage &&
    isLovellFederalResource(resource as LovellBifurcatedResourceTypeType)
  if (isBifurcatedPage) {
    return getLovellChildVariantOfResource(
      resource as LovellBifurcatedResourceTypeType,
      context.lovell.variant
    )
  }

  // const isLovellListingPage =
  //   isLovellResourceType(resource.type as ResourceTypeType) &&
  //   context.lovell.isLovellVariantPage &&
  //   context.listing.isListingPage
  // if (isLovellListingPage) {
  //   return mergeFederalListingPage(resource)
  // }

  return resource
}
