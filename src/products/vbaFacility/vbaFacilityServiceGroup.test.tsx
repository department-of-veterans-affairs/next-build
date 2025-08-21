import React from 'react'
import { render, screen } from '@testing-library/react'
import { VbaFacilityServiceGroup } from './vbaFacilityServiceGroup'
import mockService from '@/mocks/vbaFacilityService.mock.json'
import mockVbaFacility from '@/products/vbaFacility/mock.json'
import { formatter as formatVbaData } from '@/products/vbaFacility/query'

const formattedMock = formatVbaData({
  entity: mockVbaFacility,
  services: [mockService],
})
const mockGroup = {
  headingId: 'group1',
  heading: 'Benefits Services',
  mainPhone: '123-123-1234',
  services: formattedMock.allServices,
}
describe('VbaFacilityServiceGroup', () => {
  it('renders heading and accordion', () => {
    render(<VbaFacilityServiceGroup {...mockGroup} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Benefits Services'
    )
    expect(screen.getByTestId('service-accordion')).toBeInTheDocument()
    expect(screen.getByTestId('service-accordion-item')).toBeInTheDocument()
  })
})
