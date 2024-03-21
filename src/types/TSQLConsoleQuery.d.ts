type TSQLConsoleQuery = {
    draft_query_id: int,
    loading: boolean,
    query_index: int,
    results: {
        stdout: Array<object>
        stderr: Array<string>
        timings: {
            start: number,
            end: number
        }
    }
}

export = TSQLConsoleQuery;