import { render, screen } from '@testing-library/react'
import { PressReleaseListing } from '@/templates/layouts/pressReleaseListing'
import { PressReleaseListing as FormattedPressReleaseListing } from '@/types/formatted/pressReleaseListing'
import { formattedPressReleases } from '@/mocks/formattedPressReleases.mock'

describe('PressReleaseListing component renders', () => {
  let pressReleaseListingProps: FormattedPressReleaseListing

  beforeEach(() => {
    pressReleaseListingProps = {
      id: 'c56246c6-4a86-4b06-b576-241eb01a5e0e',
      breadcrumbs: [
        { title: 'Home', uri: '/', options: [] },
        { title: 'News', uri: '/news', options: [] },
      ],
      title: 'News releases',
      entityId: 1234,
      entityPath: 'sample/path/url',
      introText: 'News Releases for VA Southern Nevada health care.',
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
          tag: 'meta',
          attributes: {
            name: 'title',
            content:
              'News releases | VA Coatesville health care | Veterans Affairs',
          },
        },
        {
          tag: 'meta',
          attributes: {
            name: 'description',
            content:
              'Get the latest news from Coatesville-area medical centers and clinics. For more information about Coatesville health care, contact our Public Affairs Office at 610-380-4348.',
          },
        },
      ],
      lastUpdated: '2021-07-01T14:00:00.000Z',
    }
  })

  test('with valid data', () => {
    render(<PressReleaseListing {...pressReleaseListingProps} />)
    expect(screen.queryByText(/News releases/)).toBeInTheDocument()
    expect(
      screen.queryByText(/News Releases for VA Southern Nevada health care./)
    ).toBeInTheDocument()
  })

  test('with no press releases', () => {
    render(<PressReleaseListing {...pressReleaseListingProps} releases={[]} />)
    expect(screen.queryByText(/News releases/)).toBeInTheDocument()
    const element = screen.getByText('No stories at this time.')
    expect(element).toBeInTheDocument()
  })
})

describe('PressReleaseListing component does not render', () => {
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
