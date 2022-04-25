import { recordEvent } from '@/utils/recordEvent'
import { FOOTER_EVENTS, FOOTER_COLUMNS, FOOTER_CONTENT } from './helpers'

export const DesktopLinks = ({ desktop, visible }) => {
  return (
    <div
      aria-hidden={visible ? 'false' : 'true'}
      className="usa-grid-full flex-container usa-grid-flex-mobile va-footer-content"
    >
      <div className="va-footer-linkgroup">
        <h2 className="va-footer-linkgroup-title">{FOOTER_CONTENT.PROGRAMS}</h2>
        {desktop[FOOTER_COLUMNS.PROGRAMS]}
      </div>
      <div className="va-footer-linkgroup" id="footer-services">
        <h2 className="va-footer-linkgroup-title">
          {FOOTER_CONTENT.RESOURCES}
        </h2>
        {desktop[FOOTER_COLUMNS.RESOURCES]}
      </div>
      <div className="va-footer-linkgroup" id="footer-popular">
        <h2 className="va-footer-linkgroup-title">{FOOTER_CONTENT.CONNECT}</h2>
        {desktop[FOOTER_COLUMNS.CONNECT]}
      </div>
      <div className="va-footer-linkgroup" id="veteran-crisis">
        <h2 className="va-footer-linkgroup-title">{FOOTER_CONTENT.CRISIS}</h2>
        <ul className="va-footer-links">
          <li>
            <button
              onClick={() =>
                recordEvent({
                  event: FOOTER_EVENTS.CRISIS_LINE,
                })
              }
              className="va-button-link va-overlay-trigger"
              data-show="#modal-crisisline"
            >
              {FOOTER_CONTENT.CRISIS_LINE}
            </button>
          </li>
        </ul>
        <h2 className="va-footer-linkgroup-title vads-u-margin-top--2 vads-u-padding-bottom--1">
          Get answers
        </h2>
        {desktop[FOOTER_COLUMNS.CONTACT]}
      </div>
    </div>
  )
}
