import React from 'react'
import { render, screen } from '@testing-library/react'
import { OperatingStatuses } from './OperatingStatuses'

describe('OperatingStatuses', () => {
  const status = {
    title: 'status one',
    url: 'test/facility',
    status: 'normal',
    statusInfo: 'test',
  }
  const testOperatingStatuses = [
    { ...status },
    {
      ...status,
      title: 'status two',
      status: 'notice',
    },
    {
      ...status,
      title: 'status three',
      status: 'limited',
    },
    {
      ...status,
      title: 'status four',
      status: 'closed',
    },
    {
      ...status,
      title: 'status five',
      status: 'temporary_closure',
    },
    {
      ...status,
      title: 'status six',
      status: 'temporary_location',
    },
    {
      ...status,
      title: 'status seven',
      status: 'virtual_care',
    },
    {
      ...status,
      title: 'status eight',
      status: 'coming_soon',
    },
  ]
  test('renders operating statuses', () => {
    render(<OperatingStatuses operatingStatuses={testOperatingStatuses} />)
    expect(screen.getByTestId('normal-status')).toBeInTheDocument()
    expect(screen.getByTestId('notice-status')).toBeInTheDocument()
    expect(screen.getByTestId('limited-status')).toBeInTheDocument()
    expect(screen.getByTestId('closed-status')).toBeInTheDocument()
    expect(screen.getByTestId('temporary_closure-status')).toBeInTheDocument()
    expect(screen.getByTestId('temporary_location-status')).toBeInTheDocument()
    expect(screen.getByTestId('virtual_care-status')).toBeInTheDocument()
    expect(screen.getByTestId('coming_soon-status')).toBeInTheDocument()
  })
  test('does not render status info if normal', () => {
    render(<OperatingStatuses operatingStatuses={[status]} />)
    expect(screen.queryByTestId('status-info')).not.toBeInTheDocument()
  })
  test('does not render status info if not available when not "normal" status', () => {
    render(
      <OperatingStatuses
        operatingStatuses={[
          {
            ...status,
            title: 'closed facility',
            status: 'closed',
            statusInfo: null,
          },
        ]}
      />
    )
    expect(screen.queryByTestId('status-info')).not.toBeInTheDocument()
  })
  test('does render status info for non-normal when present', () => {
    render(
      <OperatingStatuses
        operatingStatuses={[
          {
            ...status,
            title: 'closed facility',
            status: 'closed',
            statusInfo: 'This facility is closed',
          },
        ]}
      />
    )
    expect(screen.getByTestId('status-info')).toBeInTheDocument()
  })
})
