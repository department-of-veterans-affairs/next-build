/**
 * @jest-environment node
 */

import { BlockPromo } from '@/types/drupal/block'
import { queries } from '@/data/queries'
import { mockResponse } from '@/mocks/promoBlock.mock'
import { params } from '../promoBlock'
//eslint-disable-next-line
const PromoBlock: BlockPromo | any = mockResponse

describe('DrupalJsonApiParams configuration', () => {
  test('params function sets the correct include fields', () => {
    const paramsInstance = params()
    const queryString = decodeURIComponent(paramsInstance.getQueryString())
    expect(queryString).toMatch(
      /include=field_image,field_image.image,field_promo_link/
    )
  })
})

describe('promoBlock formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('block_content--promo', PromoBlock)
    ).toMatchSnapshot()
  })
})
