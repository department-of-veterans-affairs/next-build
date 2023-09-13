// import { useEffect } from 'react';

// interface HeadCommentProps {
//   resourceType?: string;
//   path?: string;
//   entityId?: string | number;
// }

// const HeadComment = ({ resourceType, path, entityId }: HeadCommentProps) => {
//   useEffect(() => {
//     const comment = document.createComment(`
//       --
//       | resourceType: ${resourceType || 'N/A'}
//       | path: ${path || 'N/A'}
//       | entityId: ${entityId || 'N/A'}
//       |
//     `);

//     const firstChild = document.head.firstChild;
//     if (firstChild) {
//       document.head.insertBefore(comment, firstChild);
//     } else {
//       document.head.appendChild(comment);
//     }

//     return () => {
//       document.head.removeChild(comment);
//     };
//   }, [resourceType, path, entityId]);

//   return null;
// }

// export default HeadComment;

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
