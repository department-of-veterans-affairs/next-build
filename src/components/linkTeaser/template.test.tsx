import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
jest.mock('@/lib/analytics/recordEvent')
import * as recordEvent from '@/lib/analytics/recordEvent'
import { LinkTeaser } from './template'
import { LinkTeaser as FormattedLinkTeaser } from '@/components/linkTeaser/formatted-type'
import { ParagraphComponent } from '@/components/paragraph/formatted-type'

describe('<LinkTeaser> component', () => {
  const baseProps: ParagraphComponent<FormattedLinkTeaser> = {
    id: 'cb0c2019-0f48-448f-98ca-205d80c8f6fe',
    uri: '/health-care/eligibility/',
    title: 'Health Care Benefits Eligibility',
    options: null,
    summary:
      'Not sure if you qualify? Find out if you can get VA health care benefits.',
    parentField: 'field_va_paragraphs',
    componentParams: {
      sectionHeader: 'Test Section Header',
    },
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
    const propsWithFieldSpokes = {
      ...baseProps,
      parentField: 'field_spokes',
    }
    const { container } = render(<LinkTeaser {...propsWithFieldSpokes} />)

    const liEl = container.querySelector('li')
    expect(liEl).toHaveClass('hub-page-link-list__item')
  })

  test('sets active attribute to true for field_spokes', () => {
    const propsWithFieldSpokes = {
      ...baseProps,
      parentField: 'field_spokes',
    }
    const { container } = render(<LinkTeaser {...propsWithFieldSpokes} />)

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

  test('handles empty title', () => {
    const propsWithEmptyTitle = {
      ...baseProps,
      title: '',
    }
    const { container } = render(<LinkTeaser {...propsWithEmptyTitle} />)

    const vaLink = container.querySelector('va-link')
    expect(vaLink).toHaveAttribute('text', '')
  })

  test('handles empty summary', () => {
    const propsWithEmptySummary = {
      ...baseProps,
      summary: '',
    }
    const { container } = render(<LinkTeaser {...propsWithEmptySummary} />)

    const summaryEl = container.querySelector('.va-nav-linkslist-description')
    expect(summaryEl).toBeInTheDocument()
    expect(summaryEl).toHaveTextContent('')
  })

  test('handles null uri', () => {
    const propsWithNullUri = {
      ...baseProps,
      uri: null,
    }
    const { container } = render(<LinkTeaser {...propsWithNullUri} />)

    const vaLink = container.querySelector('va-link')
    expect(vaLink).not.toHaveAttribute('href')
  })

  test('renders with correct paragraph structure', () => {
    const { container } = render(<LinkTeaser {...baseProps} />)

    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs).toHaveLength(2)

    const firstParagraph = paragraphs[0]
    expect(firstParagraph).toHaveClass('va-u-margin--0')
    expect(firstParagraph.querySelector('va-link')).toBeInTheDocument()

    const secondParagraph = paragraphs[1]
    expect(secondParagraph).toHaveClass('va-nav-linkslist-description')
  })
})
