import { LeadershipListing as FormattedLeadershipListing } from '@/types/formatted/leadershipListing'

export function LeadershipListing({
  description,
  introText,
  lastSaved,
  leadership,
  title,
}: FormattedLeadershipListing) {
  console.log('description: ', description);
  console.log('introText: ', introText);
  console.log('lastSaved: ', lastSaved);
  console.log('leadership: ', leadership);
  return (
    <div className="usa-grid usa-grid-full">
      <div className="usa-width-three-fourths">
        <article className="usa-content">
          <h1 className="vads-u-margin-bottom--3">{title}</h1>
          {introText &&
            <div className="va-introtext vads-u-padding-bottom--2p5">
                {introText}
            </div>
          }
        </article>
      </div>
    </div>
  )
}
