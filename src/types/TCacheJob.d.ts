/*
 * This file is part of RootDB.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * AUTHORS
 * PORQUET Sébastien <sebastien.porquet@ijaz.fr>
 * ROBIN Brice <brice@robri.net>
 */

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