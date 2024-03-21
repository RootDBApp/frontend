/*
 * This file is part of RootDB.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * AUTHORS
 * PORQUET Sébastien <sebastien.porquet@ijaz.fr>
 * ROBIN Brice <brice@robri.net>
 */

import * as React         from 'react';
import { useTranslation } from "react-i18next";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFacetedMinMaxValues,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getGroupedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    GroupingState, Row,
    SortingState,
    useReactTable
}                         from "@tanstack/react-table";

import TDataViewTablePagination  from "../../../../types/TDataViewTablePagination";
import TDataViewTableForm        from "../../../../types/TDataViewTableForm";
import CenteredNoData            from "../../../common/loading/CenteredNoData";
import ReactTableV8Filter        from "./filters/ReactTableV8Filter";
import CustomPaginator           from "../../../common/CustomPaginator";
import {
    average,
    customSum,
    customArrIncludesSome,
    customIncludesString
}                                from "../../../../utils/tableView";
import CenteredLoading           from "../../../common/loading/CenteredLoading";
import { useVirtual }            from "react-virtual";
import { getElementContentSize } from "../../../../utils/htmlElement";


const ReactTable: React.FC<{
    columns: ColumnDef<any>[],
    data: any[],
    groupByConfig: {
        groupBy: TDataViewTableForm['global']['groupBy'],
        expanded: TDataViewTableForm['global']['expanded'],
        expanded_paginate: TDataViewTableForm['global']['expanded_paginate'],
        columns: string[]
    },
    pagination: TDataViewTablePagination,
    adjustWidthToContent?: boolean,
    loading?: boolean,
    loadingComponent?: React.ReactElement,
    stickyHeader?: boolean,
    stickyFooter?: boolean,
    timing?: number,
    parentHeight?: number,
}> = ({
          columns,
          data,
          groupByConfig,
          pagination,
          adjustWidthToContent = false,
          loading = false,
          loadingComponent = <CenteredLoading/>,
          stickyHeader = false,
          stickyFooter = false,
          timing,
          parentHeight,
      }) => {

    const {t} = useTranslation();

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [grouping, setGrouping] = React.useState<GroupingState>(groupByConfig.columns || [])
    const [displayExpandAllColumn, setDisplayExpandAllColumn] = React.useState(false)
    const [tableHeight, setTableHeight] = React.useState<number | undefined>()

    const tableContainerRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (tableContainerRef.current) {
            const gridItem = tableContainerRef.current?.closest('.react-grid-item')
            const editorSize = getElementContentSize(gridItem?.querySelector('.custom-editor'))
            let cardContentSize;
            if (editorSize) {
                cardContentSize = getElementContentSize(gridItem?.querySelector('.p-card-content'))
            }
            setTableHeight((parentHeight || 0) - (editorSize?.height || 0) - (cardContentSize?.marginY || 0))
        }
    }, [tableContainerRef, parentHeight]);

    const table = useReactTable({
        data,
        columns,
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: pagination.active ? pagination.rowsPerPage : data.length,
            }
        },
        state: {
            columnFilters,
            grouping,
            sorting,
        },
        aggregationFns: {
            customSum,
            average,
        },
        filterFns: {
            customArrIncludesSome,
            customIncludesString,
        },
        paginateExpandedRows: groupByConfig.expanded_paginate,
        onColumnFiltersChange: setColumnFilters,
        onGroupingChange: setGrouping,
        onSortingChange: setSorting,
        // Pipeline
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })


    const {rows} = table.getRowModel()
    const rowVirtualizer = useVirtual({
        parentRef: tableContainerRef,
        size: rows.length,
        overscan: 10,
    })

    const {virtualItems: virtualRows, totalSize} = rowVirtualizer

    const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
    const paddingBottom =
        virtualRows.length > 0
            ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
            : 0

    //
    //
    React.useEffect(() => {

        // table.setPageIndex(0)
        table.setPageSize(pagination.active ? pagination.rowsPerPage : data.length)
    }, [table, pagination, data])

    React.useEffect(() => {

        setGrouping(groupByConfig.columns || []);
    }, [groupByConfig.columns])

    // Display or not an extra column to expand all rows
    //
    React.useEffect(() => {

        const atLeastOneColumnIsGrouped = table.getHeaderGroups().some(
            headerGroup => headerGroup.headers.some(h => h.column.getIsGrouped())
        );

        setDisplayExpandAllColumn(atLeastOneColumnIsGrouped);

        if (!atLeastOneColumnIsGrouped) {

            table.toggleAllRowsExpanded(false);
        }
    }, [table])

    // Expanded or not all rows if the config changes
    //
    React.useEffect(() => {

        table.toggleAllRowsExpanded(groupByConfig.expanded);
    }, [table, groupByConfig.expanded])

    // TODO : move pagination out of the table.
    // TODO : calculate the table height : parentHeight - paginators

    return (
        <>
            {data.length === 0 ? (
                loading ?
                    <>{loadingComponent}</>
                    : <CenteredNoData/>
            ) : (
                <div
                    ref={tableContainerRef}
                    className={`p-datatable p-datatable-sm ${adjustWidthToContent ? 'fit-content' : ''} ${stickyHeader ? 'sticky-header' : ''} ${stickyFooter ? 'sticky-footer' : ''}`}
                    style={{maxHeight: `${tableHeight || 1000}px`}}
                >
                    <table className={adjustWidthToContent ? 'fit-content' : undefined}>
                        <thead className="p-datatable-thead">
                        {pagination.active && pagination.position.includes('top') && (
                            <tr>
                                <th className="th-paginator"
                                    colSpan={table.getVisibleFlatColumns().length + (displayExpandAllColumn ? 1 : 0)}>
                                    <CustomPaginator
                                        style={{border: 'none'}}
                                        pageLinkSize={5}
                                        first={table.getState().pagination.pageIndex * table.getState().pagination.pageSize}
                                        rows={table.getState().pagination.pageSize}
                                        totalRecords={table.getPrePaginationRowModel().rows.length}
                                        rowsPerPageOptions={[10, 20, 50, 100, 200]}
                                        onPageChange={(event) => {
                                            //console.debug('paginator index', event)
                                            table.setPageIndex(event.page);
                                            table.setPageSize(event.rows);
                                        }}
                                    />
                                </th>
                            </tr>
                        )}
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {displayExpandAllColumn && (
                                    <th
                                        key={`column_header_expand_all`}
                                        style={{width: "30px", paddingRight: 0}}
                                    >
                                        <div className="flex justify-content-start align-items-center">
                                            <i
                                                title={
                                                    table.getIsAllRowsExpanded()
                                                        ? t('report:dataview.table_form.collapse_all_rows').toString()
                                                        : t('report:dataview.table_form.expand_all_rows').toString()
                                                }
                                                className={`mr-2 cursor-pointer ${table.getIsAllRowsExpanded() ? 'pi pi-angle-down' : 'pi pi-angle-right'}`}
                                                onClick={() => table.toggleAllRowsExpanded()}
                                            />
                                        </div>
                                    </th>
                                )}
                                {headerGroup.headers.map(header => {
                                    return (
                                        <th key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className="flex justify-content-between align-items-center">
                                                    <div
                                                        className="flex justify-content-start align-items-center">
                                                        {groupByConfig.groupBy && header.column.getCanGroup() ? (
                                                            // If the column can be grouped, let's add a toggle
                                                            <i
                                                                {...{
                                                                    onClick: header.column.getToggleGroupingHandler(),
                                                                    style: {
                                                                        cursor: 'pointer',
                                                                    },
                                                                }}
                                                                title={
                                                                    header.column.getIsGrouped()
                                                                        ? t('report:dataview.table_form.un_group_by_column').toString()
                                                                        : t('report:dataview.table_form.group_by_column').toString()
                                                                }
                                                                className={`mr-2 ${header.column.getIsGrouped() ? 'pi pi-circle-on' : 'pi pi-circle-off'}`}
                                                            />
                                                        ) : null}
                                                        <div
                                                            {...{
                                                                className: header.column.getCanSort()
                                                                    ? 'cursor-pointer select-none'
                                                                    : '',
                                                                onClick: header.column.getToggleSortingHandler(),
                                                            }}
                                                        >
                                                            {flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                            <span>
                                                                            {{
                                                                                asc: <i
                                                                                    className="pi pi-sort-amount-up ml-1"/>,
                                                                                desc: <i
                                                                                    className="pi pi-sort-amount-down ml-1"/>,
                                                                            }[header.column.getIsSorted() as string] ?? null}
                                                                        </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {header.column.getCanFilter() && (
                                                            <ReactTableV8Filter column={header.column}/>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                        </thead>
                        <tbody className="p-datatable-tbody">
                        {paddingTop > 0 && (
                            <tr>
                                <td style={{height: `${paddingTop}px`}}/>
                            </tr>
                        )}
                        {virtualRows.map(virtualRow => {
                            const row = rows[virtualRow.index] as Row<any>;
                            return (
                                <tr key={row.id}>
                                    {displayExpandAllColumn && (
                                        <td key={`column_expand_all_placeholder_body`}/>
                                    )}
                                    {row.getVisibleCells().map(cell => {
                                        return (
                                            <td key={cell.id}>
                                                {cell.getIsGrouped() ? (
                                                    // If it's a grouped cell, add an expander and row count
                                                    <>
                                                        <i
                                                            {...{
                                                                onClick: row.getToggleExpandedHandler(),
                                                                style: {
                                                                    cursor: row.getCanExpand()
                                                                        ? 'pointer'
                                                                        : 'normal',
                                                                },
                                                            }}
                                                            title={
                                                                row.getIsExpanded()
                                                                    ? t('report:dataview.table_form.group_by_collapse_row').toString()
                                                                    : t('report:dataview.table_form.group_by_expand_row').toString()
                                                            }
                                                            className={row.getIsExpanded() ? 'pi pi-angle-down' : 'pi pi-angle-right'}
                                                        />
                                                        {' '}
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </>
                                                ) : cell.getIsAggregated() ? (
                                                    // If the cell is aggregated, use the Aggregated
                                                    // renderer for cell
                                                    flexRender(
                                                        cell.column.columnDef.aggregatedCell ??
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )
                                                ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                                                    // Otherwise, just render the regular cell
                                                    flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                        {paddingBottom > 0 && (
                            <tr>
                                <td style={{height: `${paddingBottom}px`}}/>
                            </tr>
                        )}
                        </tbody>
                        <tfoot className="p-datatable-tfoot">
                        {table.getVisibleFlatColumns().some(c => !!c.columnDef.aggregationFn) && table.getFooterGroups().map(footerGroup => (
                            <tr key={footerGroup.id}>
                                {displayExpandAllColumn && (
                                    <td key={`column_expand_all_placeholder_footer`}/>
                                )}
                                {footerGroup.headers.map(footer => (
                                    <td key={footer.id}>
                                        {flexRender(
                                            footer.column.columnDef.footer,
                                            footer.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {!!timing && (
                            <tr>
                                <td colSpan={table.getVisibleFlatColumns().length}>
                                    <div className="w-100 flex align-items-center justify-content-between">
                                        <span># {table.getCoreRowModel().rows.length} {t('common:row', {count: table.getCoreRowModel().rows.length})}&nbsp;</span>
                                        <span>[ {timing}s ]</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {pagination.active && pagination.position.includes('bottom') && (
                            <tr>
                                <th className="th-paginator"
                                    colSpan={table.getVisibleFlatColumns().length + (displayExpandAllColumn ? 1 : 0)}>
                                    <CustomPaginator
                                        style={{border: 'none'}}
                                        pageLinkSize={5}
                                        first={table.getState().pagination.pageIndex * table.getState().pagination.pageSize}
                                        rows={table.getState().pagination.pageSize}
                                        totalRecords={table.getPrePaginationRowModel().rows.length}
                                        rowsPerPageOptions={[10, 20, 50, 100, 200]}
                                        onPageChange={(event) => {
                                            //console.debug('paginator index', event)
                                            table.setPageIndex(event.page);
                                            table.setPageSize(event.rows);
                                        }}
                                    />
                                </th>
                            </tr>
                        )}
                        </tfoot>
                    </table>

                </div>
            )}
        </>
    );
};
export default ReactTable;