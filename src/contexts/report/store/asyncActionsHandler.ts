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

import * as React              from "react";
import { AsyncActionHandlers } from 'use-reducer-async';
import { t }                   from "i18next";

import { IReportState }                         from "./initialState";
import { EReportDevBarMessageType }             from "../../../types/applicationEvent/EReportDevBarMessageType";
import TReportAndDataViewEvent                  from "../../../types/TReportAndDataViewEvent";
import EchoClient                               from "../../../services/EchoClient";
import { notificationEvent, reportDevBarEvent } from "../../../utils/events";
import {
    gotReport,
    gotReportDataViewJs,
    gotReportDataViewQuery,
    gotReportDataViewResults,
    gotReportDataViews,
    reportCacheUpdated,
    reportDataViewRunEnd,
    reportDataViewRunError,
    reportDataViewRunStart,
    reportRunEnd,
    reportRunStart,
    reportShowDataViewAdd,
    TReportAction,
}                                               from "./actions";
import {
    IGetReport,
    IListenPrivateChannelReport,
    IListenPublicChannelReport,
    IPublicGetReport,
    IPublicGetReportDataViews,
    IUpdateReportDataViewJs,
    IUpdateReportDataViewQuery,
    TReportAsyncAction
}                                               from "./asyncAction";
import { apiSendRequest }                       from "../../../services/api";
import { EAPIEndPoint }                         from "../../../types/EAPIEndPoint";
import TReport                                  from "../../../types/TReport";
import TReportDataView                          from "../../../types/TReportDataView";
import { ECallbackStatus }                      from "../../../types/ECallbackStatus";
import TReportDataViewJs                        from "../../../types/TReportDataViewJs";
import { TAPIResponse }                         from "../../../types/TAPIResponsed";
import { TReportCacheStatus }                   from "../../../types/TReportCacheStatus";

const getReportDataViews = (
    dispatch: { (value: TReportAction): void },
    reportId: number,
    instanceId: number,
    getReportResponse?: TReport,
) => {

    apiSendRequest({
        method: 'GET',
        endPoint: EAPIEndPoint.REPORT_DATA_VIEW,
        urlParameters: [
            {key: 'report-id', value: reportId},
            {key: 'instance-id', value: instanceId},
        ],
        callbackSuccess: (response: Array<TReportDataView>) => {

            if (getReportResponse) {
                dispatch(gotReport(getReportResponse));
            }

            dispatch(
                gotReportDataViews({
                    dataViews: response,
                    reportId: reportId,
                    reportInstanceId: instanceId
                }));
        },
        callbackError: () => {

            if (getReportResponse) {
                dispatch(gotReport(getReportResponse));
            }

            document.dispatchEvent(
                reportDevBarEvent({
                    reportId,
                    timestamp: Date.now(),
                    title: 'Report Id #' + reportId,
                    message: 'Error while getting report data views',
                    type: EReportDevBarMessageType.ERROR_REPORT,
                })
            );
        }
    });
}

// Used when report is embedded in another website.
const getPublicReportDataViews = (
    dispatch: { (value: TReportAction): void },
    reportId: number,
    instanceId: number,
    securityHash: string,
    getReportResponse?: TReport,
) => {

    apiSendRequest({
        method: 'GET',
        endPoint: EAPIEndPoint.PUBLIC_REPORT_DATAVIEW,
        urlParameters: [
            {key: 'report-id', value: reportId},
            {key: 'instance-id', value: instanceId},
            {key: 'sh', value: securityHash}
        ],
        callbackSuccess: (response: Array<TReportDataView>) => {

            if (getReportResponse) {
                dispatch(gotReport(getReportResponse));
            }

            dispatch(
                gotReportDataViews({
                    dataViews: response,
                    reportId: reportId,
                    reportInstanceId: instanceId
                }))
        }
    });
}

const asyncActionHandlers: AsyncActionHandlers<React.Reducer<IReportState, TReportAction>, TReportAsyncAction> = {

    GET_REPORT: ({dispatch}) => async (action: IGetReport) => {

        apiSendRequest({
            method: 'GET',
            endPoint: EAPIEndPoint.REPORT,
            resourceId: action.payload.reportId,
            extraUrlPath: '?instanceId=' + String(action.payload.reportInstanceId),
            callbackSuccess: (response: TReport) => {

                getReportDataViews(dispatch, Number(response?.id), action.payload.reportInstanceId, response);
            },
            callbackError: () => {

                document.dispatchEvent(
                    reportDevBarEvent({
                        reportId: action.payload.reportId,
                        timestamp: Date.now(),
                        title: 'Report Id #' + action.payload,
                        message: "Error while getting the report",
                        type: EReportDevBarMessageType.ERROR_REPORT,
                    })
                );
            }
        });
    },

    LISTEN_PRIVATE_CHANNEL_REPORT: ({dispatch}) => async (action: IListenPrivateChannelReport) => {

        console.debug('ws - leave private channel: user.' + action.payload.webSocketSessionId);
        EchoClient.leave('user.' + action.payload.webSocketSessionId);

        console.debug('ws - listen private channel: user.' + action.payload.webSocketSessionId);
        EchoClient
            .private('user.' + action.payload.webSocketSessionId)
            //
            // Report events.
            //
            .listen('ReportCacheUpdated', (reportCacheStatus: TReportCacheStatus) => {

                console.debug('ws - ReportCacheUpdated', reportCacheStatus);
                dispatch(reportCacheUpdated(reportCacheStatus));
            })
            .listen('ReportRunStart', (reportAndDataViewEvent: TReportAndDataViewEvent) => {

                console.debug('ws - ReportRunStart', reportAndDataViewEvent);
                reportAndDataViewEvent.results_cached_at = new Date(reportAndDataViewEvent.results_cached_at);
                dispatch(reportRunStart(reportAndDataViewEvent));
                document.dispatchEvent(
                    reportDevBarEvent({
                        reportId: reportAndDataViewEvent.report_id,
                        timestamp: Date.now(),
                        title: reportAndDataViewEvent.report_name,
                        message: 'Run Report - started.',
                        type: EReportDevBarMessageType.LOG_REPORT,
                    })
                );
            })
            .listen('ReportError', (reportAndDataViewEvent: TReportAndDataViewEvent) => {

                console.debug('ws - ReportError', reportAndDataViewEvent);
                reportAndDataViewEvent.results_cached_at = new Date(reportAndDataViewEvent.results_cached_at);
                dispatch(reportRunEnd(reportAndDataViewEvent));
                document.dispatchEvent(
                    reportDevBarEvent({
                        reportId: reportAndDataViewEvent.report_id,
                        timestamp: Date.now(),
                        title: reportAndDataViewEvent.report_name,
                        message: reportAndDataViewEvent.errors.join("\n"),
                        type: EReportDevBarMessageType.ERROR_REPORT,
                    })
                );
            })
            .listen('ReportRunEnd', (reportAndDataViewEvent: TReportAndDataViewEvent) => {

                console.debug('ws - ReportRunEnd', reportAndDataViewEvent);
                reportAndDataViewEvent.results_cached_at = new Date(reportAndDataViewEvent.results_cached_at);
                dispatch(reportRunEnd(reportAndDataViewEvent));
                document.dispatchEvent(
                    reportDevBarEvent({
                        reportId: reportAndDataViewEvent.report_id,
                        timestamp: Date.now(),
                        title: reportAndDataViewEvent.report_name,
                        message: 'Run Report - finished.',
                        type: EReportDevBarMessageType.LOG_REPORT,
                    })
                );
            })
            //
            // Data view events.
            //
            .listen('ReportDataViewRunStart', (reportAndDataViewEvent: TReportAndDataViewEvent) => {

                console.debug('ws - ReportDataViewRunStart', reportAndDataViewEvent);
                reportAndDataViewEvent.results_cached_at = new Date(reportAndDataViewEvent.results_cached_at);
                document.dispatchEvent(
                    reportDevBarEvent({
                        reportId: reportAndDataViewEvent.report_id,
                        timestamp: Date.now(),
                        title: reportAndDataViewEvent.data_view_name,
                        message: 'Run Data View - started.',
                        type: EReportDevBarMessageType.LOG_REPORT,
                    })
                );

                dispatch(reportDataViewRunStart(reportAndDataViewEvent));
            })
            .listen('ReportDataViewResultsReceived', (reportAndDataViewEvent: TReportAndDataViewEvent) => {

                    console.debug('ws - ReportDataViewResultsReceived', reportAndDataViewEvent);
                    reportAndDataViewEvent.results_cached_at = new Date(reportAndDataViewEvent.results_cached_at);
                    document.dispatchEvent(
                        reportDevBarEvent({
                            reportId: reportAndDataViewEvent.report_id,
                            timestamp: Date.now(),
                            title: reportAndDataViewEvent.data_view_name,
                            message: 'Received ' + reportAndDataViewEvent.results.length + ' results',
                            type: EReportDevBarMessageType.LOG_REPORT,
                        })
                    );

                    dispatch(gotReportDataViewResults(reportAndDataViewEvent));
                }
            )
            .listen('ReportDataViewError', (reportAndDataViewEvent: TReportAndDataViewEvent) => {

                console.debug('ws - ReportDataViewError', reportAndDataViewEvent);
                reportAndDataViewEvent.results_cached_at = new Date(reportAndDataViewEvent.results_cached_at);
                dispatch(reportDataViewRunError(reportAndDataViewEvent));

                document.dispatchEvent(
                    notificationEvent({
                        message: reportAndDataViewEvent.errors.join("\n"),
                        timestamp: Date.now(),
                        title: reportAndDataViewEvent.data_view_name,
                        reportId: reportAndDataViewEvent.report_id,
                        type: EReportDevBarMessageType.ERROR_REPORT,
                        severity: "error",
                        toast: false
                    }));
            })
            .listen('ReportDataViewRunEnd', (reportAndDataViewEvent: TReportAndDataViewEvent) => {

                console.debug('ws - ReportDataViewRunEnd', reportAndDataViewEvent);
                reportAndDataViewEvent.results_cached_at = new Date(reportAndDataViewEvent.results_cached_at);
                dispatch(reportDataViewRunEnd(reportAndDataViewEvent));

                document.dispatchEvent(
                    reportDevBarEvent({
                        reportId: reportAndDataViewEvent.report_id,
                        timestamp: Date.now(),
                        title: reportAndDataViewEvent.data_view_name,
                        message: 'Run Data View - finished.',
                        type: EReportDevBarMessageType.LOG_REPORT,
                    })
                );
            });
    },

    // START -  Used when report is embedded in another website.
    //
    LISTEN_PUBLIC_CHANNEL_REPORT: ({dispatch}) => async (action: IListenPublicChannelReport) => {

        EchoClient.leave('user.public.' + action.payload);

        EchoClient.channel('user.public.' + action.payload)
            //
            // reports events
            //
            .listen('ReportRunStart', (reportAndDataViewEvent: TReportAndDataViewEvent) => {

                // console.debug('ws - ReportRunStart', reportAndDataViewEvent);
                dispatch(reportRunStart(reportAndDataViewEvent));
            })
            .listen('ReportError', (reportAndDataViewEvent: TReportAndDataViewEvent) => {

                // console.debug('ws - ReportError', reportAndDataViewEvent);
                dispatch(reportRunEnd(reportAndDataViewEvent));
            })
            .listen('ReportRunEnd', (reportAndDataViewEvent: TReportAndDataViewEvent) => {

                // console.debug('ws - ReportRunEnd', reportAndDataViewEvent);
                dispatch(reportRunEnd(reportAndDataViewEvent));
            })
            //
            // Data views events.
            //
            .listen('ReportDataViewRunStart', (reportAndDataViewEvent: TReportAndDataViewEvent) => {

                // console.debug('ws - ReportDataViewRunStart', reportAndDataViewEvent);
                dispatch(reportDataViewRunStart(reportAndDataViewEvent));
            })
            .listen('ReportDataViewResultsReceived', (reportAndDataViewEvent: TReportAndDataViewEvent) => {

                // console.debug('ws - ReportDataViewRunEnd', reportAndDataViewEvent);
                dispatch(gotReportDataViewResults(reportAndDataViewEvent));
            })
            .listen('ReportDataViewRunEnd', (reportAndDataViewEvent: TReportAndDataViewEvent) => {

                console.debug('ws - ReportDataViewRunEnd', reportAndDataViewEvent);
                dispatch(reportDataViewRunEnd(reportAndDataViewEvent));
            });
    },

    PUBLIC_GET_REPORT: ({dispatch}) => async (action: IPublicGetReport) => {

        // console.debug('get Report', action.payload);
        apiSendRequest({
            method: 'GET',
            endPoint: EAPIEndPoint.PUBLIC_REPORT,
            resourceId: action.payload.reportId,
            urlParameters: [
                {key: 'sh', value: action.payload.securityHash,},
                {key: 'instanceId', value: action.payload.reportInstanceId}
            ],
            callbackSuccess: (response: TReport) => {

                getPublicReportDataViews(
                    dispatch,
                    action.payload.reportId,
                    action.payload.reportInstanceId,
                    action.payload.securityHash,
                    response,
                );
            }
        });
    },

    PUBLIC_GET_REPORT_DATAVIEWS: ({dispatch}) => async (action: IPublicGetReportDataViews) => {

        dispatch(reportShowDataViewAdd({report_id: action.payload.reportId, show: false}));
    },
    //
    // END   -  Used when report is embedded in another website.

    UPDATE_REPORT_DATAVIEW_JS: ({dispatch}) => async (action: IUpdateReportDataViewJs) => {

        apiSendRequest({
            method: 'PUT',
            endPoint: EAPIEndPoint.REPORT_DATA_VIEW_JS,
            formValues: action.payload.dataViewJs,
            resourceId: action.payload.dataViewJs.id,
            callbackSuccess: (response: TReportDataViewJs) => {

                dispatch(gotReportDataViewJs({dataViewJs: response, reportId: action.payload.reportId}));
                action.payload.callback(action.payload.reportId, {status: ECallbackStatus.ACTION_OK});
            },
            callbackError: (error: TAPIResponse) => {

                document.dispatchEvent(
                    reportDevBarEvent({
                        reportId: action.payload.reportId,
                        timestamp: Date.now(),
                        title: 'Report Id #' + action.payload.reportId + ', dataView Id #' + action.payload.dataViewId,
                        message: error.message,
                        type: EReportDevBarMessageType.ERROR_REPORT,
                    }));

                action.payload.callback(action.payload.reportId, {
                    status: ECallbackStatus.ACTION_KO,
                    error: error.message
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
    },

    UPDATE_REPORT_DATAVIEW_QUERY: ({dispatch}) => async (action: IUpdateReportDataViewQuery) => {

        apiSendRequest({
            method: 'PUT',
            endPoint: EAPIEndPoint.REPORT_DATA_VIEW,
            formValues: {query: action.payload.query},
            extraUrlPath: 'query',
            resourceId: action.payload.dataViewId,
            callbackSuccess: () => {
                dispatch(gotReportDataViewQuery({
                    reportId: action.payload.reportId,
                    dataViewId: action.payload.dataViewId,
                    dataViewQuery: action.payload.query,
                }));
                action.payload.callback(action.payload.reportId, {status: ECallbackStatus.ACTION_OK});
            },
            callbackError: (error: TAPIResponse) => {

                document.dispatchEvent(
                    reportDevBarEvent({
                        reportId: action.payload.reportId,
                        timestamp: Date.now(),
                        title: 'Report Id #' + action.payload.reportId + ', dataView Id #' + action.payload.dataViewId,
                        message: error.message,
                        type: EReportDevBarMessageType.ERROR_REPORT,
                    }));

                action.payload.callback(action.payload.reportId, {
                    status: ECallbackStatus.ACTION_KO,
                    error: error.message
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
    },
};

export default asyncActionHandlers;