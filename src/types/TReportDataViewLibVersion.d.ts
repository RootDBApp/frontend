import { TReportDataViewLib } from "./TReportDataViewLib";

type TReportDataViewLibVersion = {
    id: number,
    report_data_view_lib_id: number,
    major_version: string,
    version: string,
    url_documentation: string,
    default: boolean,
    report_data_view_lib: TReportDataViewLib
}

export = TReportDataViewLibVersion;