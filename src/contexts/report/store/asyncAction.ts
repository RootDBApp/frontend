import * as types        from "./types";
import TReportDataViewJs from "../../../types/TReportDataViewJs";
import {
    ICallbackGetReportDateViewsAndResponseStatus,
}                        from "../../../types/ICallBacks";
import { TNameValue }    from "../../../types/TNameValue";

export interface IGetReport {
    type: types.TGetReport,
    payload: { reportId: number, reportInstanceId: number },
}

export interface IListenPrivateChannelReport {
    type: types.TListenPrivateChannelReport,
    payload: { webSocketSessionId: string }
}

export interface IListenPublicChannelReport {
    type: types.TListenPublicChannelReport,
    payload: string // random hash to identify the guest user on the websocket server.
}

export interface IPublicGetReport {
    type: types.TPublicGetReport,
    payload: { reportId: number, reportInstanceId: number, securityHash: string },
}

export interface IPublicGetReportDataViews {
    type: types.TPublicGetReportDataviews,
    payload: { reportId: number, securityHash: string },
}

export interface IReportCacheResults {
    type: types.TReportCacheResults,
    payload: { reportId: number, parameters: Array<TNameValue>, dataViewResults: Array<{ reportDataViewId: number, results: Array<object> }> }
}

export interface IUpdateReportDataViewJs {
    type: types.TUpdateReportDataViewJs,
    payload: { reportId: number, dataViewId: number, dataViewJs: TReportDataViewJs, callback: ICallbackGetReportDateViewsAndResponseStatus },
}

export interface IUpdateReportDataViewQuery {
    type: types.TUpdateReportDataViewQuery,
    payload: { reportId: number, dataViewId: number, query: string, callback: ICallbackGetReportDateViewsAndResponseStatus },
}

export const getReport = (payload: { reportId: number, reportInstanceId: number }): IGetReport => ({
    type: types.GET_REPORT,
    payload: payload,
});

export const listenPrivateChannelReport = (payload: { webSocketSessionId: string }): IListenPrivateChannelReport => ({
    type: types.LISTEN_PRIVATE_CHANNEL_REPORT,
    payload
});

export const listenPublicChannelReport = (payload: string): IListenPublicChannelReport => ({
    type: types.LISTEN_PUBLIC_CHANNEL_REPORT,
    payload
});

export const publicGetReport = (payload: { reportId: number, reportInstanceId: number, securityHash: string, }): IPublicGetReport => ({
    type: types.PUBLIC_GET_REPORT,
    payload,
});

export const publicGetReportDataViews = (payload: { reportId: number, securityHash: string }): IPublicGetReportDataViews => ({
    type: types.PUBLIC_GET_REPORT_DATAVIEWS,
    payload,
});

export const updateReportDataViewJs = (payload: { reportId: number, dataViewId: number, dataViewJs: TReportDataViewJs, callback: ICallbackGetReportDateViewsAndResponseStatus }): IUpdateReportDataViewJs => ({
    type: types.UPDATE_REPORT_DATAVIEW_JS,
    payload,
});

export const updateReportDataViewQuery = (payload: { reportId: number, dataViewId: number, query: string, callback: ICallbackGetReportDateViewsAndResponseStatus }): IUpdateReportDataViewQuery => ({
    type: types.UPDATE_REPORT_DATAVIEW_QUERY,
    payload,
});


export type TReportAsyncAction =
    IGetReport
    | IListenPrivateChannelReport
    | IListenPublicChannelReport
    | IPublicGetReport
    | IPublicGetReportDataViews
    | IUpdateReportDataViewQuery
    | IUpdateReportDataViewJs
    ;
