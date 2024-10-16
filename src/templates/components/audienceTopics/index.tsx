import Link from 'next/link'
import { isEmpty } from 'lodash'
import { AudienceTopics as FormattedAudienceTopics } from '@/types/formatted/audienceTopics'
import { ParagraphComponent } from '@/types/formatted/paragraph'

export function AudienceTopics({
  tags,
}: ParagraphComponent<FormattedAudienceTopics>) {
  if (isEmpty(tags)) return null

  const tagsList = tags.map(({ id, href, name }, index) => (
    <Link
      href={href}
      key={id}
      className="vads-u-margin-bottom--1p5 vads-u-font-size--sm vads-u-border--1px vads-u-border-color--primary vads-u-padding-y--0p25 vads-u-padding-x--0p5 vads-u-margin-left--1p5 vads-u-text-decoration--none vads-u-color--base"
      style={{ borderRadius: '3px', lineHeight: '1.3' }}
    >
      {name}
    </Link>
  ))

  return (
    <div className="vads-u-padding-top--3 vads-u-padding-bottom--1p5 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light vads-u-display--flex">
      <p className="vads-u-margin-y--0 vads-u-font-weight--bold">Tags</p>
      <div className="vads-u-display--flex vads-u-flex-wrap--wrap">
        {tagsList}
      </div>
    </div>
  )
}
