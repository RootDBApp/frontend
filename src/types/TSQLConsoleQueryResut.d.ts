type TSQLConsoleQueryResult = {
    query_index: int,
    draft_query_id: int,
    results: {
        stdout: Array<object>
        stderr: Array<string>
    }
}

export = TSQLConsoleQueryResult;