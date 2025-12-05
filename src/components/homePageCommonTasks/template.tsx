import clsx from 'clsx'
import { CommonTasksData } from './formatted-type'
import styles from './template.module.css'

export function HomePageCommonTasks({
  searchLinks,
  popularLinks,
}: CommonTasksData) {
  return (
    <div
      className={styles.wrapper}
      data-e2e="common"
      data-testid="common-tasks"
    >
      {/* Content container */}
      <div className="vads-grid-container vads-u-padding-x--0">
        <div className="vads-grid-row">
          {/* start first column */}
          <div
            className={clsx(
              'vads-grid-col-12 tablet:vads-grid-col-6',
              styles.columnLeft
            )}
          >
            <div className="vads-u-margin-x--2 desktop:vads-u-margin-x--0 desktop:vads-u-padding-right--9 vads-u-padding-bottom--5">
              <h2
                className="vads-u-color--gray-dark vads-u-font-family--serif"
                id="search-tools-header"
              >
                Search
              </h2>

              <div data-widget-type="homepage-search"></div>

              <h3 className="vads-u-color--gray-dark vads-u-font-family--serif">
                Other search tools
              </h3>
              <div className="homepage-common-tasks__search-tools">
                <ul className="vads-u-padding-left--0" role="list">
                  {searchLinks.map((link, index) => (
                    <li key={index}>
                      <va-icon
                        icon="arrow_forward"
                        className="vads-u-color--link-default vads-u-margin-right--1"
                        size="3"
                      ></va-icon>
                      <va-link href={link.url} text={link.title}></va-link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* end first column */}

          {/* start second column */}
          <div
            className={clsx(
              'vads-grid-col-12 tablet:vads-grid-col-6',
              styles.columnRight
            )}
          >
            <div className="vads-u-padding-left--2p5 tablet:vads-u-padding-right--2p5 vads-u-padding-bottom--5">
              <h2 className="vads-u-color--gray-dark vads-u-font-family--serif">
                Top pages
              </h2>
              <ul
                className="homepage-common-tasks__list vads-u-padding-left--0"
                role="list"
              >
                {popularLinks.map((link, index) => (
                  <li key={index}>
                    <va-link href={link.url} text={link.title}></va-link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* end second column */}
        </div>
      </div>
    </div>
  )
}
