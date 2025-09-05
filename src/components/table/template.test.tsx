import { render } from '@testing-library/react'
import { Table } from './template'

const tableData = [
  [
    '<strong>School name</strong>',
    '<strong>VSOC counselor email address</strong>',
    '<strong>Regional office</strong>',
  ],
  [
    'George Mason University',
    'Valerie Smith <a href="mailto:test@va.gov">test@va.gov</a>',
    'National Capital Region Benefits Office (372)',
  ],
  [
    'Northern Virginia Community College - Alexandria',
    'Michelle Pohmer <a href="mailto:test@va.gov">test@va.gov</a>',
    'National Capital Region Benefits Office (372)',
  ],
  [
    'Norfolk State University',
    'Donecia Lawson <a href="mailto:test@va.gov">test@va.gov</a>',
    'Roanoke (314)',
  ],
]

describe('<Table> with valid data', () => {
  test('renders <Table> component with header and rows', () => {
    render(<Table data={tableData} />)
    const vaTableEl = document.querySelector('va-table')
    const vaTableRowEl = document.querySelectorAll('va-table-row')
    expect(vaTableEl).toBeTruthy()
    expect(vaTableRowEl).toHaveLength(4)
  })

  test('renders <Table> component with caption', () => {
    render(<Table data={tableData} title="Table Title" />)
    const vaTableEl = document.querySelector('va-table')
    expect(vaTableEl).toHaveAttribute('table-title')
  })
})

describe('<Table> with inValid data', () => {
  test('does not render <Table> component', () => {
    render(<Table data={[]} />)
    const vaTableEl = document.querySelector('va-table')
    expect(vaTableEl).toBeFalsy()
  })
})
