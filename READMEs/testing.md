## Testing

This document outlines expectations for contributors to this project with regard to testing.

1. **All nontrivial pieces of code should have have unit tests.** (And if the code is trivial, perhaps it needs to be rethought.)
 
1. **Tests should be written in Jest and use the existing tooling wherever possible.** Please discuss any new dev dependencies with at least one other member of the team before adding them to the project.

1. **Tests should always cover the "Happy Path" or paths in their entirety.** A reasonable number of failure paths, appropriate to the likelihood and severity of errors, should be anticipated as well; silent failures cause very real issues with static site generation.

1. **PRs should aim for 100% coverage of lines, branches, and expressions.** PRs should lower test coverage metrics only in exceptional circumstances.  Test coverage requirements are set to a couple percent below the current metrics; these should increase briskly over time.

1. **Unit tests should incorporate accessibility testing whever appropriate.** Whenever a component is rendered, check it.  If there is a rerender, check it again!  The `axe` tool is made available in our internal `test-utils` module:

```javascript
import { axe, render, waitFor } from 'test-utils'

test('Footer correctly renders a column when provided with links', async () => {
  ....
  const { container } = render(<SomeComponent />)
  await waitFor(async () => expect(await axe(container)).toHaveNoViolations())
})
```
