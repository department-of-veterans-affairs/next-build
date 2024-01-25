import { recordEvent } from '@/lib/analytics/recordEvent'

type BenefitsHub = {
  id: string
  label: string
  path: string
  teaserText: string
}

type BenefitsHubLinksProps = {
  benefitHubs: BenefitsHub[]
}

export function BenefitsHubLinks({ benefitHubs }: BenefitsHubLinksProps) {
  return (
    <section
      className="vads-u-padding-y--3 vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1 large-screen:vads-u-padding-x--0"
      data-template="includes/benefit-hubs-links"
    >
      <h2 className="vads-u-margin-y--0 vads-u-font-size--h3">VA benefits</h2>

      <ul className="usa-unstyled-list" role="list">
        {benefitHubs.map((hub) => {
          return (
            <li className="vads-u-margin-y--2" key={hub.id}>
              <p className="vads-u-margin--0">
                <strong>
                  <a
                    onClick={() =>
                      recordEvent({
                        event: 'nav-linkslist',
                        'links-list-header': hub.label,
                        'links-list-section-header': 'VA benefits',
                      })
                    }
                    href={hub.path}
                  >
                    {hub.label}
                  </a>
                </strong>
              </p>
              <p className="vads-u-margin--0">{hub.teaserText}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
