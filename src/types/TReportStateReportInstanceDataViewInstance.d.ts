import TReportInstance   from "./TReportInstance";
import TDataViewInstance from "./TDataViewInstance";
import { Layout }        from "react-grid-layout";

type TReportStateReportInstanceDataViewInstance = {
    report?: TReport,
    instance?: TReportInstance,
    dataViewInstance?: TDataViewInstance,
    temporaryLayout?: Layout[],
}

export = TReportStateReportInstanceDataViewInstance;