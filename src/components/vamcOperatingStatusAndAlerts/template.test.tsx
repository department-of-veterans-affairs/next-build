import React from 'react'
import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { VamcOperatingStatusAndAlerts } from './template'
import mockData from './mock.json'
import { formatter } from './query'
import facilityMock from '../vamcFacility/mock'
import { NodeVamcOperatingStatusAndAlerts } from '@/types/drupal/node'
import mockVamcSystem from '@/components/vamcSystem/mock.shallow.json'
import { ShallowVamcSystem } from '@/components/vamcSystem/vamcSystemAndMenu'

describe('VamcOperatingStatusAndAlerts with valid data', () => {
  const vamcOperatingStatusAndAlertsData = formatter({
    entity: mockData as unknown as NodeVamcOperatingStatusAndAlerts,
    vamcSystem: mockVamcSystem as ShallowVamcSystem,
    menu: null,
    facilities: [facilityMock],
  })
  test('renders VamcOperatingStatusAndAlerts component', async () => {
    const { container } = render(
      <VamcOperatingStatusAndAlerts {...vamcOperatingStatusAndAlertsData} />
    )
    expect(screen.queryByText(/VA Louisville health care/)).toBeInTheDocument()
    expect(screen.getByTestId('emergency-resources')).toBeInTheDocument()
    expect(screen.getByTestId('emergency-information')).toBeInTheDocument()
    expect(screen.getByTestId('local-emergency-resources')).toBeInTheDocument()

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })
  test('does not render emergency section with no content', () => {
    const noEmergencyInformation = {
      ...vamcOperatingStatusAndAlertsData,
      emergencyInformation: null,
      localEmergencyLinks: null,
    }
    render(<VamcOperatingStatusAndAlerts {...noEmergencyInformation} />)
    expect(screen.queryByTestId('emergency-resources')).not.toBeInTheDocument()
  })
  test('does render emergency section with just info', async () => {
    const noEmergencyLinks = {
      ...vamcOperatingStatusAndAlertsData,
      localEmergencyLinks: null,
    }
    const { container } = render(
      <VamcOperatingStatusAndAlerts {...noEmergencyLinks} />
    )
    expect(screen.getByTestId('emergency-resources')).toBeInTheDocument()
    expect(screen.getByTestId('emergency-information')).toBeInTheDocument()
    expect(
      screen.queryByTestId('local-emergency-resources')
    ).not.toBeInTheDocument()

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })
  test('does render emergency section with just links', async () => {
    const noEmergencyInfo = {
      ...vamcOperatingStatusAndAlertsData,
      emergencyInformation: null,
    }
    const { container } = render(
      <VamcOperatingStatusAndAlerts {...noEmergencyInfo} />
    )
    expect(screen.getByTestId('emergency-resources')).toBeInTheDocument()
    expect(
      screen.queryByTestId('emergency-information')
    ).not.toBeInTheDocument()
    expect(screen.getByTestId('local-emergency-resources')).toBeInTheDocument()

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })
  describe('lovell variants', () => {
    test('Tricare LovellSwitcher is rendered', async () => {
      const { container } = render(
        <VamcOperatingStatusAndAlerts
          {...vamcOperatingStatusAndAlertsData}
          lovellSwitchPath="/lovell-federal-health-care-va/operating-status"
          lovellVariant="tricare"
        />
      )
      expect(
        screen.getByText('You are viewing this page as a TRICARE beneficiary.')
      ).toBeInTheDocument()

      const axeResults = await axe(container)
      expect(axeResults).toHaveNoViolations()
    })
    test('VA LovellSwitcher is rendered', async () => {
      const { container } = render(
        <VamcOperatingStatusAndAlerts
          {...vamcOperatingStatusAndAlertsData}
          lovellSwitchPath="/lovell-federal-health-care-tricare/operating-status"
          lovellVariant="va"
        />
      )
      expect(
        screen.getByText('You are viewing this page as a VA beneficiary.')
      ).toBeInTheDocument()

      const axeResults = await axe(container)
      expect(axeResults).toHaveNoViolations()
    })
  })
})
