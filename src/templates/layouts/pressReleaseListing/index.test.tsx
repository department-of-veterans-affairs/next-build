import { render, screen } from '@testing-library/react'
import { PressReleaseListing } from '@/templates/layouts/pressReleaseListing'
import { PressReleaseListing as FormattedPressReleaseListing } from '@/types/formatted/pressReleaseListing'
import { formattedPressReleases } from '@/mocks/formattedPressReleases.mock'

describe('<PressReleaseListing> component renders', () => {
  let pressReleaseListingProps: FormattedPressReleaseListing

  beforeEach(() => {
    pressReleaseListingProps = {
      id: 'c56246c6-4a86-4b06-b576-241eb01a5e0e',
      breadcrumbs: [
        { title: 'Home', uri: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/', options: [] },
        { title: 'VA Coatesville health care', uri: 'https://content-build-medc0xjkxm4jmpzxl3tfbcs7qcddsivh.ci.cms.va.gov/coatesville-health-care', options: [] },
      ],
      title: 'News releases',
      entityId: 1234,
      entityPath: 'sample/path/url',
      introText: 'Get the latest news from Coatesville-area medical centers and clinics. For more information about Coatesville health care, contact our Public Affairs Office at 610-380-4348.',
      type: 'node--press_releases_listing',
      published: true,
      releases: formattedPressReleases,
      menu: {
        rootPath: 'sample/path/url',
        data: { name: '', description: '', links: [] },
      },
      currentPage: 1,
      totalItems: 0,
      totalPages: 1,
      metatags: [
        {
          tag: "meta",
          attributes: {
            name: "title",
            content: "News releases | VA Coatesville health care | Veterans Affairs"
          }
        },
        {
          tag: "meta",
          attributes: {
            name: "description",
            content: "Get the latest news from Coatesville-area medical centers and clinics. For more information about Coatesville health care, contact our Public Affairs Office at 610-380-4348."
          }
        },
        {
          tag: "link",
          attributes: {
            rel: "image_src",
            href: "https://www.va.gov/img/design/logo/va-og-image.png"
          }
        },
        {
          tag: "meta",
          attributes: {
            property: "og:site_name",
            content: "Veterans Affairs"
          }
        },
        {
          tag: "meta",
          attributes: {
            property: "og:title",
            content: "News releases | VA Coatesville health care | Veterans Affairs"
          }
        },
        {
          tag: "meta",
          attributes: {
            property: "og:description",
            content: "Get the latest news from Coatesville-area medical centers and clinics. For more information about Coatesville health care, contact our Public Affairs Office at 610-380-4348."
          }
        },
        {
          tag: "meta",
          attributes: {
            property: "og:image",
            content: "https://www.va.gov/img/design/logo/va-og-image.png"
          }
        },
        {
          tag: "meta",
          attributes: {
            property: "og:image:alt",
            content: "U.S. Department of Veterans Affairs"
          }
        },
        {
          tag: "meta",
          attributes: {
            name: "twitter:card",
            content: "summary_large_image"
          }
        },
        {
          tag: "meta",
          attributes: {
            name: "twitter:description",
            content: "Get the latest news from Coatesville-area medical centers and clinics. For more information about Coatesville health care, contact our Public Affairs Office at 610-380-4348."
          }
        },
        {
          tag: "meta",
          attributes: {
            name: "twitter:site",
            content: "@DeptVetAffairs"
          }
        },
        {
          tag: "meta",
          attributes: {
            name: "twitter:title",
            content: "News releases | VA Coatesville health care | Veterans Affairs"
          }
        },
        {
          tag: "meta",
          attributes: {
            name: "twitter:image",
            content: "https://www.va.gov/img/design/logo/va-og-image.png"
          }
        },
        {
          tag: "meta",
          attributes: {
            name: "twitter:image:alt",
            content: "U.S. Department of Veterans Affairs"
          }
        }
      ],
      lastUpdated: '2021-07-01T14:00:00.000Z',
    }
  })

  test('with valid data', () => {
    render(<PressReleaseListing {...pressReleaseListingProps} />)
    expect(screen.queryByText(/News releases/)).toBeInTheDocument()
    expect(
      screen.queryByText(
        /Get the latest news from Coatesville-area medical centers and clinics. For more information about Coatesville health care, contact our Public Affairs Office at 610-380-4348./
      )
    ).toBeInTheDocument()
  })

  test('with no press releases', () => {
    const sansPressReleases = { ...pressReleaseListingProps, releases: null }
    render(<PressReleaseListing {...sansPressReleases} />)
    expect(screen.queryByText(/News releases/)).toBeInTheDocument()
    //expect(screen.queryByText(/No press releases at this time/)).toBeInTheDocument()
  })
})

describe('<PressReleaseListing> component does not render', () => {
  test('without press release listings data', () => {
    const pressReleaseListingProps: FormattedPressReleaseListing = null
    render(<PressReleaseListing {...pressReleaseListingProps} />)
    expect(screen.queryByText(/News releases/)).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        /Get the latest news from Coatesville-area medical centers and clinics. For more information about Coatesville health care, contact our Public Affairs Office at 610-380-4348./
      )
    ).not.toBeInTheDocument()
  })
})
