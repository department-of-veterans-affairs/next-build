import HTMLComment from 'react-html-comment'

export const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div
          id="footerNav"
          data-testid="footer"
          data-minimal-footer="false"
        ></div>
      </footer>
      <div id="logout-modal-root"></div>
      <HTMLComment
        text="
      VA's mission: To fulfill President Lincoln's promise to care for those who have served in our nation's military and for their families, caregivers, and survivors.
      "
      />
    </>
  )
}
