import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
jest.mock('@/lib/analytics/recordEvent')
import * as recordEvent from '@/lib/analytics/recordEvent'
import { LinkTeaser } from './template'

describe('<LinkTeaser> component', () => {
  const baseProps = {
    id: 'cb0c2019-0f48-448f-98ca-205d80c8f6fe',
    entityId: 123,
    type: 'paragraph--link_teaser' as const,
    uri: '/health-care/eligibility/',
    title: 'Health Care Benefits Eligibility',
    options: null,
    summary:
      'Not sure if you qualify? Find out if you can get VA health care benefits.',
    sectionHeader: 'Test Section Header',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders va-link with correct attributes', () => {
    const { container } = render(<LinkTeaser {...baseProps} />)

    const vaLink = container.querySelector('va-link')
    expect(vaLink).toHaveAttribute('href', '/health-care/eligibility/')
    expect(vaLink).toHaveAttribute('text', 'Health Care Benefits Eligibility')
    expect(vaLink).toHaveAttribute('target', '')
    expect(vaLink).not.toHaveAttribute('active')
  })

  test('renders summary text', () => {
    render(<LinkTeaser {...baseProps} />)

    expect(
      screen.getByText(
        'Not sure if you qualify? Find out if you can get VA health care benefits.'
      )
    ).toBeInTheDocument()
  })

  test('applies correct CSS classes to li element for field_va_paragraphs', () => {
    const { container } = render(<LinkTeaser {...baseProps} />)

    const liEl = container.querySelector('li')
    expect(liEl).not.toHaveClass('hub-page-link-list__item')
  })

  test('applies correct CSS classes to li element for field_spokes', () => {
    const propsWithSpokes = {
      ...baseProps,
      isHubPage: true,
    }
    const { container } = render(<LinkTeaser {...propsWithSpokes} />)

    const liEl = container.querySelector('li')
    expect(liEl).toHaveClass('hub-page-link-list__item')
  })

  test('sets active attribute to true for field_spokes', () => {
    const propsWithSpokes = {
      ...baseProps,
      isHubPage: true,
    }
    const { container } = render(<LinkTeaser {...propsWithSpokes} />)

    const vaLink = container.querySelector('va-link')
    expect(vaLink).toHaveAttribute('active', '')
  })

  test('handles target option correctly', () => {
    const propsWithTarget = {
      ...baseProps,
      options: { target: '_blank' },
    }
    const { container } = render(<LinkTeaser {...propsWithTarget} />)

    const vaLink = container.querySelector('va-link')
    expect(vaLink).toHaveAttribute('target', '_blank')
  })

  test('handles missing target option', () => {
    const { container } = render(<LinkTeaser {...baseProps} />)

    const vaLink = container.querySelector('va-link')
    expect(vaLink).toHaveAttribute('target', '')
  })

  test('handles null options', () => {
    const propsWithNullOptions = {
      ...baseProps,
      options: null,
    }
    const { container } = render(<LinkTeaser {...propsWithNullOptions} />)

    const vaLink = container.querySelector('va-link')
    expect(vaLink).toHaveAttribute('target', '')
  })

  test('calls recordEvent with correct parameters on click', () => {
    const { container } = render(<LinkTeaser {...baseProps} />)
    const liEl = container.querySelector('li')

    fireEvent.click(liEl)

    expect(recordEvent.recordEvent).toHaveBeenCalledWith({
      event: 'nav-linkslist',
      'links-list-header': 'Health%20Care%20Benefits%20Eligibility',
      'links-list-section-header': 'Test%20Section%20Header',
    })
  })
})
