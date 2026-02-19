/**
 * @jest-environment node
 */

import { DrupalMediaDocumentExternal } from '@/types/drupal/media'
import { formatter as mediaDocumentExternalFormatter } from './query'
import mockData from '@/components/mediaDocumentExternal/mock.json'

//eslint-disable-next-line
const mediaDocumentExternalMock: DrupalMediaDocumentExternal | any = mockData

describe('Media image returns formatted data', () => {
  test('outputs formatted data', () => {
    const formattedData = mediaDocumentExternalMock
    expect(mediaDocumentExternalFormatter(formattedData)).toMatchSnapshot()
  })
})
