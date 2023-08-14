import Link from 'next/link'
import Image from '@/templates/common/image'
import { DesktopLinks } from './desktop'
import { MobileLinks } from './mobile'
import { FOOTER_COLUMNS, createLinkGroups } from './helpers'
import { VA_WRAPPER_IMAGES } from '@/lib/constants'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { mountWidgets } from '@/lib/utils/mountWidgets'
import { useEffect } from 'react'

export const Footer = ({ links }) => {
  // useEffect(() => {
  //   mountWidgets(document.querySelectorAll('[data-widget-type]'), 6000)
  // }, [])

  const linkItems = createLinkGroups(links)
  const isBreakpoint = useMediaQuery(768)
  if (!links) return null

  return (
    <section role="contentinfo">
      {/* <div id="announcement-root"></div> */}
      <footer className="footer">
        <div id="footerNav" data-testid="footer">
          <div className="footer-inner">
            {isBreakpoint ? (
              <MobileLinks mobile={linkItems} visible />
            ) : (
              <DesktopLinks desktop={linkItems} visible />
            )}
          </div>
          <div className="usa-grid usa-grid-full footer-banner">
            <Link
              href="/"
              passHref
              className="va-footer-logo"
              title="Go to VA.gov"
            >
              <img
                src="/img/va-logo-white.png"
                alt="VA logo"
                width="200"
                height="50"
              />
            </Link>
          </div>
          <div className="usa-grid usa-grid-full va-footer-links-bottom">
            {linkItems[FOOTER_COLUMNS?.SUPERLINKS]}
          </div>
        </div>
      </footer>
    </section>
  )
}
