
export const buildColumns = (rows) => {
    const columns = Object.keys(rows[0]).map((key) => {
        for (const row of rows) {
            return {
                Header: row[key],
                accessor: key,
                Cell: ({ cell }) => {
                    return (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: cell.value,
                            }}
                        />
                    );
                },
            }
        }
    })
    return columns
}