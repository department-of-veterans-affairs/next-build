import { render, screen } from '@testing-library/react'
import { CommonAndPopular } from './'

describe('CommonAndPopular Component', () => {
  test('renders common and popular links correctly', () => {
    render(<CommonAndPopular />)

    const commonQuestionsLinks = screen.getAllByRole('link', {
      name: /how do i /i,
    })
    expect(commonQuestionsLinks).toHaveLength(3)
    expect(commonQuestionsLinks[0]).toHaveAttribute(
      'href',
      expect.stringMatching(/\/health-care\/how-to-apply\/?/)
    )

    const popularLinks = screen.getAllByRole('link', {
      name: /view|find nearby va locations|contact the veterans crisis line/i,
    })
    expect(popularLinks).toHaveLength(3)
    expect(popularLinks[0]).toHaveAttribute(
      'href',
      expect.stringMatching(/\/find-locations\/?/)
    )
  })
})
