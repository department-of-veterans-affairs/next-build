import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ImageAndStaticMap } from './'

jest.mock('@/templates/common/mediaImage', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  MediaImage: ({ alt }) => <img alt={alt} />,
}))
jest.mock('@/lib/analytics/recordEvent', () => ({
  recordEvent: jest.fn(),
}))

describe('ImageAndStaticMap Component', () => {
  const mockImage = {
    id: 'test-image',
    alt: 'Test Image',
    title: 'Test Image Title',
    width: 200,
    height: 100,
    links: {
      self: {
        href: 'https://example.com/test-image.jpg',
      },
    },
  }

  it('renders the image with the correct alt text', () => {
    render(<ImageAndStaticMap image={mockImage} facilityId="facility-1" />)
    expect(screen.getByAltText('Test Image')).toBeInTheDocument()
  })

  it('triggers recordEvent on image click', () => {
    const { recordEvent } = require('@/lib/analytics/recordEvent')
    render(<ImageAndStaticMap image={mockImage} facilityId="facility-1" />)

    fireEvent.click(screen.getByAltText('Test Image'))
    expect(recordEvent).toHaveBeenCalledWith({
      event: 'image-click',
      'facility-name': 'facility-1',
    })
  })
})
