import React from 'react'
import { render, screen } from '@testing-library/react'
import { Accordion } from './' // Adjust this path to where your Accordion component is located

const accordionData = [
  {
    header: 'First Header',
    html: '<p>Content for the first item</p>',
  },
  {
    header: 'Second Header',
    html: '<p>Content for the second item</p>',
  },
]

describe('<Accordion> Component', () => {
  it('renders correctly with items', () => {
    render(
      <Accordion id="test-accordion" bordered={true} items={accordionData} />
    )
    const firstAccordion = document.getElementById(
      'test-accordion-first-header'
    )
    const secondAccordion = document.getElementById(
      'test-accordion-second-header'
    )

    expect(firstAccordion).toBeTruthy()
    expect(secondAccordion).toBeTruthy()
  })

  it('renders no items when passed an empty array', () => {
    render(<Accordion id="empty-accordion" bordered={true} items={[]} />)
    const firstAccordion = document.getElementById(
      'test-accordion-first-header'
    )
    const secondAccordion = document.getElementById(
      'test-accordion-second-header'
    )

    expect(firstAccordion).toBeFalsy()
    expect(secondAccordion).toBeFalsy()
  })
})
