import { NewsStoryType } from '@/types/index'
import { RESOURCE_TYPES } from '@/lib/constants/resourceTypes'
import {
  LOVELL,
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
  bifurcateLovellFederalPathResources,
  removeLovellFederalPathResources,
  getOppositeChildVariant,
  getLovellStaticPropsContext,
  getLovellExpandedFormattedResource,
  LovellExpandedFormattedResource,
  getLovellVariantOfStaticPathResource,
  isLovellBifurcatedResource,
} from './lovell'
import { slugToPath } from '@/lib/utils/slug'

const lovellFederalSlug = [LOVELL.federal.pathSegment, 'stories', 'story-1']

const lovellTricareSlug = [LOVELL.tricare.pathSegment, 'stories', 'story-1']

const lovellVaSlug = [LOVELL.va.pathSegment, 'stories', 'story-1']

const otherSlug = ['some-other-health-care', 'stories', 'story-1']

const lovellFederalResource = {
  path: {
    alias: slugToPath(lovellFederalSlug),
    pid: null,
    langcode: null,
  },
  administration: LOVELL.federal.administration,
}

const lovellTricareResource = {
  path: {
    alias: slugToPath(lovellTricareSlug),
    pid: null,
    langcode: null,
  },
  administration: LOVELL.tricare.administration,
}

const lovellVaResource = {
  path: {
    alias: slugToPath(lovellVaSlug),
    pid: null,
    langcode: null,
  },
  administration: LOVELL.va.administration,
}

const otherResource = {
  path: {
    alias: slugToPath(otherSlug),
    pid: null,
    langcode: null,
  },
  administration: {
    id: 123,
    name: 'Some Other health care',
  },
}

const newsStoryPartialResource = {
  id: 'some-unique-id',
  type: RESOURCE_TYPES.STORY,
  published: true,
  title: 'Title',
  image: {
    src: 'image/src',
    alt: 'alt-text',
  },
  caption: 'caption',
  author: {
    title: 'Author Name',
  },
  introText: 'intro-text',
  bodyContent: 'story-body',
  date: '2020-01-01',
  socialLinks: {
    title: 'Social Network',
  },
  listing: 'listing',
  entityId: 12345,
}

describe('isLovellResourceType', () => {
  test('should return true when Lovell resource type', () => {
    const storyResult = isLovellResourceType(RESOURCE_TYPES.STORY)
    expect(storyResult).toBe(true)
  })

  test('should return false when not Lovell resource type', () => {
    const storyListingResult = isLovellResourceType(
      RESOURCE_TYPES.STORY_LISTING
    )
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

describe('getLovellVariantOfStaticPathResource', () => {
  const resource = {
    path: {
      alias: `/${LOVELL.va.pathSegment}/stories`,
      pid: 68161,
      langcode: 'en',
    },
    administration: LOVELL.va.administration,
  }

  test('should return resource adjusted for federal variant', () => {
    const result = getLovellVariantOfStaticPathResource(
      resource,
      LOVELL.federal.variant
    )
    expect(result).toStrictEqual({
      path: {
        alias: `/${LOVELL.federal.pathSegment}/stories`,
        pid: resource.path.pid,
        langcode: resource.path.langcode,
      },
      administration: LOVELL.federal.administration,
    })
  })

  test('should return resource adjusted for TRICARE variant', () => {
    const result = getLovellVariantOfStaticPathResource(
      resource,
      LOVELL.tricare.variant
    )
    expect(result).toStrictEqual({
      path: {
        alias: `/${LOVELL.tricare.pathSegment}/stories`,
        pid: resource.path.pid,
        langcode: resource.path.langcode,
      },
      administration: LOVELL.tricare.administration,
    })
  })

  test('should return resource (unchanged) for VA variant', () => {
    const result = getLovellVariantOfStaticPathResource(
      resource,
      LOVELL.va.variant
    )
    expect(result).toStrictEqual(resource)
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

describe('bifurcateLovellFederalPathResources', () => {
  test('should return one additional TRICARE resource and one additional VA resource when one Federal resource is present', () => {
    const resources = [
      lovellFederalResource,
      lovellTricareResource,
      lovellVaResource,
      otherResource,
    ]

    const modifiedResources = bifurcateLovellFederalPathResources(resources)
    expect(modifiedResources.length).toBe(5)

    const federalResources = modifiedResources.filter(isLovellFederalResource)
    expect(federalResources.length).toBe(0)

    const tricareResources = modifiedResources.filter(isLovellTricareResource)
    expect(tricareResources.length).toBe(2)

    const vaResources = modifiedResources.filter(isLovellVaResource)
    expect(vaResources.length).toBe(2)
  })

  test('should return original resource collection when no Federal resources are present', () => {
    const resources = [lovellTricareResource, lovellVaResource, otherResource]

    const modifiedResources = bifurcateLovellFederalPathResources(resources)
    expect(modifiedResources).toEqual(resources)
  })
})

describe('removeLovellFederalPathResources', () => {
  test('should remove Federal resources if present, but leave VA and TRICARE resources', () => {
    const resources = [
      lovellFederalResource,
      lovellTricareResource,
      lovellVaResource,
      otherResource,
    ]

    const modifiedResources = removeLovellFederalPathResources(resources)
    expect(modifiedResources.length).toBe(3)

    const federalResources = modifiedResources.filter(isLovellFederalResource)
    expect(federalResources.length).toBe(0)

    const tricareResources = modifiedResources.filter(isLovellTricareResource)
    expect(tricareResources.length).toBe(1)

    const vaResources = modifiedResources.filter(isLovellVaResource)
    expect(vaResources.length).toBe(1)
  })

  test('should return original resource collection when no Federal resources are present', () => {
    const resources = [lovellTricareResource, lovellVaResource, otherResource]

    const modifiedResources = removeLovellFederalPathResources(resources)
    expect(modifiedResources).toEqual(resources)
  })
})

describe('getLovellStaticPropsContext', () => {
  test('should return TRICARE-populated Lovell values when TRICARE page', () => {
    const context = {
      params: {
        slug: lovellTricareSlug,
      },
    }
    const result = getLovellStaticPropsContext(context)
    expect(result).toStrictEqual({
      isLovellVariantPage: true,
      variant: LOVELL.tricare.variant,
    })
  })

  test('should return VA-populated Lovell values when VA page', () => {
    const context = {
      params: {
        slug: lovellVaSlug,
      },
    }
    const result = getLovellStaticPropsContext(context)
    expect(result).toStrictEqual({
      isLovellVariantPage: true,
      variant: LOVELL.va.variant,
    })
  })

  test('should return null/false Lovell values when not Lovell page', () => {
    const context = {
      params: {
        slug: otherSlug,
      },
    }
    const result = getLovellStaticPropsContext(context)
    expect(result).toStrictEqual({
      isLovellVariantPage: false,
      variant: null,
    })
  })
})

describe('getLovellExpandedFormattedResource', () => {
  describe(`${RESOURCE_TYPES.STORY}`, () => {
    test('should properly handle TRICARE bifurcated news story page', () => {
      const tricarePath = lovellTricareResource.path.alias
      const vaPath = lovellVaResource.path.alias
      const expandedContext = {
        params: {
          slug: lovellTricareSlug,
        },
        path: tricarePath,
        drupalPath: tricarePath,
        lovell: {
          isLovellVariantPage: true,
          variant: LOVELL.tricare.variant,
        },
        listing: {
          isListingPage: false,
          firstPagePath: null,
          page: null,
        },
      }
      const resource: NewsStoryType = {
        ...newsStoryPartialResource,
        entityPath: vaPath, //Bifurcated pages get VA version's path from Drupal
        socialLinks: {
          ...newsStoryPartialResource.socialLinks,
          vaPath,
        },
        administration: LOVELL.federal.administration, //This indicates bifurcation
      }

      const result: LovellExpandedFormattedResource<NewsStoryType> =
        getLovellExpandedFormattedResource(resource, expandedContext)

      expect(result.entityPath).toBe(tricarePath)
      expect(result.socialLinks.path).toBe(tricarePath)
      expect(result.administration).toStrictEqual(LOVELL.tricare.administration)
      expect(result.lovellVariant).toBe(LOVELL.tricare.variant)
      expect(result.canonicalLink).toBe(vaPath)
      expect(result.lovellSwitchPath).toBe(vaPath)
    })

    test('should properly handle VA bifurcated news story page', () => {
      const vaPath = lovellVaResource.path.alias
      const tricarePath = lovellTricareResource.path.alias
      const expandedContext = {
        params: {
          slug: lovellVaSlug,
        },
        path: vaPath,
        drupalPath: vaPath,
        lovell: {
          isLovellVariantPage: true,
          variant: LOVELL.va.variant,
        },
        listing: {
          isListingPage: false,
          firstPagePath: null,
          page: null,
        },
      }
      const resource: NewsStoryType = {
        ...newsStoryPartialResource,
        entityPath: vaPath,
        socialLinks: {
          ...newsStoryPartialResource.socialLinks,
          path: vaPath,
        },
        administration: LOVELL.federal.administration, //This indicates bifurcation
      }

      const result: LovellExpandedFormattedResource<NewsStoryType> =
        getLovellExpandedFormattedResource(resource, expandedContext)

      expect(result.entityPath).toBe(vaPath)
      expect(result.socialLinks.path).toBe(vaPath)
      expect(result.administration).toStrictEqual(LOVELL.va.administration)
      expect(result.lovellVariant).toBe(LOVELL.va.variant)
      expect(result.canonicalLink).toBe(vaPath)
      expect(result.lovellSwitchPath).toBe(tricarePath)
    })

    test('should return original page resource when Lovell but not bifurcated', () => {
      const path = otherResource.path.alias
      const expandedContext = {
        params: {
          slug: otherSlug,
        },
        path,
        drupalPath: path,
        lovell: {
          isLovellVariantPage: true,
          variant: LOVELL.tricare.variant,
        },
        listing: {
          isListingPage: false,
          firstPagePath: null,
          page: null,
        },
      }
      const resource: NewsStoryType = {
        ...newsStoryPartialResource,
        entityPath: path, //Non-bifurcated TRICARE pages get TRICARE path
        socialLinks: {
          ...newsStoryPartialResource.socialLinks,
          path,
        },
        administration: LOVELL.tricare.administration, //Not bifurcated because not federal
      }

      const result: LovellExpandedFormattedResource<NewsStoryType> =
        getLovellExpandedFormattedResource(resource, expandedContext)

      expect(result).toStrictEqual(resource)
    })

    test('should return original page resource when not Lovell page', () => {
      const path = otherResource.path.alias
      const expandedContext = {
        params: {
          slug: otherSlug,
        },
        path,
        drupalPath: path,
        lovell: {
          isLovellVariantPage: false,
          variant: null,
        },
        listing: {
          isListingPage: false,
          firstPagePath: null,
          page: null,
        },
      }
      const resource: NewsStoryType = {
        ...newsStoryPartialResource,
        entityPath: path,
        socialLinks: {
          ...newsStoryPartialResource.socialLinks,
          path,
        },
        administration: {
          id: 123,
          name: 'Some Other Health Care',
        },
      }
      const result = getLovellExpandedFormattedResource(
        resource,
        expandedContext
      )
      expect(result).toStrictEqual(resource)
    })
  })
})
