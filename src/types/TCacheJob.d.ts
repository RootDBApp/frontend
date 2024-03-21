import { ECacheJobFrequency } from "./ECacheJobFrequency";
import { EWeekDay }           from "./EWeekDay";

type TCacheJob = {
    id: number,
    report_id: number,
    frequency: ECacheJobFrequency,
    at_minute: number | null,
    at_time: Date | null,
    at_weekday: EWeekDay | null,
    at_day: number | null,
    ttl: number,
    last_run: Date | null,
    last_run_duration: number,
    last_num_parameter_sets: number,
    last_cache_size: string,
    activated: boolean,
    running: boolean,
    cache_job_parameter_set_configs: Array<TCacheJobParameterSetConfig>
}