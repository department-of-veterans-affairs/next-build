import FooterComment from '../utils/FooterComment'

export const Footer = () => {
  return (
    <section role="contentinfo">
      <div id="announcement-root"></div>
      <footer className="footer">
        <FooterComment />
        <div id="footerNav" data-testid="footer"></div>
      </footer>
    </section>
  )
}
