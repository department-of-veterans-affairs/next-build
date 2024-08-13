import { render, screen } from '@testing-library/react'
import { GoogleMapsDirections } from './'

describe('GoogleMapsDirections Component', () => {
  test('renders anchor element with correct href attribute', () => {
    const title = 'Target Location'
    const address = '123 Main St, City, Country'
    const expectedUrl = `https://maps.google.com?saddr=Current+Location&daddr=${encodeURIComponent(
      address
    )}`

    render(<GoogleMapsDirections title={title} address={address} />)

    // const anchorElement = screen.getByRole('va-link', {
    //   name: "maps-directions",
    // })
    //const anchorElement = screen.getByText('Get directions on Google Maps')
    const anchorElement = screen.getByTestId('maps-directions')
    expect(anchorElement).toBeInTheDocument()

    expect(anchorElement).toHaveAttribute('href', expectedUrl)
  })
})
