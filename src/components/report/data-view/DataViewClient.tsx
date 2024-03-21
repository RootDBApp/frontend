import { Card }        from 'primereact/card';
import * as React      from 'react';
import { useNavigate } from "react-router-dom";

import TReportDataView                   from "../../../types/TReportDataView";
import DataView                          from "./DataView";
import DataViewOptionsOverlay            from "./DataViewOptionsOverlay";
import { upEventResizeAceEditor }        from "../../../utils/events";
import { replaceParametersPlaceholders } from "../../../utils/parameterPlaceholder";
import { TNameValue }                    from "../../../types/TNameValue";
import TReportParameter                  from "../../../types/TReportParameter";
import { nameValuesToString }            from "../../../utils/tools";
import { EDataViewType }                 from "../../../types/EDataViewType";
import { context as authContext }        from "../../../contexts/auth/store/context";
import TopRightLoading                   from "../../common/loading/TopRightLoading";
import TDataViewInstance                 from "../../../types/TDataViewInstance";
import TReport                           from "../../../types/TReport";
import TReportInstance                   from "../../../types/TReportInstance";
import { Button }                        from "primereact/button";
import { useTranslation }                from "react-i18next";
import TCallbackResponse                 from "../../../types/TCallbackResponse";
import { ECallbackStatus }               from "../../../types/ECallbackStatus";
import { updateReportDataViewQuery }     from "../../../contexts/report/store/asyncAction";
import { apiSendRequest }                from "../../../services/api";
import { EAPIEndPoint }                  from "../../../types/EAPIEndPoint";
import * as RTReport                     from "../../../contexts/report/ReportContextProvider";
import CustomEditor                      from "../../common/CustomEditor";
import { reportShowDataViewQuery }       from "../../../contexts/report/store/actions";
import { EAceEditorButton }              from "../../../types/primereact/EAceEditorButton";
import { EReportViewMode }               from "../../../types/EReportViewMode";
import round                             from "lodash.round";
import { ERole }                         from "../../../types/ERole";
import { DataViewTitle }                 from "./DataViewTitle";

const DataViewClient: React.FC<{
    dataView: TReportDataView,
    dataViewInstance: TDataViewInstance,
    report: TReport,
    reportInstance: TReportInstance,
    reportParameterInputValues: TNameValue[],
    reportParameters: TReportParameter[],
    publicMode?: boolean,
}> = ({
          dataView,
          dataViewInstance,
          report,
          reportInstance,
          reportParameterInputValues,
          reportParameters,
          publicMode
      }): React.ReactElement | null => {

    const navigate = useNavigate();
    const {t} = useTranslation();

    const {state: authState} = React.useContext(authContext);

    const replacedTitle = replaceParametersPlaceholders(dataView.title || '', reportParameterInputValues, reportParameters || []);
    const replacedDesc = replaceParametersPlaceholders(dataView.description || '', reportParameterInputValues, reportParameters || []);

    // START - For SQL query update.
    //
    const reportDispatch = RTReport.useDispatch();

    const [stateSQLConsoleCallbackResponseQuery, setSQLConsoleCallbackResponseQuery] = React.useState<TCallbackResponse>({status: ECallbackStatus.IDLE})
    const [editorQuery, setEditorQuery] = React.useState<string>(dataView.query);

    const updateReportDataViewQueryHandler = (query: string, run?: boolean, callback?: Function): void => {

        reportDispatch(
            updateReportDataViewQuery({
                dataViewId: dataView.id,
                query,
                reportId: report.id,
                callback: (reportId, callbackResponse) => {

                    setSQLConsoleCallbackResponseQuery(callbackResponse);

                    if (run === true) {

                        apiSendRequest({
                            method: 'POST',
                            endPoint: EAPIEndPoint.REPORT_DATA_VIEW,
                            resourceId: dataView.id,
                            extraUrlPath: 'run',
                            formValues: {
                                useCache: reportInstance.useCache,
                                instanceId: reportInstance.id,
                                parameters: reportInstance.reportParameterInputValues,
                            },
                            callbackSuccess: () => {

                                if (callback) {

                                    callback();
                                }
                            },
                        });
                    }
                }
            })
        )
    }

    // Handle shortcuts
    //
    React.useEffect(() => {

        function handleRunShortcut(event: KeyboardEvent): void {

            const {
                altKey,
                shiftKey,
                code,
            } = event;

            // ALT + SHIFT + R
            if (code === 'KeyR' && altKey && shiftKey) {

                event.preventDefault();
                updateReportDataViewQueryHandler(String(editorQuery || ''), true);
            }
        }

        // Bind the Event listener
        document.addEventListener("keydown", handleRunShortcut);
        return () => {

            // Unbind the event listener on clean up
            document.removeEventListener("keydown", handleRunShortcut);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    //
    // END - For SQL query update.

    // If put in a useEffect, data view are not always re-rendered when results are coming. (even with dependencies correctly setup)
    return (
        <>

            <div>
                {(reportInstance.expandedDataViewId && reportInstance.expandedDataViewId > 0 && dataViewInstance.showQuery && reportInstance.viewMode === EReportViewMode.DEV) &&
                    <CustomEditor
                        id={'sql_editor_dataview_' + dataView.id}
                        value={dataView.query}
                        onExecuteCallback={(query: string) => {
                            updateReportDataViewQueryHandler(query, true);
                        }}
                        onSaveCallback={(query: string) => {
                            updateReportDataViewQueryHandler(query);
                        }}
                        onCloseCallback={() => {

                            reportDispatch(
                                reportShowDataViewQuery({
                                    reportId: report.id,
                                    reportInstanceId: reportInstance.id,
                                    dataViewId: dataView.id,
                                    show: false
                                }));
                        }}
                        onChangeCallback={(query: string) => {
                            setEditorQuery(query);
                        }}
                        runCallbackResponse={stateSQLConsoleCallbackResponseQuery}
                        saveCallbackResponse={stateSQLConsoleCallbackResponseQuery}
                        activeButtons={[EAceEditorButton.RUN]}
                        resize="vertical"
                        height="205px"
                        notification={(
                            <>
                                {dataViewInstance.loading && <i className="pi pi-spin pi-spinner mr-2"/>}
                                {!dataViewInstance.loading && dataViewInstance.end && dataViewInstance.start && `[ ${(dataViewInstance.end - dataViewInstance.start) / 1000}s ]`}
                            </>
                        )}
                    />
                }
            </div>

            <div
                className={`data-view-buttons ${reportInstance.expandedDataViewId && reportInstance.viewMode === EReportViewMode.DEV ? 'hidden' : ''}`}
            >

                {dataViewInstance.loading ? (
                    <TopRightLoading/>
                ) : (
                    <>
                        {!publicMode && dataView.type !== EDataViewType.METRIC && (
                            <div className="data-view-full-screen speeddial-button">
                                <Button
                                    icon={`pi ${!!reportInstance.expandedDataViewId ? 'pi-window-minimize' : 'pi-window-maximize'}`}
                                    rounded outlined
                                    onClick={() => {
                                        if (reportInstance.expandedDataViewId) {
                                            navigate(`/report/${report.id}_${reportInstance.id}?view-mode=client&${nameValuesToString(reportParameterInputValues.filter(param => param.name !== 'run'))}`);
                                        } else {
                                            navigate(`/report/${report.id}_${reportInstance.id}/data-view/${dataView.id}?view-mode=client&${nameValuesToString(reportParameterInputValues.filter(param => param.name !== 'run'))}`);
                                        }
                                    }}
                                    tooltip={!!reportInstance.expandedDataViewId
                                        ? t('common:editor.minimize-no-shortcut').toString()
                                        : t('common:editor.maximize-no-shortcut').toString()
                                    }
                                    tooltipOptions={{position: 'left'}}
                                />
                            </div>
                        )}

                        <DataViewOptionsOverlay
                            report={report}
                            reportInstance={reportInstance}
                            dataView={dataView}
                            className="data-view-actions"
                            handleExpand={() => {

                                navigate(`/report/${report.id}_${reportInstance.id}/data-view/${dataView.id}?view-mode=dev&${nameValuesToString(reportParameterInputValues.filter(param => param.name !== 'run'))}`);
                                document.dispatchEvent(upEventResizeAceEditor);
                            }}
                            handleDataViewConfiguration={() => {
                                // reportDispatch(reportShowDataViewParams({
                                //     report_id: Number(reportId), data_view_id: dataView.id
                                // }))
                            }}
                            devMode={!authState.user.is_super_admin && authState.user.organization_user.ui_grants.report_data_view.edit}
                            jsonResults={dataView.type === EDataViewType.TABLE ? dataViewInstance.results : undefined}
                        />
                    </>
                )}
            </div>

            <Card
                className={`data-view-card ${dataViewInstance.errors && dataViewInstance.errors.length > 0 ? 'error' : ''}`}
                header={(
                    <div
                        className="react-grid-layout-draggable-handle p-3"
                        style={{display: (reportInstance.expandedDataViewId && reportInstance.expandedDataViewId > 0 && reportInstance.viewMode === EReportViewMode.DEV) ? 'none' : ''}}
                    >
                        <DataViewTitle
                            title={replacedTitle || dataView.name}
                            descriptionDisplayType={dataView.description_display_type}
                            replacedDesc={replacedDesc}
                            id={dataView.id}
                        />
                    </div>
                )}
            >
                <DataView
                    dataView={dataView}
                    dataViewInstance={dataViewInstance}
                    mountParams={!!(reportInstance.expandedDataViewId && reportInstance.expandedDataViewId > 0 && reportInstance.viewMode === EReportViewMode.DEV)}
                    report={report}
                    reportInstance={reportInstance}
                    expanded={!!(reportInstance.expandedDataViewId && reportInstance.expandedDataViewId > 0)}
                    showView
                />
            </Card>
            {!dataViewInstance.waitingData && (
                <>
                    {dataViewInstance.elapsedTime && authState.user.organization_user.role_ids.some(role_id => [ERole.DEVELOPER, ERole.DEMO_DEVELOPER].includes(role_id))
                        ? (
                            (dataViewInstance.results_from_cache
                                    ? <span className="date-view-results-cached">{t('report:cache.from_cache').toString()}</span>
                                    : <span className="date-view-elapsed-time">{round(dataViewInstance.elapsedTime, 2)} s</span>
                            )
                        )
                        : (dataViewInstance.results_from_cache && <span className="date-view-results-cached">{t('report:cache.from_cache').toString()}</span>)
                    }
                </>
            )}
        </>
    );
}

export default DataViewClient;