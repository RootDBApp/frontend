import TDataViewTableColumnParameter  from "./TDataViewTableParameter";
import TDataViewTablePagination from "./TDataViewTablePagination";

type TDataViewTableForm = {
    columns: TDataViewTableColumnParameter[],
    global: {
        pagination: TDataViewTablePagination,
        groupBy: boolean,
        expanded: boolean,
        expanded_paginate: boolean,
        adjust_width?: boolean,
    }
}

export = TDataViewTableForm;