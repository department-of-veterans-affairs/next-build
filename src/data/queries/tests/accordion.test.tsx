import { ParagraphAccordion } from '@/types/drupal/paragraph'
import { queries } from '@/data/queries'
import mockData from '@/mocks/Accordion.mock.json'

const AccordionMock: ParagraphAccordion = mockData

describe('Accordion formatData', () => {
  let windowSpy

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get')
  })

  afterEach(() => {
    windowSpy.mockRestore()
  })

  test('outputs formatted data', () => {
    windowSpy.mockImplementation(() => undefined)

    expect(
      queries.formatData('paragraph--basic_accordion', AccordionMock)
    ).toMatchSnapshot()
  })
})
