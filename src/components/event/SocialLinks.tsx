import {
  VaIcon,
  VaLink,
} from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { getFacebookLink, getXLink } from '@/lib/utils/social'

interface SocialLinksProps {
  path: string
  title: string
  description?: string
  address?: string
  dateObject?: {
    endValue: number
    value: number
  }
}

export const SocialLinks = ({
  path,
  title,
  description,
  address,
  dateObject,
}: SocialLinksProps) => {
  const facebookLink = getFacebookLink(path)
  const xLink = getXLink(path, title)

  return (
    <div id="va-c-social-share">
      <p className="vads-u-margin-y--2p5">
        <VaIcon
          class="va-c-social-icon vads-u-margin-right--0p5"
          icon="calendar_today"
          size={3}
        />
        <VaLink
          data-description={description}
          data-end={dateObject?.endValue}
          data-location={address}
          data-start={dateObject?.value}
          data-subject={title}
          href={path}
          id="add-to-calendar-link"
          text="Add to Calendar"
        />
      </p>

      <p className="vads-u-margin-y--2p5">
        <VaIcon
          class="va-c-social-icon vads-u-margin-right--0p5"
          icon={facebookLink.icon}
          size={3}
        />
        <VaLink href={facebookLink.href} text={facebookLink.text} />
      </p>
      <p className="vads-u-margin-y--0">
        <VaIcon
          class="va-c-social-icon vads-u-margin-right--0p5"
          icon={xLink.icon}
          size={3}
        />
        <VaLink href={xLink.href} text={xLink.text} />
      </p>
    </div>
  )
}
