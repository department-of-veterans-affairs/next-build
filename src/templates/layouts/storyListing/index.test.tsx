import { render, screen } from '@testing-library/react'
import { StoryListing } from '@/templates/layouts/storyListing'
import { StoryListing as FormattedStoryListing } from '@/types/formatted/storyListing'
import { formattedStories } from '@/mocks/formattedNewsStories.mock'

describe('<StoryListing> component renders', () => {
  let storyListingProps: FormattedStoryListing

  beforeEach(() => {
    storyListingProps = {
      id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
      breadcrumbs: [
        { title: 'Home', uri: '/', options: [] },
        { title: 'News', uri: '/news', options: [] },
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
