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

import { ChartDataset } from "chart.js";

import * as types               from './types';
import TReport                  from "../../../types/TReport";
import TReportParameter         from "../../../types/TReportParameter";
import { TNameValue }           from "../../../types/TNameValue";
import { EReportPanel }         from "../../../types/EReportPanels";
import TReportDataView          from "../../../types/TReportDataView";
import { EReportViewMode }      from "../../../types/EReportViewMode";
import TReportDataViewJs        from "../../../types/TReportDataViewJs";
import { EDataViewFieldUpdate } from "../../../types/EDataViewFieldUpdate";
import { TAddReportInstance }   from "./types";
import TReportAndDataViewEvent  from "../../../types/TReportAndDataViewEvent";
import { TReportCacheStatus }   from "../../../types/TReportCacheStatus";
import TChartJsConfigurator     from "../../../types/TChartJsConfigurator";

export interface IAddReportInstance {
    type: TAddReportInstance
    payload: { reportId: number, reportInstanceId: number },
}

export interface ICloseReportInstance {
    type: types.TCloseReportInstance,
    payload: { reportId: number, reportInstanceId: number },
}

export interface IDeletedReportDataView {
    type: types.TDeletedReportDataView,
    payload: { reportId: number, dataViewId: number },
}

export interface IGotReport {
    type: types.TGotReport,
    payload: TReport | null,
}

export interface IGotReportDataViews {
    type: types.TGotReportDataviews,
    payload: { dataViews: TReportDataView[] | null, reportId: number, reportInstanceId: number },
}

export interface IGotReportDataView {
    type: types.TGotReportDataview,
    payload: { dataView: TReportDataView, reportId: number, reportInstanceId: number },
}

export interface IGotReportDataViewJs {
    type: types.TGotReportDataviewJs,
    payload: { dataViewJs: TReportDataViewJs, reportId: number },
}

export interface IGotReportDataViewQuery {
    type: types.TGotReportDataviewQuery,
    payload: { dataViewQuery: string, reportId: number, dataViewId: number },
}

export interface IGotReportDataViewResults {
    type: types.TGotReportDataViewResults,
    payload: TReportAndDataViewEvent,
}

export interface IReportInstanceSetUseCache {
    type: types.TReportInstanceSetUseCache,
    payload: { reportId: number, reportInstanceId: number, useCache: boolean }
}

export interface IReportSetVisibility {
    type: types.TReportSetVisibility,
    payload: { reportId: number, is_visible: boolean }
}

export interface IReportExpandDataView {
    type: types.TReportExpandDataView,
    payload: { reportId: number, reportInstanceId: number, dataViewId: number | undefined },
}

export interface IReportRunStart {
    type: types.TReportRunStart,
    payload: TReportAndDataViewEvent,
}

export interface IReportRunEnd {
    type: types.TReportRunEnd,
    payload: TReportAndDataViewEvent,
}

export interface IUpdateReportParameters {
    type: types.TUpdateReportParameters,
    payload: { report_id: number, parameters: TReportParameter[] },
}

export interface IUpdateReportParameterInputValue {
    type: types.TUpdateReportParameterInputValue,
    payload: TNameValue & { reportId: number, reportInstanceId: number }
}

export interface IUpdateReportQuery {
    type: types.TUpdateReportQueryInit | types.TUpdateReportQueryCleanup,
    payload: { query: string, reportId: number }
}

export interface IReportCacheUpdated {
    type: types.TReportCacheUpdated,
    payload: TReportCacheStatus
}

export interface IReportDataViewRunStart {
    type: types.TReportDataViewRunStart,
    payload: TReportAndDataViewEvent,
}

export interface IReportDataViewRunEnd {
    type: types.TReportDataViewRunEnd,
    payload: TReportAndDataViewEvent,
}

export interface IReportDataViewRunError {
    type: types.TReportDataViewRunError,
    payload: TReportAndDataViewEvent,
}

export interface IReportDataViewSetChartJsConfigurator {
    type: types.TReportDataViewSetChartJsConfiguratorObject,
    payload: { chartJsConfigurator: TChartJsConfigurator, reportId: number, dataViewId: number },
}

export interface IReportDataViewUpdateChartJsConfiguratorDataSet {
    type: types.TReportDataViewUpdateChartJsConfiguratorDataSet,
    payload: { dataSet: ChartDataset, dataSetIndex: number, reportId: number, dataViewId: number },
}

export interface IReportDataViewUpdateQueryJs {
    type: types.TReportDataViewUpdateQueryJs,
    payload: { reportId: number, dataViewId: number, field: EDataViewFieldUpdate, contents: string },
}

export interface IGotReportDataViewPosition {
    type: types.TGotReportDataViewPosition,
    payload: { reportId: number, dataViewId: number, position: { x: number, y: number, w: number, h: number } },
}

export interface IReportParameterInputValuesInitialized {
    type: types.TReportParameterInputValuesInitialized,
    payload: { initialized: boolean, reportId: number, reportInstanceId: number }
}

export interface IReportResultsCached {
    type: types.TReportResultsCached,
    payload: { reportId: number, cached: boolean },
}

export interface IReportSetFavorite {
    type: types.TReportSetFavorite,
    payload: { report_id: number, favorite: boolean },
}

export interface IReportSetReportViewMode {
    type: types.TReportSetReportViewMode,
    payload: { reportId: number, reportInstanceId: number, viewMode: EReportViewMode },
}

export interface IReportShowDataViewAdd {
    type: types.TReportShowDataViewAdd,
    payload: { report_id: number, show: boolean },
}

export interface IReportShowDataViewQuery {
    type: types.TReportShowDataViewQuery,
    payload: { reportId: number, reportInstanceId: number, dataViewId: number, show: boolean },
}

export interface IReportTogglePanel {
    type: types.TReportTogglePanel,
    payload: { reportId: number, reportInstanceId: number, panel: EReportPanel, show: boolean },
}

export interface IReportUpdateInfo {
    type: types.TReportUpdateInfo,
    payload: { report_id: number, name: string },
}

export interface IResetReportsState {
    type: types.TResetReportsState,
    payload: null,
}

export const addReportInstance = (payload: { reportId: number, reportInstanceId: number }): IAddReportInstance => ({
    type: types.ADD_REPORT_INSTANCE,
    payload,
});

export const closeReportInstance = (payload: { reportId: number, reportInstanceId: number }): ICloseReportInstance => ({
    type: types.CLOSE_REPORT_INSTANCE,
    payload,
});

export const deletedReportDataView = (payload: { reportId: number, dataViewId: number }): IDeletedReportDataView => ({
    type: types.DELETED_REPORT_DATAVIEW,
    payload,
});

export const gotReport = (payload: TReport | null): IGotReport => ({
    type: types.GOT_REPORT,
    payload,
});

export const reportCacheUpdated = (payload: TReportCacheStatus): IReportCacheUpdated => ({
    type: types.REPORT_CACHE_UPDATED,
    payload
});

export const gotReportDataView = (payload: { dataView: TReportDataView, reportId: number, reportInstanceId: number }): IGotReportDataView => ({
    type: types.GOT_REPORT_DATAVIEW,
    payload,
});

export const gotReportDataViews = (payload: { dataViews: TReportDataView[] | null, reportId: number, reportInstanceId: number }): IGotReportDataViews => ({
    type: types.GOT_REPORT_DATAVIEWS,
    payload,
});

export const gotReportDataViewJs = (payload: { dataViewJs: TReportDataViewJs, reportId: number }): IGotReportDataViewJs => ({
    type: types.GOT_REPORT_DATAVIEW_JS,
    payload,
});

export const gotReportDataViewQuery = (payload: { dataViewQuery: string, reportId: number, dataViewId: number }): IGotReportDataViewQuery => ({
    type: types.GOT_REPORT_DATAVIEW_QUERY,
    payload,
});

export const gotReportDataViewResults = (payload: TReportAndDataViewEvent): IGotReportDataViewResults => ({
    type: types.GOT_REPORT_DATAVIEW_RESULTS,
    payload
})

export const reportDataViewRunEnd = (payload: TReportAndDataViewEvent): IReportDataViewRunEnd => ({
    type: types.REPORT_DATAVIEW_RUN_END,
    payload
});

export const reportDataViewRunError = (payload: TReportAndDataViewEvent): IReportDataViewRunError => ({
    type: types.REPORT_DATAVIEW_RUN_ERROR,
    payload
});

export const reportDataViewRunStart = (payload: TReportAndDataViewEvent): IReportDataViewRunStart => ({
    type: types.REPORT_DATAVIEW_RUN_START,
    payload
});

export const reportDataViewSetChartJSConfigurator = (payload: { chartJsConfigurator: TChartJsConfigurator, reportId: number, dataViewId: number }): IReportDataViewSetChartJsConfigurator => ({
    type: types.REPORT_DATAVIEW_SET_CHARTJS_CONFIGURATOR_OBJECT,
    payload
});

export const reportDataViewUpdateChartJsConfiguratorDataSet = (payload: { dataSet: ChartDataset, dataSetIndex: number, reportId: number, dataViewId: number }): IReportDataViewUpdateChartJsConfiguratorDataSet => ({
    type: types.REPORT_DATAVIEW_UPDATE_CHARTJS_CONFIGURATOR_DATA_SET,
    payload
});

export const reportDataViewUpdateQueryJs = (payload: { reportId: number, dataViewId: number, field: EDataViewFieldUpdate, contents: string }): IReportDataViewUpdateQueryJs => ({
    type: types.REPORT_DATAVIEW_UPDATE_QUERY_JS,
    payload
});

export const gotReportDataViewPosition = (payload: { reportId: number, dataViewId: number, position: { x: number, y: number, w: number, h: number } }): IGotReportDataViewPosition => ({
    type: types.GOT_REPORT_DATAVIEW_POSITION,
    payload,
})

export const reportExpandDataView = (payload: { reportId: number, reportInstanceId: number, dataViewId: number | undefined }): IReportExpandDataView => ({
    type: types.REPORT_EXPAND_DATAVIEW,
    payload
});

export const reportInstanceSetUseCache = (payload: { reportId: number, reportInstanceId: number, useCache: boolean }): IReportInstanceSetUseCache => ({
    type: types.REPORT_INSTANCE_SET_USE_CACHE,
    payload
})

export const reportParameterInputValuesInitialized = (payload: { initialized: boolean, reportId: number, reportInstanceId: number }): IReportParameterInputValuesInitialized => ({
    type: types.REPORT_PARAMETER_INPUT_VALUES_INITIALIZED,
    payload
});

export const reportRunEnd = (payload: TReportAndDataViewEvent): IReportRunEnd => ({
    type: types.REPORT_RUN_END,
    payload
});

export const reportRunStart = (payload: TReportAndDataViewEvent): IReportRunStart => ({
    type: types.REPORT_RUN_START,
    payload
});

export const reportSetFavorite = (payload: { report_id: number, favorite: boolean }): IReportSetFavorite => ({
    type: types.REPORT_SET_FAVORITE,
    payload
});

export const reportSetViewMode = (payload: { reportId: number, reportInstanceId: number, viewMode: EReportViewMode }): IReportSetReportViewMode => ({
    type: types.REPORT_SET_VIEW_MODE,
    payload
});

export const reportSetVisibility = (payload: { reportId: number, is_visible: boolean }): IReportSetVisibility => ({
    type: types.REPORT_SET_VISIBILITY,
    payload,
});

export const reportShowDataViewAdd = (payload: { report_id: number, show: boolean }): IReportShowDataViewAdd => ({
    type: types.REPORT_SHOW_DATAVIEW_ADD,
    payload
});

export const reportShowDataViewQuery = (payload: { reportId: number, reportInstanceId: number, dataViewId: number, show: boolean }): IReportShowDataViewQuery => ({
    type: types.REPORT_SHOW_DATAVIEW_QUERY,
    payload
})

export const reportTogglePanel = (payload: { reportId: number, reportInstanceId: number, panel: EReportPanel, show: boolean }): IReportTogglePanel => ({
    type: types.REPORT_TOGGLE_PANEL,
    payload
});

export const reportUpdateInfo = (payload: { report_id: number, name: string }): IReportUpdateInfo => ({
    type: types.REPORT_UPDATE_INFO,
    payload
});

export const resetReportsState = (): IResetReportsState => ({
    type: types.RESET_REPORTS_STATE,
    payload: null,
});

export const updateReportParameters = (payload: { report_id: number, parameters: TReportParameter[] }): IUpdateReportParameters => ({
    type: types.UPDATE_REPORT_PARAMETERS,
    payload
});

export const updateReportParameterInputValue = (payload: TNameValue & { reportId: number, reportInstanceId: number }): IUpdateReportParameterInputValue => ({
    type: types.UPDATE_REPORT_PARAMETER_INPUT_VALUE,
    payload
});

export const updateReportQueryCleanup = (payload: { query: string, reportId: number }): IUpdateReportQuery => ({
    type: types.UPDATE_REPORT_QUERY_CLEANUP,
    payload
});
export const updateReportQueryInit = (payload: { query: string, reportId: number }): IUpdateReportQuery => ({
    type: types.UPDATE_REPORT_QUERY_INIT,
    payload
});

export type TReportAction =
    | IAddReportInstance
    | ICloseReportInstance
    | IDeletedReportDataView
    | IGotReport
    | IGotReportDataViews
    | IGotReportDataView
    | IGotReportDataViewJs
    | IGotReportDataViewQuery
    | IGotReportDataViewResults
    | IReportCacheUpdated
    | IReportDataViewRunStart
    | IReportDataViewRunEnd
    | IReportDataViewRunError
    | IReportDataViewSetChartJsConfigurator
    | IReportDataViewUpdateChartJsConfiguratorDataSet
    | IReportDataViewUpdateQueryJs
    | IReportExpandDataView
    | IReportResultsCached
    | IReportRunStart
    | IReportRunEnd
    | IReportParameterInputValuesInitialized
    | IReportInstanceSetUseCache
    | IReportSetFavorite
    | IReportSetReportViewMode
    | IReportSetVisibility
    | IReportShowDataViewAdd
    | IReportShowDataViewQuery
    | IReportTogglePanel
    | IReportUpdateInfo
    | IResetReportsState
    | IUpdateReportParameters
    | IUpdateReportParameterInputValue
    | IUpdateReportQuery
    | IGotReportDataViewPosition
    ;