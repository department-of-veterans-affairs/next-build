import React from 'react'
import { isEmpty } from 'lodash'
import {
  VaTable,
  VaTableRow,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { Table as FormattedTable } from '@/types/formatted/table'

export function Table({
  data,
  title = '',
}: Pick<FormattedTable, 'data' | 'title'>) {
  if (isEmpty(data)) return

  return (
    <VaTable
      data-next-component="templates/components/table"
      table-title={title}
    >
      {data.map((tableRow: string[], tableRowIndex) => (
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
