import React from 'react'
import Link from 'next/link'

export function CommonAndPopular() {
  return (
    <div className="row va-quicklinks va-quicklinks--commpop">
      <div className="small-12 usa-width-one-half medium-6 columns">
        <h3 className="va-h-ruled">Common Questions</h3>
        <ul className="va-list--plain">
          <li>
            <Link href="/health-care/how-to-apply/">
              How do I apply for health care?
            </Link>
          </li>
          <li>
            <Link href="/disability/how-to-file-claim/">
              How do I file for disability benefits?
            </Link>
          </li>
          <li>
            <Link href="/education/how-to-apply/">
              How do I apply for education benefits?
            </Link>
          </li>
        </ul>
      </div>
      <div className="small-12 usa-width-one-half medium-6 columns">
        <h3 className="va-h-ruled">Popular on VA.gov</h3>
        <ul className="va-list--plain">
          <li>
            <Link href="/find-locations/">Find nearby VA locations</Link>
          </li>
          <li>
            <Link href="/education/gi-bill-comparison-tool">
              View education benefits available by school
            </Link>
          </li>
          <li>
            <a
              href="https://www.veteranscrisisline.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="external no-external-icon"
            >
              Contact the Veterans Crisis Line
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
