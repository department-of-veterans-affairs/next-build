import { render, screen } from '@testing-library/react'
import { axe } from '@/test-utils'
import { ProcessList } from './template'

describe('ProcessList with valid data', () => {
  test('renders ProcessList component', async () => {
    const { container } = render(
      <ProcessList
        id="1"
        type="paragraph--process"
        entityId={1}
        steps={[{ html: `<p>test step 1</p>` }, { html: `<p>test step 2</p>` }]}
      />
    )

    expect(screen.queryByText(/test step 1/)).toBeInTheDocument()

    const axeResults = await axe(container)
    expect(axeResults).toHaveNoViolations()
  })

  test('returns with no steps provided', () => {
    render(
      <ProcessList id="1" type="paragraph--process" entityId={1} steps={null} />
    )

    expect(screen.queryByText(/test step 1/)).toBeFalsy()
  })
})
