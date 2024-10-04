import { Checklist } from '@/types/drupal/node'
import { queries } from '@/data/queries'
import mockData from '@/mocks/checklist.mock.json'

const ChecklistMock: Checklist = mockData

describe('Checklist formatData', () => {
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
      queries.formatData('node--checklist', ChecklistMock)
    ).toMatchSnapshot()
  })
})
