import { render, screen } from '@testing-library/react'
import { PressReleaseListing } from '@/templates/layouts/pressReleaseListing'
import { PressReleaseListing as FormattedPressReleaseListing } from '@/types/formatted/pressReleaseListing'
import { formattedPressReleases } from '@/mocks/formattedPressReleases.mock'

describe('PressReleaseListing component renders', () => {
  let pressReleaseListingProps: FormattedPressReleaseListing

  beforeEach(() => {
    pressReleaseListingProps = {
      id: '7134a789-abc0-4583-8795-70d65a3e03fd',
      breadcrumbs: [
        { title: 'Home', uri: '/', options: [] },
        {
          title: 'VA Birmingham health care',
          uri: '/birmingham-health-care',
          options: [],
        },
      ],
      title: 'News releases',
      entityId: 1234,
      entityPath: 'sample/path/url',
      introText:
        'Get the latest news from the Birmingham VA Health Care System.\\r\\n',
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
              'News Releases | VA Birmingham health care | Veterans Affairs',
          },
        },
        {
          tag: 'meta',
          attributes: {
            name: 'description',
            content:
              'Get the latest news from the Birmingham VA Health Care System.',
          },
        },
      ],
      lastUpdated: '2021-10-22T18:53:30+00:00',
    }
  })

  /*test('press release rendered per listing page', () => {
    render(<PressReleaseListing {...pressReleaseListingProps} />)
    const listinglength = pressReleaseListingProps.releases.length
    expect(listinglength).toBeLessThanOrEqual(10)
  })*/

  test('with valid data', () => {
    render(<PressReleaseListing {...pressReleaseListingProps} />)
    expect(screen.queryByText(/News releases/)).toBeInTheDocument()
    expect(
      screen.queryByText(
        /Get the latest news from the Birmingham VA Health Care System./
      )
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
        /Get the latest news from the Birmingham VA Health Care System./
      )
    ).not.toBeInTheDocument()
  })
})
