/**
 * @jest-environment node
 */

import { DrupalMediaVideo } from '@/types/drupal/media'
import {queries} from '@/data/queries/'
import mockData from '@/mocks/mediaImage.mock.json'

//eslint-disable-next-line
const mediaVideoMock: DrupalMediaVideo | any = mockData

describe('Media image returns formatted data', () => {
  test('outputs formatted data', () => {
    const formattedData = mediaVideoMock
    expect(queries.formatData('media--video', formattedData)).toMatchSnapshot()
  })
})
