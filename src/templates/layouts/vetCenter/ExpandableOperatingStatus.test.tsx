import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ExpandableOperatingStatus } from './ExpandableOperatingStatus'
import { FacilityOperatingStatusFlags } from '@/types/drupal/node'

describe('ExpandableOperatingStatus', () => {
  describe('with operatingStatusMoreInfo provided', () => {
    test('renders expandable alert for notice status', () => {
      const { container } = render(
        <ExpandableOperatingStatus
          operatingStatusFlag="notice"
          operatingStatusMoreInfo="Additional facility notice information"
        />
      )

      const expandableAlert = container.querySelector('va-alert-expandable')
      expect(expandableAlert).toBeInTheDocument()
      expect(expandableAlert).toHaveAttribute('trigger', 'Facility notice')
      expect(expandableAlert).toHaveAttribute('status', 'info')
      expect(
        screen.getByText('Additional facility notice information')
      ).toBeInTheDocument()
    })

    test('renders expandable alert for limited status', () => {
      const { container } = render(
        <ExpandableOperatingStatus
          operatingStatusFlag="limited"
          operatingStatusMoreInfo="Limited services details"
        />
      )

      const expandableAlert = container.querySelector('va-alert-expandable')
      expect(expandableAlert).toBeInTheDocument()
      expect(expandableAlert).toHaveAttribute(
        'trigger',
        'Limited services and hours'
      )
      expect(expandableAlert).toHaveAttribute('status', 'info')
      expect(screen.getByText('Limited services details')).toBeInTheDocument()
    })

    test('renders expandable alert for temporary_closure status', () => {
      const { container } = render(
        <ExpandableOperatingStatus
          operatingStatusFlag="temporary_closure"
          operatingStatusMoreInfo="Closure details and timeline"
        />
      )

      const expandableAlert = container.querySelector('va-alert-expandable')
      expect(expandableAlert).toBeInTheDocument()
      expect(expandableAlert).toHaveAttribute(
        'trigger',
        'Temporary facility closure'
      )
      expect(expandableAlert).toHaveAttribute('status', 'warning')
      expect(
        screen.getByText('Closure details and timeline')
      ).toBeInTheDocument()
    })

    test('renders expandable alert for temporary_location status', () => {
      const { container } = render(
        <ExpandableOperatingStatus
          operatingStatusFlag="temporary_location"
          operatingStatusMoreInfo="New temporary location address"
        />
      )

      const expandableAlert = container.querySelector('va-alert-expandable')
      expect(expandableAlert).toBeInTheDocument()
      expect(expandableAlert).toHaveAttribute('trigger', 'Temporary location')
      expect(expandableAlert).toHaveAttribute('status', 'warning')
      expect(
        screen.getByText('New temporary location address')
      ).toBeInTheDocument()
    })

    test('renders expandable alert for virtual_care status', () => {
      const { container } = render(
        <ExpandableOperatingStatus
          operatingStatusFlag="virtual_care"
          operatingStatusMoreInfo="Virtual care instructions"
        />
      )

      const expandableAlert = container.querySelector('va-alert-expandable')
      expect(expandableAlert).toBeInTheDocument()
      expect(expandableAlert).toHaveAttribute('trigger', 'Virtual care only')
      expect(expandableAlert).toHaveAttribute('status', 'warning')
      expect(screen.getByText('Virtual care instructions')).toBeInTheDocument()
    })

    test('renders expandable alert for coming_soon status', () => {
      const { container } = render(
        <ExpandableOperatingStatus
          operatingStatusFlag="coming_soon"
          operatingStatusMoreInfo="Opening date and details"
        />
      )

      const expandableAlert = container.querySelector('va-alert-expandable')
      expect(expandableAlert).toBeInTheDocument()
      expect(expandableAlert).toHaveAttribute('trigger', 'Coming soon')
      expect(expandableAlert).toHaveAttribute('status', 'warning')
      expect(screen.getByText('Opening date and details')).toBeInTheDocument()
    })

    test('renders expandable alert for closed status', () => {
      const { container } = render(
        <ExpandableOperatingStatus
          operatingStatusFlag="closed"
          operatingStatusMoreInfo="Facility closure information"
        />
      )

      const expandableAlert = container.querySelector('va-alert-expandable')
      expect(expandableAlert).toBeInTheDocument()
      expect(expandableAlert).toHaveAttribute('trigger', 'Facility closed')
      expect(expandableAlert).toHaveAttribute('status', 'warning')
      expect(
        screen.getByText('Facility closure information')
      ).toBeInTheDocument()
    })
  })

  describe('without operatingStatusMoreInfo (slim alerts)', () => {
    test('renders slim alert for notice status', () => {
      const { container } = render(
        <ExpandableOperatingStatus
          operatingStatusFlag="notice"
          operatingStatusMoreInfo={null}
        />
      )

      const alert = container.querySelector('va-alert')
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveAttribute('status', 'info')
      expect(screen.getByText('Facility notice')).toBeInTheDocument()

      // Should not have expandable alert
      expect(
        container.querySelector('va-alert-expandable')
      ).not.toBeInTheDocument()
    })

    test('renders slim alert for limited status', () => {
      const { container } = render(
        <ExpandableOperatingStatus
          operatingStatusFlag="limited"
          operatingStatusMoreInfo={null}
        />
      )

      const alert = container.querySelector('va-alert')
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveAttribute('status', 'info')
      expect(screen.getByText('Limited services and hours')).toBeInTheDocument()
    })

    test('renders slim alert for temporary_closure status', () => {
      const { container } = render(
        <ExpandableOperatingStatus
          operatingStatusFlag="temporary_closure"
          operatingStatusMoreInfo={null}
        />
      )

      const alert = container.querySelector('va-alert')
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveAttribute('status', 'warning')
      expect(screen.getByText('Temporary facility closure')).toBeInTheDocument()
    })

    test('renders slim alert for closed status', () => {
      const { container } = render(
        <ExpandableOperatingStatus
          operatingStatusFlag="closed"
          operatingStatusMoreInfo={null}
        />
      )

      const alert = container.querySelector('va-alert')
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveAttribute('status', 'warning')
      expect(screen.getByText('Facility closed')).toBeInTheDocument()
    })
  })

  describe('edge cases and invalid statuses', () => {
    test('returns null for normal status', () => {
      const { container } = render(
        <ExpandableOperatingStatus
          operatingStatusFlag="normal"
          operatingStatusMoreInfo="Should not display"
        />
      )

      expect(container.firstChild).toBeNull()
      expect(screen.queryByText('Should not display')).not.toBeInTheDocument()
    })

    test('returns null for invalid status', () => {
      const { container } = render(
        <ExpandableOperatingStatus
          operatingStatusFlag={'invalid_status' as FacilityOperatingStatusFlags}
          operatingStatusMoreInfo="Should not display"
        />
      )

      expect(container.firstChild).toBeNull()
      expect(screen.queryByText('Should not display')).not.toBeInTheDocument()
    })

    test('handles empty string as more info', () => {
      const { container } = render(
        <ExpandableOperatingStatus
          operatingStatusFlag="notice"
          operatingStatusMoreInfo=""
        />
      )

      // Empty string is falsy, so should render slim alert
      const alert = container.querySelector('va-alert')
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveAttribute('slim')
      expect(
        container.querySelector('va-alert-expandable')
      ).not.toBeInTheDocument()
    })
  })
})
