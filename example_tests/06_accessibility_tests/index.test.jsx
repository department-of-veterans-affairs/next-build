import { axe, render, screen, userEvent, waitFor } from 'test-utils'
import { Component1, Component2, Component3 } from './'

describe('<Component1/>', () => {
  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('renders without accessibility violations', async () => {
    const { container } = render(<Component1 />)
    /*
    Should return something like the following:

    ● Component1 › renders without accessibility violations

        expect(received).toHaveNoViolations(expected)

        Expected the HTML found at $('img') to have no violations:

        <img src="https://example.org/example.jpg">

        Received:

        "Images must have alternate text (image-alt)"

        Fix any of the following:
          Element does not have an alt attribute
          aria-label attribute does not exist or is empty
          aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
          Element has no title attribute
          Element's default semantics were not overridden with role="none" or role="presentation"
    */
    await waitFor(async () => expect(await axe(container)).toHaveNoViolations())
  })
})
describe('<Component2/>', () => {
  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('renders without accessibility violations', async () => {
    const { container } = render(<Component2 />)
    /*
    Should return something like the following:

    ● Component example accessibility tests › renders without accessibility violations

      expect(received).toHaveNoViolations(expected)

      Expected the HTML found at $('#target') to have no violations:

      <div role="button" id="target" aria-label="Thing 1" aria-mccheddarton="Unsupported thing 2"></div>

      Received:

      "ARIA attributes must conform to valid names (aria-valid-attr)"

      Fix any of the following:
        Invalid ARIA attribute name: aria-mccheddarton
    */
    await waitFor(async () => expect(await axe(container)).toHaveNoViolations())
  })
})

describe('<Component3/>', () => {
  test('renders without accessibility errors', async () => {
    /*
    The initial configuration should have a select with three options, the 
    first of which is selected.  Its name should appear in the heading.
    */
    const colors = {
      // eslint-disable-next-line prettier/prettier
      ffffff: 'White',
      '000000': 'Black',
      '00008B': 'Dark Blue',
    }
    const { container } = render(<Component3 colors={colors} />)
    // This is normal; black text on a white background shouldn't cause issues.
    await waitFor(async () => expect(await axe(container)).toHaveNoViolations())

    // Black-on-black!  I hit the sack!
    // I've been too long, I'm glad to be back
    let newColor = 'Black'
    await userEvent.selectOptions(screen.getByLabelText(/color/i), [newColor])
    expect(screen.getByRole('heading')).toHaveTextContent(newColor)
    expect(screen.getByLabelText(/color/i)).toHaveTextContent(newColor)
    // The following also passes, even though it totally shouldn't.
    await waitFor(async () => expect(await axe(container)).toHaveNoViolations())
    /*
    See https://github.com/dequelabs/axe-core/issues/595
    TL;DR: Be careful what you run axe tests against under JSDOM.

    When testing accessibility and things _pass_, be sure to check the test
    results for incomplete tests, i.e. tests that didn't fail because they
    could not be completed.
    */
    expect(await axe(container)).toEqual(
      expect.objectContaining({
        incomplete: expect.arrayContaining([
          expect.objectContaining({
            id: 'color-contrast',
            impact: null,
            description:
              'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
          }),
        ]),
      })
    )
  })
})
