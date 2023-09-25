import { StaticPathResourceType } from '@/types/index'

const LOVELL = {
  federal: {
    administration: {
      id: 347,
      name: 'Lovell Federal health care',
    },
    slug: 'lovell-federal-health-care',
  },
  tricare: {
    administration: {
      id: 1039,
      name: 'Lovell - TRICARE',
    },
    slug: 'lovell-federal-health-care-tricare',
  },
  va: {
    administration: {
      id: 1040,
      name: 'Lovell - VA',
    },
    slug: 'lovell-federal-health-care-va',
  },
}

function isLovellFederalPathResource(
  resource: StaticPathResourceType
): boolean {
  return resource.administration.id === LOVELL.federal.administration.id
}

/**
 * Replaces first slug (system name) in a path with the passed-in slug.
 * E.g.
 * Input:
 *   path: `/lovell-federal-health-care-va/stories/story-title`
 *   slug: `lovell-federal-health-care-tricare`
 * Output: `/lovell-federal-health-care-tricare/stories/story-title`
 */
function replaceLovellSystemSlugInPath(path: string, slug: string): string {
  return `/${slug}/${path
    .split('/')
    .filter((slug) => slug !== '')
    .slice(1)
    .join('/')}`
}

/**
 * Path resources assigned to Lovell Federal system become two distinct path resources;
 * one for TRICARE and one for VA.
 */
function bifurcateLovellFederalPathResource(
  resource: StaticPathResourceType
): StaticPathResourceType[] {
  const tricareResource = {
    path: {
      ...resource.path,
      alias: replaceLovellSystemSlugInPath(
        resource.path.alias,
        LOVELL.tricare.slug
      ),
    },
    administration: LOVELL.tricare.administration,
  }

  const vaResource = {
    path: {
      ...resource.path,
      alias: replaceLovellSystemSlugInPath(resource.path.alias, LOVELL.va.slug),
    },
    administration: LOVELL.va.administration,
  }

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
      if (isLovellFederalPathResource(resource)) {
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
  return resources.filter((resource) => !isLovellFederalPathResource(resource))
}
