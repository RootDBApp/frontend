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

import { Message }        from "primereact/message";
import { Button }         from "primereact/button";
import * as React         from 'react';
import { useTranslation } from "react-i18next";

import DataViewGraphParamsJs          from "./DataViewGraphParamsJs";
import DataViewGraphView              from "./DataViewGraphView";
import TReportDataView                from "../../../../types/TReportDataView";
import { ICallbackSQLEditorOnChange } from "../../../../types/ICallBacks";
import TCallbackResponse              from "../../../../types/TCallbackResponse";
import CenteredError                  from "../../../common/loading/CenteredError";
import SQLConsoleResult               from "../../../sqlconsole/SQLConsoleResult";
import TDataViewInstance              from "../../../../types/TDataViewInstance";
import TReport                        from "../../../../types/TReport";
import TReportInstance                from "../../../../types/TReportInstance";
import AncestorSizeProvider           from "../../../common/size/AncestorSizeProvider";
import { EReportViewMode }            from "../../../../types/EReportViewMode";

enum viewModes {
    GRAPH,
    TABLE,
}

const DataViewGraph: React.FC<{
    callBackResponse: TCallbackResponse,
    dataView: TReportDataView,
    dataViewInstance: TDataViewInstance,
    expanded: boolean,
    mountParams: boolean,
    onChangeCallback: ICallbackSQLEditorOnChange,
    report: TReport,
    reportInstance: TReportInstance,
    showView: boolean,
    loading?: boolean, // true when data view is loaded don't have yet results.
    results?: Array<Object>,
}> = ({
          callBackResponse,
          dataView,
          dataViewInstance,
          expanded,
          mountParams,
          onChangeCallback,
          report,
          reportInstance,
          showView,
          loading = false,
          results,
      }): React.ReactElement => {

    const {t} = useTranslation('report');

    const [viewMode, setViewMode] = React.useState(viewModes.GRAPH);

    // React.useEffect(() => {
    //
    //     console.debug('======> [RENDER] DataViewGraph');
    // }, []);

    return (
        <>
            <div className={showView ? 'subgrid-area-data-view-view' : 'hidden subgrid-area-data-view-view'}>
                {dataViewInstance?.errors && dataViewInstance.errors.length > 0 ? (
                    <CenteredError extraMessage={dataViewInstance.errors.map((error, index) => (
                        <Message
                            key={`data-view-message-error${index}`}
                            className="data-view-message-error"
                            severity="error" text={error}
                        />
                    ))}/>
                ) : (
                    <>
                        {viewMode === viewModes.GRAPH && (
                            <AncestorSizeProvider widthPropName="parentWidth" heightPropName="parentHeight">
                                <DataViewGraphView
                                    dataViewJs={dataView.report_data_view_js}
                                    jsonResults={results}
                                    loading={loading}
                                    maxWidth={dataView.max_width}
                                    report={report}
                                    reportInstance={reportInstance}
                                />
                            </AncestorSizeProvider>
                        )}

                        {expanded && reportInstance.viewMode === EReportViewMode.DEV && (
                            <>
                                {viewMode === viewModes.TABLE && (
                                    <SQLConsoleResult
                                        sqlConsoleQuery={{
                                            draft_query_id: dataView.id,
                                            loading: loading,
                                            query_index: 0,
                                            results: {
                                                stdout: results || [],
                                                stderr: [],
                                                timings: {start: 0, end: 0}
                                            }
                                        }}
                                        adjustWidthToContent={false}
                                    />
                                )}
                                <div className="p-buttonset switch-view">
                                    <Button
                                        className={`${viewMode === viewModes.GRAPH ? 'p-button-primary' : 'p-button-outlined p-button-secondary'}`}
                                        icon="pi pi-chart-bar"
                                        onClick={() => setViewMode(viewModes.GRAPH)}
                                        tooltip={t('report:dataview.preview_graph_view').toString()}
                                        tooltipOptions={{position: 'bottom'}}
                                    />
                                    <Button
                                        className={`${viewMode === viewModes.TABLE ? 'p-button-primary' : 'p-button-outlined p-button-secondary'}`}
                                        icon="pi pi-table"
                                        onClick={() => setViewMode(viewModes.TABLE)}
                                        tooltip={t('report:dataview.preview_table_view').toString()}
                                        tooltipOptions={{position: 'bottom'}}
                                    />
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
            {mountParams && (
                <div className={expanded ? 'subgrid-area-data-view-params' : 'hidden subgrid-area-data-view-params'}>
                    <DataViewGraphParamsJs
                        callBackResponse={callBackResponse}
                        dataView={dataView}
                        onChangeCallback={(js_code: string) => {

                            onChangeCallback(js_code);
                        }}
                        reportId={report.id}
                    />
                </div>
            )}
        </>
    )
}

export default DataViewGraph;