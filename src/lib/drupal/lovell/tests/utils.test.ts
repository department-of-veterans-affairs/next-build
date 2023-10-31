import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import { LOVELL } from '../constants'
import {
  isLovellResourceType,
  isLovellBifurcatedResourceType,
  isLovellFederalResource,
  isLovellTricareResource,
  isLovellVaResource,
  isLovellResource,
  isLovellChildVariantResource,
  isLovellTricarePath,
  isLovellVaPath,
  isLovellChildVariantPath,
  isLovellTricareSlug,
  isLovellVaSlug,
  isLovellChildVariantSlug,
  getOppositeChildVariant,
  isLovellBifurcatedResource,
  getLovellVariantOfUrl,
  getLovellVariantOfTitle,
  getLovellVariantOfBreadcrumbs,
} from '../utils'
import {
  lovellTricareSlug,
  lovellVaSlug,
  otherSlug,
  lovellFederalResource,
  lovellTricareResource,
  lovellVaResource,
  otherResource,
  newsStoryPartialResource,
} from './mockData'

describe('isLovellResourceType', () => {
  test('should return true when Lovell resource type', () => {
    const storyResult = isLovellResourceType(RESOURCE_TYPES.STORY)
    expect(storyResult).toBe(true)
  })

  test('should return false when not Lovell resource type', () => {
    const storyListingResult = isLovellResourceType(RESOURCE_TYPES.QA)
    expect(storyListingResult).toBe(false)
  })
})

describe('isLovellBifurcatedResourceType', () => {
  test('should return true when Lovell bifurcated resource type', () => {
    const storyResult = isLovellBifurcatedResourceType(RESOURCE_TYPES.STORY)
    expect(storyResult).toBe(true)
  })

  test('should return false when not Lovell bifurcated resource type', () => {
    const storyListingResult = isLovellBifurcatedResourceType(
      RESOURCE_TYPES.STORY_LISTING
    )
    expect(storyListingResult).toBe(false)
  })
})

describe('isLovellFederalResource', () => {
  test('should return true when Federal resource', () => {
    const result = isLovellFederalResource(lovellFederalResource)
    expect(result).toBe(true)
  })

  test('should return false when TRICARE resource', () => {
    const result = isLovellFederalResource(lovellTricareResource)
    expect(result).toBe(false)
  })

  test('should return false when VA resource', () => {
    const result = isLovellFederalResource(lovellVaResource)
    expect(result).toBe(false)
  })

  test('should return false when any other resource', () => {
    const result = isLovellFederalResource(otherResource)
    expect(result).toBe(false)
  })
})

describe('isLovellTricareResource', () => {
  test('should return true when TRICARE resource', () => {
    const result = isLovellTricareResource(lovellTricareResource)
    expect(result).toBe(true)
  })

  test('should return false when Federal resource', () => {
    const result = isLovellTricareResource(lovellFederalResource)
    expect(result).toBe(false)
  })

  test('should return false when VA resource', () => {
    const result = isLovellTricareResource(lovellVaResource)
    expect(result).toBe(false)
  })

  test('should return false when any other resource', () => {
    const result = isLovellTricareResource(otherResource)
    expect(result).toBe(false)
  })
})

describe('isLovellVaResource', () => {
  test('should return true when VA resource', () => {
    const result = isLovellVaResource(lovellVaResource)
    expect(result).toBe(true)
  })

  test('should return false when Federal resource', () => {
    const result = isLovellVaResource(lovellFederalResource)
    expect(result).toBe(false)
  })

  test('should return false when TRICARE resource', () => {
    const result = isLovellVaResource(lovellTricareResource)
    expect(result).toBe(false)
  })

  test('should return false when any other resource', () => {
    const result = isLovellVaResource(otherResource)
    expect(result).toBe(false)
  })
})

describe('isLovellResource', () => {
  test('should return true when Federal resource', () => {
    const result = isLovellResource(lovellFederalResource)
    expect(result).toBe(true)
  })

  test('should return true when TRICARE resource', () => {
    const result = isLovellResource(lovellTricareResource)
    expect(result).toBe(true)
  })

  test('should return true when VA resource', () => {
    const result = isLovellResource(lovellVaResource)
    expect(result).toBe(true)
  })

  test('should return false when any other resource', () => {
    const result = isLovellResource(otherResource)
    expect(result).toBe(false)
  })
})

describe('isLovellChildVariantResource', () => {
  test('should return false when Federal resource', () => {
    const result = isLovellChildVariantResource(lovellFederalResource)
    expect(result).toBe(false)
  })

  test('should return true when TRICARE resource', () => {
    const result = isLovellChildVariantResource(lovellTricareResource)
    expect(result).toBe(true)
  })

  test('should return true when VA resource', () => {
    const result = isLovellChildVariantResource(lovellVaResource)
    expect(result).toBe(true)
  })

  test('should return false when any other resource', () => {
    const result = isLovellChildVariantResource(otherResource)
    expect(result).toBe(false)
  })
})

describe('isLovellTricarePath', () => {
  test('should return true when TRICARE path', () => {
    const result = isLovellTricarePath(lovellTricareResource.path.alias)
    expect(result).toBe(true)
  })

  test('should return false when VA path', () => {
    const result = isLovellTricarePath(lovellVaResource.path.alias)
    expect(result).toBe(false)
  })

  test('should return false when any other path', () => {
    const result = isLovellTricarePath(otherResource.path.alias)
    expect(result).toBe(false)
  })
})

describe('isLovellVaPath', () => {
  test('should return true when VA path', () => {
    const result = isLovellVaPath(lovellVaResource.path.alias)
    expect(result).toBe(true)
  })

  test('should return false when TRICARE path', () => {
    const result = isLovellVaPath(lovellTricareResource.path.alias)
    expect(result).toBe(false)
  })

  test('should return false when any other path', () => {
    const result = isLovellVaPath(otherResource.path.alias)
    expect(result).toBe(false)
  })
})

describe('isLovellChildVariantPath', () => {
  test('should return true when VA path', () => {
    const result = isLovellChildVariantPath(lovellVaResource.path.alias)
    expect(result).toBe(true)
  })

  test('should return true when TRICARE path', () => {
    const result = isLovellChildVariantPath(lovellTricareResource.path.alias)
    expect(result).toBe(true)
  })

  test('should return false when any other path', () => {
    const result = isLovellChildVariantPath(otherResource.path.alias)
    expect(result).toBe(false)
  })
})

describe('isLovellTricareSlug', () => {
  test('should return true when TRICARE slug', () => {
    const result = isLovellTricareSlug(lovellTricareSlug)
    expect(result).toBe(true)
  })

  test('should return false when VA slug', () => {
    const result = isLovellTricareSlug(lovellVaSlug)
    expect(result).toBe(false)
  })

  test('should return false when any other slug', () => {
    const result = isLovellTricareSlug(otherSlug)
    expect(result).toBe(false)
  })
})

describe('isLovellVaSlug', () => {
  test('should return true when VA slug', () => {
    const result = isLovellVaSlug(lovellVaSlug)
    expect(result).toBe(true)
  })

  test('should return false when TRICARE path', () => {
    const result = isLovellVaSlug(lovellTricareSlug)
    expect(result).toBe(false)
  })

  test('should return false when any other path', () => {
    const result = isLovellTricareSlug(otherSlug)
    expect(result).toBe(false)
  })
})

describe('isLovellChildVariantSlug', () => {
  test('should return true when VA slug', () => {
    const result = isLovellChildVariantSlug(lovellVaSlug)
    expect(result).toBe(true)
  })

  test('should return true when TRICARE path', () => {
    const result = isLovellChildVariantSlug(lovellTricareSlug)
    expect(result).toBe(true)
  })

  test('should return false when any other path', () => {
    const result = isLovellChildVariantSlug(otherSlug)
    expect(result).toBe(false)
  })
})

describe('getOppositeChildVariant', () => {
  test('should return VA when TRICARE passed in', () => {
    const result = getOppositeChildVariant(LOVELL.tricare.variant)
    expect(result).toBe(LOVELL.va.variant)
  })

  test('should return TRICARE when VA passed in', () => {
    const result = getOppositeChildVariant(LOVELL.va.variant)
    expect(result).toBe(LOVELL.tricare.variant)
  })
})

describe('getLovellVariantOfUrl', () => {
  test('should properly convert relative url', () => {
    const url = lovellFederalResource.path.alias
    const result = getLovellVariantOfUrl(url, LOVELL.tricare.variant)
    expect(result).toBe(lovellTricareResource.path.alias)
  })

  test('should properly convert absolute url', () => {
    const domain = 'https://www.va.gov'
    const url = `${domain}${lovellFederalResource.path.alias}`
    const result = getLovellVariantOfUrl(url, LOVELL.va.variant)
    expect(result).toBe(`${domain}${lovellVaResource.path.alias}`)
  })

  test('should leave non-Lovell url unchanged', () => {
    const url = '/some/non-lovell/path'
    const result = getLovellVariantOfUrl(url, LOVELL.va.variant)
    expect(result).toBe(url)
  })

  test('should only replace first occurrence of a lovell path segment', () => {
    const url = `${LOVELL.tricare.pathSegment}/${LOVELL.tricare.pathSegment}`
    const result = getLovellVariantOfUrl(url, LOVELL.va.variant)
    expect(result).toBe(
      `${LOVELL.va.pathSegment}/${LOVELL.tricare.pathSegment}`
    )
  })
})

describe('getLovellVariantOfTitle', () => {
  test('should properly convert Lovell title from Federal to child variant', () => {
    const title = LOVELL.federal.title
    const result = getLovellVariantOfTitle(title, LOVELL.va.variant)
    expect(result).toBe(LOVELL.va.title)
  })

  test('should properly convert Lovell title from child variant to Federal', () => {
    const title = LOVELL.tricare.title
    const result = getLovellVariantOfTitle(title, LOVELL.federal.variant)
    expect(result).toBe(LOVELL.federal.title)
  })

  test('should leave non-Lovell title unchanged', () => {
    const title = 'Some non-Lovell title'
    const result = getLovellVariantOfTitle(title, LOVELL.va.variant)
    expect(result).toBe(title)
  })
})

describe('getLovellVariantOfBreadcrumbs', () => {
  const breadcrumbs = [
    {
      uri: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/',
      title: 'Home',
      options: [],
    },
    {
      uri: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/lovell-federal-health-care',
      title: 'Lovell Federal health care',
      options: [],
    },
  ]

  test('should properly convert breadcrumbs', () => {
    const result = getLovellVariantOfBreadcrumbs(breadcrumbs, LOVELL.va.variant)
    expect(result).toStrictEqual([
      breadcrumbs[0],
      {
        uri: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/lovell-federal-health-care-va',
        title: 'Lovell Federal health care - VA',
        options: [],
      },
    ])
  })
})

describe('isLovellBifurcatedResource', () => {
  test('should return true when Lovell bifurcated', () => {
    const bifurcatedResource = {
      ...newsStoryPartialResource,
      entityPath: lovellVaResource.path.alias,
      administration: LOVELL.federal.administration,
    }
    const result = isLovellBifurcatedResource(bifurcatedResource)
    expect(result).toBe(true)
  })

  test('should return false when Lovell TRICARE only', () => {
    const tricareResource = {
      ...newsStoryPartialResource,
      entityPath: lovellTricareResource.path.alias,
      administration: lovellTricareResource.administration,
    }
    const result = isLovellBifurcatedResource(tricareResource)
    expect(result).toBe(false)
  })

  test('should return false when Lovell VA only', () => {
    const vaResource = {
      ...newsStoryPartialResource,
      entityPath: lovellVaResource.path.alias,
      administration: lovellVaResource.administration,
    }
    const result = isLovellBifurcatedResource(vaResource)
    expect(result).toBe(false)
  })

  test('should return false when not a Lovell resource', () => {
    const someOtherResource = {
      ...newsStoryPartialResource,
      entityPath: otherResource.path.alias,
      administration: otherResource.administration,
    }
    const result = isLovellBifurcatedResource(someOtherResource)
    expect(result).toBe(false)
  })
})
