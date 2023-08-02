import Link from 'next/link'
import { isEmpty } from 'lodash'
import { AudienceTopicsType } from '@/types/index'

export function AudienceTopics({ tags }: AudienceTopicsType) {
  if (isEmpty(tags)) return null
  const tagsList = tags.map(({ id, href, name }) => (
    <div key={id}>
      <div className="vads-u-margin-right--1 vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--0">
        <Link
          href={`${href}/${encodeURI(name)}`}
          className="vads-u-margin-bottom--1p5 usa-button-secondary vads-u-font-size--sm vads-u-border--1px vads-u-border-color--primary vads-u-padding--0p25 vads-u-padding-x--0p5 vads-u-margin-left--1p5 vads-u-text-decoration--none vads-u-color--base"
        >
          {name}
        </Link>
      </div>
    </div>
  ))

  return (
    <div className="vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
      <div className="vads-u-padding-top--3 vads-u-padding-bottom--1p5 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-display--flex vads-u-align-items--flex-start vads-u-flex-direction--row">
        <strong className="vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--0">
          Tags
        </strong>
        <div className="vads-u-display--flex vads-u-flex-wrap--wrap">
          {tagsList}
        </div>
      </div>
    </div>
  )
}
