import { truncateWordsOrChar } from '@/lib/utils/helpers'
import { PressReleaseTeaser as FormattedPressReleaseTeaser } from '@/types/formatted/pressRelease'
import { formatDate } from '@/lib/utils/helpers'

/** Teaser press release */

export function PressReleaseTeaser({
  headingLevel,
  title,
  link,
  introText,
  releaseDate,
}: FormattedPressReleaseTeaser) {
  const TitleTag = ({ children, className }) => {
    const Heading = headingLevel ? headingLevel : 'h2'
    return <Heading className={className}>{children}</Heading>
  }

  return (
    <>
      <section className="vads-u-margin-bottom--4">
        <TitleTag className="vads-u-margin-bottom--1p5 vads-u-font-size--md medium-screen:vads-u-font-size--lg">
          <va-link href={link} text={title}>
            {title}
          </va-link>
        </TitleTag>
        <strong>{formatDate(releaseDate)}</strong>
        <p className="vads-u-margin-top--0">
          {truncateWordsOrChar(introText, 60, true)}
        </p>
      </section>
    </>
  )
}
