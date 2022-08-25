import { render, screen } from '@testing-library/react'
import { FacilityMenu } from '@/templates/components/facilityMenu'
import { Menu } from '@/types/dataTypes/drupal/menu'
import MockMenu from './facilityMenu.json'

let menu: Menu = MockMenu

describe('<FacilityMenu> component renders', () => {
  beforeEach(() => {
    window.history.pushState({}, 'Test Title', '/altoona-health-care/locations')
  })

  test('with valid data', () => {
    render(<FacilityMenu {...menu} />)
    expect(screen.queryByText(/Stories/)).toBeInTheDocument()
    expect(screen.queryByText(/About VA Altoona/)).toBeInTheDocument()
  })

  test('active state appears on the active route', () => {
    render(<FacilityMenu {...menu} />)
    expect(screen.queryByText('Locations')).toBeInTheDocument()
    expect(
      screen.getByText('Locations').closest('a').classList.contains('open')
    ).toBe(true)
  })

  test('child menu items show on a route with children', () => {
    render(<FacilityMenu {...menu} />)
    expect(screen.queryByText('Locations')).toBeInTheDocument()
    expect(screen.queryByText('Van Zandt Medical Center')).toBeInTheDocument()
  })

  test("if child menu items exist in the tree, they should not show on routes that aren't matching the url pathname", () => {
    render(<FacilityMenu {...menu} />)
    expect(screen.queryByText('Locations')).toBeInTheDocument()
    expect(screen.queryByText('Work with us')).toBeInTheDocument()
    expect(screen.queryByText('Jobs and careers')).not.toBeInTheDocument()
  })
})

describe('<FacilityMenu> component does not render', () => {
  test('without menu data', () => {
    menu = null
    render(<FacilityMenu {...menu} />)
    expect(screen.queryByText(/Stories/)).not.toBeInTheDocument()
    expect(screen.queryByText(/About VA Altoona/)).not.toBeInTheDocument()
  })
})
