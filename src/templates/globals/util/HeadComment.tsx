import { useEffect } from 'react'

interface HeadCommentProps {
  resourceType?: string
  path?: string
  entityId?: string | number
}

const HeadComment: React.FC<HeadCommentProps> = ({
  resourceType,
  path,
  entityId,
}) => {
  useEffect(() => {
    const comment = document.createComment(`
      --
      | resourceType: ${resourceType || 'N/A'}
      | path: ${path || 'N/A'}
      | entityId: ${entityId || 'N/A'}
      | 
    `)

    const firstChild = document.head.firstChild
    if (firstChild) {
      document.head.insertBefore(comment, firstChild)
    } else {
      document.head.appendChild(comment)
    }

    return () => {
      document.head.removeChild(comment)
    }
  }, [resourceType, path, entityId])

  return null
}

export default HeadComment
