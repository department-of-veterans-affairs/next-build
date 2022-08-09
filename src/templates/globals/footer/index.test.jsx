import { axe, faker, render, waitFor } from 'test-utils'
import 'window-matchmedia-polyfill'
import Footer from '.'
import mockFetch from '../../../mocks/mockFetch'

describe('Footer without any links', () => {
  test.skip('Footer renders nothing meaningful in the absence of any links', async () => {
    const links = []
    const content = [links]
    const { container } = render(<Footer links={content} />)
    await waitFor(async () => expect(await axe(container)).toHaveNoViolations())
  })
})

describe('Footer with meaningful links', () => {
  test.skip('Footer correctly renders a column when provided with links', async () => {
    let links = await mockFetch('FOOTER_LINKS').then((res) => res.json())
    const content = links
    const { container } = render(<Footer links={content} />)
    await waitFor(async () => expect(await axe(container)).toHaveNoViolations())
  })
})
