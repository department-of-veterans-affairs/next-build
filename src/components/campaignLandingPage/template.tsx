import { placeholders } from './placeholders.temp'

type CampaignLandingPageProps = {
  title: string
}

export function CampaignLandingPage({ title }: CampaignLandingPageProps) {
  return (
    <>
      <div className="va-u-background--gradiant-blue">
        <div className="vads-l-grid-container vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
          <div className="vads-l-col--12 small-screen:vads-l-col--10 medium-screen:vads-l-col--8 small-desktop-screen:vads-l-col--12">
            <div className="vads-u-display--flex small-desktop-screen:vads-l-row">
              <div className="vads-l-col--12 small-desktop-screen:vads-l-col--6 vads-u-padding-top--4 vads-u-padding-bottom--6 desktop:vads-u-padding-right--4">
                <h1 className="vads-u-color--white">{title}</h1>
                <hr className="va-c-blue-line--large vads-u-border-color--primary-alt vads-u-border--2px vads-u-margin-y--2" />
                <p className="va-introtext vads-u-color--white">
                  {placeholders.fieldHeroBlurb}
                </p>

                {placeholders.fieldPrimaryCallToAction && (
                  <va-link-action
                    className="vads-u-margin-top--2"
                    href={
                      placeholders.fieldPrimaryCallToAction.entity
                        .fieldButtonLink.url.path
                    }
                    type="reverse"
                    text={
                      placeholders.fieldPrimaryCallToAction.entity
                        .fieldButtonLabel
                    }
                  />
                )}
              </div>
              <div className="vads-u-display--none desktop:vads-u-display--block">
                <img
                  alt=""
                  src={placeholders.fieldHeroImage.entity.image.derivative.url}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="vads-u-background-color--primary-alt-lightest">
        <div className="vads-l-grid-container vads-u-padding-y--6 vads-u-padding-bottom--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
          <div className="vads-l-row">
            <div className="vads-l-col--12 medium-screen:vads-l-col--8">
              <h2 className="vads-u-margin--0 vads-u-margin-bottom--2">
                Why this matters to you
              </h2>
              <p className="va-introtext vads-u-margin-top--0 vads-u-margin-bottom--2">
                {placeholders.fieldClpWhyThisMatters}
              </p>
              {placeholders.fieldSecondaryCallToAction && (
                <va-link-action
                  href={
                    placeholders.fieldSecondaryCallToAction.entity
                      .fieldButtonLink.url.path
                  }
                  type="secondary"
                  text={
                    placeholders.fieldSecondaryCallToAction.entity
                      .fieldButtonLabel
                  }
                />
              )}
            </div>
            <div className="vads-l-col--12 medium-screen:vads-l-col--3 medium-screen:vads-u-margin-left--6">
              <div className=" vads-u-margin-top--3 medium-screen:vads-u-margin-top--0">
                {placeholders.fieldClpAudience &&
                  placeholders.fieldClpAudience.length > 0 && (
                    <div className="vads-u-background-color--white vads-u-padding--2 vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--2">
                      <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin--0">
                        This page is for
                      </p>
                      <hr className="va-c-blue-line vads-u-border-color--primary-alt vads-u-margin-y--2" />
                      <ul className="usa-unstyled-list" role="list">
                        {placeholders.fieldClpAudience.map(
                          (clpAudience, index) => (
                            <li
                              key={index}
                              className="vads-u-font-size--sm vads-u-font-weight--bold vads-u-margin-top--2 vads-u-line-height--2"
                            >
                              {clpAudience.entity.name}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                <div
                  data-template="includes/social-share"
                  id="va-c-social-share"
                >
                  <ul className="usa-unstyled-list" role="list">
                    <li className="vads-u-margin-bottom--2p5">
                      <va-icon
                        icon="facebook"
                        size="3"
                        className="vads-u-color--link-default"
                      ></va-icon>
                      <va-link
                        className="va-js-share-link"
                        href={`https://www.facebook.com/sharer/sharer.php?href=${placeholders.hostUrl}${placeholders.entityUrl.path}`}
                        text="Share on Facebook"
                      ></va-link>
                    </li>
                    <li>
                      <va-icon
                        icon="x"
                        size="3"
                        className="vads-u-color--link-default"
                      ></va-icon>
                      <va-link
                        className="va-js-share-link"
                        href={`https://twitter.com/intent/tweet?text=${title}&url=${placeholders.hostUrl}${placeholders.entityUrl.path}`}
                        text="Share on X (formerly Twitter)"
                      ></va-link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
        <div className="vads-l-row">
          <div className="vads-l-col--12 medium-screen:vads-l-col--9">
            <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
              What you can do
            </p>
            <h2 className="vads-u-margin--0">
              {placeholders.fieldClpWhatYouCanDoHeader}
            </h2>
            <p className="va-introtext vads-u-margin-top--1 vads-u-margin-bottom--4">
              {placeholders.fieldClpWhatYouCanDoIntro}
            </p>
          </div>
        </div>

        <div className="vads-l-row vads-u-margin-bottom--2 medium-screen:vads-u-margin-x--neg1">
          {placeholders.fieldClpWhatYouCanDoPromos.map((promo, index) => (
            <div
              key={index}
              className="vads-l-col--12 medium-screen:vads-l-col--4 vads-u-align-content--stretch vads-u-margin-y--1 "
            >
              <div className="vads-u-background-color--gray-light-alt vads-u-height--full medium-screen:vads-u-margin-x--1 medium-screen:vads-u-margin-y--0">
                <img
                  alt={promo.entity.fieldImage.entity.image.alt}
                  height={
                    promo.entity.fieldImage.entity.thumbnail.derivative.height
                  }
                  src={promo.entity.fieldImage.entity.thumbnail.derivative.url}
                  width={
                    promo.entity.fieldImage.entity.thumbnail.derivative.width
                  }
                />
                <h3 className="vads-u-padding-x--2 vads-u-margin-top--2">
                  {/* TODO: determineFieldLink filter - using direct URL path */}
                  {promo.entity.fieldPromoLink.entity.fieldLink.url.path && (
                    <va-link
                      active
                      href={
                        promo.entity.fieldPromoLink.entity.fieldLink.url.path
                      }
                      text={promo.entity.fieldPromoLink.entity.fieldLink.title}
                    ></va-link>
                  )}
                </h3>
                <p className="vads-u-margin-bottom--2 vads-u-margin-top--1 vads-u-padding-x--2">
                  {promo.entity.fieldPromoLink.entity.fieldLinkSummary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {placeholders.fieldClpVideoPanel && (
        <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
          <div className="vads-l-row">
            <div className="vads-l-col--12 medium-screen:vads-l-col--8">
              <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
                Video
              </p>
              <h2 className="vads-u-margin--0">
                {placeholders.fieldClpVideoPanelHeader}
              </h2>

              {/* TODO: createEmbedYouTubeVideoURL filter - need helper function */}
              {placeholders.fieldMedia.entity.fieldMediaVideoEmbedField && (
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="vads-u-margin-top--4 medium-screen:vads-u-padding-right--1"
                  frameBorder="0"
                  height="315"
                  src={placeholders.fieldMedia.entity.fieldMediaVideoEmbedField}
                  title={
                    placeholders.fieldMedia.entity.name ||
                    'A related YouTube video'
                  }
                  width="100%"
                ></iframe>
              )}

              {placeholders.fieldMedia.entity.fieldDuration && (
                <p className="vads-u-font-size--sm vads-u-margin--0">
                  {/* TODO: formatSeconds filter - need helper function */}
                  {placeholders.fieldMedia.entity.fieldDuration}
                  {placeholders.fieldMedia.entity.fieldDuration &&
                    placeholders.fieldMedia.entity.fieldPublicationDate
                      .date && <> &bull; </>}
                  {/* TODO: humanizeDate filter - need helper function */}
                  {placeholders.fieldMedia.entity.fieldPublicationDate.date}
                </p>
              )}

              {placeholders.fieldMedia.entity.fieldDescription && (
                <p className="va-introtext vads-u-margin-top--1 vads-u-margin-bottom--0">
                  {placeholders.fieldMedia.entity.fieldDescription}
                </p>
              )}

              {placeholders.fieldClpVideoPanelMoreVideo.entity.fieldButtonLink
                .url.path &&
                placeholders.fieldClpVideoPanelMoreVideo.entity
                  .fieldButtonLabel && (
                  <p>
                    <va-link-action
                      className="vads-u-display--block"
                      href={
                        placeholders.fieldClpVideoPanelMoreVideo.entity
                          .fieldButtonLink.url.path
                      }
                      text={
                        placeholders.fieldClpVideoPanelMoreVideo.entity
                          .fieldButtonLabel
                      }
                      type="secondary"
                    ></va-link-action>
                  </p>
                )}
            </div>
          </div>
        </div>
      )}

      {placeholders.fieldClpSpotlightPanel && (
        <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
          <div className="vads-l-row">
            <div className="vads-l-col--12 medium-screen:vads-l-col--9">
              <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
                Spotlight
              </p>
              <h2 className="vads-u-margin-top--0">
                {placeholders.fieldClpSpotlightHeader}
              </h2>
              <p className="va-introtext vads-u-margin-top--1 vads-u-margin-bottom--4">
                {placeholders.fieldClpSpotlightIntroText}
                {placeholders.fieldClpSpotlightCta.entity.fieldButtonLink.url
                  .path &&
                  placeholders.fieldClpSpotlightCta.entity.fieldButtonLabel && (
                    <va-link
                      href={
                        placeholders.fieldClpSpotlightCta.entity.fieldButtonLink
                          .url.path
                      }
                      text={
                        placeholders.fieldClpSpotlightCta.entity
                          .fieldButtonLabel
                      }
                    ></va-link>
                  )}
              </p>
            </div>
          </div>
          <div className="vads-l-row vads-u-margin-bottom--2 medium-screen:vads-u-margin-x--neg1">
            {placeholders.fieldClpSpotlightLinkTeasers.map(
              (linkTeaser, index) => (
                <div
                  key={index}
                  className="vads-l-col--12 medium-screen:vads-l-col--4 vads-u-align-content--stretch vads-u-margin-y--1 "
                >
                  <div className="vads-u-background-color--gray-light-alt vads-u-height--full medium-screen:vads-u-margin-x--1 medium-screen:vads-u-margin-y--0">
                    <div className="vads-u-padding--2">
                      <h3 className="vads-u-margin-top--0">
                        {/* TODO: determineFieldLink filter - using direct URL path */}
                        {linkTeaser.entity.fieldLink.url.path && (
                          <va-link
                            active
                            href={linkTeaser.entity.fieldLink.url.path}
                            text={linkTeaser.entity.fieldLink.title}
                          ></va-link>
                        )}
                      </h3>
                      <p className="vads-u-margin-top--1">
                        {linkTeaser.entity.fieldLinkSummary}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {placeholders.fieldClpStoriesPanel && (
        <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
          <div className="vads-l-row">
            <div className="vads-l-col--12 medium-screen:vads-l-col--9">
              <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
                Stories
              </p>
              <h2 className="vads-u-margin-top--0">
                {placeholders.fieldClpStoriesHeader}
              </h2>
              <p className="va-introtext vads-u-margin-top--1 vads-u-margin-bottom--4">
                {placeholders.fieldClpStoriesIntro}
              </p>

              {placeholders.fieldClpStoriesTeasers &&
                placeholders.fieldClpStoriesTeasers.length > 0 && (
                  <div className="vads-u-display--flex vads-u-flex-direction--column">
                    {placeholders.fieldClpStoriesTeasers.map(
                      (storyTeaser, index) => (
                        <div
                          key={index}
                          className="vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row vads-u-margin-bottom--4"
                        >
                          {storyTeaser.entity.fieldMedia.entity.thumbnail
                            .derivative.url && (
                            <img
                              alt={
                                storyTeaser.entity.fieldMedia.entity.image.alt
                              }
                              className="story-image vads-u-height--full medium-screen:vads-u-margin-right--2"
                              height={
                                storyTeaser.entity.fieldMedia.entity.thumbnail
                                  .derivative.height
                              }
                              src={
                                storyTeaser.entity.fieldMedia.entity.thumbnail
                                  .derivative.url
                              }
                              width={
                                storyTeaser.entity.fieldMedia.entity.thumbnail
                                  .derivative.width
                              }
                            />
                          )}
                          <div className="vads-u-margin-top--2 medium-screen:vads-u-margin-top--0">
                            <h3 className="vads-u-margin-top--0">
                              {/* TODO: determineFieldLink filter - using direct URL path */}
                              {storyTeaser.entity.fieldLinkTeaser.entity
                                .fieldLink.url.path && (
                                <va-link
                                  active
                                  href={
                                    storyTeaser.entity.fieldLinkTeaser.entity
                                      .fieldLink.url.path
                                  }
                                  text={
                                    storyTeaser.entity.fieldLinkTeaser.entity
                                      .fieldLink.title
                                  }
                                ></va-link>
                              )}
                            </h3>
                            <p>
                              {
                                storyTeaser.entity.fieldLinkTeaser.entity
                                  .fieldLinkSummary
                              }
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

              {placeholders.fieldClpStoriesCta.uri && (
                <va-link-action
                  href={placeholders.fieldClpStoriesCta.uri}
                  type="secondary"
                  text="See more stories"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {placeholders.fieldClpResourcesPanel && (
        <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
          <div className="vads-l-row">
            <div className="vads-l-col--12 medium-screen:vads-l-col--9">
              <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
                Downloadable resources
              </p>
              <h2 className="vads-u-margin-top--0">
                {placeholders.fieldClpResourcesHeader}
              </h2>
              <p className="va-introtext vads-u-margin-top--1 vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--4">
                {placeholders.fieldClpResourcesIntroText}
              </p>
            </div>
          </div>

          <div className="vads-l-row vads-u-margin-bottom--2 medium-screen:vads-u-margin-x--neg1">
            {placeholders.fieldClpResources.map((resource, index) => (
              <div
                key={index}
                className="vads-l-col--12 medium-screen:vads-l-col--4 vads-u-align-content--stretch vads-u-margin-y--1 "
              >
                <div className="vads-u-background-color--gray-light-alt vads-u-height--full vads-u-padding--2 vads-u-display--flex vads-u-flex-direction--column vads-u-justify-content--space-between medium-screen:vads-u-margin-x--1 medium-screen:vads-u-margin-y--0">
                  <h3 className="vads-u-margin--0">{resource.entity.name}</h3>
                  <p className="vads-u-flex--1">
                    {resource.entity.fieldDescription}
                  </p>

                  {/* TODO: In the Liquid template, this one is NOT a va-link where other links are.
                   * note to Zach Button to ask the team why */}
                  <a
                    aria-label={`Download ${resource.entity.name} PDF`}
                    download
                    href={resource.entity.fieldMediaExternalFile.uri}
                    onClick={() => {
                      // TODO: recordEvent analytics function needs to be implemented
                      // recordEvent({ 'event': 'clp-link-click', 'clp-section-category': 'Downloadable resources', 'clp-section-title': fieldClpResourcesHeader, 'clp-total-sections': clpTotalSections, 'clp-click-label': `Download ${resource.entity.name}` });
                    }}
                  >
                    Download (PDF)
                  </a>
                </div>
              </div>
            ))}
          </div>

          {placeholders.fieldClpResourcesCta.entity.fieldButtonLink &&
            placeholders.fieldClpResourcesCta.entity.fieldButtonLabel && (
              <div className="vads-l-row">
                <div className="vads-u-col--12">
                  <va-link-action
                    href={
                      placeholders.fieldClpResourcesCta.entity.fieldButtonLink
                        .url.path
                    }
                    type="secondary"
                    text={
                      placeholders.fieldClpResourcesCta.entity.fieldButtonLabel
                    }
                  />
                </div>
              </div>
            )}
        </div>
      )}

      {placeholders.fieldClpEventsPanel && (
        <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
          <div className="vads-l-row">
            <div className="vads-l-col--12 medium-screen:vads-l-col--9">
              <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
                Events
              </p>
              <h2 className="vads-u-margin-top--0">
                {placeholders.fieldClpEventsHeader}
              </h2>
            </div>
          </div>

          <div className="vads-l-row vads-u-margin-bottom--2 medium-screen:vads-u-margin-x--neg6">
            {placeholders.fieldClpEventsReferences.map(
              (eventReference, index) => (
                <div
                  key={index}
                  className={`vads-l-col--12 medium-screen:vads-l-col--6 ${index > 0 ? 'vads-u-margin-top--4 medium-screen:vads-u-margin-top--0' : ''}`}
                >
                  <div className="medium-screen:vads-u-margin-x--6">
                    <h3 className="vads-u-margin-top--0">
                      {eventReference.entity.entityUrl.path &&
                      eventReference.entity.title ? (
                        <va-link
                          href={eventReference.entity.entityUrl.path}
                          text={eventReference.entity.title}
                        ></va-link>
                      ) : (
                        eventReference.entity.title
                      )}
                    </h3>

                    <p>{eventReference.entity.fieldDescription}</p>

                    <div className="vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row">
                      <p className="vads-u-font-weight--bold vads-u-margin--0 vads-u-margin-right--2">
                        When
                      </p>
                      <p className="vads-u-margin--0">
                        {/* TODO: currentTime, deriveMostRecentDate, dateFromUnix, timezoneAbbrev filters - need helper functions */}
                      </p>
                    </div>

                    {(eventReference.entity.fieldFacilityLocation.entity
                      .entityUrl.path ||
                      eventReference.entity.fieldLocationHumanreadable ||
                      eventReference.entity.fieldLink.uri) && (
                      <div className="vads-u-display--flex vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row vads-u-margin-top--2">
                        <p className="vads-u-font-weight--bold vads-u-margin--0 vads-u-margin-right--2">
                          Where
                        </p>

                        <div className="vads-u-display--flex vads-u-flex-direction--column">
                          {eventReference.entity.fieldFacilityLocation.entity
                            .entityUrl.path &&
                            eventReference.entity.fieldFacilityLocation.entity
                              .title && (
                              <va-link
                                href={
                                  eventReference.entity.fieldFacilityLocation
                                    .entity.entityUrl.path
                                }
                                text={
                                  eventReference.entity.fieldFacilityLocation
                                    .entity.title
                                }
                              />
                            )}

                          {eventReference.entity.fieldLink.uri &&
                            eventReference.entity.fieldEventCta && (
                              <>
                                {/* TODO: determineFieldLink filter - using direct URL path */}
                                {eventReference.entity.fieldLink.url.path && (
                                  <va-link
                                    active
                                    href={
                                      eventReference.entity.fieldLink.url.path
                                    }
                                    text={eventReference.entity.fieldEventCta}
                                  ></va-link>
                                )}
                              </>
                            )}

                          {eventReference.entity.fieldLocationHumanreadable && (
                            <>
                              {eventReference.entity.fieldUrlOfAnOnlineEvent
                                .uri ? (
                                <va-link
                                  href={
                                    eventReference.entity
                                      .fieldUrlOfAnOnlineEvent.uri
                                  }
                                  text={
                                    eventReference.entity
                                      .fieldLocationHumanreadable
                                  }
                                />
                              ) : (
                                <p className="vads-u-margin--0">
                                  {
                                    eventReference.entity
                                      .fieldLocationHumanreadable
                                  }
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {placeholders.fieldClpFaqPanel && (
        <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
          <div className="vads-l-row">
            <div className="vads-l-col--12 medium-screen:vads-l-col--8">
              <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
                FAQ
              </p>

              {(() => {
                const sectionHeader =
                  placeholders.fieldClpReusableQA &&
                  placeholders.fieldClpReusableQA.entity.fieldSectionHeader
                    ? placeholders.fieldClpReusableQA.entity.fieldSectionHeader
                    : 'Frequently asked questions'

                return (
                  <>
                    <h2 className="vads-u-margin-top--0">{sectionHeader}</h2>

                    {placeholders.fieldClpReusableQA &&
                      placeholders.fieldClpReusableQA.entity.fieldRichWysiwyg
                        .processed && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              placeholders.fieldClpReusableQA.entity
                                .fieldRichWysiwyg.processed,
                          }}
                        />
                      )}

                    <va-accordion bordered uswds>
                      {placeholders.fieldClpFaqParagraphs.map(
                        (faqParagraph, index) =>
                          faqParagraph.entity && (
                            <va-accordion-item
                              key={index}
                              bordered
                              header={faqParagraph.entity.fieldQuestion}
                              level="3"
                              data-faq-entity-id={faqParagraph.entity.entityId}
                              id={faqParagraph.entity.fieldQuestion}
                              uswds
                            >
                              {/* TODO: hashReference filter - need helper function for id */}
                              {/* TODO: include statement - render paragraph component based on entityBundle */}
                              {faqParagraph.entity.fieldAnswer &&
                                faqParagraph.entity.fieldAnswer[0] && (
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        faqParagraph.entity.fieldAnswer[0]
                                          .entity.processed,
                                    }}
                                  />
                                )}
                            </va-accordion-item>
                          )
                      )}

                      {placeholders.fieldClpReusableQA &&
                        (() => {
                          const questions =
                            placeholders.fieldClpReusableQA.entity.queryFieldQAs
                              .entities

                          if (
                            placeholders.fieldClpReusableQA.entity
                              .entityBundle === 'q_a_group'
                          ) {
                            if (
                              placeholders.fieldClpReusableQA.entity
                                .fieldAccordionDisplay
                            ) {
                              return questions.map((item) => {
                                const id = item.entityId
                                return (
                                  <va-accordion-item
                                    key={id}
                                    bordered
                                    className="va-accordion-item"
                                    header={item.entityLabel}
                                    id={item.entityLabel}
                                    level="3"
                                  >
                                    {/* TODO: hashReference filter - need helper function for id */}
                                    <div
                                      id={id}
                                      data-entity-id={id}
                                      data-analytics-faq-section={sectionHeader}
                                      data-analytics-faq-text={item.entityLabel}
                                    >
                                      <div id={`${item.entityBundle}-${id}`}>
                                        {/* TODO: include statement - render paragraph component based on entityBundle */}
                                        {item.fieldAnswer &&
                                          item.fieldAnswer.entity && (
                                            <div
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  item.fieldAnswer.entity
                                                    .processed,
                                              }}
                                            />
                                          )}
                                      </div>
                                    </div>
                                  </va-accordion-item>
                                )
                              })
                            } else {
                              const entity =
                                placeholders.fieldClpReusableQA.entity
                              const fieldQAs = entity.queryFieldQAs.entities

                              return fieldQAs.map((fieldQA, index) => (
                                <div key={index}>
                                  <h3>{fieldQA.entityLabel}</h3>
                                  {fieldQA.fieldAnswer && (
                                    <>
                                      {/* TODO: include statement - render paragraph component based on entityBundle */}
                                      {fieldQA.fieldAnswer.entity && (
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              fieldQA.fieldAnswer.entity
                                                .processed,
                                          }}
                                        />
                                      )}
                                    </>
                                  )}
                                </div>
                              ))
                            }
                          }
                          return null
                        })()}
                    </va-accordion>
                  </>
                )
              })()}
            </div>
          </div>

          {placeholders.fieldClpFaqCta.entity.fieldButtonLink.url.path &&
            placeholders.fieldClpFaqCta.entity.fieldButtonLabel && (
              <div className="vads-l-row">
                <div className="vads-u-col--12">
                  <va-link-action
                    className="vads-u-margin-top--1"
                    href={
                      placeholders.fieldClpFaqCta.entity.fieldButtonLink.url
                        .path
                    }
                    type="secondary"
                    text={placeholders.fieldClpFaqCta.entity.fieldButtonLabel}
                  />
                </div>
              </div>
            )}
        </div>
      )}

      {placeholders.fieldConnectWithUs.entity.fieldExternalLink.title &&
        (() => {
          // TODO: jsonToObj filter - need helper function to parse JSON
          const socialLinksObject = JSON.parse(
            placeholders.fieldConnectWithUs.entity.fieldSocialMediaLinks
              .platformValues
          )

          return (
            <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
              <div className="vads-l-row">
                <div className="vads-l-col--12 medium-screen:vads-l-col--9">
                  <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
                    Connect with us
                  </p>
                  <h2 className="vads-u-margin-top--0">
                    Get updates from{' '}
                    {
                      placeholders.fieldConnectWithUs.entity.fieldExternalLink
                        .title
                    }
                  </h2>
                </div>
              </div>

              <div className="vads-l-row medium-screen:vads-u-margin-x--neg1">
                {placeholders.fieldConnectWithUs.entity.fieldEmailUpdatesLink
                  .url.path &&
                  placeholders.fieldConnectWithUs.entity.fieldEmailUpdatesLink
                    .title && (
                    <div className="vads-l-col--12 medium-screen:vads-l-col--4">
                      <div className="vads-u-margin-y--1 medium-screen:vads-u-margin-x--1">
                        <va-icon
                          icon="mail"
                          size="3"
                          className="vads-u-color--link-default vads-u-padding-right--1"
                        ></va-icon>
                        <va-link
                          href={
                            placeholders.fieldConnectWithUs.entity
                              .fieldEmailUpdatesLink.url.path
                          }
                          text={
                            placeholders.fieldConnectWithUs.entity
                              .fieldEmailUpdatesLink.title
                          }
                        />
                      </div>
                    </div>
                  )}

                {socialLinksObject.twitter?.value && (
                  <div className="vads-l-col--12 medium-screen:vads-l-col--4">
                    <div className="vads-u-margin-y--1 medium-screen:vads-u-margin-x--1">
                      <va-icon
                        icon="x"
                        size="3"
                        className="vads-u-color--link-default vads-u-padding-right--1"
                      ></va-icon>
                      <va-link
                        href={`https://twitter.com/${socialLinksObject.twitter.value}`}
                        text={`${placeholders.fieldConnectWithUs.entity.fieldExternalLink.title} X (formerly Twitter)`}
                      />
                    </div>
                  </div>
                )}

                {socialLinksObject.facebook?.value && (
                  <div className="vads-l-col--12 medium-screen:vads-l-col--4">
                    <div className="vads-u-margin-y--1 medium-screen:vads-u-margin-x--1">
                      <va-icon
                        icon="facebook"
                        size="3"
                        className="vads-u-color--link-default vads-u-padding-right--1"
                      ></va-icon>
                      <va-link
                        href={`https://facebook.com/${socialLinksObject.facebook.value}`}
                        text={`${placeholders.fieldConnectWithUs.entity.fieldExternalLink.title} Facebook`}
                      />
                    </div>
                  </div>
                )}

                {socialLinksObject.youtube?.value && (
                  <div className="vads-l-col--12 medium-screen:vads-l-col--4">
                    <div className="vads-u-margin-y--1 medium-screen:vads-u-margin-x--1">
                      <va-icon
                        icon="youtube"
                        size="3"
                        className="vads-u-color--link-default vads-u-padding-right--1"
                      ></va-icon>
                      <va-link
                        href={`https://youtube.com/${socialLinksObject.youtube.value}`}
                        text={`${placeholders.fieldConnectWithUs.entity.fieldExternalLink.title} YouTube`}
                      />
                    </div>
                  </div>
                )}

                {socialLinksObject.linkedin?.value && (
                  <div className="vads-l-col--12 medium-screen:vads-l-col--4">
                    <div className="vads-u-margin-y--1 medium-screen:vads-u-margin-x--1">
                      <va-icon
                        icon="linkedin"
                        size="3"
                        className="vads-u-color--link-default vads-u-padding-right--1"
                      ></va-icon>
                      <va-link
                        href={`https://linkedin.com/${socialLinksObject.linkedin.value}`}
                        text={`${placeholders.fieldConnectWithUs.entity.fieldExternalLink.title} LinkedIn`}
                      />
                    </div>
                  </div>
                )}

                {socialLinksObject.instagram?.value && (
                  <div className="vads-l-col--12 medium-screen:vads-l-col--4">
                    <div className="vads-u-margin-y--1 medium-screen:vads-u-margin-x--1">
                      <va-icon
                        icon="instagram"
                        size="3"
                        className="vads-u-color--link-default vads-u-padding-right--1"
                      ></va-icon>
                      <va-link
                        href={`https://instagram.com/${socialLinksObject.instagram.value}`}
                        text={`${placeholders.fieldConnectWithUs.entity.fieldExternalLink.title} Instagram`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })()}

      {placeholders.fieldBenefitCategories &&
        placeholders.fieldBenefitCategories.length > 0 && (
          <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
            <div className="vads-l-row">
              <div className="vads-l-col--12 medium-screen:vads-l-col--9">
                <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
                  VA Benefits
                </p>
                <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
                  Learn more about related VA benefits
                </h2>
              </div>
            </div>

            <div className="vads-l-row medium-screen:vads-u-margin-x--neg6">
              {placeholders.fieldBenefitCategories.map(
                (benefitCategory, index) => (
                  <div
                    key={index}
                    className={`vads-l-col--12 medium-screen:vads-l-col--6 ${index > 0 ? 'vads-u-margin-top--2 medium-screen:vads-u-margin-top--0' : ''}`}
                  >
                    <div className="medium-screen:vads-u-margin-left--6 medium-screen:vads-u-margin-right--5">
                      <div className="vads-u-display--flex vads-u-align-items--center">
                        {/* TODO: getHubIcon filter - need helper function to render icon based on fieldTitleIcon */}
                        <va-icon
                          icon={benefitCategory.entity.fieldTitleIcon}
                          size="3"
                          className="vads-u-margin-right--1"
                        ></va-icon>
                        <h3 className="vads-u-margin--0 vads-u-font-size--h4">
                          <va-link
                            href={benefitCategory.entity.entityUrl.path}
                            text={benefitCategory.entity.title}
                          ></va-link>
                        </h3>
                      </div>
                      <p className="vads-u-margin-top--1">
                        {benefitCategory.entity.fieldTeaserText}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
            <va-back-to-top></va-back-to-top>
            {/* TODO: include statement - render above-footer-elements component */}
          </div>
        )}
    </>
  )
}
