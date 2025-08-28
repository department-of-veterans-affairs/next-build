import { render, screen } from '@testing-library/react'
import { ReactWidget } from './template'

describe('<ReactWidget> with valid data', () => {
  test('renders CTA <ReactWidget />', () => {
    render(
      <ReactWidget
        id="rw-02"
        entityId={2}
        widgetType="direct-deposit"
        ctaWidget={true}
      />
    )
    const ctaWidget = document.querySelector('[data-widget-type="cta"]')
    expect(ctaWidget).not.toBeNull()
  })

  test('renders (default) <ReactWidget />', () => {
    render(
      <ReactWidget id="rw-01" entityId={1} widgetType="pension-app-status" />
    )
    expect(screen.queryByText(/Loading.../)).toBeInTheDocument()
  })

  test('renders button-format <ReactWidget />', () => {
    render(
      <ReactWidget
        id="rw-01"
        entityId={1}
        widgetType="pension-app-status"
        buttonFormat={true}
        defaultLink={{
          url: '/some/path',
          title: 'Click Here',
        }}
      />
    )
    const ctaWidget = document.querySelector(
      '.usa-button-primary.va-button-primary'
    )
    expect(ctaWidget).not.toBeNull()
    expect(screen.queryByText(/Click Here/)).toBeInTheDocument()
  })
})
