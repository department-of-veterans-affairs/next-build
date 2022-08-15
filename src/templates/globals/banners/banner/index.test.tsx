import { render, screen } from 'test-utils'
import { Banner } from '@/templates/globals/banners/banner'

const banner = {
  id: 'ccd9d30f-78f9-4358-80d7-191f99b18d43',
  title: 'COVID-19 vaccines at VA',
  body: 'This is the banner body',
  alertType: 'information',
  dismiss: true,
}

describe('<Banner> component renders', () => {
  test('with valid data', () => {
    render(<Banner {...banner} />)
    expect(screen.queryByText(/This is the banner body/)).toBeInTheDocument()
    expect(screen.getByRole('va-banner')).toHaveAttribute(
      'headline',
      'COVID-19 vaccines at VA'
    )
  })
})

describe('<Banner> component does not render', () => {
  test('without node data', () => {
    banner.body = null
    render(<Banner {...banner} />)
    expect(
      screen.queryByText(/This is the banner body/)
    ).not.toBeInTheDocument()
  })
})
