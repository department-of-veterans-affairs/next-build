import { render, screen } from '@testing-library/react'
import { ExpandableText } from '@/templates/components/expandableText/index'

const expandableTextProps = {
  id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
  header: 'Show more',
  text: 'If you need support...',
}

describe('ExpandableText with valid data', () => {
  test('renders ExpandableText component', () => {
    render(<ExpandableText {...expandableTextProps} />)

    const vaAlertExpandable = document.querySelector('va-alert-expandable')
    expect(vaAlertExpandable).toHaveAttribute('trigger', 'Show more')
  })
})

describe('ExpandableText with invalid data', () => {
  test('does not render ExpandableText component when header is not present', () => {
    expandableTextProps.header = null
    render(<ExpandableText {...expandableTextProps} />)

    const vaAlertExpandable = document.querySelector('va-alert-expandable')
    expect(vaAlertExpandable).toBeFalsy()
  })
})
