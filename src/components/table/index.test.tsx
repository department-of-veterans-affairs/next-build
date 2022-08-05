import { render, screen } from '@testing-library/react'
import { Table } from './index'

const tableData = [
  [
    '<strong>School name</strong>',
    '<strong>VSOC counselor email address</strong>',
    '<strong>Regional office</strong>',
  ],
  [
    'George Mason University',
    'Valerie Smith <a href="mailto:Valerie.Smith11@va.gov">Valerie.Smith11@va.gov</a>',
    'National Capital Region Benefits Office (372)',
  ],
  [
    'Northern Virginia Community College - Alexandria',
    'Michelle Pohmer <a href="mailto:Michelle.Pohmer@va.gov">Michelle.Pohmer@va.gov</a>',
    'National Capital Region Benefits Office (372)',
  ],
  [
    'Norfolk State University',
    'Donecia Lawson <a href="mailto:Donecia.Lawson@va.gov">Donecia.Lawson@va.gov</a>',
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
})

describe('<Table> with inValid data', () => {
  test('does not render <Table> component', () => {
    render(<Table data={[]} />)
    const vaTableEl = document.querySelector('va-table')
    expect(vaTableEl).toBeFalsy()
    screen.debug()
  })
})
