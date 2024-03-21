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

export const ADD_REPORT_INSTANCE = 'ADD_REPORT_INSTANCE';
export type TAddReportInstance = typeof ADD_REPORT_INSTANCE;

export const CLOSE_REPORT_INSTANCE = 'CLOSE_REPORT_INSTANCE';
export type TCloseReportInstance = typeof CLOSE_REPORT_INSTANCE;

export const DELETED_REPORT_DATAVIEW = 'DELETED_REPORT_DATAVIEW';
export type TDeletedReportDataView = typeof DELETED_REPORT_DATAVIEW;

export const GET_REPORT = 'GET_REPORT';
export type TGetReport = typeof GET_REPORT;

export const GOT_REPORT = 'GOT_REPORT';
export type TGotReport = typeof GOT_REPORT;

export const GOT_REPORT_DATAVIEWS = 'GOT_REPORT_DATAVIEWS';
export type TGotReportDataviews = typeof GOT_REPORT_DATAVIEWS;

export const GOT_REPORT_DATAVIEW = 'GOT_REPORT_DATAVIEW';
export type TGotReportDataview = typeof GOT_REPORT_DATAVIEW;

export const GOT_REPORT_DATAVIEW_JS = 'GOT_REPORT_DATAVIEW_JS';
export type TGotReportDataviewJs = typeof GOT_REPORT_DATAVIEW_JS;

export const GOT_REPORT_DATAVIEW_POSITION = 'GOT_REPORT_DATAVIEW_POSITION';
export type TGotReportDataViewPosition = typeof GOT_REPORT_DATAVIEW_POSITION;

export const GOT_REPORT_DATAVIEW_QUERY = 'GOT_REPORT_DATAVIEW_QUERY';
export type TGotReportDataviewQuery = typeof GOT_REPORT_DATAVIEW_QUERY;

export const GOT_REPORT_DATAVIEW_RESULTS = 'GOT_REPORT_DATAVIEW_RESULTS';
export type TGotReportDataViewResults = typeof GOT_REPORT_DATAVIEW_RESULTS;

export const LISTEN_PRIVATE_CHANNEL_REPORT = 'LISTEN_PRIVATE_CHANNEL_REPORT';
export type TListenPrivateChannelReport = typeof LISTEN_PRIVATE_CHANNEL_REPORT;

export const LISTEN_PUBLIC_CHANNEL_REPORT = 'LISTEN_PUBLIC_CHANNEL_REPORT';
export type TListenPublicChannelReport = typeof LISTEN_PUBLIC_CHANNEL_REPORT;

export const PUBLIC_GET_REPORT = 'PUBLIC_GET_REPORT';
export type TPublicGetReport = typeof PUBLIC_GET_REPORT;

export const PUBLIC_GET_REPORT_DATAVIEWS = 'PUBLIC_GET_REPORT_DATAVIEWS';
export type TPublicGetReportDataviews = typeof PUBLIC_GET_REPORT_DATAVIEWS;

export const REPORT_CACHE_RESULTS = 'REPORT_CACHE_RESULTS';
export type TReportCacheResults = typeof REPORT_CACHE_RESULTS;

export const REPORT_CACHE_UPDATED = 'REPORT_CACHE_UPDATED';
export type TReportCacheUpdated = typeof REPORT_CACHE_UPDATED;

export const REPORT_EXPAND_DATAVIEW = 'EXPAND_DATAVIEW';
export type TReportExpandDataView = typeof REPORT_EXPAND_DATAVIEW;

export const REPORT_INSTANCE_SET_USE_CACHE = 'REPORT_INSTANCE_SET_USE_CACHE';
export type TReportInstanceSetUseCache = typeof REPORT_INSTANCE_SET_USE_CACHE;

export const REPORT_RUN_START = 'REPORT_RUN_START';
export type TReportRunStart = typeof REPORT_RUN_START;

export const REPORT_RUN_END = 'REPORT_RUN_END';
export type TReportRunEnd = typeof REPORT_RUN_END;

export const REPORT_DATAVIEW_RUN_START = 'REPORT_DATAVIEW_RUN_START';
export type TReportDataViewRunStart = typeof REPORT_DATAVIEW_RUN_START;

export const REPORT_DATAVIEW_RUN_END = 'REPORT_DATAVIEW_RUN_END';
export type TReportDataViewRunEnd = typeof REPORT_DATAVIEW_RUN_END;

export const REPORT_DATAVIEW_RUN_ERROR = 'REPORT_DATAVIEW_RUN_ERROR';
export type TReportDataViewRunError = typeof REPORT_DATAVIEW_RUN_ERROR;

export const REPORT_DATAVIEW_UPDATE_QUERY_JS = 'REPORT_DATAVIEW_UPDATE_QUERY_JS';
export type TReportDataViewUpdateQueryJs = typeof REPORT_DATAVIEW_UPDATE_QUERY_JS;

export const REPORT_PARAMETER_INPUT_VALUES_INITIALIZED = 'REPORT_PARAMETER_INPUT_VALUES_INITIALIZED';
export type TReportParameterInputValuesInitialized = typeof REPORT_PARAMETER_INPUT_VALUES_INITIALIZED;

export const REPORT_RESULTS_CACHED = 'REPORT_RESULTS_CACHED';
export type TReportResultsCached = typeof REPORT_RESULTS_CACHED;

export const REPORT_SET_FAVORITE = 'REPORT_SET_FAVORITE';
export type TReportSetFavorite = typeof REPORT_SET_FAVORITE;

export const REPORT_SET_VIEW_MODE = 'REPORT_SET_VIEW_MODE';
export type TReportSetReportViewMode = typeof REPORT_SET_VIEW_MODE;

export const REPORT_SET_VISIBILITY = 'REPORT_SET_VISIBILITY';
export type TReportSetVisibility = typeof REPORT_SET_VISIBILITY;

export const REPORT_SHOW_OPTIONS = 'REPORT_SHOW_OPTIONS';
export type TReportShowOptions = typeof REPORT_SHOW_OPTIONS;

export const REPORT_SHOW_PARAMS = 'REPORT_SHOW_PARAMS';
export type TReportShowParams = typeof REPORT_SHOW_PARAMS;

export const REPORT_SHOW_DATAVIEW_ADD = 'REPORT_SHOW_DATAVIEW_ADD';
export type TReportShowDataViewAdd = typeof REPORT_SHOW_DATAVIEW_ADD;

export const REPORT_SHOW_DATAVIEW_PARAMS = 'REPORT_SHOW_DATAVIEW_PARAMS';
export type TReportShowDataViewParams = typeof REPORT_SHOW_DATAVIEW_PARAMS;

export const REPORT_SHOW_DATAVIEW_QUERY = 'REPORT_SHOW_DATAVIEW_QUERY';
export type TReportShowDataViewQuery = typeof REPORT_SHOW_DATAVIEW_QUERY;

export const REPORT_TOGGLE_PANEL = 'REPORT_TOGGLE_PANEL';
export type TReportTogglePanel = typeof REPORT_TOGGLE_PANEL;

export const REPORT_UPDATE_INFO = 'REPORT_UPDATE_INFO';
export type TReportUpdateInfo = typeof REPORT_UPDATE_INFO;

export const RESET_REPORTS_STATE = 'RESET_REPORTS_STATE';
export type TResetReportsState = typeof RESET_REPORTS_STATE;

export const UPDATE_REPORT_DATAVIEW_JS = 'UPDATE_REPORT_DATAVIEW_JS';
export type TUpdateReportDataViewJs = typeof UPDATE_REPORT_DATAVIEW_JS;

export const UPDATE_REPORT_DATAVIEW_QUERY = 'UPDATE_REPORT_DATAVIEW_QUERY';
export type TUpdateReportDataViewQuery = typeof UPDATE_REPORT_DATAVIEW_QUERY;

export const UPDATE_REPORT_PARAMETERS = 'UPDATE_REPORT_PARAMETERS';
export type TUpdateReportParameters = typeof UPDATE_REPORT_PARAMETERS;

export const UPDATE_REPORT_PARAMETER_INPUT_VALUE = 'UPDATE_REPORT_PARAMETER_INPUT_VALUE';
export type TUpdateReportParameterInputValue = typeof UPDATE_REPORT_PARAMETER_INPUT_VALUE;

export const UPDATE_REPORT_QUERY_CLEANUP = 'UPDATE_REPORT_QUERY_CLEANUP';
export type TUpdateReportQueryCleanup = typeof UPDATE_REPORT_QUERY_CLEANUP;

export const UPDATE_REPORT_QUERY_INIT = 'UPDATE_REPORT_QUERY_INIT';
export type TUpdateReportQueryInit = typeof UPDATE_REPORT_QUERY_INIT;