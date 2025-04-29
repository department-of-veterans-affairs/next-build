import { render, screen } from '@testing-library/react'
import { PressReleaseTeaser } from '@/templates/components/pressReleaseTeaser'

const teaserData = {
  id: '6153ed5b-85c2-4ead-9893-3d656ad5d758',
  type: 'node--press_release',
  published: true,
  title: 'Wilmington VAMC 2019 Annual Report',
  lastUpdated: '2021-04-12T14:27:39+00:00',
  releaseDate: '2021-04-12T14:27:39+00:00',
  link: '/wilmington-health-care/news-releases/wilmington-vamc-2019-annual-report',
  introText: 'We invite you to come and read our 2019 Annual Report. ',
}
describe('<PressReleaseTeaser> with valid data', () => {
  let spy: jest.SpyInstance
  beforeEach(() => {
    spy = jest.spyOn(console, 'error').mockImplementation(() => null)
  })
  afterEach(() => {
    spy.mockRestore()
  })
  test('renders component', () => {
    const { container } = render(<PressReleaseTeaser {...teaserData} />)
    const link = container.querySelector('va-link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', teaserData.link)
    expect(link).toHaveAttribute('text', teaserData.title)
    expect(
      screen.getByText(/We invite you to come and read our 2019 Annual Report./)
    ).toBeInTheDocument()
    expect(screen.getByText('April 12, 2021')).toBeInTheDocument()
  })

  test('renders with default heading level', () => {
    const { container } = render(
      <PressReleaseTeaser {...teaserData} headingLevel={undefined} />
    )
    const heading = container.querySelector('h2')
    expect(heading).toBeInTheDocument()
  })

  test('renders correctly with specified heading leve;', () => {
    const { container } = render(
      <PressReleaseTeaser {...teaserData} headingLevel="h3" />
    )
    const heading = container.querySelector('h3')
    expect(heading).toBeInTheDocument()
  })
})
