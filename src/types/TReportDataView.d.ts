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

import { EDataViewType }                   from "./EDataViewType";
import TReportDataViewJs                   from "./TReportDataViewJs";
import TReportDataViewLibVersion           from "./TReportDataViewLibVersion";
import TReportDataViewRunTimeConfiguration from "./TReportDataViewRuntimeConfiguration";

type TReportDataView = {
    id: number,
    by_chunk: boolean,
    chunk_size: number,
    description_display_type?: number,
    is_visible: boolean,
    json_runtime_configuration?: TReportDataViewRunTimeConfiguration,
    json_runtime_configuration_minified?: boolean,
    on_queue: boolean,
    max_width: number | undefined,
    name: string,
    position: string,
    query: string,
    report_data_view_lib_version_id: number,
    report_data_view_js: TReportDataViewJs,
    report_data_view_js_id: number,
    type: EDataViewType,
    created_at?: Date,
    description?: string,
    report_data_view_lib_type_id?: number,
    report_data_view_lib_version?: TReportDataViewLibVersion,
    title?: string,
    updated_at?: Date | null,
}

export = TReportDataView;
