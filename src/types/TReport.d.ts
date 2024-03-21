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

import TUser              from "./TUser";
import TConnectorDatabase from "./TConnectorDatabase";
import TOrganization      from "./TOrganization";
import TReportDataView    from "./TReportDataView";
import TCategory          from "./TCategory";
import TDirectory         from "./TDirectory";
import TReportGroup       from "./TReportGroup";
import TReportUser        from "./TReportUser";
import TReportParameter   from "./TReportParameter";

type TReport = {
    category_id: number,
    conf_connector_id: number,
    directory_id: number,
    has_cache: boolean,
    has_job_cache: boolean,
    has_user_cache: boolean,
    has_data_views: boolean,
    has_parameters: boolean,
    is_visible: boolean,
    on_queue: boolean,
    id: number,
    name: string,
    num_parameter_sets_cached_by_jobs: int,
    num_parameter_sets_cached_by_users: int,
    organization_id: number,
    public_access: boolean,
    public_authorized_referers: Array<string>,
    allowed_groups?: Array<TReportGroup>,
    allowed_users?: Array<TReportUser>,
    category?: TCategory,
    conf_connector?: TConnectorDatabase,
    description?: string,
    description_listing?: string,
    created_at?: Date,
    dataViews?: Array<TReportDataView>,
    directory?: TDirectory,
    favorite?: boolean,
    organization?: TOrganization,
    parameters?: Array<TReportParameter>,
    public_security_hash?: string,
    query_cleanup?: string,
    query_init?: string,
    reportParameterInputValues?: Array<TFormValues>,
    title?: string,
    updated_at?: Date,
    user?: TUser,
    user_id?: number,
    // For a report instance only.
    // <front_url>/report/<id>_<instance_id>?run
    instance_id?: number, // id + '_' + Date.now();
    // For LisBoxItem
    label?: string,
    value?: number,
    // For ReportForm
    group_ids?: Array<number>,
    user_ids?: Array<number>
};

export = TReport;