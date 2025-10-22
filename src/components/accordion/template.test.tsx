import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { Accordion } from './template'
import { AccordionItem as FormattedAccordionItem } from '@/components/accordion/formatted-type'

const accordionData: FormattedAccordionItem[] = [
  {
    id: '1',
    type: 'paragraph--basic_accordion',
    header: 'First Header',
    html: '<p>Content for the first item</p>',
  },
  {
    id: '2',
    type: 'paragraph--basic_accordion',
    header: 'Second Header',
    html: '<p>Content for the second item</p>',
  },
]

describe('<Accordion> Component', () => {
  it('renders correctly with items', async () => {
    const { getByText, container } = render(
      <Accordion id="test-accordion" bordered={true} items={accordionData} />
    )

    expect(screen.getByText('Content for the first item')).toBeInTheDocument()
    expect(screen.getByText('Content for the second item')).toBeInTheDocument()

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })

  it('renders no items when passed an empty array', () => {
    const { queryByText } = render(
      <Accordion id="empty-accordion" bordered={true} items={[]} />
    )

    expect(queryByText('First Header')).not.toBeInTheDocument()
    expect(queryByText('Second Header')).not.toBeInTheDocument()
  })

  it('returns null when items are not provided', () => {
    const { container } = render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Accordion id="null-accordion" bordered={true} items={undefined as any} />
    )
    expect(container).toBeEmptyDOMElement()
  })
})
