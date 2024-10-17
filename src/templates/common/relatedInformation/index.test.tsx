import { render, screen } from '@testing-library/react'
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

    render(<RelatedInformation relatedInformation={relatedInformation} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
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

    render(<RelatedInformation relatedInformation={oneLink} />)

    expect(screen.getAllByRole('paragraph')).toHaveLength(2)
  })
})
