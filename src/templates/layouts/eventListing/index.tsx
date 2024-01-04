import { useEffect } from "react";

type EventListingProps = {
  title: string
}

export function EventListing({ title, fieldIntroText, entityUrl, facilitySidebar, reverseFieldListingNode, pastEvents }: EventListingProps) {
  // useEffect(() => {
  //   window.allEventTeasers = reverseFieldListingNode;
  //   window.pastEvents = pastEvents;
  // }, [reverseFieldListingNode, pastEvents]);
  return (
    <div>
      <h1>EVENT LISTING</h1>
      <p>{title}</p>
    </div>

    // <div className="interior vads-u-padding-bottom--3" id="content">
    //   <main className="va-l-detail-page va-facility-page">
    //     <div className="usa-grid usa-grid-full">
    //       <div className="events vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1p5 medium-screen:vads-u-padding-x--0 vads-u-padding-bottom--2">
    //         <h1 id="article-heading">{title}</h1>
    //         <div className="va-introtext">
    //           {fieldIntroText && (
    //             <p className="events-show" id="office-events-description">
    //               {fieldIntroText}
    //             </p>
    //           )}
    //         </div>
    //       </div>
    //       <div data-widget-type="events"></div>
    //     </div>
    //   </main>
    //   <div className="usa-grid usa-grid-full">
    //     <div className="last-updated vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
    //       <div className="vads-u-display--flex above-footer-elements-container">
    //         <div className="vads-u-flex--1 vads-u-text-align--right">
    //           <span className="vads-u-text-align--right">

    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}
