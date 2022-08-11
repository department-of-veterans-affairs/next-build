import { render, screen } from '@testing-library/react'
import { StoryListingFull } from '@/templates/layouts/storyListingFull'
import { StoryListingFullType } from '@/types/index'

let storyListingProps: StoryListingFullType = {
  id: 'f421578b-0add-405c-ac0c-1b1d146a360f',
  title: 'Stories',
  introText: 'We honor outstanding doctors',
  type: 'node--story_listing',
  published: true,
  stories: []
}

describe('<StoryListing> component renders', () => {
  test('with valid data', () => {
    render(<StoryListingFull {...storyListingProps} />)
    expect(screen.queryByText(/Stories/)).toBeInTheDocument()
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).toBeInTheDocument()
  })
})

describe('<StoryListing> component does not render', () => {
  test('without story listings data', () => {
    storyListingProps = null
    render(<StoryListingFull {...storyListingProps} />)
    expect(screen.queryByText(/Stories/)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/We honor outstanding doctors/)
    ).not.toBeInTheDocument()
  })
})
