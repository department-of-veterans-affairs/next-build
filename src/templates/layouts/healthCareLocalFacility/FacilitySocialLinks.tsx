import { FieldLink } from '@/types/drupal/field_type'
import clsx from 'clsx'
import React from 'react'

type SocialLink = Pick<FieldLink, 'uri' | 'title'>
type OperatingStatus = Pick<FieldLink, 'url'>

export interface FacilitySocialLinksProps {
  regionNickname: string
  fieldGovdeliveryIdEmerg?: string
  fieldGovdeliveryIdNews?: string
  fieldOperatingStatus?: OperatingStatus
  fieldFacebook?: SocialLink
  fieldTwitter?: SocialLink
  fieldFlickr?: SocialLink
  fieldInstagram?: SocialLink
  fieldYoutube?: SocialLink
}

const FacilitySocialLinks = ({
  regionNickname,
  fieldGovdeliveryIdEmerg,
  fieldGovdeliveryIdNews,
  fieldOperatingStatus,
  fieldFacebook,
  fieldTwitter,
  fieldFlickr,
  fieldInstagram,
  fieldYoutube,
}: FacilitySocialLinksProps) => {
  const renderIcon = (icon: string) => (
    <va-icon
      icon={icon}
      size="3"
      class="vads-u-color--link-default vads-u-margin-right--0p5"
    />
  )

  const govDeliveryLinks = [
    fieldGovdeliveryIdNews && (
      <>
        {renderIcon('mail')}
        <va-link
          href={`https://public.govdelivery.com/accounts/USVHA/subscriber/new?topic_id=${fieldGovdeliveryIdNews}`}
          rel="noreferrer"
          text={`Subscribe to ${regionNickname} news and announcements`}
        />
      </>
    ),
    fieldGovdeliveryIdEmerg && (
      <>
        {renderIcon('mail')}
        <va-link
          href={`https://public.govdelivery.com/accounts/USVHA/subscriber/new?topic_id=${fieldGovdeliveryIdEmerg}`}
          rel="noreferrer"
          text={`Subscribe to ${regionNickname} emergency notifications`}
        />
      </>
    ),
    fieldOperatingStatus?.url && (
      <>
        {renderIcon('adjust')}
        <va-link
          href={fieldOperatingStatus.url}
          text={`${regionNickname} operating status`}
        />
      </>
    ),
  ].filter(Boolean)

  const socialLinks = [
    fieldFacebook && (
      <>
        {renderIcon('facebook')}
        <va-link
          href={fieldFacebook.uri}
          rel="noreferrer"
          text={fieldFacebook.title}
        />
      </>
    ),
    fieldTwitter && (
      <>
        {renderIcon('x')}
        <va-link
          href={fieldTwitter.uri}
          rel="noreferrer"
          text={fieldTwitter.title}
        />
      </>
    ),
    fieldFlickr && (
      <>
        {renderIcon('flickr')}
        <va-link
          href={fieldFlickr.uri}
          rel="noreferrer"
          text={fieldFlickr.title}
        />
      </>
    ),
    fieldInstagram && (
      <>
        {renderIcon('instagram')}
        <va-link
          href={fieldInstagram.uri}
          rel="noreferrer"
          text={fieldInstagram.title}
        />
      </>
    ),
    fieldYoutube && (
      <>
        {renderIcon('youtube')}
        <va-link
          href={fieldYoutube.uri}
          rel="noreferrer"
          text={fieldYoutube.title}
        />
      </>
    ),
  ].filter(Boolean)

  if (!govDeliveryLinks.length && !socialLinks.length) {
    return null
  }

  const renderLinkColumn = (links: React.ReactNode[]) => (
    <div className="tablet:vads-grid-col-6">
      {links.map((link, index) => (
        <p
          className={clsx(
            'vads-u-margin-top--0',
            index === links.length - 1
              ? 'vads-u-margin-bottom--0'
              : 'vads-u-margin-bottom--2'
          )}
          key={index}
        >
          {link}
        </p>
      ))}
    </div>
  )

  return (
    <section
      data-template="facilities/facility_social_links"
      className="vads-u-background-color--gray-lightest vads-u-margin-top--4 mobile-lg:vads-u-margin-top--6 vads-u-padding-x--3 vads-u-padding-y--2p5"
    >
      <h2
        id="get-updates"
        className="vads-u-margin-top--0 vads-u-margin-bottom--2"
      >
        Get updates from {regionNickname}
      </h2>
      <div className="vads-grid-row vads-grid-gap-md">
        {govDeliveryLinks.length > 0 && renderLinkColumn(govDeliveryLinks)}
        {socialLinks.length > 0 && renderLinkColumn(socialLinks)}
      </div>
    </section>
  )
}

export default FacilitySocialLinks
