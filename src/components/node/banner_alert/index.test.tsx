import { render, screen } from 'test-utils'
import BannerAlert from '@/components/node/banner_alert'
import mock_banner_alert from './nodeBannerAlert.json'

describe('<BannerAlert> component renders', () => {
  test('with valid data', () => {
    const { container } = render(<BannerAlert node={mock_banner_alert} />)
    const aEl = container.querySelectorAll('a')

    expect(
      screen.queryByText(/Visit our vaccine information page/)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Get updates on affected services and facilities/)
    ).toBeInTheDocument()
    expect(screen.getByRole('va-banner')).toHaveAttribute(
      'headline',
      'COVID-19 vaccines at VA'
    )
    expect(aEl[0]).toHaveAttribute(
      'href',
      '/wilkes-barre-health-care/programs/covid-19-vaccines'
    )
    expect(aEl[0]).toHaveAttribute(
      'onclick',
      'recordEvent({"event":"nav-alert-box-link-click","alert-box-status":"warning","alert-box-headline":"COVID-19 vaccines at VA","alert-box-headline-level":"3","alert-box-background-only":"false","alert-box-closeable":"false","alert-box-click-label":"Visit our vaccine information page"})'
    )
    expect(aEl[0]).toHaveAttribute('title', 'COVID-19 vaccines')
    screen.debug(container)
  })
})

describe('<BannerAlert> component does not render', () => {
  test('without node data', () => {
    render(<BannerAlert node={[]} />)
    expect(screen.queryByText(/This is the body/)).not.toBeInTheDocument()
  })
})