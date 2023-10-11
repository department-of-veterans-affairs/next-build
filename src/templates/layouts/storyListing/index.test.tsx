import { render, screen } from '@testing-library/react'
import { StoryListing } from '@/templates/layouts/storyListing'
import { StoryListingType } from '@/types/index'

let storyListingProps: StoryListingType = {
  id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
  breadcrumbs: [
    {
      uri: 'https://cms-7m0jwgfd3t0pt3txlgzvixowibrfagsq.ci.cms.va.gov/',
      title: 'Home',
      options: [],
    },
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
