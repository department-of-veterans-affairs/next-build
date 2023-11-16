import { render, screen } from '@testing-library/react'
import { StoryListing } from '@/templates/layouts/storyListing'
import { StoryListing as FormattedStoryListing } from '@/types/dataTypes/formatted/storyListing'

let storyListingProps: FormattedStoryListing = {
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
  stories: [],
  menu: {
    rootPath: 'sample/path/url',
    data: { name: '', description: '', links: [] },
  },
  currentPage: 1,
  totalItems: 0,
  totalPages: 1,
}

describe('<StoryListing> component renders', () => {
  test('with valid data', () => {
    render(<StoryListing {...storyListingProps} />)
    expect(screen.queryByText(/Stories/)).toBeInTheDocument()
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
  })
})

describe('<StoryListing> component does not render', () => {
  test('without story listings data', () => {
    storyListingProps = null
    render(<StoryListing {...storyListingProps} />)
    expect(screen.queryByText(/Stories/)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).not.toBeInTheDocument()
  })
})
