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
    created_at?: DateTime,
    updated_at?: DateTime,
    js_register?: string,
    js_register_minified?: boolean,
    js_init?: string,
    js_init_minified?: boolean,
    report_data_view?: TReportDataView
    report_data_view_lib_version?: TReportDataViewLibVersion
}

export = TReportDataViewJs;