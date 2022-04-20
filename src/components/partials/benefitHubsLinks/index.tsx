// Noting that landing_page is Benefit Hub Landing Page.
import BenefitHubLink from '@/components/node/landing_page'

const benefitsHubLinks = ({ nodes }) => {
  if (nodes) {
    return (
      <>
        <section className="vads-u-padding-y--3 vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
          <h2 className="vads-u-margin-y--0 vads-u-font-size--h3">
            VA benefits
          </h2>

          <ul className="usa-unstyled-list" role="list">
            {nodes.map((node, index) => (
              <li key={index} className="vads-u-margin-y--2">
                <BenefitHubLink node={node} />
              </li>
            ))}
          </ul>
        </section>
      </>
    )
  }
}

// This should not be the default; we will have a full display eventually.
export default benefitsHubLinks
