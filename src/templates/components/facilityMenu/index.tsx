import clsx from 'clsx'
import { useState, Fragment } from 'react'
import { RecursiveMenu, MenuItemProps } from '@/types/index'

const MenuItem = ({
  id,
  url,
  title,
  expanded,
  enabled,
  items,
}: MenuItemProps) => {
  if (!enabled) return

  if (items && expanded) {
    return (
      <li key={id} className={'va-sidenav-level-1'}>
        <h2
          className={
            'va-sidenav-item-label vads-u-font-family--sans va-sidenav-item-label-bold'
          }
        >
          {title}
        </h2>
        <ul>
          {items.map((item, i) => (
            <MenuItem {...item} key={item.id} />
          ))}
        </ul>
      </li>
    )
  } else {
    return (
      <li key={id} className={'va-sidenav-level-2'}>
        <a className={'va-sidenav-item-label'} href={url}>
          {title}
        </a>
      </li>
    )
  }
}

const RecursiveMenuTree = ({ items, tree, depth, maxDepth }: RecursiveMenu) => {
  const [obj] = tree

  const renderMenuTree = (branch: MenuItemProps, depth) => {
    if (branch.items) depth++
    if (depth > maxDepth) return
    if (depth == maxDepth) branch.expanded = false

    return (
      <MenuItem {...branch}>
        <ul>
          {branch.items &&
            branch.items.map((innerBranch: MenuItemProps, i: number) => {
              return (
                <Fragment key={i}>
                  {renderMenuTree(innerBranch, depth)}
                </Fragment>
              )
            })}
        </ul>
      </MenuItem>
    )
  }

  return (
    <>
      {obj.items.map((branch: MenuItemProps) => (
        <Fragment key={branch.id}>{renderMenuTree(branch, depth)}</Fragment>
      ))}
    </>
  )
}

export const FacilityMenu = ({
  items,
  tree,
  depth,
  maxDepth,
}: RecursiveMenu) => {
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
        <RecursiveMenuTree
          items={items}
          tree={tree}
          depth={depth}
          maxDepth={maxDepth}
        />
      </ul>
    </div>
  )
}
