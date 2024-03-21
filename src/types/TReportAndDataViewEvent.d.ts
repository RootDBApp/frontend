type TReportAndDataViewEvent = {
    report_id: number,
    instance_id: number,
    hash_parameters: string,
    report_name: string,
    data_view_id: number
    data_view_name: string,
    errors: Array<string>,
    results: Array<object>,
    results_from_cache: boolean,
    results_cache_type: string,
    results_cached_at: Date,
    ms_elapsed: number,
}

export = TReportAndDataViewEvent;