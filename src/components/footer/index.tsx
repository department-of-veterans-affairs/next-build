
import Link from 'next/link'
import Image from '@/components/image';
import { DesktopLinks } from './desktop'
import { MobileLinks } from './mobile'
import { FOOTER_COLUMNS } from './helpers';
import { VA_WRAPPER_IMAGES } from '@/lib/constants';
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { createLinkGroups } from './helpers';






const Footer = ({ links }) => {
    const superlinks = createLinkGroups(links)
    const isBreakpoint = useMediaQuery(768)

    if (!links) return null;
    return (
        <section role="contentinfo">
            <div id="announcement-root"></div>
            <footer className="footer">
                <div id="footerNav">
                    <div className="footer-inner">
                        {isBreakpoint ? <MobileLinks links={links} visible /> : <DesktopLinks links={links} visible />}
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
                        {superlinks[FOOTER_COLUMNS?.SUPERLINKS]}
                    </div>
                </div>
            </footer>
        </section>
    );
};

export default Footer