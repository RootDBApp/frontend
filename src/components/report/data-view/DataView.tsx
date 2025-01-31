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

import * as React from 'react';

import TReportDataView              from "../../../types/TReportDataView";
import TCallbackResponse            from "../../../types/TCallbackResponse";
import { ECallbackStatus }          from "../../../types/ECallbackStatus";
import { EDataViewType }            from "../../../types/EDataViewType";
import TReportDataViewJs            from "../../../types/TReportDataViewJs";
import * as RTReport                from "../../../contexts/report/ReportContextProvider";
import { updateReportDataViewJs }   from "../../../contexts/report/store/asyncAction";
import TDataViewTableForm           from "../../../types/TDataViewTableForm";
import CenteredLoading              from "../../common/loading/CenteredLoading";
import { context as authContext }   from "../../../contexts/auth/store/context";
import TDataViewInstance            from "../../../types/TDataViewInstance";
import TReport                      from "../../../types/TReport";
import TReportInstance              from "../../../types/TReportInstance";
import DataViewMetric               from "./metric/DataViewMetric";
import TDataViewMetricForm          from "../../../types/TDataViewMetricForm";
import DataViewText                 from "./text/DataViewText";
import TDataViewTextForm            from "../../../types/TDataViewTextForm";
import { notificationEvent }        from "../../../utils/events";
import { EReportDevBarMessageType } from "../../../types/application-event/EReportDevBarMessageType";
import { useTranslation }           from "react-i18next";

const DataViewTable = React.lazy(() => import('./table_V8/DataViewTable'));
const DataViewGraph = React.lazy(() => import('./graph/DataViewGraph'));

const DataView: React.FC<{
    dataView: TReportDataView,
    dataViewInstance: TDataViewInstance,
    expanded: boolean,
    mountParams: boolean,
    report: TReport,
    reportInstance: TReportInstance,
    showView: boolean,
}> = ({
          dataView,
          dataViewInstance,
          mountParams = true,
          report,
          reportInstance,
          expanded,
          showView,
      }): React.ReactElement => {

    const {t} = useTranslation('report');
    const {state: authState} = React.useContext(authContext);

    const reportDispatch = RTReport.useDispatch();

    const [stateJsCodeCallbackResponseQuery, setStateJsCodeCallbackResponseQuery] = React.useState<TCallbackResponse>({status: ECallbackStatus.IDLE})

    // @todo we should not call this when only running view, in embedded mode.
    const updateReportDataViewJsHandler = (dataViewJs: TReportDataViewJs): void => {

        if (authState.isLoggedIn) {

            reportDispatch(
                updateReportDataViewJs({
                    dataViewId: dataView.id,
                    dataViewJs,
                    reportId: report.id,
                    callback: (reportId: number, callbackResponse: TCallbackResponse) => {
                        setStateJsCodeCallbackResponseQuery(callbackResponse);
                        document.dispatchEvent(
                            notificationEvent({
                                message: t('report:dataview.notification_updated_dataview_config'),
                                reportId: reportId,
                                timestamp: Date.now(),
                                title: dataView.name,
                                type: EReportDevBarMessageType.LOG,
                                severity: "info",
                                toast: true,
                            })
                        );
                    }
                })
            )
        }
    }

    const updateReportDataViewJsJsCode = (updateJsCode: string): void => {

        updateReportDataViewJsHandler({...dataView.report_data_view_js, js_code: updateJsCode});
    }

    const updateReportDataViewJsJsonForm = (updateJsonForm: TDataViewTableForm | TDataViewMetricForm | TDataViewTextForm): void => {

        updateReportDataViewJsHandler({
            ...dataView.report_data_view_js,
            json_form: JSON.stringify(updateJsonForm),
        });
    }

    return (
        <React.Suspense fallback={<CenteredLoading/>}>

            {dataView.type === EDataViewType.GRAPH && (
                <DataViewGraph
                    callBackResponse={stateJsCodeCallbackResponseQuery}
                    dataView={dataView}
                    dataViewInstance={dataViewInstance}
                    loading={dataViewInstance.waitingData}
                    mountParams={mountParams}
                    onChangeCallback={(js_code: string) => {

                        updateReportDataViewJsJsCode(js_code);
                    }}
                    results={dataViewInstance?.results}
                    expanded={expanded}
                    showView={showView}
                    report={report}
                    reportInstance={reportInstance}
                />
            )}

            {(dataView.type === EDataViewType.TABLE) && (
                <DataViewTable
                    callBackResponse={stateJsCodeCallbackResponseQuery}
                    dataView={dataView}
                    dataViewInstance={dataViewInstance}
                    loading={dataViewInstance.waitingData}
                    mountParams={mountParams}
                    onChangeCallback={(jsonForm: TDataViewTableForm) => {

                        updateReportDataViewJsJsonForm(jsonForm);
                    }}
                    expanded={expanded}
                    report={report}
                    reportInstance={reportInstance}
                    results={dataViewInstance?.results}
                    showView={showView}

                />
            )}

            {(dataView.type === EDataViewType.METRIC) && (
                <DataViewMetric
                    callBackResponse={stateJsCodeCallbackResponseQuery}
                    dataView={dataView}
                    dataViewInstance={dataViewInstance}
                    loading={dataViewInstance.waitingData}
                    mountParams={mountParams}
                    onChangeCallback={(jsonForm: TDataViewMetricForm) => {

                        updateReportDataViewJsJsonForm(jsonForm);
                    }}
                    expanded={expanded}
                    report={report}
                    reportInstance={reportInstance}
                    results={dataViewInstance?.results}
                    showView={showView}
                />
            )}

            {(dataView.type === EDataViewType.TEXT) && (
                <DataViewText
                    callBackResponse={stateJsCodeCallbackResponseQuery}
                    dataView={dataView}
                    dataViewInstance={dataViewInstance}
                    loading={dataViewInstance.waitingData}
                    mountParams={mountParams}
                    onChangeCallback={(jsonForm: TDataViewTextForm) => {

                        updateReportDataViewJsJsonForm(jsonForm);
                    }}
                    expanded={expanded}
                    report={report}
                    reportInstance={reportInstance}
                    results={dataViewInstance?.results}
                    showView={showView}
                />
            )}
        </React.Suspense>

    );
}

export default DataView;