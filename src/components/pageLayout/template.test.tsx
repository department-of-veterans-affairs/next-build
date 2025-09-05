import { render, screen } from 'test-utils'
import '@testing-library/jest-dom'
import { PageLayout, formatBannerType } from './template'
import { PromoBanner } from '@/components/promoBanner/template'
import { Banner } from '@/components/banner/template'
import { BANNER_RESOURCE_TYPES } from '@/lib/constants/resourceTypes'

const children = <div></div>
const banners = [
  {
    id: 'ccd9d30f-78f9-4358-80d7-191f99b18d43',
    title: 'COVID-19 vaccines at VA',
    path: '/va-pittsburgh-health-care/vamc-banner-alert/2021-01-08/help-limit-the-spread-of-covid-19-and-other',
    body: 'This is the banner body',
    alertType: 'information',
    dismiss: true,
    type: 'banner',
  },
]
const props = { bannerData: [], footerData: [], megaMenuData: [] }

describe('<PageLayout> renders', () => {
  test('body', () => {
    render(
      <>
        <PageLayout {...props}>
          <div>This is the layout</div>
        </PageLayout>
      </>
    )

    expect(document.querySelector('body')).toBeInTheDocument()
  })

  test('<Banner> when bannerData exists', () => {
    render(
      <PageLayout {...props} bannerData={banners}>
        {children}
      </PageLayout>
    )
    expect(screen.queryByText(/This is the banner body/)).toBeInTheDocument()
  })

  test('<Banner> when bannerData does not exist', () => {
    render(<PageLayout {...props}>{children}</PageLayout>)
    expect(
      screen.queryByText(/This is the banner body/)
    ).not.toBeInTheDocument()
  })

  test('Header and Footer are present', () => {
    render(
      <PageLayout {...props} bannerData={banners}>
        {children}
      </PageLayout>
    )

    expect(screen.getByRole('banner')).toHaveClass('header')

    const footer = screen.getByTestId('footer')
    // not sure why, there is only one contentinfo role present
    expect(screen.getAllByRole('contentinfo')[0]).toContainElement(footer)
  })
})

describe('formatBannerType function', () => {
  test('returns PromoBanner for BANNER_RESOURCE_TYPES.PROMO', () => {
    const bannerData = {
      id: '1',
      type: BANNER_RESOURCE_TYPES.PROMO,
      title: '',
      key: '1',
    }
    const result = formatBannerType(bannerData)
    expect(result).toEqual(<PromoBanner {...bannerData} />)
  })

  test('returns Banner for BANNER_RESOURCE_TYPES.BASIC', () => {
    const bannerData = {
      id: '3',
      type: BANNER_RESOURCE_TYPES.BASIC,
      title: '',
      key: '3',
    }
    const result = formatBannerType(bannerData)
    expect(result).toEqual(<Banner {...bannerData} />)
  })

  test('returns null for unknown banner type', () => {
    const bannerData = {
      id: '4',
      type: 'unknown',
    }
    const result = formatBannerType(bannerData)
    expect(result).toBeNull()
  })
})
