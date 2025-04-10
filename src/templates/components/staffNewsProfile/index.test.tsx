import { render, screen } from 'test-utils'
import { StaffNewsProfile } from '@/templates/components/staffNewsProfile/index'

describe('StaffNewsProfile', () => {
  test('renders byline with title and description', () => {
    const props = {
      title: 'John Smith',
      description: 'Staff Writer',
    }
    render(<StaffNewsProfile {...props} />)
    expect(screen.getByText('By John Smith, Staff Writer')).toBeInTheDocument()
    expect(screen.getByText('By John Smith, Staff Writer').tagName).toBe('P')
  })

  test('renders byline with title only when description is missing', () => {
    const props = {
      title: 'John Smith',
    }
    render(<StaffNewsProfile {...props} />)
    expect(screen.getByText('By John Smith')).toBeInTheDocument()
    expect(screen.getByText('By John Smith').tagName).toBe('P')
  })
})
