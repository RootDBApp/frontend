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

import Chart                     from "chart.js";

import TReportDataView           from "./TReportDataView";
import TReportDataViewLibVersion from "./TReportDataViewLibVersion";

type TReportDataViewJs = {
    id: number,
    report_data_view_id: number,
    report_data_view_lib_version_id: number,
    json_form: string,
    json_form_minified: boolean,
    js_code: string,
    js_code_minified: boolean,
    chartJs?: Chart,
    created_at?: DateTime,
    js_register?: string,
    js_register_minified?: boolean,
    js_init?: string,
    js_init_minified?: boolean,
    report_data_view?: TReportDataView,
    report_data_view_lib_version?: TReportDataViewLibVersion,
    updated_at?: DateTime,
}

export = TReportDataViewJs;