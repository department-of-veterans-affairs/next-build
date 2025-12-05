import { BenefitsData } from './formatted-type'
import { getHubIcon } from '@/lib/utils/benefitsHub'

export function HomePageBenefits({ benefitsHubLinks }: BenefitsData) {
  // Group items into rows of 3
  const itemRows: (typeof benefitsHubLinks)[] = []
  for (let i = 0; i < benefitsHubLinks.length; i += 3) {
    itemRows.push(benefitsHubLinks.slice(i, i + 3))
  }

  const renderHubItem = (link: (typeof benefitsHubLinks)[0], index: number) => {
    const iconConfig = getHubIcon(link.icon, 'vads-u-margin-right--1')
    return (
      <div key={index} className="usa-width-one-third" data-e2e="hub">
        <h3 className="heading-level-4 vads-u-display--flex vads-u-align-items--center">
          {iconConfig && (
            <va-icon
              icon={iconConfig.icon}
              size="3"
              class={iconConfig.className}
            />
          )}
          <va-link href={link.url} text={link.title}></va-link>
        </h3>
        <p className="vads-u-margin-top--0">{link.description}</p>
      </div>
    )
  }

  return (
    <section
      className="vads-u-padding--2p5 vads-u-padding-bottom--3 medium-screen:vads-u-padding-top--6 medium-screen:vads-u-padding-bottom--9"
      data-e2e="hubs"
      data-testid="home-page-benefits"
    >
      {/* Heading in its own div */}
      <div className="usa-grid usa-grid-full">
        <h2 className="vads-u-color--gray-dark vads-u-font-family--serif usa-width-two-thirds vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--5">
          Explore VA benefits and health care
        </h2>
      </div>

      {/* Items grouped into rows of 3 */}
      {itemRows.map((rowItems, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="usa-grid usa-grid-full homepage-benefits-row"
        >
          {rowItems.map((link, itemIndex) =>
            renderHubItem(link, rowIndex * 3 + itemIndex)
          )}
        </div>
      ))}
    </section>
  )
}
