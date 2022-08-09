import { render, screen } from '@testing-library/react'
import {
  ExpandableText,
  ExpandableTextProps,
} from 'templates/expandable_text/index'

const expandableTextProps: ExpandableTextProps = {
  id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
  header: 'Show more',
  text: 'If you need support...',
}

describe('ExpandableText with valid data', () => {
  test('renders ExpandableText component', () => {
    render(
      <ExpandableText key={expandableTextProps.id} {...expandableTextProps} />
    )

    const vaAccordionItemEl = document.querySelector('va-accordion-item')
    expect(vaAccordionItemEl).toHaveAttribute('header', 'Show more')
    expect(screen.queryByText(/If you need support.../)).toBeInTheDocument()
  })
})

describe('ExpandableText with invalid data', () => {
  test('does not render ExpandableText component when header is not present', () => {
    expandableTextProps.header = null

    render(
      <ExpandableText key={expandableTextProps.id} {...expandableTextProps} />
    )

    const vaAccordionItemEl = document.querySelector('va-accordion-item')
    expect(vaAccordionItemEl).toBeFalsy()
  })

  test('does not render the text info when text is not present', () => {
    expandableTextProps.header = 'Show more'
    expandableTextProps.text = null
    render(
      <ExpandableText key={expandableTextProps.id} {...expandableTextProps} />
    )

    const vaAccordionItemEl = document.querySelector('va-accordion-item')
    expect(vaAccordionItemEl).toHaveAttribute('header', 'Show more')
    expect(screen.queryByText(/If you need support.../)).not.toBeInTheDocument()
  })

  test('does not render the text info when processed is not present', () => {
    expandableTextProps.header = 'Show more'
    expandableTextProps.text = null
    render(
      <ExpandableText key={expandableTextProps.id} {...expandableTextProps} />
    )

    const vaAccordionItemEl = document.querySelector('va-accordion-item')
    expect(vaAccordionItemEl).toHaveAttribute('header', 'Show more')
    expect(screen.queryByText(/If you need support.../)).not.toBeInTheDocument()
  })
})
