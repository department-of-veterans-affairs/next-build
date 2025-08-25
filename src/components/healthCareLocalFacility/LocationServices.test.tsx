import { render } from '@testing-library/react'
import { LocationServices } from './LocationServices'
import { screen } from '@testing-library/dom'

const mockData: Array<{ title: string; wysiwigContents: string }> = [
  { title: 'Foo', wysiwigContents: '<p>Foo contents</p>' },
  { title: 'Bar', wysiwigContents: '<div>Bar contents</div>' },
] as const

describe('LocationServices', () => {
  it('should render the LocationServices component', () => {
    const { container } = render(<LocationServices items={mockData} />)
    expect(
      screen.getByRole('heading', { name: /Prepare for your visit/i })
    ).toBeInTheDocument()
    expect(
      container.querySelector('va-accordion-item[header="Foo"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('va-accordion-item[header="Bar"]')
    ).toBeInTheDocument()
    // Make sure that the WYSIWYG contents are rendered as DOM elements, not
    // plain text
    expect(screen.getByText(/Foo contents/i).tagName).toEqual('P')
    expect(screen.getByText(/Bar contents/i).tagName).toEqual('DIV')
  })
})
