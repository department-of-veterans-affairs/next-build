import { TopNav } from './TopNav'

export const Header = () => {
  return (
    <header className="header merger" role="banner">
      {/*  Mobile Layout */}
      <div
        data-widget-type="header"
        data-show={true}
        data-show-nav-login={true}
        data-show-mega-menu={true}
        id="header-v2"
      ></div>

      {/* Tablet/desktop layout */}
      <TopNav />
    </header>
  )
}
