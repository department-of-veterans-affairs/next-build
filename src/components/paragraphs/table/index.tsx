import Link from 'next/link'
import { useMemo } from 'react'

import { useTable } from 'react-table'
import { v4 as uuidv4 } from 'uuid'
import Table from '@department-of-veterans-affairs/component-library/Table'

const prepareRow = (row) => {
    const [school, email, location] = row.map((item) => {
        if (Array.isArray(item)) {
            return item.filter((i) => i)
        }
        return item
    })
    return {
        school,
        email,
        location,
    }
}

const TableComponent = ({ data }) => {
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
                data={data.map((table) => prepareRow(table))}
            />
        </>
    )
}

export default TableComponent
