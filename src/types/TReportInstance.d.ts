import { TNameValue }      from "./TNameValue";
import { EReportViewMode } from "./EReportViewMode";
import { EReportPanels }   from "./EReportPanels";
import TDataViewInstance   from "./TDataViewInstance";

type TReportInstance = {
    error: boolean,
    dataViewInstances: Array<TDataViewInstance>,
    hashParameters: string, //hash of reportParameterInputValues
    id: number // reportId + uniq ID
    isLoading: boolean,
    panels: EReportPanels,
    reportParameterInputValues: Array<TNameValue>,
    reportParameterInputValuesInitialized: boolean,
    results_from_cache: boolean,
    results_cache_type: string,
    results_cached_at: Date,
    showDataViewAdd: boolean,
    useCache: boolean,
    viewMode: EReportViewMode,
    expandedDataViewId?: number,
    showDataViewParams?: number
}

export = TReportInstance;
