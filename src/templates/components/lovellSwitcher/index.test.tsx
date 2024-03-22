import { render } from '@testing-library/react'
import { LovellSwitcher } from './'
import { LovellChildVariant } from '@/lib/drupal/lovell/types'

jest.mock('@/lib/drupal/lovell/utils', () => ({
  getOppositeChildVariant: jest.fn((variant) =>
    variant === 'tricare' ? 'VA' : 'tricare'
  ),
}))

describe('<LovellSwitcher> Component', () => {
  it('renders correctly with valid props', () => {
    const currentVariant = 'tricare' as LovellChildVariant
    const switchPath = '/switch/to/VA'
    render(
      <LovellSwitcher currentVariant={currentVariant} switchPath={switchPath} />
    )
    const vaAlertEl = document.querySelector('va-alert')
    expect(vaAlertEl).toBeValid()
  })

  it('does not render without a switchPath', () => {
    const currentVariant = 'va' as LovellChildVariant

    const { container } = render(
      /* @ts-expect-error Missing switchPath for testing purposes */
      <LovellSwitcher currentVariant={currentVariant} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('does not render without a currentVariant', () => {
    const switchPath = '/switch/to/va'
    /* @ts-expect-error Missing currentVariant for testing purposes */
    const { container } = render(<LovellSwitcher switchPath={switchPath} />)
    expect(container.firstChild).toBeNull()
  })
})
