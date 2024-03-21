import { EDataViewType }         from "./EDataViewType";
import TReportDataViewLibVersion from "./TReportDataViewLibVersion";

type TReportDataViewLib = {
    id: number,
    type: EDataViewType,
    name: string,
    url_website: string,
    default: boolean,
    report_data_view_lib_versions: Array<TReportDataViewLibVersion>
}

export = TReportDataViewLib;