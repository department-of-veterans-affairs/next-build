import { render, screen } from '@testing-library/react'
import { HealthCareLocalFacility } from './index'
import { HealthCareLocalFacility as FormattedHealthCareLocalFacility } from '@/types/formatted/healthCareLocalFacility'

const mockData: FormattedHealthCareLocalFacility = {
  id: '123',
  title: 'Test facility',
  type: 'node--health_care_local_facility',
  published: true,
  lastUpdated: '',
}

describe('HealthCareLocalFacility with valid data', () => {
  test('renders HealthCareLocalFacility component', () => {
    render(<HealthCareLocalFacility {...mockData} />)

    expect(screen.queryByText(/Test facility/)).toBeInTheDocument()
  })
})
