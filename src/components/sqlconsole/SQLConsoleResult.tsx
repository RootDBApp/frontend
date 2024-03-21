import * as React    from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { filterFns } from "@tanstack/table-core";

import ReactTable       from "../report/data-view/table_V8/ReactTable";
import TSQLConsoleQuery from "../../types/TSQLConsoleQuery";
import { renameKeys }   from "../../utils/tableView";

const SQLConsoleResult: React.FC<{
    sqlConsoleQuery: TSQLConsoleQuery,
    adjustWidthToContent?: boolean
}> = (
    {
        sqlConsoleQuery,
        adjustWidthToContent = true
    }): React.ReactElement => {

    const columns = React.useMemo((): ColumnDef<any>[] => {

        if (sqlConsoleQuery.results.stdout?.length > 0) {

            const resultColumns = Object.entries(sqlConsoleQuery.results.stdout[0]);

            return resultColumns.map(([column]) => {

                return {
                    header: column,
                    accessorKey: column.replace('.', ''),
                    filterFn: filterFns.includesString,
                }
            });
        }
        return [];
    }, [sqlConsoleQuery]);

    const data = React.useMemo((): any => {

        return renameKeys(
            sqlConsoleQuery.results.stdout,
            (key: string) => key.includes('.') ? key.replace('.', '') : key,
        )
    }, [sqlConsoleQuery.results.stdout])

    return (
        <ReactTable
            loading={sqlConsoleQuery.loading}
            columns={columns}
            data={data}
            pagination={{
                active: sqlConsoleQuery.results.stdout.length > 20,
                rowsPerPage: 20,
                position: ['top']
            }}
            groupByConfig={{
                groupBy: false,
                expanded_paginate: false,
                expanded: false,
                columns: [],
            }}
            adjustWidthToContent={adjustWidthToContent}
            stickyHeader
            stickyFooter
            timing={(sqlConsoleQuery.results.timings.end - sqlConsoleQuery.results.timings.start) / 1000}
        />
    );
}

export default SQLConsoleResult;