import { ContentFooter } from '@/templates/common/contentFooter'
import { VbaFacility as FormattedVBAFacility } from '@/types/formatted/vbaFacility'

export function VbaFacility({ title, lastUpdated }: FormattedVBAFacility) {
  return (
    <div className="interior">
      <main className="va-l-detail-page va-facility-page">
        <div className="vads-grid-container">
          <article className="usa-content va-l-facility-detail">
            <h1>{title}</h1>

            <div>TODO: Add conditional intro text</div>
            <div>TODO: Add buttons</div>

            <va-on-this-page></va-on-this-page>

            <h2 className="vads-u-margin-bottom--3">
              Location and contact information
            </h2>
            <div>TODO: Add conditional Prepare for your visit</div>
            <h2 className="vads-u-margin-bottom--3">Prepare for your visit</h2>

            <h2 className="vads-u-margin-bottom--3">In the spotlight</h2>
            <div>TODO: Add In the spotlight cards</div>

            <div>TODO: Add services/benefits</div>

            <div>TODO: Add conditional get updates links</div>
            <h2 className="vads-u-margin-bottom--3">
              Other nearby VA locations
            </h2>
            <div>TODO: Add Other nearby VA locations</div>

            <h2 className="vads-u-margin-bottom--3">
              VA locations in other areas
            </h2>
            <p>Looking for a VA benefits location in another area?</p>
            <p>
              <va-link
                href="/find-locations?facilityType=benefits"
                text="Find a VA benefits location"
              ></va-link>
            </p>
            <va-back-to-top></va-back-to-top>
            <ContentFooter lastUpdated={lastUpdated} />
          </article>
        </div>
      </main>
    </div>
  )
}
