import { render, screen } from '@testing-library/react'
import { HealthCareLocalFacility } from './index'

describe('HealthCareLocalFacility with valid data', () => {
  test('renders HealthCareLocalFacility component', () => {
    render(<HealthCareLocalFacility title={'Hello world'} />)

    expect(screen.queryByText(/Hello world/)).toBeInTheDocument()
  })
})
