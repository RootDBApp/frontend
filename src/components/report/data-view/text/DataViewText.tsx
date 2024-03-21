import { Message } from "primereact/message";
import * as React  from 'react';


import CenteredError                     from "../../../common/loading/CenteredError";
import { uncompress }                    from "../../../../utils/tools";
import { ICallbackTextJsonFormOnChange } from "../../../../types/ICallBacks";
import TReportDataView                   from "../../../../types/TReportDataView";
import TDataViewInstance                 from "../../../../types/TDataViewInstance";
import TReport                           from "../../../../types/TReport";
import TReportInstance                   from "../../../../types/TReportInstance";
import TCallbackResponse                 from "../../../../types/TCallbackResponse";
import DataViewTextView                  from "./DataViewTextView";
import DataViewTextParamsForm            from "./DataViewTextParamsForm";
import TDataViewTextForm                 from "../../../../types/TDataViewTextForm";

const DataViewText: React.FC<{
    callBackResponse?: TCallbackResponse,
    dataView: TReportDataView,
    dataViewInstance: TDataViewInstance,
    expanded: boolean,
    onChangeCallback: ICallbackTextJsonFormOnChange,
    mountParams: boolean,
    report: TReport,
    reportInstance: TReportInstance
    showView: boolean,
    loading?: boolean, // true when data view is loaded don't have yet results.
    results?: Array<Object>,
}> = ({
          callBackResponse,
          dataView,
          dataViewInstance,
          expanded,
          onChangeCallback,
          mountParams,
          report,
          reportInstance,
          showView,
          loading = false,
          results,
      }): React.ReactElement => {

    const config: TDataViewTextForm | undefined = React.useMemo(() => {
        return dataView.report_data_view_js.json_form_minified
            ? JSON.parse(uncompress(dataView.report_data_view_js.json_form))
            : JSON.parse(dataView.report_data_view_js.json_form)
    }, [dataView.report_data_view_js.json_form, dataView.report_data_view_js.json_form_minified]);

    // React.useEffect(() => {
    //
    //     console.debug('======> [RENDER] DataViewTable');
    // }, []);

    return (
        <>
            <div className={showView ? 'subgrid-area-data-view-view ql-snow' : 'hidden subgrid-area-data-view-view'}>
                {dataViewInstance?.errors && dataViewInstance.errors.length > 0 ? (
                    <CenteredError extraMessage={dataViewInstance.errors.map((error, index) => (
                        <Message
                            key={`data-view-message-error${index}`}
                            className="data-view-message-error"
                            severity="error" text={error}
                        />
                    ))}/>
                ) : (
                    <DataViewTextView
                        report={report}
                        reportInstance={reportInstance}
                        loading={loading}
                        config={config}
                        jsonResults={results}
                        expanded={expanded}
                        dataView={dataView}
                    />
                )}
            </div>
            {mountParams && (
                <div className={`subgrid-area-data-view-params ${!expanded ? 'hidden' : ''}`}>
                    <DataViewTextParamsForm
                        callBackResponse={callBackResponse}
                        config={config}
                        onChangeCallback={onChangeCallback}
                        className="dataview-panel params flex"
                        reportParameters={report.parameters}
                        columns={results && results.length > 0
                            ? Object.entries(results[0]).map(([key, value]: [string, any]) => ({name: key, value}))
                            : undefined
                        }
                    />
                </div>
            )}
        </>
    )
}

export default DataViewText;