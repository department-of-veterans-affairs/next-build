/**
 * @jest-environment node
 */

import { DrupalMediaImage } from '@/types/drupal/media'
import { queries } from '@/data/queries/'
import mockData from '@/mocks/mediaImage.mock.json'

//eslint-disable-next-line
const mediaImageMock: DrupalMediaImage | any = mockData

describe('Media image returns formatted data', () => {
  test('outputs formatted data', () => {
    const formattedData = mediaImageMock
    expect(queries.formatData('media--image', formattedData)).toMatchSnapshot()
  })
})
