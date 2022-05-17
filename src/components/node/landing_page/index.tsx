import Link from 'next/link'
import React from 'react'

export type NodeLandingPage = {
  /** THis is teaser text. */
  field_teaser_text: string
  /** This is home page hub label. */
  field_home_page_hub_label: string
  path?: any
}

export interface BenefitsHubLinkArgs {
  /**
   * Expects a Benefits Hub Landing Page node.
   */
  node: NodeLandingPage
}

// Output a landing_page node as a link to itself, plus its teaser text.
export const BenefitsHubLink: React.FC<BenefitsHubLinkArgs> = ({
  node,
  node: { field_home_page_hub_label, field_teaser_text },
}) => {
  if (node) {
    return (
      <>
        <p className="vads-u-margin--0">
          <strong>
            <Link href={node.path?.alias ? node.path?.alias : ' '} passHref>
              <a>{field_home_page_hub_label}</a>
            </Link>
          </strong>
        </p>
        <p className="vads-u-margin--0">{field_teaser_text}</p>
      </>
    )
  }
}
