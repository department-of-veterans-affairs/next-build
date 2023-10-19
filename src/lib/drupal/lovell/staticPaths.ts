import { LovellVariant } from './types'
import { LOVELL } from './constants'
import { getLovellVariantOfUrl, isLovellFederalResource } from './utils'
import { StaticPathResourceType } from '@/types/index'

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

export function removeLovellFederalPathResources(
  resources: StaticPathResourceType[]
): StaticPathResourceType[] {
  return resources.filter((resource) => !isLovellFederalResource(resource))
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
