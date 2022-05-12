import { render, screen, toHaveAttribute } from 'test-utils'
import Footer from '.'

test('Footer renders nothing meaningful in the absence of any links', async () => {
  const content = []
  render(<Footer links={content} />)
  screen.debug()
  expect(document.querySelector('div div')).toHaveAttribute(
    'class',
    'my-test-classname'
  )
})
