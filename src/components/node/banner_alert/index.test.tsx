import { render, screen } from 'test-utils'
import BannerAlert from '@/components/node/banner_alert'
import mock_banner_alert from './nodeBannerAlert.json'

describe('<BannerAlert> component renders', () => {
  test('with valid data', () => {
    render(<BannerAlert node={mock_banner_alert} />)
    expect(screen.queryByText(/This is the body/)).toBeInTheDocument()
    expect(screen.getByRole('va-banner')).toHaveAttribute(
      'headline',
      'COVID-19 vaccines at VA'
    )
  })
})

describe('<BannerAlert> component does not render', () => {
  test('without node data', () => {
    render(<BannerAlert node={[]} />)
    expect(screen.queryByText(/This is the body/)).not.toBeInTheDocument()
  })
})
