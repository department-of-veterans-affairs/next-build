/**
 * @jest-environment node
 */

import { DrupalMediaDocument } from '@/types/drupal/media'
import { queries } from '@/data/queries'
import mockData from '@/mocks/mediaDocument.mock.json'

//eslint-disable-next-line
const mediaDocumentMock: DrupalMediaDocument | any = mockData

describe('Media image returns formatted data', () => {
  test('outputs formatted data', () => {
    const formattedData = mediaDocumentMock
    expect(queries.formatData('media--document', formattedData)).toMatchSnapshot()
  })
})
