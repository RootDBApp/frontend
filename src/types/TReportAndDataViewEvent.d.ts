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