import Link from 'next/link'
import { isEmpty } from 'lodash'

export interface BenefitHubProps {
  title: string
  relatedBenefitHubs: RelatedBenefitHubProp[]
}

export type RelatedBenefitHubProp = {
  id: string
  url: string
  title: string
  homePageHubLabel: string
  teaserText: string
}

// Partial outputting a list of benefits related to a given page.
// Typically, used on a resource page.
export function BenefitsHubLandingPage({
  title,
  relatedBenefitHubs,
}: BenefitHubProps) {
  if (isEmpty(relatedBenefitHubs)) return null

  const benefitsHubLink = relatedBenefitHubs.map(
    ({ id, url, homePageHubLabel, teaserText }) => (
      <li key={id} className="vads-u-margin-y--2">
        <p className="vads-u-margin--0">
          <strong>
            <Link href={url} passHref>
              <a>{homePageHubLabel}</a>
            </Link>
          </strong>
        </p>
        <p className="vads-u-margin--0">{teaserText}</p>
      </li>
    )
  )

  return (
    <>
      <section className="vads-u-padding-y--3 vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
        <h2 className="vads-u-margin-y--0 vads-u-font-size--h3">{title}</h2>

        <ul className="usa-unstyled-list" role="list">
          {benefitsHubLink}
        </ul>
      </section>
    </>
  )
}
