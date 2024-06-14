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

import { Layout } from "react-grid-layout";

import {
    IDeletedReportDataView,
    IGotReportDataView,
    IGotReportDataViewJs,
    IGotReportDataViewQuery,
    IReportDataViewRunEnd,
    IReportDataViewRunError,
    IReportDataViewRunStart,
    IReportSetFavorite,
    IReportShowDataViewAdd,
    IReportShowDataViewQuery,
    IReportTogglePanel,
    IReportUpdateInfo,
    IUpdateReportParameters,
    IUpdateReportQuery,
    TReportAction
}                                                         from "./actions";
import { initialState, IReportState, reportInitialState } from "./initialState";
import {
    ADD_REPORT_INSTANCE,
    CLOSE_REPORT_INSTANCE,
    DELETED_REPORT_DATAVIEW,
    GOT_REPORT,
    GOT_REPORT_DATAVIEW,
    GOT_REPORT_DATAVIEW_JS,
    GOT_REPORT_DATAVIEW_POSITION,
    GOT_REPORT_DATAVIEW_QUERY,
    GOT_REPORT_DATAVIEW_RESULTS,
    GOT_REPORT_DATAVIEWS,
    REPORT_CACHE_UPDATED,
    REPORT_DATAVIEW_RUN_END,
    REPORT_DATAVIEW_RUN_ERROR,
    REPORT_DATAVIEW_RUN_START,
    REPORT_DATAVIEW_SET_CHARTJS_OBJECT,
    REPORT_DATAVIEW_UPDATE_CHARTJS_DATA_SET,
    REPORT_DATAVIEW_UPDATE_QUERY_JS,
    REPORT_EXPAND_DATAVIEW,
    REPORT_INSTANCE_SET_USE_CACHE,
    REPORT_PARAMETER_INPUT_VALUES_INITIALIZED,
    REPORT_RUN_END,
    REPORT_RUN_START,
    REPORT_SET_FAVORITE,
    REPORT_SET_VIEW_MODE,
    REPORT_SET_VISIBILITY,
    REPORT_SHOW_DATAVIEW_ADD,
    REPORT_SHOW_DATAVIEW_QUERY,
    REPORT_TOGGLE_PANEL,
    REPORT_UPDATE_INFO,
    RESET_REPORTS_STATE,
    UPDATE_REPORT_PARAMETER_INPUT_VALUE,
    UPDATE_REPORT_PARAMETERS,
    UPDATE_REPORT_QUERY_CLEANUP,
    UPDATE_REPORT_QUERY_INIT
}                                                         from "./types";
import TReportParameter                                   from "../../../types/TReportParameter";
import TReportDataView                                    from "../../../types/TReportDataView";
import { EDataViewFieldUpdate }                           from "../../../types/EDataViewFieldUpdate";
import TDataViewInstance                                  from "../../../types/TDataViewInstance";
import TReportInstance                                    from "../../../types/TReportInstance";
import { EReportPanel }                                   from "../../../types/EReportPanels";
import { EReportViewMode }                                from "../../../types/EReportViewMode";
import TReportStateReportInstanceDataViewInstance         from "../../../types/TReportStateReportInstanceDataViewInstance";
import TReportStateReportInstance                         from "../../../types/TReportStateReportInstance";
import TReportDataViewState                               from "../../../types/TReportDataViewState";
import { EDataViewType }                                  from "../../../types/EDataViewType";
import TReport                                            from "../../../types/TReport";
import { TNameValue }                                     from "../../../types/TNameValue";
import TReportDataViewJs                                  from "../../../types/TReportDataViewJs";
import { ChartDataset }                                   from "chart.js";


export const defaultDataViewInstance: TDataViewInstance = {
    id: 0,
    loading: false,
    results: [],
    showQuery: true,
    waitingData: false,
    results_from_cache: false,
}

export const defaultDataViewJs: TReportDataViewJs = {
    id: 0,
    report_data_view_id: 1,
    report_data_view_lib_version_id: 1,
    json_form: '',
    json_form_minified: false,
    js_code: '',
    js_code_minified: false,
}

export const defaultDataView: TReportDataView = {
    by_chunk: false,
    chunk_size: 1000,
    id: 0,
    is_visible: true,
    max_width: undefined,
    name: "",
    on_queue: false,
    position: "",
    query: "",
    report_data_view_js: defaultDataViewJs,
    report_data_view_js_id: 1,
    report_data_view_lib_version_id: 1,
    type: EDataViewType.TABLE
};

export const extractReportDataViewFromReportIdAndDataViewId = (state: IReportState[], reportId: number, dataViewId: number): TReportDataViewState => {

    // console.debug('============> report reducer | extractReportDataViewFromReportIdAndDataViewId <============');
    // console.debug('reportId', reportId);
    // console.debug('dataViewId', dataViewId);

    const report = state.find((reportState: IReportState) => Number(reportState?.report?.id) === Number(reportId))?.report;

    return {
        report: report ?? undefined,
        dataView: report?.dataViews?.find((dataView: TReportDataView) => Number(dataView.id) === Number(dataViewId))
    }
}

export const extractReportStateReportInstanceDataViewInstanceFromLocation = (state: IReportState[], pathname: string, withLayout?: boolean): TReportStateReportInstanceDataViewInstance => {

    const matchReportIdInstanceId = new RegExp(/report\/(\d{1,10})_(\d{1,13})/g).exec(pathname);
    const matchesReportDataViewId = new RegExp(/report\/\d{1,10}_\d{1,13}\/data-view\/(\d{1,10})/g).exec(pathname);

    // console.debug('============> report reducer | extractReportStateFromLocation <============');
    // console.debug('location', pathname);
    // console.debug('matchReportUniqId', matchReportIdInstanceId);
    // console.debug('matchesReportDataViewId', matchesReportDataViewId);

    let report: TReport | null | undefined = null;
    let temporaryLayout: Layout[] | undefined;
    if (matchReportIdInstanceId) {

        report = state.find((reportState: IReportState) => reportState.report?.id === Number(matchReportIdInstanceId[1]))?.report;
        if (withLayout === true) {
            temporaryLayout = state.find((reportState: IReportState) => reportState.report?.id === Number(matchReportIdInstanceId[1]))?.temporaryLayout;
        }
    }

    return {
        report: report ?? undefined,

        instance: matchReportIdInstanceId
            ? state.find((reportState: IReportState) => Number(reportState.report?.id) === Number(matchReportIdInstanceId[1]))
                ?.instances.find((reportInstance: TReportInstance) => Number(reportInstance.id) === Number(matchReportIdInstanceId[2]))
            : undefined,

        dataViewInstance: (matchReportIdInstanceId && matchesReportDataViewId)
            ? state.find((reportState: IReportState) => Number(reportState.report?.id) === Number(matchReportIdInstanceId[1]))
                ?.instances.find((reportInstance: TReportInstance) => Number(reportInstance.id) === Number(matchReportIdInstanceId[2]))
                ?.dataViewInstances.find((dataViewInstance: TDataViewInstance) => Number(dataViewInstance.id) === Number(matchesReportDataViewId[1]))
            : undefined,

        temporaryLayout,
    }
}

export const extractReportStateFromReportId = (state: IReportState[], reportId: number | null): IReportState => {

    // console.debug('============> report reducer | extractReportStateFromReportId <============');
    // console.debug('reportId', reportId);

    return (
        state.find((reportState: IReportState) => Number(reportState.report?.id) === Number(reportId))
        || reportInitialState
    );
}

export const extractReportStateFromReportIdAndInstanceId = (state: IReportState[], reportId: number, reportInstanceId: number): TReportStateReportInstance => {

    // console.debug('============> report reducer | extractReportStateFromReportIdAndInstanceId <============');
    // console.debug('reportId', reportId);
    // console.debug('reportInstanceId', reportInstanceId);

    const reportState = state.find((reportState: IReportState) => Number(reportState.report?.id) === Number(reportId));

    // console.debug('reportState', reportState);
    // console.debug('instance', reportState?.instances.find((reportInstance: TReportInstance) => Number(reportInstance.id) === Number(reportInstanceId)));

    return {
        instance: reportState?.instances.find((reportInstance: TReportInstance) => Number(reportInstance.id) === Number(reportInstanceId)),
        report: reportState?.report ?? undefined
    }
}


const updateReportState = (state: IReportState[], reportId: number | null, payload: any): IReportState[] => {

    const reportIndex = state.findIndex((reportState: IReportState) => reportState.report?.id === reportId);
    const newState = [...state];

    if (reportIndex > -1) {

        newState[reportIndex] = {...newState[reportIndex], ...payload};
    } else {

        newState.push(payload);
    }
    console.debug('======> updateReportState()', newState);
    return newState;
}

const initializeDefaultParametersInputValue = (parameters: TReportParameter[]) => {

    return parameters.map(parameter => ({
        name: parameter.variable_name,
        value: (parameter.parameter_input?.default_value && parameter.parameter_input?.default_value.length > 0) ? parameter.parameter_input.default_value : parameter.forced_default_value
    }));
}

const reducer = (state: IReportState[], action: TReportAction): IReportState[] => {

    console.debug('======> reducer()', action);
    let reportState: IReportState;

    switch (action.type) {

        // When we open a new report instance. (so we already got report's data with GOT_REPORT)
        case ADD_REPORT_INSTANCE:

            reportState = extractReportStateFromReportId(
                [...state],
                action.payload?.reportId || null,
            );

            return updateReportState(
                state,
                action.payload?.reportId || null,
                {
                    ...reportState,
                    instances: [
                        ...reportState.instances,
                        {
                            id: Number(action.payload?.reportInstanceId),
                            dataViewInstances: reportState.report?.dataViews?.map(
                                (dataView: TReportDataView) => {

                                    return {
                                        id: dataView.id,
                                        loading: false,
                                        results: [],
                                        showQuery: true,
                                    }
                                }
                            ),
                            panels: {
                                [EReportPanel.QUERY_INIT]: false,
                                [EReportPanel.DATA_VIEWS]: true,
                                [EReportPanel.QUERY_CLEANUP]: false,
                            },
                            error: false,
                            viewMode: EReportViewMode.CLIENT,
                            // do not update report parameters if already initialized
                            reportParameterInputValues: initializeDefaultParametersInputValue(reportState.report?.parameters || []),
                            reportParameterInputValuesInitialized: true,
                            showDataViewAdd: false,
                            useCache: reportState.report?.has_cache,
                            has_job_cache: reportState.report?.has_job_cache,
                            has_user_cache: reportState.report?.has_user_cache,
                            num_parameter_sets_cached_by_jobs: reportState.report?.num_parameter_sets_cached_by_jobs,
                            num_parameter_sets_cached_by_users: reportState.report?.num_parameter_sets_cached_by_users,
                        }
                    ],
                }
            );

        case CLOSE_REPORT_INSTANCE:

            reportState = extractReportStateFromReportId(
                [...state],
                action.payload?.reportId || null,
            );

            reportState.instances = reportState.instances.filter(reportInstance => reportInstance.id !== action.payload.reportInstanceId);

            // Remove completely this report.
            if (reportState.instances.length === 0) {

                return state.filter(reportState => reportState.report?.id !== action.payload.reportId || reportState.report === null)
            }

            // Just update report's instances, removing one instance.
            return updateReportState(
                state,
                action.payload.reportId,
                {
                    ...reportState,
                    instances: reportState.instances
                }
            );

        case DELETED_REPORT_DATAVIEW:

            reportState = extractReportStateFromReportId(
                [...state],
                (action as IDeletedReportDataView).payload?.reportId,
            );

            // let currentDataViews = reportState.report?.dataViews || [];

            return updateReportState(
                state,
                (action as IDeletedReportDataView).payload?.reportId,
                {
                    ...reportState,
                    report: {
                        ...reportState.report,
                        dataViews: reportState.report?.dataViews?.filter(dataView => dataView.id !== (action as IDeletedReportDataView).payload?.dataViewId)
                    },
                }
            );

        // When we open for the first time a report.
        case GOT_REPORT:

            reportState = extractReportStateFromReportId(
                [...state],
                action.payload?.id || null,
            );

            // If we open a report configuration form, without having opened an instance.
            if (Number(action.payload?.instance_id) === 9999999999999) {

                return updateReportState(
                    state,
                    action.payload?.id || null,
                    {
                        ...reportState,
                        // instance_id: undefined because it's only for a report's instance. (we got that from the response)
                        report: {...reportState.report, ...action.payload, instance_id: undefined},
                    }
                );
            } else {

                return updateReportState(
                    state,
                    action.payload?.id || null,
                    {
                        ...reportState,
                        // instance_id: undefined because it's only for a report's instance. (we got that from the response)
                        report: {...reportState.report, ...action.payload, instance_id: undefined},
                        instances: [
                            ...reportState.instances,
                            {
                                dataViewInstances: [],
                                error: false,
                                id: Number(action.payload?.instance_id),
                                isLoading: false,
                                panels: {
                                    [EReportPanel.QUERY_INIT]: false,
                                    [EReportPanel.DATA_VIEWS]: true,
                                    [EReportPanel.QUERY_CLEANUP]: false,
                                },
                                // do not update report parameters if already initialized
                                reportParameterInputValues: initializeDefaultParametersInputValue(action.payload?.parameters || []),
                                reportParameterInputValuesInitialized: true,
                                showDataViewAdd: false,
                                useCache: action?.payload?.has_cache,
                                has_job_cache: action?.payload?.has_job_cache,
                                has_user_cache: action?.payload?.has_user_cache,
                                num_parameter_sets_cached_by_jobs: action?.payload?.num_parameter_sets_cached_by_jobs,
                                num_parameter_sets_cached_by_users: action?.payload?.num_parameter_sets_cached_by_users,
                                viewMode: EReportViewMode.CLIENT
                            }
                        ],
                    }
                );
            }

        case GOT_REPORT_DATAVIEW:

            reportState = extractReportStateFromReportId(
                [...state],
                action.payload?.reportId,
            );

            // @todo - is this check really useful ?
            let dataViewFound = false;
            let newCurrentDataViews: Array<TReportDataView> = [];
            let newCurrentDataViewsInstances: Array<TDataViewInstance> = [];

            if (reportState.report?.dataViews) {

                newCurrentDataViews = reportState.report?.dataViews?.map((dataViewLooped: TReportDataView) => {
                    if (dataViewLooped.id === action.payload?.dataView.id) {

                        dataViewFound = true;
                        return {
                            ...dataViewLooped,
                            ...action.payload.dataView,
                        };
                    }

                    return dataViewLooped;
                });
            }

            if (!dataViewFound) {

                newCurrentDataViews.push({
                    ...action.payload.dataView,
                });

                newCurrentDataViewsInstances = reportState.instances.find((reportInstance: TReportInstance) => reportInstance.id === action.payload.reportInstanceId)?.dataViewInstances || [];
                newCurrentDataViewsInstances.push({
                    ...defaultDataViewInstance,
                    id: action.payload.dataView.id,
                })
            }

            return updateReportState(
                state,
                (action as IGotReportDataView).payload?.reportId || null,
                {
                    ...reportState,
                    report: {
                        ...reportState.report,
                        dataViews: newCurrentDataViews
                    },
                    instances: [
                        ...reportState.instances.map(
                            (reportInstance: TReportInstance) => {

                                if (reportInstance.id === action.payload?.reportInstanceId) {

                                    return {
                                        ...reportInstance,
                                        dataViewInstances: newCurrentDataViewsInstances
                                    }
                                }

                                return reportInstance;
                            }
                        )
                    ]
                }
            );

        case GOT_REPORT_DATAVIEWS:

            reportState = extractReportStateFromReportId(
                [...state],
                action.payload?.reportId,
            );

            return updateReportState(
                state,
                action.payload?.reportId || null,
                {
                    ...reportState,
                    report: {
                        ...reportState.report,
                        dataViews: action.payload?.dataViews
                    },
                    instances: [
                        ...reportState.instances.map(
                            (reportInstance: TReportInstance) => {

                                if (reportInstance.id === action.payload?.reportInstanceId) {

                                    return {
                                        ...reportInstance,
                                        dataViewInstances: action.payload?.dataViews?.map(
                                            (dataView: TReportDataView) => {

                                                return {
                                                    ...defaultDataViewInstance,
                                                    id: dataView.id,
                                                }
                                            }
                                        )
                                    }
                                }

                                return reportInstance;
                            }
                        ),
                    ],
                }
            );

        case GOT_REPORT_DATAVIEW_JS:

            if ((action as IGotReportDataViewJs).payload.dataViewJs === undefined) {

                console.warn('report:store:reducer - empty report data view js.');
                return state;
            }

            reportState = extractReportStateFromReportId(
                [...state],
                action.payload?.reportId,
            );

            if (reportState.report?.dataViews) {

                const newState = {
                    ...reportState,
                    report: {
                        ...reportState.report,
                        dataViews: [
                            ...reportState.report?.dataViews?.map(dataView => {
                                if (dataView.id === action.payload?.dataViewJs.report_data_view_id) {
                                    return {
                                        ...dataView,
                                        report_data_view_js: action.payload?.dataViewJs,
                                        loading: false,
                                    }
                                }
                                return dataView;
                            }),
                        ],
                    },
                    instances: [
                        ...reportState.instances.map((reportInstance: TReportInstance) => {

                            return {
                                ...reportInstance,
                                dataViewInstances: reportInstance.dataViewInstances.map((dataViewInstance: TDataViewInstance) => {

                                    if (dataViewInstance.id === Number(action.payload.dataViewJs.report_data_view_id)) {
                                        return {
                                            ...dataViewInstance,
                                            errors: dataViewInstance.errors?.filter(error => !error.startsWith('Javascript error :')),
                                        }
                                    }

                                    return dataViewInstance;
                                })
                            }
                        })
                    ]
                };

                return updateReportState(
                    state,
                    (action as IGotReportDataViewJs).payload?.reportId || null,
                    newState
                );
            }
            return state;

        case GOT_REPORT_DATAVIEW_POSITION:
            reportState = extractReportStateFromReportId(
                [...state],
                action.payload?.reportId,
            );

            if (reportState.report?.dataViews) {

                const newState = {
                    ...reportState,
                    report: {
                        ...reportState.report,
                        dataViews: [
                            ...reportState.report?.dataViews?.map(dataView => {
                                if (dataView.id === action.payload?.dataViewId) {
                                    return {
                                        ...dataView,
                                        position: JSON.stringify(action.payload?.position),
                                        loading: false,
                                    }
                                }
                                return dataView;
                            }),
                        ],
                    },
                };

                return updateReportState(
                    state,
                    action.payload?.reportId || null,
                    newState
                );
            }
            return state;

        case GOT_REPORT_DATAVIEW_QUERY:
            reportState = extractReportStateFromReportId(
                [...state],
                (action as IGotReportDataViewQuery).payload?.reportId,
            );

            if (reportState.report?.dataViews) {

                const newState = {
                    ...reportState,
                    report: {
                        ...reportState.report,
                        dataViews: [
                            ...reportState.report?.dataViews?.map(dataView => {
                                if (dataView.id === (action as IGotReportDataViewQuery).payload?.dataViewId) {
                                    return {
                                        ...dataView,
                                        query: (action as IGotReportDataViewQuery).payload?.dataViewQuery,
                                        loading: false,
                                    }
                                }
                                return dataView;
                            }),
                        ],
                    },
                };

                return updateReportState(
                    state,
                    (action as IGotReportDataViewQuery).payload?.reportId || null,
                    newState
                );
            }
            return state;

        case GOT_REPORT_DATAVIEW_RESULTS:

            reportState = extractReportStateFromReportId(
                [...state],
                action.payload?.report_id || null,
            );

            if (reportState.report?.dataViews) {

                return updateReportState(
                    state,
                    action.payload?.report_id || null,
                    {
                        ...reportState,

                        instances: [
                            ...reportState.instances.map(
                                (reportInstance: TReportInstance) => {

                                    if (reportInstance.id === Number(action.payload?.instance_id)) {

                                        return {
                                            ...reportInstance,
                                            dataViewInstances:
                                                reportInstance.dataViewInstances?.map(
                                                    (dataViewInstance: TDataViewInstance) => {

                                                        if (dataViewInstance.id === Number(action.payload?.data_view_id)) {
                                                            return {
                                                                ...dataViewInstance,
                                                                results: action.payload?.results,
                                                                loading: false,
                                                            }
                                                        }

                                                        return dataViewInstance;
                                                    }
                                                )
                                        }
                                    }

                                    return reportInstance;
                                }
                            ),
                        ],
                    }
                );
            }

            return state;

        case REPORT_CACHE_UPDATED:

            reportState = extractReportStateFromReportId(
                [...state],
                action.payload.report_id || null,
            );

            return updateReportState(
                state,
                action.payload.report_id || null,
                {
                    ...reportState,
                    report: {
                        ...reportState.report,
                        has_cache: action.payload.has_cache,
                        has_job_cache: action.payload.has_job_cache,
                        has_user_cache: action.payload.has_user_cache,
                        num_parameter_sets_cached_by_jobs: action.payload.num_parameter_sets_cached_by_jobs,
                        num_parameter_sets_cached_by_users: action.payload.num_parameter_sets_cached_by_users,
                    },
                    instances: reportState.instances.map((reportInstance: TReportInstance) => {
                        return {
                            ...reportInstance,
                            useCache: action.payload.has_cache,
                            has_job_cache: action.payload.has_job_cache,
                            has_user_cache: action.payload.has_user_cache,
                            num_parameter_sets_cached_by_jobs: action.payload.num_parameter_sets_cached_by_jobs,
                            num_parameter_sets_cached_by_users: action.payload.num_parameter_sets_cached_by_users,
                        }
                    })
                }
            );

        case REPORT_DATAVIEW_RUN_END:

            reportState = extractReportStateFromReportId(
                [...state],
                (action as IReportDataViewRunEnd).payload?.report_id || null,
            );

            if (reportState.report?.dataViews) {
                return updateReportState(
                    state,
                    (action as IReportDataViewRunEnd).payload?.report_id || null,
                    {
                        ...reportState,

                        instances: [
                            ...reportState.instances.map((reportInstance: TReportInstance) => {

                                if (reportInstance.id === Number(action.payload.instance_id)) {

                                    return {
                                        ...reportInstance,
                                        isLoading: false,
                                        dataViewInstances: reportInstance.dataViewInstances.map((dataViewInstance: TDataViewInstance) => {

                                            if (dataViewInstance.id === Number(action.payload.data_view_id)) {
                                                return {
                                                    ...dataViewInstance,
                                                    loading: false,
                                                    end: Date.now(),
                                                    waitingData: false,
                                                    elapsedTime: action.payload.ms_elapsed,
                                                    results_from_cache: action.payload.results_from_cache,
                                                    results_cache_type: action.payload.results_cache_type,
                                                    results_cached_at: action.payload.results_cached_at,
                                                }
                                            }

                                            return dataViewInstance;
                                        })
                                    }
                                }

                                return reportInstance;
                            })
                        ]
                    }
                );
            }
            return state;

        case REPORT_DATAVIEW_RUN_ERROR:

            reportState = extractReportStateFromReportId(
                [...state],
                (action as IReportDataViewRunError).payload?.report_id || null,
            );

            if (reportState.report?.dataViews) {
                return updateReportState(
                    state,
                    (action as IReportDataViewRunError).payload?.report_id || null,
                    {
                        ...reportState,

                        instances: [
                            ...reportState.instances.map((reportInstance: TReportInstance) => {

                                if (reportInstance.id === Number(action.payload.instance_id)) {

                                    return {
                                        ...reportInstance,
                                        isLoading: false,
                                        dataViewInstances: reportInstance.dataViewInstances.map((dataViewInstance: TDataViewInstance) => {

                                            if (dataViewInstance.id === Number(action.payload.data_view_id)) {
                                                return {
                                                    ...dataViewInstance,
                                                    loading: false,
                                                    errors: action.payload.errors,
                                                    end: Date.now(),
                                                    waitingData: false,
                                                    elapsedTime: action.payload.ms_elapsed,
                                                    results_from_cache: false,
                                                    results_cache_type: '',
                                                    results_cached_at: new Date(),
                                                }
                                            }

                                            return dataViewInstance;
                                        })
                                    }
                                }

                                return reportInstance;
                            })
                        ]
                    }
                );
            }
            return state;

        // Used when initialising the ChartJs object from js code.
        case REPORT_DATAVIEW_SET_CHARTJS_OBJECT:

            reportState = extractReportStateFromReportId(
                [...state],
                action.payload?.reportId || null,
            );

            if (reportState.report?.dataViews) {

                return updateReportState(
                    state,
                    action.payload?.reportId || null,
                    {
                        ...reportState,
                        report: {
                            ...reportState.report,
                            dataViews: reportState.report?.dataViews?.map((dataView: TReportDataView) => {

                                if (dataView.id === action.payload?.dataViewId) {

                                    return {
                                        ...dataView,
                                        report_data_view_js: {
                                            ...dataView.report_data_view_js,
                                            chartJs: action.payload?.chartjs
                                        }
                                    }
                                }

                                return dataView;
                            })
                        }
                    }
                );
            }

            return state;

        // Mainly used by ChartJsConfigurator components.
        case REPORT_DATAVIEW_UPDATE_CHARTJS_DATA_SET:

            reportState = extractReportStateFromReportId(
                [...state],
                action.payload?.reportId || null,
            );

            if (reportState.report?.dataViews) {

                return updateReportState(
                    state,
                    action.payload?.reportId || null,
                    {
                        ...reportState,
                        report: {
                            ...reportState.report,
                            dataViews: reportState.report?.dataViews?.map((dataView: TReportDataView) => {

                                if (dataView.id === action.payload?.dataViewId) {

                                    return {
                                        ...dataView,
                                        report_data_view_js: {
                                            ...dataView.report_data_view_js,
                                            chartJs: {
                                                ...dataView.report_data_view_js.chartJs,
                                                config: {
                                                    ...dataView.report_data_view_js.chartJs?.config,
                                                    data: {
                                                        ...dataView.report_data_view_js.chartJs?.config?.data,
                                                        datasets: dataView.report_data_view_js.chartJs?.config?.data?.datasets?.map((dataSet: ChartDataset, index: number) => {

                                                            if (index === action.payload.dataSetIndex) {

                                                                return action.payload.dataSet;
                                                            }

                                                            return dataSet;
                                                        })
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                return dataView;
                            })
                        }
                    }
                );
            }

            return state;

        case REPORT_DATAVIEW_RUN_START:

            reportState = extractReportStateFromReportId(
                [...state],
                (action as IReportDataViewRunStart).payload?.report_id || null,
            );

            if (reportState.report?.dataViews) {

                return updateReportState(
                    state,
                    (action as IReportDataViewRunStart).payload?.report_id || null,
                    {
                        ...reportState,

                        instances: [
                            ...reportState.instances.map((reportInstance: TReportInstance) => {

                                if (reportInstance.id === Number(action.payload.instance_id)) {

                                    return {
                                        ...reportInstance,
                                        isLoading: true,
                                        dataViewInstances: reportInstance.dataViewInstances.map((dataViewInstance: TDataViewInstance) => {

                                            if (dataViewInstance.id === Number(action.payload.data_view_id)) {

                                                return {
                                                    ...dataViewInstance,
                                                    start: Date.now(),
                                                    end: null,
                                                    results: [],
                                                    errors: [],
                                                    loading: true,
                                                    waitingData: true,
                                                    elapsedTime: undefined,
                                                    results_from_cache: false,
                                                    results_cache_type: '',
                                                    results_cached_at: new Date(),
                                                }
                                            }

                                            return dataViewInstance;
                                        })
                                    }
                                }

                                return reportInstance;
                            })
                        ]
                    }
                );
            }

            return state;

        case REPORT_DATAVIEW_UPDATE_QUERY_JS:

            reportState = extractReportStateFromReportId(
                [...state],
                action.payload?.reportId || null,
            );

            if (reportState.report?.dataViews) {
                return updateReportState(
                    state,
                    action.payload?.reportId || null,
                    {
                        ...reportState,
                        report: {
                            ...reportState.report,
                            dataViews: [
                                ...reportState.report?.dataViews?.map(dataView => {

                                    if (dataView.id === action.payload.dataViewId) {

                                        switch (action.payload?.field) {

                                            case EDataViewFieldUpdate.QUERY:
                                                return {
                                                    ...dataView,
                                                    query: action.payload.contents
                                                }

                                            case EDataViewFieldUpdate.JS:
                                                return {
                                                    ...dataView,
                                                    report_data_view_js: {
                                                        ...dataView.report_data_view_js,
                                                        js_code: action.payload.contents
                                                    }
                                                }

                                            case EDataViewFieldUpdate.JS_INIT:
                                                return {
                                                    ...dataView,
                                                    report_data_view_js: {
                                                        ...dataView.report_data_view_js,
                                                        js_init: action.payload.contents
                                                    }
                                                }

                                            case EDataViewFieldUpdate.JS_REGISTER:
                                                return {
                                                    ...dataView,
                                                    report_data_view_js: {
                                                        ...dataView.report_data_view_js,
                                                        js_register: action.payload.contents
                                                    }
                                                }
                                        }
                                    }

                                    return dataView;
                                }),
                            ],
                        },
                    }
                );
            }

            return state;

        case REPORT_EXPAND_DATAVIEW:

            reportState = extractReportStateFromReportId(
                [...state],
                action.payload.reportId || null,
            )

            return updateReportState(
                state,
                action.payload.reportId,
                {
                    ...reportState,
                    instances: [
                        ...reportState.instances.map((reportInstance: TReportInstance) => {

                            if (reportInstance.id === Number(action.payload.reportInstanceId)) {

                                return {
                                    ...reportInstance,
                                    expandedDataViewId: action.payload.dataViewId
                                }
                            }

                            return reportInstance;
                        })
                    ]
                },
            );

        case REPORT_INSTANCE_SET_USE_CACHE:

            reportState = extractReportStateFromReportId(
                [...state],
                action.payload.reportId || null,
            )

            return updateReportState(
                state,
                action.payload.reportId,
                {
                    ...reportState,
                    instances: [
                        ...reportState.instances.map((reportInstance: TReportInstance) => {

                            if (reportInstance.id === Number(action.payload.reportInstanceId)) {

                                return {
                                    ...reportInstance,
                                    useCache: action.payload.useCache
                                }
                            }

                            return reportInstance;
                        })
                    ]
                },
            );

        case REPORT_PARAMETER_INPUT_VALUES_INITIALIZED:

            reportState = extractReportStateFromReportId(
                [...state],
                action.payload.reportId
            );

            return updateReportState(
                state,
                action.payload?.reportId || null,
                {
                    ...reportState,
                    instances: [
                        ...reportState.instances.map(
                            (reportInstance: TReportInstance) => {

                                if (reportInstance.id === action.payload?.reportInstanceId) {

                                    return {
                                        ...reportInstance,
                                        reportParameterInputValuesInitialized: action.payload.initialized
                                    }
                                }

                                return reportInstance;
                            }
                        ),
                    ],
                }
            );

        case REPORT_RUN_END:

            reportState = extractReportStateFromReportId(
                [...state],
                action.payload.report_id || null,
            );
            return updateReportState(
                state,
                action.payload.report_id || null,
                {
                    ...reportState,

                    instances: reportState.instances.map((reportInstance: TReportInstance) => {

                        if (reportInstance.id === Number(action.payload.instance_id)) {

                            return {
                                ...reportInstance,
                                isLoading: false,
                                results_from_cache: action.payload.results_from_cache,
                                results_cache_type: action.payload.results_cache_type,
                                results_cached_at: action.payload.results_cached_at,
                                waitingData: false,
                            }
                        }

                        return reportInstance;
                    })
                }
            );

        case REPORT_RUN_START:

            reportState = extractReportStateFromReportId(
                [...state],
                action.payload.report_id || null,
            );

            return updateReportState(
                state,
                action.payload.report_id || null,
                {
                    ...reportState,

                    instances: reportState.instances.map((reportInstance: TReportInstance) => {

                        if (reportInstance.id === Number(action.payload.instance_id)) {

                            return {
                                ...reportInstance,
                                isLoading: true,
                                dataViewInstances: (reportInstance.dataViewInstances || []).map((dataViewInstance: TDataViewInstance) => {

                                    return {
                                        ...dataViewInstance,
                                        results: [],
                                        loading: false,
                                        waitingData: true,
                                        results_from_cache: false,
                                        results_cache_type: '',
                                        results_cached_at: new Date(),
                                    }
                                })
                            }
                        }

                        return reportInstance;
                    })
                }
            );

        case REPORT_SET_FAVORITE:

            reportState = extractReportStateFromReportId(
                [...state],
                (action as IReportSetFavorite).payload?.report_id || null,
            );

            if (reportState.report?.id) {
                return updateReportState(
                    state,
                    (action as IReportSetFavorite).payload.report_id,
                    {
                        ...reportState,
                        report: {...reportState.report, favorite: (action as IReportSetFavorite).payload.favorite},
                    },
                );
            }

            return state;

        case REPORT_SET_VIEW_MODE:

            reportState = extractReportStateFromReportId(
                [...state],
                action.payload.reportId || null,
            );

            return updateReportState(
                state,
                action.payload.reportId,
                {
                    ...reportState,
                    instances: [
                        ...reportState.instances.map((reportInstance: TReportInstance) => {

                            if (reportInstance.id === Number(action.payload.reportInstanceId)) {

                                return {
                                    ...reportInstance,
                                    viewMode: action.payload.viewMode,
                                    // expandedDataViewId: action.payload.viewMode === EReportViewMode.DEV ? reportInstance.expandedDataViewId : undefined
                                    expandedDataViewId: reportInstance.expandedDataViewId
                                }
                            }

                            return reportInstance;
                        })
                    ]
                },
            );

        case REPORT_SET_VISIBILITY:
            reportState = extractReportStateFromReportId(
                [...state],
                action.payload.reportId,
            );

            if (reportState.report?.id) {

                return updateReportState(
                    state,
                    action.payload.reportId,
                    {
                        ...reportState,
                        report: {...reportState.report, is_visible: action.payload.is_visible},
                    },
                );
            }

            return state;

        case REPORT_SHOW_DATAVIEW_ADD:

            return updateReportState(
                state,
                (action as IReportShowDataViewAdd).payload.report_id,
                {
                    showDataViewAdd: (action as IReportShowDataViewAdd).payload.show,
                },
            );

        case REPORT_SHOW_DATAVIEW_QUERY:

            reportState = extractReportStateFromReportId(
                [...state],
                (action as IReportShowDataViewQuery).payload?.reportId,
            );
            // currentDataViews = reportState.report?.dataViews || [];
            return updateReportState(
                state,
                (action as IReportShowDataViewQuery).payload?.reportId || null,
                {
                    ...reportState,

                    instances: reportState.instances.map((reportInstance: TReportInstance) => {

                        if (reportInstance.id === Number(action.payload.reportInstanceId)) {

                            return {
                                ...reportInstance,
                                dataViewInstances: reportInstance.dataViewInstances.map((dataViewInstance: TDataViewInstance) => {

                                    if (dataViewInstance.id === Number(action.payload.dataViewId)) {
                                        return {
                                            ...dataViewInstance,
                                            showQuery: action.payload.show
                                        }
                                    }

                                    return dataViewInstance;
                                })
                            }
                        }

                        return reportInstance;
                    })
                }
            );

        case REPORT_TOGGLE_PANEL:

            reportState = extractReportStateFromReportId(
                [...state],
                (action as IReportTogglePanel).payload?.reportId || null,
            );

            return updateReportState(
                state,
                action.payload?.reportId || null,
                {
                    ...reportState,
                    instances: [
                        ...reportState.instances.map((reportInstance: TReportInstance) => {

                            if (reportInstance.id === Number(action.payload.reportInstanceId)) {

                                return {
                                    ...reportInstance,
                                    panels: {
                                        ...reportInstance.panels,
                                        [action.payload.panel]: action.payload.show
                                    }
                                }
                            }

                            return reportInstance;
                        })
                    ]
                },
            );

        case REPORT_UPDATE_INFO:

            reportState = extractReportStateFromReportId(
                [...state],
                (action as IReportUpdateInfo).payload?.report_id || null,
            );

            return updateReportState(
                state,
                (action as IReportUpdateInfo).payload.report_id,
                {
                    reportName: (action as IReportUpdateInfo).payload.name,
                },
            );

        case RESET_REPORTS_STATE:
            return initialState;

        case UPDATE_REPORT_PARAMETERS:

            reportState = extractReportStateFromReportId(
                [...state],
                (action as IUpdateReportParameters).payload.report_id
            );

            return updateReportState(
                state,
                (action as IUpdateReportParameters).payload.report_id,
                {
                    report: {
                        ...reportState.report,
                        has_parameters: (action as IUpdateReportParameters).payload.parameters.length > 0,
                        parameters: (action as IUpdateReportParameters).payload.parameters,
                    },
                    reportParameterInputValues: initializeDefaultParametersInputValue(
                        (action as IUpdateReportParameters).payload?.parameters || []
                    ),
                    reportParameterInputValuesInitialized: true,
                }
            );

        case UPDATE_REPORT_PARAMETER_INPUT_VALUE:

            reportState = extractReportStateFromReportId(
                [...state],
                action.payload.reportId
            );

            const reportParameterInputValues: Array<TNameValue> = reportState.instances.find(
                (reportInstance: TReportInstance) => reportInstance.id === action.payload.reportInstanceId)
                ?.reportParameterInputValues || [];

            const parameterInputIndex = reportParameterInputValues.findIndex(formValue => formValue.name === action.payload.name);

            if (reportParameterInputValues[parameterInputIndex]) {

                reportParameterInputValues[parameterInputIndex].value = action.payload.value;
            } else {

                reportParameterInputValues.push(action.payload)
            }

            return updateReportState(
                state,
                action.payload?.reportId || null,
                {
                    ...reportState,
                    instances: [
                        ...reportState.instances.map(
                            (reportInstance: TReportInstance) => {

                                if (reportInstance.id === action.payload?.reportInstanceId) {

                                    return {
                                        ...reportInstance,
                                        reportParameterInputValues
                                    }
                                }

                                return reportInstance;
                            }
                        ),
                    ],
                }
            );

        case UPDATE_REPORT_QUERY_CLEANUP:
            reportState = extractReportStateFromReportId(
                [...state],
                action.payload.reportId
            );

            return updateReportState(
                state,
                (action as IUpdateReportQuery).payload.reportId,
                {
                    report: {
                        ...reportState.report,
                        query_cleanup: action.payload.query,
                    }
                }
            );

        case UPDATE_REPORT_QUERY_INIT:
            reportState = extractReportStateFromReportId(
                [...state],
                (action as IUpdateReportQuery).payload.reportId
            );

            return updateReportState(
                state,
                action.payload.reportId,
                {
                    report: {
                        ...reportState.report,
                        query_init: (action as IUpdateReportQuery).payload.query,
                    }
                }
            );

        default:
            return state;
    }
};

export default reducer;