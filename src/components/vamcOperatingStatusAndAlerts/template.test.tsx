import React from 'react'
import { render, screen } from '@testing-library/react'
import { VamcOperatingStatusAndAlerts } from './template'
import mockData from './mock.json'
import { formatter } from './query'
import facilityMock from '../vamcFacility/mock'
import { NodeVamcOperatingStatusAndAlerts } from '@/types/drupal/node'

describe('VamcOperatingStatusAndAlerts with valid data', () => {
  const vamcOperatingStatusAndAlertsData = formatter({
    entity: mockData as NodeVamcOperatingStatusAndAlerts,
    menu: null,
    facilities: [facilityMock],
  })
  test('renders VamcOperatingStatusAndAlerts component', () => {
    render(
      <VamcOperatingStatusAndAlerts {...vamcOperatingStatusAndAlertsData} />
    )
    expect(
      screen.queryByText(/VA Oklahoma City health care/)
    ).toBeInTheDocument()
    expect(screen.getByTestId('emergency-resources')).toBeInTheDocument()
    expect(screen.getByTestId('emergency-information')).toBeInTheDocument()
    expect(screen.getByTestId('local-emergency-resources')).toBeInTheDocument()
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
  test('does render emergency section with just info', () => {
    const noEmergencyLinks = {
      ...vamcOperatingStatusAndAlertsData,
      localEmergencyLinks: null,
    }
    render(<VamcOperatingStatusAndAlerts {...noEmergencyLinks} />)
    expect(screen.getByTestId('emergency-resources')).toBeInTheDocument()
    expect(screen.getByTestId('emergency-information')).toBeInTheDocument()
    expect(
      screen.queryByTestId('local-emergency-resources')
    ).not.toBeInTheDocument()
  })
  test('does render emergency section with just links', () => {
    const noEmergencyInfo = {
      ...vamcOperatingStatusAndAlertsData,
      emergencyInformation: null,
    }
    render(<VamcOperatingStatusAndAlerts {...noEmergencyInfo} />)
    expect(screen.getByTestId('emergency-resources')).toBeInTheDocument()
    expect(
      screen.queryByTestId('emergency-information')
    ).not.toBeInTheDocument()
    expect(screen.getByTestId('local-emergency-resources')).toBeInTheDocument()
  })
  describe('lovell variants', () => {
    test('Tricare LovellSwitcher is rendered', () => {
      render(
        <VamcOperatingStatusAndAlerts
          {...vamcOperatingStatusAndAlertsData}
          lovellSwitchPath="/lovell-federal-health-care-va/operating-status"
          lovellVariant="tricare"
        />
      )
      expect(
        screen.getByText('You are viewing this page as a TRICARE beneficiary.')
      ).toBeInTheDocument()
    })
    test('VA LovellSwitcher is rendered', () => {
      render(
        <VamcOperatingStatusAndAlerts
          {...vamcOperatingStatusAndAlertsData}
          lovellSwitchPath="/lovell-federal-health-care-tricare/operating-status"
          lovellVariant="va"
        />
      )
      expect(
        screen.getByText('You are viewing this page as a VA beneficiary.')
      ).toBeInTheDocument()
    })
  })
})
