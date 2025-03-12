import { render, screen } from '@testing-library/react'
import { HealthCareLocalFacility } from './index'
import { HealthCareLocalFacility as FormattedHealthCareLocalFacility } from '@/types/formatted/healthCareLocalFacility'

const mockData: FormattedHealthCareLocalFacility = {
  id: '123',
  title: 'Test facility',
  type: 'node--health_care_local_facility',
  published: true,
  lastUpdated: '',
  introText: 'Test intro text',
  operatingStatusFacility: 'normal',
}

describe('HealthCareLocalFacility with valid data', () => {
  test('renders HealthCareLocalFacility component with basic data', () => {
    render(<HealthCareLocalFacility {...mockData} />)

    const basicDataFields: Array<keyof FormattedHealthCareLocalFacility> = [
      'title',
      'introText',
    ]
    basicDataFields.forEach((key) =>
      expect(screen.getByText(mockData[key])).toBeInTheDocument()
    )
  })
})
