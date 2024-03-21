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