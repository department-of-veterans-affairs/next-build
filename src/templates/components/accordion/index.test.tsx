import React from 'react'
import { render } from '@testing-library/react'
import { Accordion } from './'
import { AccordionItem as FormattedAccordionItem } from '@/types/formatted/accordion'

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
  it('renders correctly with items', () => {
    render(
      <Accordion id="test-accordion" bordered={true} items={accordionData} />
    )
    const firstAccordion = document.getElementById('1-first-header')
    const secondAccordion = document.getElementById('2-second-header')

    expect(firstAccordion).toBeTruthy()
    expect(secondAccordion).toBeTruthy()
  })

  it('renders no items when passed an empty array', () => {
    render(<Accordion id="empty-accordion" bordered={true} items={[]} />)
    const firstAccordion = document.getElementById('1-first-header')
    const secondAccordion = document.getElementById('2-second-header')

    expect(firstAccordion).toBeFalsy()
    expect(secondAccordion).toBeFalsy()
  })
})
