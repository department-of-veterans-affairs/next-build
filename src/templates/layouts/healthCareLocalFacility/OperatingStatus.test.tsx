import { render, screen } from '@testing-library/react'
import { OperatingStatusFlags } from './OperatingStatus'
import { ComponentProps } from 'react'

const mockData: ComponentProps<typeof OperatingStatusFlags> = {
  operatingStatusFacility: 'normal',
  menu: {
    rootPath: '/test-nav-path',
    data: {
      name: 'test-nav',
      description: 'test-nav-description',
      links: [
        {
          url: {
            path: '/test-nav-path',
          },
          description: 'test-nav-description',
          expanded: true,
          label: 'test-nav-label',
          links: [],
        },
      ],
    },
  },
}

describe('HealthCareLocalFacility OperatingStatusFlags', () => {
  test('Renders null for normal status', () => {
    const { container } = render(<OperatingStatusFlags {...mockData} />)
    expect(container).toBeEmptyDOMElement()
  })

  test.each([
    ['notice', 'info', 'Facility notice'],
    ['limited', 'warning', 'Limited services and hours'],
    ['temporary_closure', 'warning', 'Temporary facility closure'],
    ['temporary_location', 'warning', 'Temporary location'],
    ['virtual_care', 'warning', 'Virtual care only'],
    ['coming_soon', 'warning', 'Coming soon'],
    ['closed', 'warning', 'Facility closed'],
  ])(
    'renders va-alert with correct status and text for status "%s"',
    (operatingStatus, expectedAlertStatus, expectedText) => {
      const { container } = render(
        <OperatingStatusFlags
          menu={mockData.menu}
          operatingStatusFacility={operatingStatus}
        />
      )

      const alert = container.querySelector('va-alert')
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveAttribute('status', expectedAlertStatus)

      const link = container.querySelector('va-link', { name: expectedText })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute(
        'href',
        mockData.menu.data.links[0].url.path + '/operating-status'
      )
      expect(link).toHaveAttribute('text', expectedText)
    }
  )
})
