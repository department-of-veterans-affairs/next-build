/**
 * ### Overview
 * Story Listing represents the collection pages for News Stories in a facility.
 *
 * Story Listing expects data of type {@link FormattedStoryListing}.
 *
 * ### Examples
 * @see https://va.gov/pittsburgh-health-care/stories/
 *
 */

import { VaPagination } from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { StoryListing as FormattedStoryListing } from './formatted-type'
import { NewsStoryTeaser as FormattedNewsStoryTeaser } from '../newsStory/formatted-type'
import { NewsStoryTeaser } from '@/components/newsStoryTeaser/template'
import { ContentFooter } from '@/components/contentFooter/template'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'
import { DEFAULT_PAGE_LIST_LENGTH } from '../../lib/constants/pagination'
import { SideNavLayout } from '@/components/sideNavLayout/template'

export function StoryListing({
  id,
  title,
  introText,
  stories,
  menu,
  currentPage,
  totalPages,
  lovellVariant,
  lovellSwitchPath,
}: LovellStaticPropsResource<FormattedStoryListing>) {
  const storyTeasers =
    stories?.length > 0 ? (
      stories?.map((story: FormattedNewsStoryTeaser) => (
        <li key={story.id}>
          <NewsStoryTeaser {...story} />
        </li>
      ))
    ) : (
      <li className="clearfix-text">No stories at this time.</li>
    )

  return (
    <SideNavLayout key={id} menu={menu}>
      <article>
        <LovellSwitcher
          currentVariant={lovellVariant}
          switchPath={lovellSwitchPath}
        />
        <h1>{title}</h1>
        <div className="vads-grid-container--full">
          <div className="va-introtext">{introText && <p>{introText}</p>}</div>
          <div className="vads-grid-container--full">
            <ul className="usa-unstyled-list">{storyTeasers}</ul>
          </div>

          {totalPages > 1 && (
            <VaPagination
              page={currentPage}
              pages={totalPages}
              maxPageListLength={DEFAULT_PAGE_LIST_LENGTH}
              onPageSelect={(page) => {
                const newPage =
                  page.detail.page > 1 ? `page-${page.detail.page}` : ''
                const newUrl = window.location.href.replace(
                  /(?<=stories\/).*/, // everything after /stories/
                  newPage
                )
                window.location.assign(newUrl)
              }}
            />
          )}
        </div>
      </article>
      <ContentFooter />
    </SideNavLayout>
  )
}
