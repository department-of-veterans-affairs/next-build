import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom'
import { MediaImageComponent } from '.'

import mediaImage from './mockMedia.json'
// Language: typescript
// Path: src/components/media/index.test.tsx

describe('Media Image component renders with valid data', () => {
  test('<MediaImage> renders', () => {
    render(<MediaImageComponent {...mediaImage[0]} imageStyle="2_1_large" />)
    expect(screen.getByAltText('Dr. Brooke Decker')).toBeInTheDocument()
  })
  test('MediaImage renders with large image', () => {
    render(<MediaImageComponent {...mediaImage[0]} imageStyle="2_1_large" />)
    expect(screen.queryByAltText('Dr. Brooke Decker')).toBeInTheDocument()
  })
  test('MediaImage renders when image style is defined', () => {
    mediaImage[0].imageStyle = null
    render(<MediaImageComponent {...mediaImage[0]} imageStyle="2_1_large" />)
    expect(screen.queryByAltText('Dr. Brooke Decker')).toBeInTheDocument()
  })
  test('MediaImage does not render with null data', () => {
    mediaImage[0] = null
    render(<MediaImageComponent {...mediaImage[0]} imageStyle="2_1_large" />)
    expect(screen.queryByAltText('Dr. Brooke Decker')).not.toBeInTheDocument()
  })
})
