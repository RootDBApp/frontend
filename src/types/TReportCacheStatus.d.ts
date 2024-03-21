export interface TReportCacheStatus {
    report_id: int,
    has_cache: boolean
    has_job_cache: boolean,
    has_user_cache: boolean,
    num_parameter_sets_cached_by_jobs: int,
    num_parameter_sets_cached_by_users: int,
}