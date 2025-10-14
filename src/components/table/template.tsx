import React from 'react'
import { isEmpty } from 'lodash'
import {
  VaTable,
  VaTableRow,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings'
import { Table as FormattedTable } from '@/components/table/formatted-type'

export function Table({
  data,
  title = '',
}: Pick<FormattedTable, 'data' | 'title'>) {
  if (isEmpty(data)) return

  return (
    <VaTable table-title={title} table-type="bordered">
      {data.map((tableRow: string[], tableRowIndex) => (
        <VaTableRow
          key={tableRowIndex}
          slot={tableRowIndex === 0 ? 'headers' : ''}
        >
          {tableRow.map((rowItem, rowIndex) => (
            <span
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
