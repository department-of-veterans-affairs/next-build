import clsx from 'clsx'
import { useState, Fragment } from 'react'
import { Menu } from '@/types/dataTypes/drupal/menu'

interface MenuItemProps {
  readonly id: string
  readonly url: string
  readonly title: string
  items?: Tree
  children?: any
}

type Tree = ReadonlyArray<MenuItemProps>

const MenuItem = ({ id, url, title, items }: MenuItemProps) => {
  if (items) {
    return (
      <li key={id}>
        <h2
          className={
            'va-sidenav-item-label vads-u-font-family--sans va-sidenav-item-label-bold'
          }
        >
          {title}
        </h2>
        {items.map((item, i) => (
          <MenuItem {...item} key={i} />
        ))}
      </li>
    )
  } else {
    return (
      <li key={id}>
        <a href={url}>{title}</a>
      </li>
    )
  }
}

const RecursiveMenuTree = ({ items, tree }: Menu) => {
  const [obj] = tree

  const renderMenuTree = (branch: MenuItemProps) => {
    return (
      <MenuItem
        id={branch.id}
        key={branch.id}
        url={branch.url}
        title={branch.title}
        items={branch.items}
      >
        {branch.items &&
          branch.items.map((innerBranch: MenuItemProps, i: number) => {
            return <Fragment key={i}>{renderMenuTree(innerBranch)}</Fragment>
          })}
      </MenuItem>
    )
  }

  return (
    <>
      {obj.items.map((branch: MenuItemProps) => (
        <>{renderMenuTree(branch)}</>
      ))}
    </>
  )
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
        <RecursiveMenuTree items={items} tree={tree} />
      </ul>
    </div>
  )
}
