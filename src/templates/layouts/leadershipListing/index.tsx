import { LeadershipListing as FormattedLeadershipListing } from '@/types/formatted/leadershipListing'
import PersonProfileTeaser from '@/templates/components/personProfileTeaser'

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
      {/* <nav aria-label="secondary" data-widget-type="side-nav" /> */}
      <div className="usa-width-three-fourths">
        <article className="usa-content">
          <h1 className="vads-u-margin-bottom--3">{title}</h1>
          {introText &&
            <div className="va-introtext vads-u-padding-bottom--2p5">
              {introText}
            </div>
          }
          {leadership?.length && leadership.map((leader, index) => (
            <PersonProfileTeaser
              key={index}
              {...leader}
              office={leader.office?.title || ''}
            />
          ))}
        </article>
      </div>
    </div>
  )
}
