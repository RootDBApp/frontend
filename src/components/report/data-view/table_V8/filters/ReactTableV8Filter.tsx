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

import * as React          from 'react';
import { Column }          from "@tanstack/react-table";
import StringFilterV8      from "./StringFilter";
import SelectColumnFilter  from "./SelectColumnFilter";
import MinMaxFilter        from "./MinMaxFilter";
import ColumnOverlayFilter from "../../table_V8/filters/ColunmOverlayFilter";

const ReactTableV8Filter = ({column}: { column: Column<any, unknown> }): React.ReactElement => {

    let filterComponent = <StringFilterV8 column={column} activeFilter={column.getIsFiltered()}/>;
    switch (column.columnDef.filterFn) {

        case 'equals':
            filterComponent = <SelectColumnFilter column={column} multiple={false} activeFilter={column.getIsFiltered()}/>
            break;
        // @ts-ignore
        case 'customArrIncludesSome':
            filterComponent = <SelectColumnFilter column={column} multiple activeFilter={column.getIsFiltered()}/>
            break;

        case 'inNumberRange':
            filterComponent = (
                <MinMaxFilter
                    columnId={column.id}
                    activeFilter={column.getIsFiltered()}
                    minMaxDefault={column.getFacetedMinMaxValues()}
                    minMaxFilter={column.getFilterValue() as [number, number] | undefined}
                    setFilter={column.setFilterValue}
                />
            );
            break;
    }

    return (
        // eslint-disable-next-line react/jsx-no-undef
        <ColumnOverlayFilter
            overlayId={'filter_overlay_' + column.id}
            activeFilter={column.getIsFiltered()}
        >
            {filterComponent}
        </ColumnOverlayFilter>
    )
}

export default ReactTableV8Filter;