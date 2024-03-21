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