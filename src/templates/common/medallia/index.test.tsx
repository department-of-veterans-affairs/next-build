import { render, screen } from '@testing-library/react'
import { MedalliaAssets } from './'

// Mocking useEffect
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}))

// Mock Script
jest.mock('next/script', () => ({ id, src }) => (
  <div data-testid={id} data-src={src} />
))

// Mock medallia
jest.mock('@/lib/utils/medallia', () => ({
  getSurveyNumber: jest.fn(),
  loadForm: jest.fn(),
  onMedalliaLoaded: jest.fn((callback) => callback()),
  setWindowVaSurvey: jest.fn(),
}))

describe('MedalliaAssets Component', () => {
  test('renders Script component with correct props', () => {
    process.env.NEXT_PUBLIC_BUILD_TYPE = 'local'

    render(<MedalliaAssets />)

    const scriptElement = screen.getByTestId('medallia') as HTMLDivElement
    expect(scriptElement).toBeInTheDocument()

    const expectedSrc =
      'https://resource.digital.voice.va.gov/wdcvoice/5/onsite/embed.js'
    expect(scriptElement.getAttribute('data-src')).toEqual(expectedSrc)
  })
})
