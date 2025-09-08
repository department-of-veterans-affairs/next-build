/**
 * @jest-environment node
 */

import { queries } from '@/lib/drupal/queries'
import mockData from './mock.json'

describe('paragraph--link_teaser formatData', () => {
  test('outputs formatted data', () => {
    expect(queries.formatData('paragraph--service_location', mockData)).toMatchSnapshot()
  })
})
