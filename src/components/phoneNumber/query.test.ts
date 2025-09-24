/**
 * @jest-environment node
 */

import { queries } from '@/lib/drupal/queries'
import { ParagraphPhoneNumber } from '@/types/drupal/paragraph'
import mockData from '@/components/phoneNumber/mock.json'

const phoneNumberMock = mockData as ParagraphPhoneNumber

describe('paragraph--phone_number formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('paragraph--phone_number', phoneNumberMock)
    ).toMatchSnapshot()
  })
})
