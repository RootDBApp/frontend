type TPosition = 'top' | 'bottom';
type TDataViewTablePagination = {
    active: boolean,
    rowsPerPage: number,
    position: [TPosition?],
}

export = TDataViewTablePagination;