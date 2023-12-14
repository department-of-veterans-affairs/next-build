import Link from 'next/link'
import { isEmpty } from 'lodash'
import {
  BenefitsHubLinks as FormattedBenefitHubLinks,
  BenefitsHub,
} from '@/types/dataTypes/formatted/benefitsHub'

// Partial outputting a list of benefits related to a given page.
// Typically, used on a resource page.
export function BenefitsHubLinks({
  title,
  introText,
  relatedBenefitHubs,
}: FormattedBenefitHubLinks) {
  if (isEmpty(relatedBenefitHubs)) return null

  const benefitsHubLink = relatedBenefitHubs.map(
    ({ id, url, homePageHubLabel, teaserText }: BenefitsHub) => (
      <li key={id} className="vads-u-margin-y--2">
        <p className="vads-u-margin--0">
          <strong>
            <Link href={url} passHref>
              {homePageHubLabel}
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
        {introText && <p>{introText}</p>}

        <ul className="usa-unstyled-list" role="list">
          {benefitsHubLink}
        </ul>
      </section>
    </>
  )
}
