import { VamcSystemVaPolice as FormattedVamcSystemVaPolice } from '@/types/formatted/vamcSystemVaPolice'
import { ContentFooter } from '@/templates/common/contentFooter'
import { useEffect } from 'react'
import { SideNavMenu } from '@/types/formatted/sideNav'

type VamcSystemVaPoliceProps = {
  title: string
}

// Allows additions to window object without overwriting global type
interface customWindow extends Window {
  sideNav?: SideNavMenu
}
declare const window: customWindow

export function VamcSystemVaPolice({
  title,
  menu,
}: FormattedVamcSystemVaPolice) {
  useEffect(() => {
    window.sideNav = menu
  }, [menu])

  return (
    <div className="va-l-detail-page va-facility-page">
      <div className="usa-grid usa-grid-full">
        {/* Nav data fille in by a separate script from `window.sideNav` */}
        <nav aria-label="secondary" data-widget-type="side-nav" />
        {/* Main page content */}
        <div className="usa-width-three-fourths">
          <article className="usa-content">
            <h1>{title}</h1>
          </article>
        </div>
      </div>
    </div>
  )
}
