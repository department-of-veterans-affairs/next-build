interface SocialLinkItemProps {
  url: string
  icon: string
  title: string
}

export const SocialLinkItem = ({ url, icon, title }: SocialLinkItemProps) => {
  return (
    <li className="vads-u-margin-bottom--2">
      <a
        href={url}
        className="vads-u-display--flex vads-u-align-items--baseline vads-u-text-decoration--none"
        rel="noreferrer"
      >
        <i className={`${icon} vads-u-margin-right--1`}></i>
        <span className="vads-u-text-decoration--underline">{title}</span>
      </a>
    </li>
  )
}
