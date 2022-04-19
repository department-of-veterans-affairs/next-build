import { useMemo } from "react";
import {
    useTable,
} from 'react-table';
import { v4 as uuidv4 } from 'uuid';


const Table = ({ columns, data }) => {
    data = useMemo(() => data, [data]);
    columns = useMemo(() => columns, [columns]);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
    } = useTable(
        {
            columns,
            data,
        }
    );
    if (!data) return null;

    return (
        <>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={uuidv4()} >
                            {headerGroup.headers.map(column => (
                                <th  {...column.getHeaderProps()} key={uuidv4()}>
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            <tr  {...row.getRowProps()} key={uuidv4()}>
                                {row.cells.map(cell => {


                                    return (
                                        <td {...cell.getCellProps()} key={uuidv4()}>
                                            {cell.render('Cell')}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <table {...getTableProps()} className="va-table va-table--responsive">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr role='row'  {...headerGroup.getHeaderGroupProps()} key={uuidv4()}>
                            {headerGroup.headers.map(column => (
                                <th role="columnheader" scope="col"  {...column.getHeaderProps()} key={uuidv4()}>
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()} >
                    {rows.map(row => {
                        prepareRow(row)
                        return (
                            <tr className="vads-u-padding-top--5" role="row"  {...row.getRowProps()} key={uuidv4()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td key={uuidv4()} className="column-value" role="cell">
                                            <dfn className="vads-u-display--block">{cell.render('Cell')}</dfn>
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    );
}

export default Table;
