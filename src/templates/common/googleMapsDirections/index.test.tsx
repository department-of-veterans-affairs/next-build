import { render, screen } from '@testing-library/react'
import { GoogleMapsDirections } from './'

describe('GoogleMapsDirections Component', () => {
  test('renders anchor element with correct href attribute and label', () => {
    const location = 'Target Location'
    const address = '123 Main St, City, Country'
    const expectedUrl = `https://maps.google.com?saddr=Current+Location&daddr=${encodeURIComponent(
      address
    )}`
    const expectedAriaLabel = `Get directions on Google Maps to ${location}`

    render(<GoogleMapsDirections location={location} address={address} />)

    //leaving old elemet selector just in case we need to re-use it
    // const anchorElement = screen.getByRole('va-link', {
    //   name: "maps-directions",
    // })

    const anchorElement = screen.getByTestId('maps-directions')
    expect(anchorElement).toBeInTheDocument()

    expect(anchorElement).toHaveAttribute('href', expectedUrl)
    expect(anchorElement).toHaveAttribute('label', expectedAriaLabel)
  })
  test('excludes label from render if none given', () => {
    const address = '123 Main St, City, Country'

    render(<GoogleMapsDirections address={address} />)

    const anchorElement = screen.getByTestId('maps-directions')
    expect(anchorElement).toBeInTheDocument()
    expect(anchorElement).not.toHaveAttribute('label')
  })
})
