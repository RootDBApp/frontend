import TReportParameter from "./TReportParameter";

export type TReportParameterSets = {
    from_cache_job: boolean,
    cache_job_id: number,
    cached_at: Date,
    report_parameters: Array<TReportParameter>
}

export = TReportParameterSets;