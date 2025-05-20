import { LOVELL } from '../constants'
import { getLovellStaticPropsContext } from '../staticProps'
import { lovellTricareSlug, lovellVaSlug, otherSlug } from './mockData'

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

// describe('getLovellExpandedFormattedResource', () => {
//   describe(`${RESOURCE_TYPES.STORY}`, () => {
//     test('should properly handle TRICARE bifurcated news story page', () => {
//       const tricarePath = lovellTricareResource.path.alias
//       const vaPath = lovellVaResource.path.alias
//       const expandedContext = {
//         params: {
//           slug: lovellTricareSlug,
//         },
//         path: tricarePath,
//         drupalPath: tricarePath,
//         lovell: {
//           isLovellVariantPage: true,
//           variant: LOVELL.tricare.variant,
//         },
//         listing: {
//           isListingPage: false,
//           firstPagePath: null,
//           page: null,
//         },
//       }
//       const resource: NewsStoryType = {
//         ...newsStoryPartialResource,
//         entityPath: vaPath, //Bifurcated pages get VA version's path from Drupal
//         socialLinks: {
//           ...newsStoryPartialResource.socialLinks,
//           vaPath,
//         },
//         administration: LOVELL.federal.administration, //This indicates bifurcation
//       }

//       const result: LovellExpandedFormattedResource<NewsStoryType> =
//         getLovellExpandedFormattedResource(resource, expandedContext)

//       expect(result.entityPath).toBe(tricarePath)
//       expect(result.socialLinks.path).toBe(tricarePath)
//       expect(result.administration).toStrictEqual(LOVELL.tricare.administration)
//       expect(result.lovellVariant).toBe(LOVELL.tricare.variant)
//       expect(result.canonicalLink).toBe(vaPath)
//       expect(result.lovellSwitchPath).toBe(vaPath)
//     })

//     test('should properly handle VA bifurcated news story page', () => {
//       const vaPath = lovellVaResource.path.alias
//       const tricarePath = lovellTricareResource.path.alias
//       const expandedContext = {
//         params: {
//           slug: lovellVaSlug,
//         },
//         path: vaPath,
//         drupalPath: vaPath,
//         lovell: {
//           isLovellVariantPage: true,
//           variant: LOVELL.va.variant,
//         },
//         listing: {
//           isListingPage: false,
//           firstPagePath: null,
//           page: null,
//         },
//       }
//       const resource: NewsStoryType = {
//         ...newsStoryPartialResource,
//         entityPath: vaPath,
//         socialLinks: {
//           ...newsStoryPartialResource.socialLinks,
//           path: vaPath,
//         },
//         administration: LOVELL.federal.administration, //This indicates bifurcation
//       }

//       const result: LovellExpandedFormattedResource<NewsStoryType> =
//         getLovellExpandedFormattedResource(resource, expandedContext)

//       expect(result.entityPath).toBe(vaPath)
//       expect(result.socialLinks.path).toBe(vaPath)
//       expect(result.administration).toStrictEqual(LOVELL.va.administration)
//       expect(result.lovellVariant).toBe(LOVELL.va.variant)
//       expect(result.canonicalLink).toBe(vaPath)
//       expect(result.lovellSwitchPath).toBe(tricarePath)
//     })

//     test('should return original page resource when Lovell but not bifurcated', () => {
//       const path = otherResource.path.alias
//       const expandedContext = {
//         params: {
//           slug: otherSlug,
//         },
//         path,
//         drupalPath: path,
//         lovell: {
//           isLovellVariantPage: true,
//           variant: LOVELL.tricare.variant,
//         },
//         listing: {
//           isListingPage: false,
//           firstPagePath: null,
//           page: null,
//         },
//       }
//       const resource: NewsStoryType = {
//         ...newsStoryPartialResource,
//         entityPath: path, //Non-bifurcated TRICARE pages get TRICARE path
//         socialLinks: {
//           ...newsStoryPartialResource.socialLinks,
//           path,
//         },
//         administration: LOVELL.tricare.administration, //Not bifurcated because not federal
//       }

//       const result: LovellExpandedFormattedResource<NewsStoryType> =
//         getLovellExpandedFormattedResource(resource, expandedContext)

//       expect(result).toStrictEqual(resource)
//     })

//     test('should return original page resource when not Lovell page', () => {
//       const path = otherResource.path.alias
//       const expandedContext = {
//         params: {
//           slug: otherSlug,
//         },
//         path,
//         drupalPath: path,
//         lovell: {
//           isLovellVariantPage: false,
//           variant: null,
//         },
//         listing: {
//           isListingPage: false,
//           firstPagePath: null,
//           page: null,
//         },
//       }
//       const resource: NewsStoryType = {
//         ...newsStoryPartialResource,
//         entityPath: path,
//         socialLinks: {
//           ...newsStoryPartialResource.socialLinks,
//           path,
//         },
//         administration: {
//           id: 123,
//           name: 'Some Other Health Care',
//         },
//       }
//       const result = getLovellExpandedFormattedResource(
//         resource,
//         expandedContext
//       )
//       expect(result).toStrictEqual(resource)
//     })
//   })
// })
