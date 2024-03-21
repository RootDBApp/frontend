import * as React                                                       from 'react';
import { useSearchParams, useLocation, useNavigate, useNavigationType } from 'react-router-dom';

import { EReportViewMode }                                          from "../../types/EReportViewMode";
import { EReportPanel }                                             from "../../types/EReportPanels";
import * as RTReport                                                from "../../contexts/report/ReportContextProvider";
import {
    reportExpandDataView,
    reportSetViewMode, reportShowDataViewQuery,
    reportTogglePanel,
}                                                                   from "../../contexts/report/store/actions";
import { nameValuesToString }                                       from "../../utils/tools";
import { apiSendRequest }                                           from "../../services/api";
import { EAPIEndPoint }                                             from "../../types/EAPIEndPoint";
import { getReportRunInfo }                                         from "../../utils/report";
import { useReportStateReportInstanceDataViewInstanceFromLocation } from "../../contexts/report/ReportContextProvider";
import { HeaderMenuBar }                                            from "./HeaderMenuBar";
import { useUrlParameters }                                         from "../../utils/hooks";
import { handleUseCacheReportInstanceChange }                       from "../../utils/headerMenu/reportMenu";

const Header = (): React.ReactElement => {

    const navigate = useNavigate();
    const action = useNavigationType();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const reportState = useReportStateReportInstanceDataViewInstanceFromLocation(useLocation().pathname);
    const parameters = useUrlParameters(useLocation().search, useLocation().key);

    const reportDispatch = RTReport.useDispatch();

    // Handle report's shortcuts.
    //
    React.useEffect(() => {

        function handleRunShortcut(event: KeyboardEvent): void {

            const {
                altKey,
                shiftKey,
                code,
            } = event;

            // Show / hide data view sql query
            // ALT + SHIFT+ Q
            if (code === 'KeyA'
                && altKey
                && shiftKey
                && reportState.dataViewInstance
                && reportState.instance
            ) {

                event.preventDefault();
                if (reportState.instance && reportState.dataViewInstance) {

                    reportDispatch(
                        reportShowDataViewQuery({
                            reportId: reportState.report?.id,
                            reportInstanceId: reportState.instance.id,
                            dataViewId: reportState.dataViewInstance.id,
                            show: !reportState.dataViewInstance.showQuery,
                        }))
                }
            }

                // Open Debug tab.
            // ALT + SHIFT + D
            else if (code === 'KeyD'
                && altKey
                && shiftKey
            ) {

                event.preventDefault();
                if (reportState.report?.id) {

                    navigate('/debug/report/' + String(reportState.report.id));
                }
            }

                // Run report
            // ALT + SHIFT + R
            else if (code === 'KeyR'
                && altKey && shiftKey
                && reportState.report
                && reportState.instance
                && !reportState.dataViewInstance
            ) {

                event.preventDefault();
                navigate('/report/' + String(reportState.report.id) + '_' + String(reportState.instance.id) + '?' + nameValuesToString(reportState.instance.reportParameterInputValues) + '&run');
            }

                // Toggle init panel
            // ALT + SHIFT + I
            else if (code === 'KeyI' && altKey && shiftKey && reportState.report && reportState.instance) {

                event.preventDefault();
                reportDispatch(
                    reportTogglePanel({
                        panel: EReportPanel.QUERY_INIT,
                        reportId: reportState.report.id,
                        reportInstanceId: reportState.instance.id,
                        show: !(reportState.instance.panels && reportState.instance.panels[EReportPanel.QUERY_INIT]),
                    }));
            }

                // Toggle cleanup panel
            // ALT + SHIFT + C
            else if (code === 'KeyC' && altKey && shiftKey && reportState.report.id && reportState.instance) {

                event.preventDefault();
                reportDispatch(
                    reportTogglePanel({
                        panel: EReportPanel.QUERY_CLEANUP,
                        reportId: reportState.report.id,
                        reportInstanceId: reportState.instance.id,
                        show: !(reportState.instance.panels && reportState.instance.panels[EReportPanel.QUERY_CLEANUP]),
                    }));
            }
        }

        // Bind the Event listener
        document.addEventListener("keydown", handleRunShortcut);
        return () => {

            // Unbind the event listener on clean up
            document.removeEventListener("keydown", handleRunShortcut);
        };
    }, [
        navigate,
        reportDispatch,
        reportState?.dataViewInstance,
        reportState?.dataViewInstance?.showQuery,
        reportState?.instance,
        reportState?.instance?.id,
        reportState?.instance?.panels,
        reportState?.report,
        reportState?.report?.id,
    ]);

    // Handle data views edition.
    //
    React.useEffect(() => {

        if (reportState.report
            && reportState.instance
            && reportState.instance.expandedDataViewId !== reportState?.dataViewInstance?.id
        ) {

            reportDispatch(
                reportExpandDataView({
                    reportId: reportState.report.id,
                    reportInstanceId: reportState.instance.id,
                    dataViewId: reportState.dataViewInstance ? reportState.dataViewInstance.id : undefined
                })
            );

            if (reportState.dataViewInstance) {

                reportDispatch(
                    reportSetViewMode({
                        reportId: reportState.report?.id,
                        reportInstanceId: reportState.instance.id,
                        viewMode: EReportViewMode.DEV
                    })
                )
            } else {

                reportDispatch(
                    reportSetViewMode({
                        reportId: reportState.report?.id,
                        reportInstanceId: reportState.instance.id,
                        viewMode: EReportViewMode.CLIENT
                    })
                )
            }
        }
    }, [
        reportState,
        reportDispatch,
        reportState?.dataViewInstance,
        reportState?.instance,
        reportState?.instance?.id,
        reportState?.report,
        reportState?.report?.id,
    ]);

    // Handle report run options.
    //
    React.useEffect(() => {

        if (reportState.report && reportState.instance && parameters) {

            const {'view-mode': view_mode, key, run, ...reportParamsFromURL} = parameters;

            if (view_mode) {

                reportDispatch(
                    reportSetViewMode({
                        reportId: reportState.report.id,
                        reportInstanceId: reportState.instance.id,
                        viewMode: view_mode
                    })
                )
            }

            const runReportInfo = getReportRunInfo(
                reportDispatch,
                reportState.instance.id,
                reportState.report.id,
                reportState.report.has_parameters,
                reportParamsFromURL,
                run,
                (searchParams.has('use-cache') ? Number(searchParams.get('use-cache')) === 1 : reportState.instance.useCache),
                reportState.report.parameters,
            );

            // console.debug('======> runReportInfo', runReportInfo);

            if (runReportInfo.run || action === 'POP' || location?.state?.fromLogin === true) {

                apiSendRequest({
                    method: 'POST',
                    endPoint: EAPIEndPoint.REPORT,
                    resourceId: Number(reportState.report?.id),
                    extraUrlPath: 'run',
                    formValues: {
                        useCache: runReportInfo.useCache,
                        instanceId: runReportInfo.instanceId,
                        parameters: runReportInfo.formValues
                    },
                    callbackSuccess: () => {
                    }
                });

                if (searchParams.has('use-cache')) {

                    handleUseCacheReportInstanceChange(
                        {reportId: reportState.report.id, reportInstanceId: Number(reportState.instance?.id), useCache: Number(searchParams.get('use-cache')) === 1},
                        reportDispatch
                    )
                }

                // Remove run parameter just after the start.
                searchParams.delete('run');
                searchParams.delete('use-cache');
                setSearchParams(searchParams);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        action,
        location?.state?.fromLogin,
        parameters,
        reportDispatch,
        reportState?.report,
        reportState?.report?.id,
        reportState?.report?.parameters,
        reportState?.report?.has_parameters,
        reportState?.instance,
        reportState?.instance?.id,
    ])

    return (
        <HeaderMenuBar/>
    )
}

export default Header;
