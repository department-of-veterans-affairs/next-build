import { render, screen } from '@testing-library/react'
import { QaSection } from './template'
import { QaSection as FormattedQaSection } from '@/components/qaSection/formatted-type'
import { CollapsiblePanel } from '@/components/collapsiblePanel/formatted-type'

const collapsiblePanelParagraph: CollapsiblePanel = {
  type: 'paragraph--collapsible_panel',
  id: 'collapsible-1',
  paragraphs: [
    {
      type: 'paragraph--collapsible_panel_item',
      id: 'item-1',
      title: 'Panel Item 1',
      wysiwyg: '<p>This is panel content</p>',
      paragraphs: [],
    },
  ],
  bordered: false,
}

const QaSectionAccordionProps: FormattedQaSection = {
  header: 'Accordion test header',
  intro: 'intro text',
  displayAccordion: true,
  type: 'paragraph--q_a_section',
  id: '1',
  questions: [
    {
      question: 'Question 1',
      answers: [
        {
          id: '1',
          html: '<p>Accordion test string 1</p>',
          type: 'paragraph--wysiwyg',
        },
        {
          id: '2',
          html: '<p>Accordion test string 2</p>',
          type: 'paragraph--wysiwyg',
        },
      ],
      id: '11111-11111-11111',
      type: 'paragraph--q_a',
    },
  ],
}

// Test data with just a collapsible panel (with header)
const QaSectionWithCollapsiblePanel: FormattedQaSection = {
  header: 'Section with header',
  intro: 'intro text',
  displayAccordion: false,
  type: 'paragraph--q_a_section',
  id: 'qa-section-1',
  questions: [collapsiblePanelParagraph],
}

// Test data with just a collapsible panel (without header)
const QaSectionWithCollapsiblePanelNoHeader: FormattedQaSection = {
  header: '',
  intro: 'intro text',
  displayAccordion: false,
  type: 'paragraph--q_a_section',
  id: 'qa-section-2',
  questions: [collapsiblePanelParagraph],
}

// Test data with WYSIWYG containing a heading followed by collapsible panel
const QaSectionWithWysiwygAndCollapsiblePanel: FormattedQaSection = {
  header: 'Section with header',
  intro: 'intro text',
  displayAccordion: false,
  type: 'paragraph--q_a_section',
  id: 'qa-section-3',
  questions: [
    {
      type: 'paragraph--wysiwyg',
      id: 'wysiwyg-1',
      html: '<h3>This is a heading</h3><p>Some content after the heading</p>',
    },
    collapsiblePanelParagraph,
  ],
}

describe('QaSection with with valid data', () => {
  test('renders QaSection component with accordion', () => {
    render(<QaSection {...QaSectionAccordionProps} />)
    const accordionDiv = document.querySelector(
      'div[data-template="paragraphs/q_a.collapsible_panel"]'
    )
    expect(accordionDiv).toBeInTheDocument()
    expect(screen.queryByText(/Accordion test header/)).toBeInTheDocument()
  })

  test('renders QaSection component without accordion', () => {
    render(<QaSection {...QaSectionWithCollapsiblePanel} />)
    const accordionDiv = document.querySelector(
      'div[data-template="paragraphs/q_a.collapsible_panel"]'
    )
    expect(accordionDiv).not.toBeInTheDocument()
    expect(screen.queryByText(/Section with header/)).toBeInTheDocument()
  })
})

describe('QaSection heading level management', () => {
  test('collapsible panel uses h3 heading when QA section has header (h2)', () => {
    render(<QaSection {...QaSectionWithCollapsiblePanel} />)

    // The header should be h2
    const header = screen.getByText('Section with header')
    expect(header.tagName).toBe('H2')

    // The collapsible panel item title should be h3 (one level below h2)
    const panelTitle = screen.getByText('Panel Item 1')
    expect(panelTitle.tagName).toBe('H3')
  })

  test('collapsible panel uses h2 heading when QA section has no header', () => {
    render(<QaSection {...QaSectionWithCollapsiblePanelNoHeader} />)

    // The collapsible panel item title should be h2 (starting from h1 level)
    const panelTitle = screen.getByText('Panel Item 1')
    expect(panelTitle.tagName).toBe('H2')
  })

  test('collapsible panel uses h4 heading when preceded by wysiwyg with h3', () => {
    render(<QaSection {...QaSectionWithWysiwygAndCollapsiblePanel} />)

    // The QA section header should be h2
    const sectionHeader = screen.getByText('Section with header')
    expect(sectionHeader.tagName).toBe('H2')

    // The WYSIWYG should contain h3
    const wysiwygHeading = screen.getByText('This is a heading')
    expect(wysiwygHeading.tagName).toBe('H3')

    // The collapsible panel item title should be h4 (one level below h3)
    const panelTitle = screen.getByText('Panel Item 1')
    expect(panelTitle.tagName).toBe('H4')
  })
})
