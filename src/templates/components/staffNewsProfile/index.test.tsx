import { render, screen } from 'test-utils'
import { StaffNewsProfile } from '@/templates/components/staffNewsProfile/index'

describe('StaffNewsProfile', () => {
  test('renders byline with full name and description', () => {
    const props = {
      field_name_first: 'John',
      field_last_name: 'Smith',
      field_description: 'Staff Writer',
    }
    render(<StaffNewsProfile {...props} />)
    expect(screen.getByText('By John Smith, Staff Writer')).toBeInTheDocument()
    expect(screen.getByText('By John Smith, Staff Writer').tagName).toBe('P')
  })

  test('renders byline with title only when description is missing', () => {
    const props = {
      field_name_first: 'John',
      field_last_name: 'Smith',
    }
    render(<StaffNewsProfile {...props} />)
    expect(screen.getByText('By John Smith')).toBeInTheDocument()
    expect(screen.getByText('By John Smith').tagName).toBe('P')
  })

  test('returns null when no name is provided', () => {
    const { container } = render(<StaffNewsProfile />)
    expect(container).toBeEmptyDOMElement()
  })
})
