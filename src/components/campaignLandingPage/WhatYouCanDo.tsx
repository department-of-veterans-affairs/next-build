import { MediaImage } from '../mediaImage/template'
import { CampaignLandingPageProps } from './template'

export const WhatYouCanDo = ({ whatYouCanDo }: CampaignLandingPageProps) => {
  return (
    <div className="vads-l-grid-container vads-u-padding-y--3 vads-u-padding-x--4 desktop-lg:vads-u-padding-x--0">
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--9">
          <p className="va-u-text-transform--uppercase vads-u-color--gray-medium vads-u-font-size--sm vads-u-margin-bottom--0">
            What you can do
          </p>
          <h2 className="vads-u-margin--0">{whatYouCanDo.header}</h2>
          <p className="va-introtext vads-u-margin-top--1 vads-u-margin-bottom--4">
            {whatYouCanDo.intro}
          </p>
        </div>
      </div>

      <div className="vads-l-row vads-u-margin-bottom--2 medium-screen:vads-u-margin-x--neg1">
        {whatYouCanDo.promos.map((promo, index) => (
          <div
            key={index}
            className="vads-l-col--12 medium-screen:vads-l-col--4 vads-u-align-content--stretch vads-u-margin-y--1 "
          >
            <div className="vads-u-background-color--gray-light-alt vads-u-height--full medium-screen:vads-u-margin-x--1 medium-screen:vads-u-margin-y--0">
              <MediaImage {...promo.image} imageStyle="3_2_medium_thumbnail" />

              <h3
                className="vads-u-padding-x--2 vads-u-margin-top--2"
                aria-label={promo.link.field_link.title}
              >
                {promo.link && (
                  <va-link
                    active
                    href={promo.link.field_link.url}
                    text={promo.link.field_link.title}
                  ></va-link>
                )}
              </h3>
              <p className="vads-u-margin-bottom--2 vads-u-margin-top--1 vads-u-padding-x--2">
                {promo.link.field_link_summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
