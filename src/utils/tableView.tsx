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

import * as React from "react";

import TDataViewTableColumnParameter from "../types/TDataViewTableColumnParameter";
import { ETableFilterType }          from "../types/ETableFilterType";
import { ETableAggregateType }       from "../types/ETableAggregateType";
import TDataViewTablePagination      from "../types/TDataViewTablePagination";
import { BuiltInFilterFn }           from "@tanstack/table-core";
import TDataViewTableColumnV8        from "../types/TDataViewTableColumnV8";
import { Column, FilterFns, Table }  from "@tanstack/react-table";
import { AggregationFn }             from "@tanstack/table-core/src/features/Grouping";
import { FilterFn }                  from "@tanstack/table-core/src/features/Filters";
import round                         from "lodash.round";

export const footerDefaultText = {
    [ETableAggregateType.SUM]: '∑ [PLACEHOLDER]',
    [ETableAggregateType.AVERAGE]: 'avg [PLACEHOLDER]',
    [ETableAggregateType.COUNT]: '# [PLACEHOLDER]',
    [ETableAggregateType.UNIQUE_COUNT]: 'u# [PLACEHOLDER]',
    [ETableAggregateType.NONE]: '',
}

export const paginationInitialState: TDataViewTablePagination = {
    active: true,
    rowsPerPage: 10,
    position: ['bottom']
};

export const filterJsonColumnsFormBeforeSave = (columnParameters: Array<TDataViewTableColumnParameter>): Array<TDataViewTableColumnParameter> => {
    return columnParameters.filter(c => !c.new && !!c.column);
}

export const getColumnFilterFunctionV8 = (filterType?: ETableFilterType): FilterFns | undefined => {

    let filterFunction;

    switch (filterType) {

        case ETableFilterType.TEXT:
            filterFunction = 'customIncludesString'
            break;

        case ETableFilterType.RESULT:
            filterFunction = 'equals' as BuiltInFilterFn
            break;

        case ETableFilterType.MULTI_RESULT:
            filterFunction = 'customArrIncludesSome'
            // filterFunction = 'arrIncludesSome' as BuiltInFilterFn
            break;

        case ETableFilterType.MINMAX:
            filterFunction = 'inNumberRange' as BuiltInFilterFn
            break;
    }

    return filterFunction;
}

export const getAggregationFnV8 = (footerMethod: ETableAggregateType): string | undefined => {
    switch (footerMethod) {
        case ETableAggregateType.SUM:
            return 'customSum';
        case ETableAggregateType.AVERAGE:
            return 'average';
        case ETableAggregateType.COUNT:
            return 'count';
        case ETableAggregateType.UNIQUE_COUNT:
            return 'uniqueCount';
        default:
            return undefined;
    }
}

export const columnsV8FormToJS = (columnParameters: Array<TDataViewTableColumnParameter>): TDataViewTableColumnV8[] => {

    return filterJsonColumnsFormBeforeSave(columnParameters)
        .filter(c => !c.hidden)
        .map((column) => {

            return {
                header: column.header,
                accessorKey: column.column,
                enableColumnFilter: column.filter !== undefined && column.filter !== ETableFilterType.NONE,
                filterFn: getColumnFilterFunctionV8(column.filter),
                footerMethod: column.footerMethod,
                footerText: column.footerText,
                footerRounding: column.footerRounding,
                groupBy: column.groupBy,
                reportLinks: column.reportLinks,
                externalLinks: column.externalLinks,
                collapsible: column.collapsible,
                asImage: column.asImage,
                asImageThumbnailWidth: column.asImageThumbnailWidth,
                asImageThumbnailHeight: column.asImageThumbnailHeight,
                asImageFullSize: column.asImageFullSize,
            } as TDataViewTableColumnV8
        });
}

export const replacePlaceholder = (text: string, result: number | string) => {

    return text.replaceAll('[PLACEHOLDER]', String(result));
}

export const getColumnFooterV8 = (footerMethod: ETableAggregateType, footerText: string, footerRounding = 2): Function => {

    switch (footerMethod) {

        case ETableAggregateType.SUM:
            return (table: Table<any>, column: Column<any>) => {

                const rows = table.getFilteredRowModel().rows;
                // Only calculate total visits if rows change
                const total = React.useMemo(
                    () => rows.reduce((sum, row) => {

                        return Number(row.getValue(column.id)) + sum
                    }, 0),
                    [rows, column]
                );

                return replacePlaceholder(footerText, round(total, footerRounding).toFixed(footerRounding));
            };

        case ETableAggregateType.COUNT:
            return (table: Table<any>, column: Column<any>) => {
                const rows = table.getFilteredRowModel().rows;

                return replacePlaceholder(footerText, rows.length);
            };

        case ETableAggregateType.UNIQUE_COUNT:
            return (table: Table<any>, column: Column<any>) => {
                const rows = table.getFilteredRowModel().rows;

                const uniqueValues = rows.reduce((count: Set<any>, row): Set<any> => {
                    count.add(row.getValue(column.id));
                    return count;
                }, new Set());

                const total = [...uniqueValues.values()].length;

                return replacePlaceholder(footerText, total);
            };

        case ETableAggregateType.AVERAGE:
            return (table: Table<any>, column: Column<any>) => {
                const rows = table.getFilteredRowModel().rows;
                // Only calculate total visits if rows change
                const total = React.useMemo(
                    () => rows.reduce((sum, row) => Number(row.getValue(column.id)) + sum, 0) / rows.length,
                    [rows, column]
                );

                return replacePlaceholder(footerText, round(total, footerRounding).toFixed(footerRounding));
            };

        default:
            return () => footerText ?? '';
    }
}

export const customSum: AggregationFn<any> = (columnId, _leafRows, childRows) => {
    // It's faster to just add the aggregations together instead of
    // process leaf nodes individually
    return childRows.reduce((sum, next) => {
        const nextValue = Number(next.getValue(columnId))
        return sum + nextValue
    }, 0)
};

export const average: AggregationFn<any> = (columnId, _leafRows, childRows) => {
    const count = childRows.length;
    const sum = childRows.reduce((sum, next) => {
        const nextValue = Number(next.getValue(columnId))
        return sum + nextValue
    }, 0);

    return count > 0 ? sum / count : undefined;
}

// Built-in functions assume the type of the value
// if we receive numbers, functions based in string values break
export const customArrIncludesSome: FilterFn<any> = (
    row,
    columnId: string,
    filterValue: any
) => {
    return filterValue.some((filter: any) => {
            const value = row.getValue<any>(columnId);
            return String(value) === String(filter);
        }
    )
}

export const customIncludesString: FilterFn<any> = (
    row,
    columnId: string,
    filterValue: string
) => {
    const search = filterValue.toLowerCase();
    const value = row.getValue<any>(columnId)
    return Boolean(String(value).toLowerCase().includes(search))
}

export function renameKeysAndHandleBooleanValue(
    data: Object[] | undefined,
    fn: (key: string) => string,
    databaseTypeId?: number | undefined
) {

    if (typeof fn !== 'function') {

        return data;
    }

    return data?.map(row => {

        const keys = Object.keys(row);
        const result: { [key: string]: any } = {};

        for (let i = 0; i < keys.length; i++) {

            let key = keys[i];
            // @ts-ignore
            let val = row[key];
            const str = fn(key);

            if (str && str !== '') {
                key = str;
            }

            // Display string for real boolean value from database results.
            if (databaseTypeId && (val === true || val === false)) {

                // cli Postgres returns : f / t
                if (databaseTypeId === 2) {

                    val = val ? 't' : 'f';
                } else {

                    val = val ? 'true' : 'false';
                }
            }

            result[key] = val;
        }

        return result;
    })
}