import { render, screen, toHaveAttribute } from 'test-utils'
import Footer from '..'

test.skip('Footer renders nothing meaningful in the absence of any links', async () => {
  render(<Footer />)
  screen.debug()
  expect(document.querySelector('div div')).toHaveAttribute(
    'class',
    'my-test-classname'
  )
})
