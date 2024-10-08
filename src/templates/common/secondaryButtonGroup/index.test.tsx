import { render, screen } from '@testing-library/react'
import { SecondaryButtonGroup } from './'

describe('SecondaryButtonGroup Component', () => {
  test('renders action links correctly when there are multiple', () => {
    const multipleButtons = [
      {
        id: '1',
        label: 'Button one',
        url: 'https://www.va.gov/button-one'
      },
      {
        id: '2',
        label: 'Button two',
        url: 'https://www.va.gov/button-two'
      }
    ]

    const { container } = render(<SecondaryButtonGroup buttons={multipleButtons} />)

    expect(container.innerHTML).toContain('Button one')
    expect(container.innerHTML).toContain('Button two')
  })

  test('renders action link correctly when there is only one', () => {
    const oneButton = [
      {
        id: '1',
        label: 'Single button',
        url: 'https://www.va.gov/single-button'
      }
    ]

    const { container } = render(<SecondaryButtonGroup buttons={oneButton} />)

    expect(container.innerHTML).toContain('Single button')
  })
})
