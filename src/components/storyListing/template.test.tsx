import { render, screen } from '@testing-library/react'
import { StoryListing } from './template'
import { StoryListing as FormattedStoryListing } from './formatted-type'
import { formattedStories } from './mock.formattedNewsStories'
import { axe } from '@/test-utils'

describe('<StoryListing> component renders', () => {
  let storyListingProps: FormattedStoryListing

  beforeEach(() => {
    storyListingProps = {
      id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
      breadcrumbs: [
        { label: 'Home', href: '/', options: [] },
        { label: 'News', href: '/news', options: [] },
      ],
      title: 'Stories',
      entityId: 1234,
      entityPath: 'sample/path/url',
      introText: 'We honor outstanding doctors',
      type: 'node--story_listing',
      published: true,
      stories: formattedStories,
      menu: {
        rootPath: 'sample/path/url',
        data: { name: '', description: '', links: [] },
      },
      currentPage: 1,
      totalItems: 0,
      totalPages: 1,
      metatags: [
        {
          attributes: {
            content: 'Stories | VA Minneapolis health care | Veterans Affairs',
            name: 'title',
          },
          tag: 'meta',
        },
        {
          attributes: {
            content: 'This is the description',
            name: 'description',
          },
          tag: 'meta',
        },
      ],
      lastUpdated: '2021-07-01T14:00:00.000Z',
    }
  })

  test('without axe violations', async () => {
    const { container } = render(<StoryListing {...storyListingProps} />)
    const axeResults = await axe(container, {
      rules: {
        // It's only empty because it isn't evaluating the `<va-link>` element inside it.
        'empty-heading': { enabled: false },
      },
    })
    expect(axeResults).toHaveNoViolations()
  })

  test('with valid data', () => {
    render(<StoryListing {...storyListingProps} />)
    expect(screen.queryByText(/Stories/)).toBeInTheDocument()
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
  })

  test('with no stories', () => {
    const sansStories = { ...storyListingProps, stories: null }

    render(<StoryListing {...sansStories} />)
    expect(screen.queryByText(/Stories/)).toBeInTheDocument()
    expect(screen.queryByText(/No stories at this time/)).toBeInTheDocument()
  })
})

describe('<StoryListing> component does not render', () => {
  test('without story listings data', () => {
    const storyListingProps: FormattedStoryListing = null
    render(<StoryListing {...storyListingProps} />)
    expect(screen.queryByText(/Stories/)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).not.toBeInTheDocument()
  })
})
