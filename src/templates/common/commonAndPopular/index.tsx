import Link from 'next/link'

export function CommonAndPopular() {
  return (
    <div className="row vads-u-padding-bottom--9" data-next-component="templates/common/commonAndPopular">
      <div className="small-12 usa-width-one-half medium-6 columns">
        <h3 className="va-h-ruled vads-u-margin-bottom--2 vads-u-padding-bottom--1 vads-u-font-size--xl">
          Common Questions
        </h3>
        <ul className="va-list--plain vads-u-margin-top--1">
          <li className="vads-u-padding-y--1">
            <Link href="/health-care/how-to-apply/">
              How do I apply for health care?
            </Link>
          </li>
          <li className="vads-u-padding-y--1">
            <Link href="/disability/how-to-file-claim/">
              How do I file for disability benefits?
            </Link>
          </li>
          <li className="vads-u-padding-y--1">
            <Link href="/education/how-to-apply/">
              How do I apply for education benefits?
            </Link>
          </li>
        </ul>
      </div>
      <div className="small-12 usa-width-one-half medium-6 columns">
        <h3 className="va-h-ruled vads-u-margin-bottom--2 vads-u-padding-bottom--1 vads-u-font-size--xl">
          Popular on VA.gov
        </h3>
        <ul className="va-list--plain vads-u-margin-top--1">
          <li className="vads-u-padding-y--1">
            <Link href="/find-locations/">Find nearby VA locations</Link>
          </li>
          <li className="vads-u-padding-y--1">
            <Link href="/education/gi-bill-comparison-tool">
              View education benefits available by school
            </Link>
          </li>
          <li className="vads-u-padding-y--1">
            <a
              target="_blank"
              href="https://www.veteranscrisisline.net/"
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
