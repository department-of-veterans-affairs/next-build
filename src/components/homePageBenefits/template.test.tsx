import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { HomePageBenefits } from './template'
import { formatter } from './query'
import mockMenu from './mock.json'
import { filterViolations } from '../../test/test-helpers'

const mockData = formatter(mockMenu)

describe('HomePageBenefits Component', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(<HomePageBenefits {...mockData} />)

    const [emptyHeadingViolations, filteredResults] = filterViolations(
      await axe(container),
      'empty-heading'
    )
    expect(filteredResults).toHaveNoViolations()
    // There's one empty heading due to an unhydrated `<va-link>`
    expect(emptyHeadingViolations).toHaveLength(1)
  })

  test('renders the heading correctly', () => {
    render(<HomePageBenefits {...mockData} />)

    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Explore VA benefits and health care',
    })
    expect(heading).toBeInTheDocument()
  })

  test('renders all hub links correctly', () => {
    const { container } = render(<HomePageBenefits {...mockData} />)

    const hubLinks = container.querySelectorAll('va-link')
    expect(hubLinks.length).toBe(mockData.benefitsHubLinks.length)

    mockData.benefitsHubLinks.forEach((link, index) => {
      const vaLink = hubLinks[index]
      expect(vaLink).toHaveAttribute('href', link.url)
      expect(vaLink).toHaveAttribute('text', link.title)
    })
  })

  test('renders all hub descriptions correctly', () => {
    render(<HomePageBenefits {...mockData} />)

    mockData.benefitsHubLinks.forEach((link) => {
      // Expect the benefit description to appear somewhere in the document
      expect(screen.getByText(link.description)).toBeInTheDocument()
    })
  })

  test('groups items into rows of 3', () => {
    const { container } = render(<HomePageBenefits {...mockData} />)

    const rows = container.querySelectorAll('.homepage-benefits-row')
    const expectedRows = Math.ceil(mockData.benefitsHubLinks.length / 3)
    expect(rows.length).toBe(expectedRows)
  })

  test('renders icons', () => {
    const { container } = render(<HomePageBenefits {...mockData} />)

    const icons = container.querySelectorAll('va-icon')
    expect(icons.length).toBe(mockData.benefitsHubLinks.length)
  })
})
