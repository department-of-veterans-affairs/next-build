import {
  VaIcon,
  VaLink,
} from '@department-of-veterans-affairs/web-components/react-bindings/index.js'
import { getFacebookLink, getXLink } from '@/lib/utils/social'

interface SocialLinksProps {
  path: string
  title: string
}

export const SocialLinks = ({ path, title }: SocialLinksProps) => {
  const facebookLink = getFacebookLink(path)
  const xLink = getXLink(path, title)

  return (
    <div
      id="va-c-social-share"
      className="vads-u-display--flex tablet:vads-u-margin-bottom--2"
    >
      <p className="vads-u-margin-y--0 vads-u-margin-right--2p5">
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
