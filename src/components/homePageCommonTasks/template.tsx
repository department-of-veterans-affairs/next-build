import { CommonTasksData } from './formatted-type'

export function HomePageCommonTasks({
  searchLinks,
  popularLinks,
}: CommonTasksData) {
  return (
    <div
      className="homepage-common-tasks__wrapper"
      data-e2e="common"
      data-testid="common-tasks"
    >
      <div className="vads-l-grid-container vads-u-padding-x--0 homepage-common-tasks">
        <div className="vads-l-row">
          {/* start first column */}
          <div className="vads-l-col--12 medium-screen:vads-l-col--6 vads-u-background-color--white">
            <div className="vads-u-margin-x--2 medium-desktop-screen:vads-u-margin-x--0 desktop:vads-u-padding-right--9 vads-u-padding-bottom--5">
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
          <div className="vads-l-col--12 medium-screen:vads-l-col--6">
            <div className="vads-u-padding-left--2p5 medium-screen:vads-u-padding-right--2p5 vads-u-padding-bottom--5">
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
