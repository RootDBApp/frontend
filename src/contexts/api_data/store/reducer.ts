import { TAPIDataAction }                                                   from './actions';
import { IAPIDataState }                                                    from './initialState';
import * as types                                                           from './types';
import TReport                                                              from "../../../types/TReport";
import TParameterInputType                                                  from "../../../types/TParameterInputType";
import TUser                                                                from "../../../types/TUser";
import TParameterInputDataType
                                                                            from "../../../types/TParameterInputDataType";
import TParameterInput                                                      from "../../../types/TParameterInput";
import TGroup                                                               from "../../../types/TGroup";
import TDirectory                                                           from "../../../types/TDirectory";
import TReportDataViewLib                                                   from "../../../types/TReportDataViewLib";
import TConnector                                                           from "../../../types/TConnector";
import TDirectoryTreeNode                                                   from "../../../types/TDirectoryTreeNode";
import TReportDataViewLibVersion
                                                                            from "../../../types/TReportDataViewLibVersion";
import TReportDataViewLibType
                                                                            from "../../../types/TReportDataViewLibType";
import { checkReportPermission, updateDirectoryTreeLabelsWithNumOfReports } from "../../../utils/tools";
import TConnectorDatabase                                                   from "../../../types/TConnectorDatabase";
import TVersionInfo                                                         from "../../../types/TVersionsInfo";
import TConnectorCompletions                                                from "../../../types/TConnectorCompletions";
import TConnectorSchemasTree                                                from "../../../types/TConnectorSchemasTree";
import TRole                                                                from "../../../types/TRole";
import TOrganization                                                        from "../../../types/TOrganization";
import TServiceMessage                                                      from "../../../types/TServiceMessage";
import { TReportCacheStatus }                                               from "../../../types/TReportCacheStatus";

const reducer = (state: IAPIDataState, action: TAPIDataAction): IAPIDataState => {

    console.debug('[api_data context::reducer]', action);
    const {type, payload} = action;

    switch (type) {

        case types.CLEAN_LOCAL_STORAGE:
            localStorage.removeItem('categories');
            localStorage.removeItem('connectors');
            localStorage.removeItem('connectorDatabases');
            localStorage.removeItem('connectorSchemasTree');
            localStorage.removeItem('dataViewLibs');
            localStorage.removeItem('directories');
            localStorage.removeItem('directoriesTree');
            localStorage.removeItem('groups');
            // localStorage.removeItem('organization');
            localStorage.removeItem('parameterInputs');
            localStorage.removeItem('parameterInputTypes');
            localStorage.removeItem('parameterInputDataTypes');
            localStorage.removeItem('reports');
            localStorage.removeItem('serviceMessages');
            localStorage.removeItem('users');

            return {
                ...state,
                categories: [],
                connectors: [],
                connectorDatabases: [],
                connectorSchemasTree: [],
                dataViewLibs: [],
                directories: [],
                directoriesTree: [],
                groups: [],
                parameterInputs: [],
                parameterInputTypes: [],
                parameterInputDataTypes: [],
                reports: [],
                users: [],
            }

        case types.CLEAN_REPORT_DIRECTORIES_TREE:

            localStorage.removeItem('directories');
            localStorage.removeItem('directoriesTree');
            localStorage.removeItem('reports');

            return {...state, directories: [], directoriesTree: [], reports: []}

        case types.GET_CONNECTORS:
            return {...state, connectorsLoading: true};

        case types.GOT_CONNECTORS:
            localStorage.setItem('connectors', JSON.stringify(payload));
            return {...state, connectors: payload as Array<TConnector>, connectorsLoading: false};

        case types.GET_CONNECTOR_COMPLETIONS:
            return {...state, connectorCompletionsLoading: true};

        case types.GOT_CONNECTOR_COMPLETIONS:

            // @todo Below, to remove duplicate, because we can have multiple editor loading at the same time
            const newConnectorCompletions = state.connectorCompletions.filter((connectorCompletions: TConnectorCompletions) => {

                return connectorCompletions.connector_id !== payload.connector_id;
            });

            newConnectorCompletions.push(payload as TConnectorCompletions);
            localStorage.setItem('connectorCompletions', JSON.stringify(newConnectorCompletions));
            return {
                ...state,
                connectorCompletions: newConnectorCompletions,
                connectorCompletionsLoading: false
            };

        case types.GET_CONNECTOR_DATABASES:
            return {...state, connectorDatabasesLoading: true};

        case types.GOT_CONNECTOR_DATABASES:
            localStorage.setItem('connectorDatabases', JSON.stringify(payload));
            return {
                ...state,
                connectorDatabases: payload as Array<TConnectorDatabase>,
                connectorDatabasesLoading: false
            };

        case types.GET_CONNECTOR_SCHEMAS_TREE:
            return {...state, connectorSchemasTreeLoading: true};

        case types.GOT_CONNECTOR_SCHEMAS_TREE:

            // To cleanup if we made a manual refresh.
            const newConnectorSchemasTree = state.connectorSchemasTree.filter((connectorSchemasTree: TConnectorSchemasTree) => {

                return connectorSchemasTree.connector_id !== payload.connector_id;
            });
            newConnectorSchemasTree.push(payload as TConnectorSchemasTree);
            localStorage.setItem('connectorSchemasTree', JSON.stringify(newConnectorSchemasTree));
            return {...state, connectorSchemasTree: newConnectorSchemasTree, connectorSchemasTreeLoading: false};

        case types.GET_CATEGORIES:
        case types.CATEGORIES_LOADING:
            return {...state, categoriesLoading: true};

        case types.GOT_CATEGORIES:
            localStorage.setItem('categories', JSON.stringify(payload));
            return {...state, categories: payload, categoriesLoading: false} as IAPIDataState;

        case types.GET_DATA_VIEW_LIBS:
            return {...state, dataViewLibsLoading: true};

        case types.GOT_DATA_VIEW_LIBS:
            localStorage.setItem('dataViewLibs', JSON.stringify(payload));
            return {...state, dataViewLibs: payload as Array<TReportDataViewLib>, dataViewLibsLoading: false};

        case types.GET_DATA_VIEW_LIB_TYPES:
            return {...state, dataViewLibTypesLoading: true};

        case types.GOT_DATA_VIEW_LIB_TYPES:
            localStorage.setItem('dataViewLibTypes', JSON.stringify(payload));
            return {
                ...state,
                dataViewLibTypes: payload as Array<TReportDataViewLibType>,
                dataViewLibTypesLoading: false
            };

        case types.GET_DATA_VIEW_LIB_VERSIONS:
            return {...state, dataViewLibVersionsLoading: true};

        case types.GOT_DATA_VIEW_LIB_VERSIONS:
            localStorage.setItem('dataViewLibVersions', JSON.stringify(payload));
            return {
                ...state,
                dataViewLibVersions: payload as Array<TReportDataViewLibVersion>,
                dataViewLibVersionsLoading: false
            };

        case types.GET_DIRECTORIES:
        case types.DIRECTORIES_LOADING:
            return {...state, directoriesLoading: true};

        case types.GOT_DIRECTORIES:
            localStorage.setItem('directories', JSON.stringify(payload));
            return {...state, directories: payload as Array<TDirectory>, directoriesLoading: false};

        case types.GET_DIRECTORIES_TREE:
        case types.DIRECTORIES_TREE_LOADING:
            return {...state, directoriesTreeLoading: true};

        case types.GOT_DIRECTORIES_TREE:
            localStorage.setItem('directoriesTree', JSON.stringify(payload));
            return {...state, directoriesTree: payload as Array<TDirectoryTreeNode>, directoriesTreeLoading: false};

        case types.GET_GROUPS:
            return {...state, groupsLoading: true};

        case types.GOT_GROUPS:
            localStorage.setItem('groups', JSON.stringify(payload));
            return {...state, groups: payload as Array<TGroup>, groupsLoading: false};

        case types.GOT_ORGANIZATION:

            // To clean up if we made a manual refresh.
            const newOrganizations = state.organizations.map((organization: TOrganization) => {

                if (payload.id === organization.id) {

                    organization.name = payload.name;
                }

                return organization;
            });

            localStorage.setItem('organizations', JSON.stringify(newOrganizations));
            return {...state, organizations: newOrganizations as Array<TOrganization>};

        case types.GOT_ORGANIZATIONS:
            localStorage.setItem('organizations', JSON.stringify(payload));
            return {...state, organizations: payload as Array<TOrganization>};

        case types.GET_PARAMETER_INPUTS:
            return {...state, parameterInputsLoading: true};

        case types.GOT_PARAMETER_INPUTS:
            localStorage.setItem('parameterInputs', JSON.stringify(payload));
            return {...state, parameterInputs: payload as Array<TParameterInput>, parameterInputsLoading: false};

        case types.GOT_PARAMETER_INPUT:
            localStorage.setItem('parameterInputs', JSON.stringify([...state.parameterInputs, payload]));
            return {
                ...state,
                parameterInputs: [...state.parameterInputs, payload as TParameterInput],
                parameterInputsLoading: false
            };

        case types.GET_PARAMETER_INPUT_DATA_TYPES:
            return {...state, parameterInputDataTypesLoading: true};

        case types.GOT_PARAMETER_INPUT_DATA_TYPES:
            localStorage.setItem('parameterInputDataTypes', JSON.stringify(payload));
            return {
                ...state,
                parameterInputDataTypes: payload as Array<TParameterInputDataType>,
                parameterInputDataTypesLoading: false
            };

        case types.GET_PARAMETER_INPUT_TYPES:
            return {...state, parameterInputTypesLoading: true};

        case types.GOT_PARAMETER_INPUT_TYPES:
            localStorage.setItem('parameterInputTypes', JSON.stringify(payload));
            return {
                ...state,
                parameterInputTypes: payload as Array<TParameterInputType>,
                parameterInputTypesLoading: false
            };

        case types.GET_REPORTS:
            return {...state, reportsLoading: true};

        case types.GOT_REPORT:

            const newReports = state.reports.map(
                (report: TReport) => {
                    if (report.id === (payload as TReport).id) {
                        return payload;
                    }

                    return report;
                }
            );

            localStorage.setItem('reports', JSON.stringify(newReports));
            return {...state, reports: newReports as Array<TReport>, reportsLoading: false};

        case types.GOT_REPORTS:
            localStorage.setItem('reports', JSON.stringify(payload));
            return {...state, reports: payload as Array<TReport>, reportsLoading: false};

        case types.GOT_ROLES:
            localStorage.setItem('roles', JSON.stringify(payload));
            return {...state, roles: payload as Array<TRole>};

        case types.GOT_SERVICE_MESSAGES:
            localStorage.setItem('serviceMessages', JSON.stringify(payload));
            return {...state, serviceMessages: payload as Array<TServiceMessage>};

        case types.GET_USERS:
            return {...state, usersLoading: true};

        case types.GOT_USERS:
            localStorage.setItem('users', JSON.stringify(payload));
            return {...state, users: payload as Array<TUser>, usersLoading: false};

        case types.GOT_VERSIONS_INFO:
            localStorage.setItem('versionsInfos', JSON.stringify(payload));
            return {...state, versionsInfos: payload as Array<TVersionInfo>};

        case types.ORGANIZATION_USER_CHANGE:
            localStorage.removeItem('categories');
            localStorage.removeItem('connectors');
            localStorage.removeItem('connectorDatabases');
            localStorage.removeItem('connectorSchemasTree');
            localStorage.removeItem('directories');
            localStorage.removeItem('directoriesTree');
            localStorage.removeItem('parameterInputs');
            localStorage.removeItem('organizations');
            localStorage.removeItem('reports');
            localStorage.removeItem('users');

            return {
                ...state,
                categories: [],
                connectors: [],
                directories: [],
                directoriesTree: [],
                parameterInputs: [],
                organizations: [],
                reports: []
            };

        case types.REFRESH_CONNECTOR_COMPLETIONS:
            // To clean up the connector we want to refresh
            const cleanedUpConnectorCompletions = state.connectorCompletions.filter((connectorCompletions: TConnectorCompletions) => {
                return connectorCompletions.connector_id !== payload;
            });
            localStorage.setItem('connectorCompletions', JSON.stringify(cleanedUpConnectorCompletions));

            return {...state, connectorCompletions: cleanedUpConnectorCompletions, connectorCompletionsLoading: false};

        case types.REFRESH_CONNECTOR_SCHEMAS_TREE:
            // To clean up the connector we want to refresh
            const cleanedUpConnectorSchemasTree = state.connectorSchemasTree.filter((connectorSchemasTree: TConnectorSchemasTree) => {

                return connectorSchemasTree.connector_id !== payload;
            });
            localStorage.setItem('connectorSchemasTree', JSON.stringify(cleanedUpConnectorSchemasTree));
            return {...state, connectorSchemasTree: cleanedUpConnectorSchemasTree, connectorSchemasTreeLoading: false};

        case types.REPORT_CREATED:

            if (!checkReportPermission(
                (payload as TReport),
                (JSON.parse(String(sessionStorage.getItem('user'))) as TUser)
            )) {

                return state;
            }

            const createdReports = state.reports;
            createdReports.push(payload as TReport);
            localStorage.setItem('reports', JSON.stringify(createdReports));

            return {...state, reports: createdReports, reportsLoading: false};

        case types.REPORT_DELETED:

            const remainingReports = state.reports.filter((report) => report.id !== (payload as TReport).id);
            localStorage.setItem('reports', JSON.stringify(remainingReports));

            return {...state, reports: remainingReports, reportsLoading: false};

        case types.REPORT_FAVORITE_ADDED:
            return {
                ...state, reports: state.reports.map(report => {

                    if (report.id === payload) {
                        return {...report, favorite: true};
                    }

                    return report;
                })
            };

        case types.REPORT_FAVORITE_DELETED:
            return {
                ...state, reports: state.reports.map(report => {

                    if (report.id === payload) {
                        return {...report, favorite: false};
                    }

                    return report;
                })
            };

        case types.REPORT_UPDATED:

            let reportUpdated: boolean = false;
            const canUpdate = checkReportPermission(
                (payload as TReport),
                (JSON.parse(String(sessionStorage.getItem('user'))) as TUser)
            );

            if (!canUpdate) {

                const remainingReports = state.reports.filter((report) => report.id !== (payload as TReport).id);
                localStorage.setItem('reports', JSON.stringify(remainingReports));

                return {...state, reports: remainingReports, reportsLoading: false};
            }

            const updatedReports = state.reports.map((report) => {

                if (report.id === (payload as TReport).id) {

                    reportUpdated = true;

                    return {
                        ...report,
                        allowed_groups: (payload as TReport).allowed_groups,
                        allowed_users: (payload as TReport).allowed_users,
                        category: (payload as TReport).category,
                        category_id: (payload as TReport).category_id,
                        description: (payload as TReport).description,
                        description_listing: (payload as TReport).description_listing,
                        directory: (payload as TReport).directory,
                        directory_id: (payload as TReport).directory_id,
                        has_data_views: (payload as TReport).has_data_views,
                        has_parameters: (payload as TReport).has_parameters,
                        is_visible: (payload as TReport).is_visible,
                        name: (payload as TReport).name,
                        organization: (payload as TReport).organization,
                        organization_id: (payload as TReport).organization_id,
                        user_id: (payload as TReport).user_id,
                        updated_at: (payload as TReport).updated_at,
                        user: (payload as TReport).user,
                    }
                }

                return report;
            });

            if (!reportUpdated) {

                updatedReports.push(payload as TReport);
            }

            localStorage.setItem('reports', JSON.stringify(updatedReports));

            return {...state, reports: updatedReports, reportsLoading: false};

        case types.REPORT_VISIBILITY_CHANGED:
            return {
                ...state, reports: state.reports.map(report => {

                    if (report.id === Number(payload.reportId)) {
                        return {...report, is_visible: payload.is_visible};
                    }

                    return report;
                })
            };

        case types.UPDATE_DIRECTORIES_TREE_NUM_REPORTS:

            if (state.directoriesTree.length === 0 && state.reports.length === 0) {

                return state;
            }

            const directoriesTree = updateDirectoryTreeLabelsWithNumOfReports([...state.directoriesTree], state.reports);
            localStorage.setItem('directoriesTree', JSON.stringify(directoriesTree));

            return {...state, directoriesTree: directoriesTree, directoriesTreeLoading: false};

        case types.UPDATE_REPORT_CACHE_STATUS:

            return {
                ...state,
                reports: state.reports.map((report: TReport) => {

                    const reportCacheStatus = action.payload.find((reportCacheStatus: TReportCacheStatus) => reportCacheStatus.report_id === report.id);

                    if (reportCacheStatus) {

                        report.has_cache = reportCacheStatus.has_cache;
                        report.has_job_cache = reportCacheStatus.has_job_cache;
                        report.has_user_cache = reportCacheStatus.has_user_cache;
                        report.num_parameter_sets_cached_by_jobs = reportCacheStatus.num_parameter_sets_cached_by_jobs;
                        report.num_parameter_sets_cached_by_users = reportCacheStatus.num_parameter_sets_cached_by_users;
                    }

                    return report;
                })
            }

        default:
            return state;
    }
};

export default reducer;

