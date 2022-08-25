import { render, screen } from '@testing-library/react'
import { StoryListing } from '@/templates/layouts/storyListing'
import { StoryListingType } from '@/types/index'

let storyListingProps: StoryListingType = {
  id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
  title: 'Stories',
  introText: 'We honor outstanding doctors',
  type: 'node--story_listing',
  published: true,
  stories: [],
  menu: { items: [], tree: [] },
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
