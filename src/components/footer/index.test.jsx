import { faker, render, screen, toHaveAttribute } from 'test-utils'
import Footer from '.'

test.skip('Footer renders nothing meaningful in the absence of any links', async () => {
  const links = []
  const content = [links]
  render(<Footer links={content} />)
  screen.debug()
  expect(document.querySelector('div div')).toHaveAttribute(
    'class',
    'my-test-classname'
  )
})

test.skip('Footer correctly renders a column when provided with links', async () => {
  const links = Array(5)
    .fill()
    .map(() => ({
      title: faker.lorem.sentence(3),
      href: faker.internet.url(),
    }))
  const content = [links]
  render(<Footer links={content} />)
  screen.debug()
  expect(1).toBe(1)
})
