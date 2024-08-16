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

import * as React                                     from 'react';
import { useTranslation }                             from "react-i18next";
import { Layout, Responsive as ResponsiveGridLayout } from "react-grid-layout";


import TReport                                                                                           from "../../types/TReport";
import TReportInstance                                                                                   from "../../types/TReportInstance";
import * as RTReport                                                                                     from "../../contexts/report/ReportContextProvider";
import TCallbackResponse                                                                                 from "../../types/TCallbackResponse";
import { ECallbackStatus }                                                                               from "../../types/ECallbackStatus";
import { EReportPanel }                                                                                  from "../../types/EReportPanels";
import { gotReportDataViewPosition, reportTogglePanel, updateReportQueryCleanup, updateReportQueryInit } from "../../contexts/report/store/actions";
import { EAceEditorButton }                                                                              from "../../types/primereact/EAceEditorButton";
import CustomEditor                                                                                      from "../common/CustomEditor";
import { apiSendRequest }                                                                                from "../../services/api";
import { EAPIEndPoint }                                                                                  from "../../types/EAPIEndPoint";
import { TAPIResponse }                                                                                  from "../../types/TAPIResponse";
import { notificationEvent }                                                                             from "../../utils/events";
import { EReportDevBarMessageType }                                                                      from "../../types/application-event/EReportDevBarMessageType";
import DataViewClient                                                                                    from "./data-view/DataViewClient";
import { getDataViewsPositions, getDataViewTypeText }                                                    from "../../utils/dataView";
import { shallowEqual }                                                                                  from "../../utils/commonJs";
import TReportDataViewUpdatePositionResult                                                               from "../../types/TReportDataViewUpdatePositionResult";
import TReportDataView                                                                                   from "../../types/TReportDataView";
import TDataViewInstance                                                                                 from "../../types/TDataViewInstance";
import { defaultDataViewInstance }                                                                       from "../../contexts/report/store/reducer";
import { context as authContext }                                                                        from "../../contexts/auth/store/context";
import { useMobileLayout }                                                                               from "../../utils/windowResize";
import { EReportViewMode }                                                                               from "../../types/EReportViewMode";
import { generateGridBackground }                                                                        from "../../utils/grid";

const ReportInstance: React.FC<{
    report: TReport,
    reportInstance: TReportInstance,
    publicMode?: boolean,
    width?: number | undefined
}> = ({
          report,
          reportInstance,
          publicMode,
          width = window.innerWidth
      }): React.ReactElement => {

    const reportDispatch = RTReport.useDispatch();
    const {t} = useTranslation();

    // START - For QueryInit / Cleanup update
    //
    const [stateSQLConsoleCallbackResponseQueryInit, setSQLConsoleCallbackResponseQueryInit] = React.useState<TCallbackResponse>({status: ECallbackStatus.IDLE})
    const [stateSQLConsoleCallbackResponseQueryCleanup, setSQLConsoleCallbackResponseQueryCleanup] = React.useState<TCallbackResponse>({status: ECallbackStatus.IDLE})

    const isPanelDisplayable = (panel: EReportPanel) => {

        const {[panel]: show} = reportInstance.panels;

        return show;
    }

    const setSQLConsoleCallbackResponse = (fromPanel: EReportPanel, callbackResponse: TCallbackResponse): void => {

        if (fromPanel === EReportPanel.QUERY_INIT) {

            setSQLConsoleCallbackResponseQueryInit(callbackResponse);
        } else {

            setSQLConsoleCallbackResponseQueryCleanup(callbackResponse);
        }
    };

    const updateReportQueries = (query: string, fromPanel: EReportPanel): void => {

        if (!!report) {

            apiSendRequest({
                method: 'PUT',
                endPoint: EAPIEndPoint.REPORT,
                extraUrlPath: 'queries',
                formValues: {[fromPanel === EReportPanel.QUERY_INIT ? 'query_init' : 'query_cleanup']: query},
                resourceId: report.id,
                callbackSuccess: (report: TReport) => {

                    setSQLConsoleCallbackResponse(fromPanel, {status: ECallbackStatus.ACTION_OK});
                    if (fromPanel === EReportPanel.QUERY_CLEANUP) {
                        reportDispatch(updateReportQueryCleanup({
                            reportId: report.id,
                            query: String(report.query_cleanup || '')
                        }));
                    }
                    if (fromPanel === EReportPanel.QUERY_INIT) {
                        reportDispatch(updateReportQueryInit({
                            reportId: report.id,
                            query: String(report.query_init || '')
                        }));
                    }
                },
                callbackError: (error: TAPIResponse) => {

                    setSQLConsoleCallbackResponse(fromPanel, {
                        status: ECallbackStatus.ACTION_KO,
                        error: 'An error occurred.'
                    });

                    document.dispatchEvent(
                        notificationEvent({
                            message: String(error.message),
                            timestamp: Date.now(),
                            title: t('common:errors').toString(),
                            forceInNotificationCenter: true,
                            type: EReportDevBarMessageType.ERROR,
                            severity: "error",
                            toast: true,
                        })
                    );
                }
            });
        }
    }
    //
    // END - For QueryInit / Cleanup update


    // START - For data views layout update
    //
    const {state: authState} = React.useContext(authContext);
    const isMobile = useMobileLayout();

    const [layouts, setLayouts] = React.useState<Array<Layout>>([]);
    const [currentBreakpoint, setCurrentBreakpoint] = React.useState<string>('lg');
    const [disabled, setDisabled] = React.useState<boolean>(false);
    const [dragging, setDragging] = React.useState(false);
    const [colorGiverElement, setColorGiverElement] = React.useState<HTMLDivElement | null>(null);

    const colsMap: { [index: string]: number } = React.useMemo(() => ({lg: 12, md: 12, sm: 1, xs: 1, xxs: 1}), []);

    const background = React.useMemo(() => {
        if (colorGiverElement) {
            return generateGridBackground(colsMap[currentBreakpoint], width);
        }
        return "";
    }, [colsMap, currentBreakpoint, colorGiverElement, width]);

    const style = React.useMemo(
        () => ({
            width: width,
            background: dragging ? background : "",
        }),
        [background, dragging, width],
    );

    const handleLayoutChange = React.useCallback((currentLayout: Layout[]) => {
        setDragging(false);
        const transformedLayout = currentLayout.map(
            (layout: Layout) => {
                return {
                    dataViewId: Number(layout.i.split('-').pop()),
                    layout: {x: layout.x, y: layout.y, w: layout.w, h: layout.h}
                }
            }
        );

        const currentDataViewsPositions = getDataViewsPositions(report.dataViews || []);
        const didNotChanged = transformedLayout.every(layout => currentDataViewsPositions.some(pos => {
            const {dataViewId, ...dataViewLayout} = pos;
            // compare dataViewId and layouts
            return dataViewId === layout.dataViewId && shallowEqual(dataViewLayout, layout.layout);
        }))


        if (!didNotChanged) {

            apiSendRequest({
                method: 'PUT',
                endPoint: EAPIEndPoint.REPORT,
                resourceId: report.id,
                extraUrlPath: 'update-data-views-layout',
                formValues: {
                    layouts: transformedLayout,
                },
                callbackSuccess: (response: TReportDataViewUpdatePositionResult[]) => {

                    response.forEach(rep => {

                        reportDispatch(gotReportDataViewPosition({
                            reportId: report.id,
                            dataViewId: rep.dataViewId,
                            position: rep.layout
                        }))
                    })

                    document.dispatchEvent(
                        notificationEvent({
                            message: t('report:grid_layout.data_views_layout_updated'),
                            reportId: report.id,
                            timestamp: Date.now(),
                            title: `${t('report:report').toString()} ${t('common:form.updated').trim().toLowerCase()}`,
                            type: EReportDevBarMessageType.LOG,
                            severity: "info",
                            toast: true,
                            life: 1000,
                        })
                    );
                },
                callbackError: (apiResponse: TAPIResponse) => {

                    document.dispatchEvent(
                        notificationEvent({
                            message: apiResponse.message,
                            reportId: report.id,
                            timestamp: Date.now(),
                            title: apiResponse.title,
                            type: EReportDevBarMessageType.LOG_REPORT,
                            severity: "error",
                            toast: true,
                            life: 3000,
                            forceInNotificationCenter: true
                        })
                    );
                }
            });
            setLayouts(currentLayout);
        }
    }, [report.dataViews, report.id, t, reportDispatch]);

    // Because the reportInstance?.dataViewInstances?.find(...) is not re-executed when we got data view results when it's the
    // second, at least, instance of a report, we use this callback to make sure we refresh data view components
    //
    const getDataViewInstance = React.useCallback((dataView: TReportDataView): TDataViewInstance => {

        return reportInstance?.dataViewInstances.find(dataViewInstance => dataViewInstance.id === dataView.id) || defaultDataViewInstance;
    }, [reportInstance?.dataViewInstances]);

    // Used to display a warning to dev when window's width is too small for data view layout setup.
    //
    React.useEffect(() => {

        if (authState.user.organization_user.ui_grants.report.edit && currentBreakpoint) {

            if (currentBreakpoint !== 'lg' && !disabled) {

                document.dispatchEvent(
                    notificationEvent({
                        message: t('report:grid_layout.disabled_layout_message').toString(),
                        timestamp: Date.now(),
                        title: t('report:grid_layout.disabled_layout_title').toString(),
                        type: EReportDevBarMessageType.LOG,
                        severity: "info",
                        toast: true,
                        life: 2000,
                        forceInNotificationCenter: false
                    })
                );

                setDisabled(true);

            } else if (currentBreakpoint === 'lg' && disabled) {

                document.dispatchEvent(
                    notificationEvent({
                        message: t('report:grid_layout.enabled_layout_message').toString(),
                        timestamp: Date.now(),
                        title: t('report:grid_layout.enabled_layout_title').toString(),
                        type: EReportDevBarMessageType.LOG,
                        severity: "info",
                        toast: true,
                        life: 2000,
                        forceInNotificationCenter: false
                    })
                );

                setDisabled(false)

            }
        }
    }, [authState.user.organization_user.ui_grants.report.edit, currentBreakpoint, disabled, report.id, t]);

    // Used to get data view positions, when this component is displayed.
    //
    React.useEffect(() => {

        const layouts: Layout[] = getDataViewsPositions(report.dataViews || []).map(area => {

            const editable = currentBreakpoint === 'lg' && !authState.user.is_super_admin && authState.user.organization_user.ui_grants.report.edit;

            const {dataViewId, ...layout} = area;
            return {
                isDraggable: editable && !isMobile && !reportInstance.expandedDataViewId,
                isResizable: editable && !isMobile && !reportInstance.expandedDataViewId,
                ...layout,
                i: `dataview-client-${report.id}-${reportInstance.id}-${area.dataViewId}`,
            }
        });

        setLayouts(layouts);
    }, [
        authState.user.is_super_admin,
        authState.user.organization_user.ui_grants.report.edit,
        currentBreakpoint,
        isMobile,
        report.id,
        report.dataViews,
        reportInstance.id,
        reportInstance.expandedDataViewId
    ]);
    //
    // END - For data views layout update

    return (
        <div className="grid-report-content-dev">
            <div
                className={isPanelDisplayable(EReportPanel.QUERY_INIT) ? 'grid-report-area-query-init' : 'hidden grid-report-area-query-init'}
                key={`report-${report.id}-${EReportPanel.QUERY_INIT}`}
            >
                <CustomEditor
                    saveCallbackResponse={stateSQLConsoleCallbackResponseQueryInit}
                    height="300px"
                    id={'sql_editor_query_init_' + report.id}
                    onCloseCallback={() => {

                        reportDispatch(
                            reportTogglePanel({
                                panel: EReportPanel.QUERY_INIT,
                                reportId: Number(report.id),
                                reportInstanceId: reportInstance.id,
                                show: false,
                            }));
                    }}
                    onSaveCallback={(query_init: string) => {
                        updateReportQueries(query_init, EReportPanel.QUERY_INIT);
                    }}
                    resize="vertical"
                    value={report.query_init}
                    activeButtons={[EAceEditorButton.SAVE]}
                />
            </div>

            <div id="color-giver" className="react-grid-item react-grid-placeholder hidden" ref={(ref) => setColorGiverElement(ref)}/>

            <ResponsiveGridLayout
                className={`layout grid-report-area-data-views ${!!reportInstance.expandedDataViewId ? 'expanded-data-view' : ''}`}
                breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                cols={colsMap}
                layouts={{lg: layouts}}
                compactType='vertical'
                preventCollision={false}
                onBreakpointChange={(newBreakpoint) => setCurrentBreakpoint(newBreakpoint)}
                onDragStart={() => setDragging(true)}
                onResizeStart={() => setDragging(true)}
                onDragStop={handleLayoutChange}
                onResizeStop={handleLayoutChange}
                // measureBeforeMount={true}
                // useCSSTransforms={false}
                draggableHandle='.react-grid-layout-draggable-handle'
                width={width}
                style={style}
                margin={[10, 10]}
            >
                {report.dataViews
                    ?.map((dataView) => (
                        <div
                            className={`
                                    data-view-container 
                                    ${reportInstance.viewMode === EReportViewMode.CLIENT ? 'client' : ''} 
                                    ${getDataViewTypeText(dataView.type)}
                                    ${!(!reportInstance.expandedDataViewId || dataView.id === reportInstance.expandedDataViewId) ? 'hidden' : ''}`
                            }
                            key={`dataview-client-${report.id}-${reportInstance.id}-${dataView.id}`}
                        >
                            <DataViewClient
                                dataView={dataView}
                                dataViewInstance={getDataViewInstance(dataView)}
                                // dataViewInstance={reportInstance?.dataViewInstances?.find(dataViewInstance => dataViewInstance.id === dataView.id) || defaultDataViewInstance}
                                report={report}
                                reportInstance={reportInstance}
                                reportParameters={report.parameters || []}
                                reportParameterInputValues={reportInstance.reportParameterInputValues}
                                publicMode={publicMode}
                            />
                        </div>
                    ))
                }
            </ResponsiveGridLayout>

            <div
                className={isPanelDisplayable(EReportPanel.QUERY_CLEANUP) ? 'grid-report-area-query-cleanup' : 'hidden grid-report-area-query-cleanup'}
                key={`report-${report.id}-${EReportPanel.QUERY_CLEANUP}`}
            >
                <CustomEditor
                    saveCallbackResponse={stateSQLConsoleCallbackResponseQueryCleanup}
                    height="450px"
                    id={'sql_editor_query_cleanup_' + report.id}
                    onCloseCallback={() => {

                        reportDispatch(
                            reportTogglePanel({
                                panel: EReportPanel.QUERY_CLEANUP,
                                reportId: Number(report.id),
                                reportInstanceId: reportInstance.id,
                                show: false,
                            }));
                    }}
                    onSaveCallback={(query_cleanup: string) => {

                        updateReportQueries(query_cleanup, EReportPanel.QUERY_CLEANUP);
                    }}
                    resize="vertical"
                    resizeHandleTop
                    value={report.query_cleanup}
                    activeButtons={[EAceEditorButton.SAVE]}
                />
            </div>
        </div>
    );
}

export default ReportInstance;