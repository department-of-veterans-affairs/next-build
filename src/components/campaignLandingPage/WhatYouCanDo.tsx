import { VaLink } from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { placeholders } from './placeholders.temp'

export const WhatYouCanDo = () => {
  return (
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
                  <VaLink
                    active
                    href={promo.entity.fieldPromoLink.entity.fieldLink.url.path}
                    text={promo.entity.fieldPromoLink.entity.fieldLink.title}
                  ></VaLink>
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
  )
}
