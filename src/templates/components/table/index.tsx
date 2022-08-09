import React from 'react'
import { isEmpty } from 'lodash'
import {
  VaTable,
  VaTableRow,
} from '@department-of-veterans-affairs/web-components/react-bindings'

interface TableProps {
  data: object[]
}

export function Table({ data }: TableProps) {
  if (isEmpty(data)) return

  return (
    <VaTable table-title="">
      {data.map((tableRow: [], tableRowIndex) => (
        <VaTableRow
          key={tableRowIndex}
          slot={tableRowIndex === 0 ? 'headers' : ''}
        >
          {tableRow.map((rowItem, rowIndex) => (
            <div
              key={rowIndex}
              dangerouslySetInnerHTML={{
                __html: rowItem,
              }}
            />
          ))}
        </VaTableRow>
      ))}
    </VaTable>
  )
}
