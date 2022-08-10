import Link from 'next/link'
import Image from '@/templates/common/image'
import { DesktopLinks } from './desktop'
import { MobileLinks } from './mobile'
import { FOOTER_COLUMNS, createLinkGroups } from './helpers'
import { VA_WRAPPER_IMAGES } from '@/lib/constants'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const Footer = ({ links }) => {
  const linkItems = createLinkGroups(links)
  const isBreakpoint = useMediaQuery(768)

  if (!links) return null
  return (
    <section role="contentinfo">
      <div id="announcement-root"></div>
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
            <Link href="/" passHref>
              <a className="va-footer-logo" title="Go to VA.gov">
                <Image
                  src={VA_WRAPPER_IMAGES?.footer}
                  alt="VA logo"
                  width="200"
                  height="50"
                />
              </a>
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
export default Footer
