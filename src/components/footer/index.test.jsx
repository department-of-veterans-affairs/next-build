import { axe, faker, render, waitFor } from 'test-utils'
import 'window-matchmedia-polyfill'
import Footer from '.'

describe('Footer without any links', () => {
  test('Footer renders nothing meaningful in the absence of any links', async () => {
    const links = []
    const content = [links]
    const { container } = render(<Footer links={content} />)
    await waitFor(async () => expect(await axe(container)).toHaveNoViolations())
  })
})

describe('Footer with meaningful links', () => {
  test('Footer correctly renders a column when provided with links', async () => {
    const links = Array(5)
      .fill()
      .map(() => ({
        title: faker.lorem.sentence(3),
        href: faker.internet.url(),
      }))
    const content = [links]
    const { container } = render(<Footer links={content} />)
    await waitFor(async () => expect(await axe(container)).toHaveNoViolations())
  })
})
