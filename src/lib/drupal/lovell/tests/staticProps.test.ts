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
