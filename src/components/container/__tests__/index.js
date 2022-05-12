import { render, screen, toHaveAttribute } from 'test-utils'
import Container from '..'

test('Container renders a container div with the specified classname, without any children', async () => {
  render(<Container className="my-test-classname" />)
  expect(document.querySelector('div div')).toHaveAttribute(
    'class',
    'my-test-classname'
  )
})
