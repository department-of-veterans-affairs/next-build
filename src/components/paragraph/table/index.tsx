import { v4 as uuidv4 } from 'uuid'
import { useMemo } from 'react'
import Table from '@department-of-veterans-affairs/component-library/Table'

interface TableProps {
  data: object[]
}
interface RowProps {
  school: string
  email: string
  location: string
}

const prepareRow = (row): RowProps => {
  const [school, email, location] = row.map((item) => {
    return (
      <div
        key={uuidv4()}
        className="vads-u-margin-bottom--0"
        dangerouslySetInnerHTML={{ __html: item }}
      />
    )
  })
  return {
    school,
    email,
    location,
  }
}

const TableComponent = ({ data }: TableProps) => {
  data = useMemo(() => data, [data])
  return (
    <>
      <Table
        fields={[
          {
            label: 'School',
            value: 'school',
          },
          {
            label: 'Email',
            value: 'email',
          },
          {
            label: 'Location',
            value: 'location',
          },
        ]}
        data={data.map((table) => {
          return prepareRow(table)
        })}
      />
    </>
  )
}

export default TableComponent
