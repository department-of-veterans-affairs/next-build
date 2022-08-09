import classNames from 'classnames'
import usePagination, { UsePaginationProps } from '../../hooks/usePagination'
import Link from 'templates/link'

export interface PagerProps extends React.HTMLAttributes<HTMLElement> {
  current: number
  total: number
  href: UsePaginationProps['href']
}

export default function Pager({ current, total, href, ...props }: PagerProps) {
  const items = usePagination({
    current,
    total,
    href,
  })

  return (
    <div
      role="navigation"
      aria-labelledby="pagination-heading"
      className={classNames('va-pagination-b', props.className)}
      {...props}
    >
      {items.map((link, index) => (
        <div key={index}>
          {link.type === 'previous' && (
            <Link href={link.href as string}>
              <a>
                <span className="va-pagination-prev-b">Previous</span>
              </a>
            </Link>
          )}
          {link.type === 'page' && (
            <div className="va-pagination-inner va-pagination-inner-b">
              <Link href={link.href as string} passHref>
                <a
                  className={classNames('', {
                    'va-pagination-active': link.isCurrent,
                  })}
                >
                  {link.display}
                </a>
              </Link>
            </div>
          )}
          {link.type === 'next' && (
            <Link href={link.href as string}>
              <a>
                <span className="va-pagination-prev-b">Next page</span>
              </a>
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}
