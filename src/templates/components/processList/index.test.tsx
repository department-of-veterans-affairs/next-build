import { render, screen } from '@testing-library/react'
import { ProcessList } from './index'

describe('ProcessList with valid data', () => {
  test('renders ProcessList component', () => {
    render(
      <ProcessList
        id="1"
        type="paragraph--process"
        entityId={1}
        steps={[{ html: `<p>test step 1</p>` }, { html: `<p>test step 2</p>` }]}
      />
    )

    expect(screen.queryByText(/test step 1/)).toBeInTheDocument()
  })
})
