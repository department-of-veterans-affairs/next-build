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

import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { SideNavMenu } from '@/types/formatted/sideNav'
import { PressReleaseListing as FormattedPressReleaseListing } from '@/products/pressReleaseListing/formatted-type'
import { PressReleaseTeaser as FormattedPressReleaseTeaser } from '@/products/pressRelease/formatted-type'
import { PressReleaseTeaser } from '@/templates/components/pressReleaseTeaser'
import { ContentFooter } from '@/templates/common/contentFooter'
import { useEffect } from 'react'
import { LovellStaticPropsResource } from '@/lib/drupal/lovell/types'
import { LovellSwitcher } from '@/templates/components/lovellSwitcher'
import { DEFAULT_PAGE_LIST_LENGTH } from '../../constants/pagination'

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

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
  // Add data to the window object for the sidebar widget
  useEffect(() => {
    window.sideNav = menu
  }, [menu])

  const pressReleaseTeasers =
    releases?.length > 0 ? (
      releases?.map((release: FormattedPressReleaseTeaser) => (
        <li key={release.id}>
          <PressReleaseTeaser {...release} />
        </li>
      ))
    ) : (
      <div className="clearfix-text">No stories at this time.</div>
    )

  return (
    <div key={id} className="vads-grid-container">
      {/* Widget coming from vets-website */}
      <nav
        data-template="navigation/facility_sidebar_nav"
        aria-label="secondary"
        data-widget-type="side-nav"
      ></nav>
      <div className="vads-grid-row">
        <div className="vads-grid-col-12">
          <article className="usa-content">
            <LovellSwitcher
              currentVariant={lovellVariant}
              switchPath={lovellSwitchPath}
            />
            <h1 id="article-heading">{title}</h1>
            <div className="vads-grid-container--full">
              <div className="va-introtext">
                {introText && <p id="office-events-description">{introText}</p>}
              </div>
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
        </div>
      </div>
    </div>
  )
}
