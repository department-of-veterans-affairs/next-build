import clsx from 'clsx'
import { useState } from 'react'
import { Menu } from '@/types/dataTypes/drupal/menu'

const renderChildItems = (items) => {
  return items.map((item) => {
    if (item.enabled)
      return (
        <a key={item.id} href={item.url} className="va-sidenav-item-label">
          {item.title}
        </a>
      )
  })
}

export const FacilityMenu = ({ items, tree }: Menu) => {
  const [active, setActive] = useState(false)

  return (
    <div
      className={clsx(
        'medium-screen:vads-u-height--auto',
        'medium-screen:vads-u-margin-left--0',
        'large-screen:vads-u-margin-right--2p5',
        'medium-screen:vads-u-margin-y--0',
        'usa-width-one-fourth',
        'va-sidenav',
        'va-sidenav-wrapper',
        'vads-u-margin--1',
        {
          'va-sidenav-height': active,
        }
      )}
    >
      <button
        type="button"
        className={clsx(
          'medium-screen:vads-u-display--none',
          'va-sidenav-default-trigger',
          'vads-u-color--primary'
        )}
        onClick={() => setActive(!active)}
        id="sidenav-menu"
        aria-label="In this section menu"
      >
        <span className="sr-only">View sub-navigation for </span>
        In this section
        <i className="fa fa-bars" aria-hidden="true" role="img" />
      </button>
      <ul
        id="va-sidenav-ul-container"
        className={clsx(
          'va-sidenav',
          'vads-u-margin-top--0',
          'vads-u-padding--0'
        )}
      >
        {/* Render all the items recursively. */}
        {renderChildItems(items)}
      </ul>
    </div>
  )
}
