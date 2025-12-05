import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { HomePageBenefits } from './template'
import { formatter } from './query'
import mockMenu from './mock.json'
import { BenefitsData } from './formatted-type'

const mockData = formatter(mockMenu)

describe('HomePageBenefits Component', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(<HomePageBenefits {...mockData} />)

    const axeResults = await axe(container, {
      rules: {
        // It's only empty because it isn't evaluating the `<va-link>` element inside it.
        'empty-heading': { enabled: false },
      },
    })
    expect(axeResults).toHaveNoViolations()
  })

  test('renders the heading correctly', () => {
    render(<HomePageBenefits {...mockData} />)

    const heading = screen.getByText('Explore VA benefits and health care')
    expect(heading).toBeInTheDocument()
    expect(heading.tagName).toBe('H2')
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

    // Check that each row has correct class
    rows.forEach((row) => {
      expect(row).toHaveClass(
        'usa-grid',
        'usa-grid-full',
        'homepage-benefits-row'
      )
    })
  })

  test('renders icons', () => {
    const { container } = render(<HomePageBenefits {...mockData} />)

    const icons = container.querySelectorAll('va-icon')
    expect(icons.length).toBe(mockData.benefitsHubLinks.length)
  })
})
