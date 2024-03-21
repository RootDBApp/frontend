type TLaravelPagination = {
    current_page: number,
    from: number,
    last_page: number,
    links: Array<TLaravelPaginationLink>,
    path: string,
    per_page: number,
    to: number,
    total: number,
}

export = TLaravelPagination;
