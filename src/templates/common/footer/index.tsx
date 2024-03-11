export const Footer = () => {
  return (
    <section role="contentinfo">
      <div id="announcement-root"></div>
      <footer className="footer" style={{backgroundColor: "red"}}>
        <div
          id="footerNav"
          data-testid="footer"
          data-minimal-footer="false"
        ></div>
      </footer>
    </section>
  )
}
