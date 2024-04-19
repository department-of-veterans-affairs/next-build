import { render } from '@testing-library/react'
import HTMLComment from './HTMLComment'

describe('HTMLComment Component', () => {
  test('renders comment in head position', () => {
    const content = 'Test comment'
    render(<HTMLComment position="head" content={content} />)

    const commentElement = document.head.firstChild as Comment

    expect(commentElement.nodeType).toBe(Node.COMMENT_NODE)
    expect(commentElement.nodeValue).toBe(content)
  })

  test('renders comment in footer position', () => {
    const content = 'Test comment'
    render(<HTMLComment position="footer" content={content} />)

    const commentElement = document.body.lastChild as Comment

    expect(commentElement.nodeType).toBe(Node.COMMENT_NODE)
    expect(commentElement.nodeValue).toBe(content)
  })
  test('appends comment to empty head', () => {
    document.head.innerHTML = ''

    const content = 'Test comment for empty head'
    render(<HTMLComment position="head" content={content} />)

    const commentElement = document.head.firstChild as Comment

    expect(commentElement).toBeDefined()
    expect(commentElement.nodeType).toBe(Node.COMMENT_NODE)
    expect(commentElement.nodeValue).toBe(content)
  })
})
