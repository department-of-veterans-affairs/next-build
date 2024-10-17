import { render } from '@testing-library/react'
import { RelatedInformation } from './'

describe('RelatedInformation Component', () => {
  test('renders the correct number of links when there are multiple', () => {
    const relatedInformation = [
      {
        id: '1',
        summary: 'Summary for button one',
        title: 'Button one',
        uri: '/button-one'
      },
      {
        id: '2',
        summary: 'Summary for button two',
        title: 'Button two',
        uri: '/button-two'
      }
    ]

    const { container } = render(<RelatedInformation relatedInformation={relatedInformation} />)

    expect(container.innerHTML).toContain('Button one')
    expect(container.innerHTML).toContain('href="/button-one"')
    expect(container.innerHTML).toContain('Button two')
    expect(container.innerHTML).toContain('href="/button-two"')
  })

  test('renders link correctly when there is only one', () => {
    const oneLink = [
      {
        id: '3',
        summary: 'Summary for button three',
        title: 'Button three',
        uri: '/button-three'
      }
    ]

    const { container } = render(<RelatedInformation relatedInformation={oneLink} />)

    expect(container.innerHTML).toContain('Button three')
    expect(container.innerHTML).toContain('href="/button-three"')
  })
})
