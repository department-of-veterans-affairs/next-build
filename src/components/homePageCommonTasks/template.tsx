import { CommonTasksData } from './formatted-type'

export function HomePageCommonTasks({
  searchLinks,
  popularLinks,
}: CommonTasksData) {
  return (
    <div
      className="homepage-common-tasks"
      data-e2e="common"
      data-testid="common-tasks"
    >
      {/* Full-width background sections */}
      <div className="homepage-common-tasks__backgrounds">
        <div className="homepage-common-tasks__background-left vads-u-background-color--white"></div>
        <div className="homepage-common-tasks__background-right vads-u-background-color--primary-alt-lightest"></div>
      </div>

      {/* Content container */}
      <div className="vads-grid-container vads-u-padding-x--0 homepage-common-tasks">
        <div className="vads-grid-row">
          {/* start first column */}
          <div className="vads-grid-col-12 tablet:vads-grid-col-6 homepage-common-tasks__column-left">
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
          <div className="vads-grid-col-12 tablet:vads-grid-col-6 homepage-common-tasks__column-right">
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

      <style>{`
        .homepage-common-tasks {
          position: relative;
        }

        .homepage-common-tasks__backgrounds {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100vw;
          height: 100%;
          display: flex;
          z-index: 0;
        }

        .homepage-common-tasks__background-left,
        .homepage-common-tasks__background-right {
          flex: 1 1 50%;
        }

        @media (max-width: 40em) {
          .homepage-common-tasks__backgrounds {
            display: none;
          }

          .homepage-common-tasks__column-left {
            background-color: white;
          }

          .homepage-common-tasks__column-right {
            background-color: var(--vads-color-primary-alt-lightest);
          }
        }

        @media (min-width: 40.0625em) {
          .homepage-common-tasks__column-left,
          .homepage-common-tasks__column-right {
            background-color: transparent;
          }
        }

        .homepage-common-tasks {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  )
}
