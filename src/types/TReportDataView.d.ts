import { EDataViewType }         from "./EDataViewType";
import TReportDataViewJs         from "./TReportDataViewJs";
import TReportDataViewLibVersion from "./TReportDataViewLibVersion";

type TReportDataView = {
    id: number,
    by_chunk: boolean,
    chunk_size: number,
    created_at?: Date,
    description?: string,
    description_display_type?: number,
    is_visible: boolean,
    on_queue: boolean,
    max_width: number | undefined,
    name: string,
    position: string,
    query: string,
    report_data_view_lib_type_id?: number,
    report_data_view_lib_version?: TReportDataViewLibVersion,
    report_data_view_lib_version_id: number,
    report_data_view_js: TReportDataViewJs,
    report_data_view_js_id: number,
    title?: string,
    type: EDataViewType,
    updated_at?: Date | null,
}

export = TReportDataView;
