import { recordEvent } from '@/lib/analytics/recordEvent'
import { StoryListingLinkType } from '@/types/index'

export const StoryListingLink = ({ path }: StoryListingLinkType) => {
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
