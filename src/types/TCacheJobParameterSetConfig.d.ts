type TCacheJobParameterSetConfig = {
    id: number,
    cache_job_id: number,
    report_parameter_id: number,
    value: string,
    date_start_from_values: TCacheJobParameterSetConfigValues,
    select_values: TCacheJobParameterSetConfigValues,
    multi_select_values: TCacheJobParameterSetConfigValues,
}