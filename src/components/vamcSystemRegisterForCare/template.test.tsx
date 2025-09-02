import React from 'react'
import { render, screen } from '@testing-library/react'
import VamcSystemRegisterForCare from './template'
import mockDrupalData from './mock.json'
import { formatter } from './query'
import mockMenu from './mock.menu.json'
import { Menu } from '@/types/drupal/menu'

const mockData = formatter({
  entity: mockDrupalData,
  menu: mockMenu as unknown as Menu,
})

describe('VamcSystemRegisterForCare', () => {
  it('renders the title', () => {
    render(<VamcSystemRegisterForCare {...mockData} />)
    expect(screen.getByText('Register for care')).toBeInTheDocument()
  })

  it('renders intro text with office entity label', () => {
    render(<VamcSystemRegisterForCare {...mockData} />)
    const introText = screen.getByText(/Register to get care at one of our/i)
    expect(introText).toBeInTheDocument()
    expect(introText.textContent).toContain('VA Richmond health care')
  })

  it('renders the main heading with correct id', () => {
    render(<VamcSystemRegisterForCare {...mockData} />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveAttribute('id', 'article-heading')
  })

  test('adds the sideNav to window.sideNav', () => {
    render(<VamcSystemRegisterForCare {...mockData} />)

    // @ts-expect-error - window.sideNav is not a default window property, but
    // we're adding it
    expect(window.sideNav).toEqual(mockData.menu)
  })
})
