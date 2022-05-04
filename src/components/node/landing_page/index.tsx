import Link from 'next/link'
import React from 'react'
import { NodeLandingPage } from '@/types/node/landing_page'

export interface BenefitsHubLinkArgs {
  /**
   * Expects a Benefits Hub Landing Page node (landing_page).
   */
  node: NodeLandingPage
}

// Output a landing_page node as a link to itself, plus its teaser text.
export const BenefitsHubLink: React.FC<BenefitsHubLinkArgs> = ({ node }) => {
  if (node) {
    return (
      <>
        <p className="vads-u-margin--0">
          <strong>
            <Link href={node.path?.alias ? node.path?.alias : ' '} passHref>
              <a>{node.field_home_page_hub_label}</a>
            </Link>
          </strong>
        </p>
        <p className="vads-u-margin--0">{node.field_teaser_text}</p>
      </>
    )
  }
}
