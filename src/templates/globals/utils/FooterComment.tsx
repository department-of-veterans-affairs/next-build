import { useEffect } from 'react'

const FooterComment = () => {
  const commentText = `\n“To care for him who shall have borne the battle and for his widow, and his orphan.”\n- Abraham Lincoln\n`

  useEffect(() => {
    const comment = document.createComment(commentText)

    const footer = document.querySelector('footer')
    if (footer) {
      const firstChild = footer.firstChild
      if (firstChild) {
        footer.insertBefore(comment, firstChild)
      } else {
        footer.appendChild(comment)
      }
    }

    return () => {
      if (footer && comment) {
        footer.removeChild(comment)
      }
    }
  }, [commentText])

  return null
}

export default FooterComment
