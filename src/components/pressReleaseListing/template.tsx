/**
 * ### Overview
 * Press Release Listing represents the collection pages for News Stories in a facility.
 *
 * Press Release Listing expects data of type {@link FormattedPressReleaseListing}.
 *
 * ### Examples
 * @see https://www.va.gov/milwaukee-health-care/news-releases/
 * @see https://www.va.gov/bronx-health-care/news-releases/
 *
 */

import { VaPagination } from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { PressReleaseListing as FormattedPressReleaseListing } from './formatted-type'
import { PressReleaseTeaser as FormattedPressReleaseTeaser } from '../pressRelease/formatted-type'
import { PressReleaseTeaser } from '@/components/pressReleaseTeaser/template'
import { ContentFooter } from '@/components/contentFooter/template'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '@/components/lovellSwitcher/template'
import { DEFAULT_PAGE_LIST_LENGTH } from '../../lib/constants/pagination'
import { SideNavLayout } from '@/components/sideNavLayout/template'

export function PressReleaseListing(
  props: LovellStaticPropsResource<FormattedPressReleaseListing>
) {
  const {
    id,
    title,
    introText,
    menu,
    currentPage,
    totalPages,
    lovellVariant,
    lovellSwitchPath,
  } = props
  const releases = props['news-releases']

  const pressReleaseTeasers =
    releases?.length > 0 ? (
      releases?.map((release: FormattedPressReleaseTeaser) => (
        <li key={release.id}>
          <PressReleaseTeaser {...release} />
        </li>
      ))
    ) : (
      <div className="clearfix-text">No news releases at this time.</div>
    )

  return (
    <SideNavLayout key={id} menu={menu}>
      <article className="usa-content">
        <LovellSwitcher
          currentVariant={lovellVariant}
          switchPath={lovellSwitchPath}
        />
        <h1 id="article-heading">{title}</h1>
        <div className="vads-grid-container--full">
          <div className="va-introtext">{introText && <p>{introText}</p>}</div>
          <ul className="usa-unstyled-list">{pressReleaseTeasers}</ul>
          {totalPages > 1 && (
            <VaPagination
              page={currentPage}
              pages={totalPages}
              maxPageListLength={DEFAULT_PAGE_LIST_LENGTH}
              onPageSelect={(page) => {
                const newPage =
                  page.detail.page > 1 ? `page-${page.detail.page}` : ''
                const newUrl = window.location.href.replace(
                  /(?<=news-releases\/).*/, // everything after /news-releases/
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
