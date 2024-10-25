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

import * as types                          from "./types";
import TReportDataViewJs                   from "../../../types/TReportDataViewJs";
import {
    ICallbackGetReportDateViewsAndResponseStatus,
}                                          from "../../../types/ICallBacks";
import { TNameValue }                      from "../../../types/TNameValue";
import TReportDataViewRunTimeConfiguration from "../../../types/TReportDataViewRuntimeConfiguration";

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

export interface IUpdateReportDataViewRuntimeConfig {
    type: types.TUpdateReportDataViewRunTimeConfiguration,
    payload: { reportId: number, dataViewId: number, runtimeConfiguration: TReportDataViewRunTimeConfiguration },
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
