/**
 * @jest-environment node
 */
import { queries } from '@/lib/drupal/queries'
import mockDataCreateAccount from '@/components/homePageHero/homePageCreateAccountSubqueueMock.json'
import mockDataPromo from '@/components/homePageHero/homePageHeroSubqueueMock.json'

describe('HomePageHeroData formatData', () => {
  test('outputs formatted data', () => {
    expect(
      queries.formatData('hero-data', {
        promoBlock: mockDataPromo,
        createAccountBlock: mockDataCreateAccount,
      })
    ).toMatchSnapshot()
  })
})
