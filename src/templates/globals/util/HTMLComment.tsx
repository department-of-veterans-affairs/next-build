import { useEffect } from 'react'

interface HTMLCommentProps {
  position: 'head' | 'footer'
  content: string
}

const HTMLComment = ({ position, content }: HTMLCommentProps) => {
  useEffect(() => {
    const comment = document.createComment(content)

    if (position === 'head') {
      const firstChild = document.head.firstChild
      if (firstChild) {
        document.head.insertBefore(comment, firstChild)
      } else {
        document.head.appendChild(comment)
      }
    } else if (position === 'footer') {
      document.body.appendChild(comment)
    }

    return () => {
      if (position === 'head') {
        document.head.removeChild(comment)
      } else if (position === 'footer') {
        document.body.removeChild(comment)
      }
    }
  }, [position, content])

  return null
}

export default HTMLComment
