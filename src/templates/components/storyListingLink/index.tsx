import { recordEvent } from '@/lib/analytics/recordEvent'
import { StoryListingLink as FormattedStoryListingLink } from '@/types/dataTypes/formatted/storyListing'

export const StoryListingLink = ({ path }: FormattedStoryListingLink) => {
  return (
    // @todo can <Link /> be used here?
    <a
      onClick={() =>
        recordEvent({
          event: 'nav-secondary-button-click',
        })
      }
      className="vads-u-display--block vads-u-margin-bottom--7"
      href={path}
      id="news-stories-listing-link"
    >
      See all stories
    </a>
  )
}
