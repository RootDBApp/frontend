import { Ace }    from "ace-builds";
import TreeNode   from "primereact/treenode";
import { t }      from "i18next";
import * as React from "react";

import { TAPIDataAction }           from "./actions";
import {
    GET_CATEGORIES,
    GET_CONNECTOR_COMPLETIONS,
    GET_CONNECTOR_DATABASES,
    GET_CONNECTOR_SCHEMAS_TREE,
    GET_CONNECTORS,
    GET_DATA_VIEW_LIB_TYPES,
    GET_DATA_VIEW_LIB_VERSIONS,
    GET_DATA_VIEW_LIBS,
    GET_DIRECTORIES,
    GET_DIRECTORIES_TREE,
    GET_GROUPS,
    GET_PARAMETER_INPUT_DATA_TYPES,
    GET_PARAMETER_INPUT_TYPES,
    GET_PARAMETER_INPUTS,
    GET_REPORTS,
    GET_USERS,
    GOT_CATEGORIES,
    GOT_CONNECTOR_COMPLETIONS,
    GOT_CONNECTOR_DATABASES,
    GOT_CONNECTOR_SCHEMAS_TREE,
    GOT_CONNECTORS,
    GOT_DATA_VIEW_LIB_TYPES,
    GOT_DATA_VIEW_LIB_VERSIONS,
    GOT_DATA_VIEW_LIBS,
    GOT_DIRECTORIES,
    GOT_DIRECTORIES_TREE,
    GOT_GROUPS,
    GOT_PARAMETER_INPUT_DATA_TYPES,
    GOT_PARAMETER_INPUT_TYPES,
    GOT_PARAMETER_INPUTS,
    GOT_REPORTS, GOT_SERVICE_MESSAGES,
    GOT_USERS,
    GOT_VERSIONS_INFO,
    LEAVE_WS_ORGANIZATION_CHANNEL,
    LISTEN_WS_ORGANIZATION_CHANNEL, REPORT_CHANGE_VISIBILITY,
    REPORT_CREATED,
    REPORT_DELETED,
    REPORT_FAVORITE_ADD,
    REPORT_FAVORITE_ADDED,
    REPORT_FAVORITE_DELETE,
    REPORT_FAVORITE_DELETED,
    REPORT_UPDATED, REPORT_VISIBILITY_CHANGED,
    UPDATE_DIRECTORIES_TREE_NUM_REPORTS, UPDATE_REPORT_CACHE_STATUS
}                                   from "./types";
import EchoClient                   from "../../../services/EchoClient";
import TConnector                   from "../../../types/TConnector";
import TGroup                       from "../../../types/TGroup";
import TUser                        from "../../../types/TUser";
import TCategory                    from "../../../types/TCategory";
import TDirectory                   from "../../../types/TDirectory";
import TParameterInput              from "../../../types/TParameterInput";
import TReportDataViewLib           from "../../../types/TReportDataViewLib";
import TReportDataViewLibVersion    from "../../../types/TReportDataViewLibVersion";
import TParameterInputType          from "../../../types/TParameterInputType";
import TParameterInputDataType      from "../../../types/TParameterInputDataType";
import TReport                      from "../../../types/TReport";
import TURLParameter                from "../../../types/common/TURLParameter";
import TReportDataViewLibType       from "../../../types/TReportDataViewLibType";
import { apiSendRequest }           from "../../../services/api";
import { EAPIEndPoint }             from "../../../types/EAPIEndPoint";
import TConnectorDatabase           from "../../../types/TConnectorDatabase";
import TVersionInfo                 from "../../../types/TVersionsInfo";
import { notificationEvent }        from "../../../utils/events";
import { TAPIResponse }             from "../../../types/TAPIResponsed";
import IRootDBTreeNode              from "../../../types/IRootDBTreeNode";
import { EReportDevBarMessageType } from "../../../types/applicationEvent/EReportDevBarMessageType";
import TServiceMessage              from "../../../types/TServiceMessage";
import TException                   from "../../../types/TException";
import { TReportCacheStatus }       from "../../../types/TReportCacheStatus";

const middleware = (dispatch: React.Dispatch<TAPIDataAction>) => (action: TAPIDataAction) => {
    dispatch(action);

    const {type, payload} = action;

    //console.debug('middleware api_data', type, payload);

    switch (type) {

        case GET_CATEGORIES:
            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.CATEGORY,
                callbackSuccess: (response: Array<TCategory>) => {

                    dispatch({type: GOT_CATEGORIES, payload: response});
                },
                callbackError: () => {
                    dispatch({type: GOT_CATEGORIES, payload: []});
                }
            });

            break;

        case GET_CONNECTORS:
            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.CONF_CONNECTOR,
                callbackSuccess: (response: Array<TConnector>) => {
                    dispatch({type: GOT_CONNECTORS, payload: response});
                },
                callbackError: () => {
                    dispatch({type: GOT_CONNECTORS, payload: []});
                }
            });

            break;

        case GET_CONNECTOR_COMPLETIONS:

            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.CONF_CONNECTOR,
                extraUrlPath: 'get-ace-editor-auto-complete',
                resourceId: payload,
                callbackSuccess: (response: Array<Ace.Completion>) => {
                    dispatch({
                        type: GOT_CONNECTOR_COMPLETIONS,
                        payload: {
                            connector_id: payload,
                            completions: response
                        }
                    });
                },
                callbackError: () => {
                    dispatch({
                        type: GOT_CONNECTOR_COMPLETIONS, payload: {
                            connector_id: payload,
                            completions: []
                        }
                    });
                }
            });

            break;

        case GET_CONNECTOR_DATABASES:
            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.CONNECTOR_DATABASE,
                callbackSuccess: (response: Array<TConnectorDatabase>) => {
                    dispatch({type: GOT_CONNECTOR_DATABASES, payload: response});
                },
                callbackError: () => {
                    dispatch({type: GOT_CONNECTOR_DATABASES, payload: []});
                }
            });

            break;

        case GET_CONNECTOR_SCHEMAS_TREE:

            dispatch({
                    type: GOT_CONNECTOR_SCHEMAS_TREE,
                    payload: {
                        connector_id: payload,
                        schema_trees: [{
                            key: String(t('common:no_data')),
                            label: "no data",
                            icon: "pi pi-fw pi-times-circle",
                        }]
                    }
                }
            );
            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.CONF_CONNECTOR,
                resourceId: payload as number,
                extraUrlPath: 'get-prime-react-tree-db',
                callbackSuccess: (response: Array<IRootDBTreeNode>) => {
                    dispatch({
                        type: GOT_CONNECTOR_SCHEMAS_TREE,
                        payload: {
                            connector_id: payload,
                            schema_trees: response
                        }
                    });
                },
                callbackError: (error: TAPIResponse) => {
                    dispatch({
                        type: GOT_CONNECTOR_SCHEMAS_TREE,
                        payload: {
                            connector_id: payload,
                            schema_trees: [{
                                key: String(t('common:no_data')),
                                label: "no data",
                                icon: "pi pi-fw pi-times-circle",
                            }]
                        }
                    });
                    document.dispatchEvent(
                        notificationEvent({
                            message: String(error.message),
                            timestamp: Date.now(),
                            title: t('common:form.unable_to_load_this_connector').toString(),
                            forceInNotificationCenter: true,
                            type: EReportDevBarMessageType.ERROR,
                            severity: "error",
                            toast: true,
                        })
                    );
                }
            });

            break;

        case GET_DATA_VIEW_LIBS:
            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.REPORT_DATA_VIEW_LIB,
                callbackSuccess: (response: Array<TReportDataViewLib>) => {
                    dispatch({type: GOT_DATA_VIEW_LIBS, payload: response});
                },
                callbackError: () => {
                    dispatch({type: GOT_DATA_VIEW_LIBS, payload: []});
                }
            });

            break;

        case GET_DATA_VIEW_LIB_TYPES:
            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.REPORT_DATA_VIEW_LIB_TYPE,
                callbackSuccess: (response: Array<TReportDataViewLibType>) => {
                    dispatch({type: GOT_DATA_VIEW_LIB_TYPES, payload: response});
                },
                callbackError: () => {
                    dispatch({type: GOT_DATA_VIEW_LIB_TYPES, payload: []});
                }
            });

            break;

        case GET_DATA_VIEW_LIB_VERSIONS:
            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.REPORT_DATA_VIEW_LIB_VERSION,
                callbackSuccess: (response: Array<TReportDataViewLibVersion>) => {
                    dispatch({type: GOT_DATA_VIEW_LIB_VERSIONS, payload: response});
                },
                callbackError: () => {
                    dispatch({type: GOT_DATA_VIEW_LIB_VERSIONS, payload: []});
                }
            });

            break;

        case GET_DIRECTORIES:
            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.DIRECTORY,
                callbackSuccess: (response: Array<TDirectory>) => {
                    dispatch({type: GOT_DIRECTORIES, payload: response});
                },
                callbackError: () => {

                    dispatch({type: GOT_DIRECTORIES, payload: []});
                }
            });

            break;

        case GET_DIRECTORIES_TREE:
            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.DIRECTORY,
                urlParameters: [{key: 'prime-react-tree', value: ''}],
                callbackSuccess: (response: Array<TreeNode.TreeNode>) => {
                    dispatch({type: GOT_DIRECTORIES_TREE, payload: response});
                    dispatch({type: UPDATE_DIRECTORIES_TREE_NUM_REPORTS, payload: undefined});
                },
                callbackError: () => {

                    dispatch({type: GOT_DIRECTORIES_TREE, payload: []});
                }
            });

            break;

        case GET_GROUPS:
            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.GROUP,
                callbackSuccess: (response: Array<TGroup>) => {
                    dispatch({type: GOT_GROUPS, payload: response});
                },
                callbackError: () => {

                    dispatch({type: GOT_GROUPS, payload: []});
                }
            });
            break;

        case GET_PARAMETER_INPUTS:
            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.REPORT_PARAMETER_INPUT,
                callbackSuccess: (response: Array<TParameterInput>) => {
                    dispatch({type: GOT_PARAMETER_INPUTS, payload: response});
                },
                callbackError: () => {
                    dispatch({type: GOT_PARAMETER_INPUTS, payload: []});
                }
            });

            break;

        case GET_PARAMETER_INPUT_DATA_TYPES:
            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.REPORT_PARAMETER_INPUT_DATA_TYPE,
                callbackSuccess: (response: Array<TParameterInputDataType>) => {
                    dispatch({
                        type: GOT_PARAMETER_INPUT_DATA_TYPES,
                        payload: response
                    });
                },
                callbackError: () => {
                    dispatch({type: GOT_PARAMETER_INPUT_DATA_TYPES, payload: []});
                }
            });

            break;

        case GET_PARAMETER_INPUT_TYPES:
            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.REPORT_PARAMETER_INPUT_TYPE,
                callbackSuccess: (response: Array<TParameterInputType>) => {
                    dispatch({type: GOT_PARAMETER_INPUT_TYPES, payload: response});
                },
                callbackError: () => {
                    dispatch({type: GOT_PARAMETER_INPUT_TYPES, payload: []});

                }
            });

            break;

        case GET_REPORTS:
            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.REPORT,
                urlParameters: payload as Array<TURLParameter>,
                callbackSuccess: (response: Array<TReport>) => {
                    dispatch({type: GOT_REPORTS, payload: response});
                    dispatch({type: UPDATE_DIRECTORIES_TREE_NUM_REPORTS, payload: undefined});
                },
                callbackError: () => {
                    dispatch({type: GOT_REPORTS, payload: []});
                }
            });

            break;

        case GET_USERS:
            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.USER,
                callbackSuccess: (response: Array<TUser>) => {
                    dispatch({type: GOT_USERS, payload: response});
                },
                callbackError: () => {
                    dispatch({type: GOT_USERS, payload: []});
                }
            });

            break;

        case REPORT_CHANGE_VISIBILITY:
            apiSendRequest({
                method: 'PUT',
                endPoint: EAPIEndPoint.REPORT,
                resourceId: payload.reportId,
                extraUrlPath: 'update-visibility',
                formValues: {is_visible: payload.is_visible},
                callbackSuccess: () => {
                    dispatch({type: REPORT_VISIBILITY_CHANGED, payload: payload});
                    dispatch({type: UPDATE_DIRECTORIES_TREE_NUM_REPORTS, payload: undefined});
                },
                callbackError: (error: TAPIResponse) => {
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

            break;

        case REPORT_FAVORITE_ADD:
            apiSendRequest({
                method: 'POST',
                endPoint: EAPIEndPoint.REPORT_USER_FAVORITE,
                formValues: {report_id: payload.id},
                callbackSuccess: () => {
                    dispatch({type: REPORT_FAVORITE_ADDED, payload: payload.id});
                    dispatch({type: UPDATE_DIRECTORIES_TREE_NUM_REPORTS, payload: undefined});
                },
                callbackError: (error: TAPIResponse) => {

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

            break;

        case REPORT_FAVORITE_DELETE:
            apiSendRequest({
                method: 'DELETE',
                endPoint: EAPIEndPoint.REPORT_USER_FAVORITE,
                resourceId: payload.id,
                callbackSuccess: () => {
                    dispatch({type: REPORT_FAVORITE_DELETED, payload: payload.id});
                    dispatch({type: UPDATE_DIRECTORIES_TREE_NUM_REPORTS, payload: undefined});
                },
                callbackError: (error: TAPIResponse) => {

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

            break;

        case LEAVE_WS_ORGANIZATION_CHANNEL:

            console.debug('ws - leave channel: organization.' + payload);
            EchoClient.leave('organization.' + payload);

            break;

        case LISTEN_WS_ORGANIZATION_CHANNEL:

            const user: TUser = JSON.parse(String(sessionStorage.getItem('user')));
            const webSocketSessionId = Number(sessionStorage.getItem('websocketSessionId'));
            if (user.id) {

                console.debug('ws (from api_data middleware - listen private channel: user.' + webSocketSessionId);
                EchoClient
                    .private('user.' + webSocketSessionId)
                    .listen('WebSocketServerIsWorkingEvent', () => {

                        sessionStorage.setItem('wss_ok', '1');
                    })
                    .listen('VersionInfosEvent', (versionsInfo: Array<TVersionInfo>) => {

                        console.debug('ws - VersionsInfoEvent', versionsInfo);
                        // It's an array because Frontend & API was available in different packages at the beginning of the project.
                        if (versionsInfo[0] && versionsInfo[0].update_available) {

                            document.dispatchEvent(
                                notificationEvent({
                                    message: t('settings:version.please_check_release_not', {version: versionsInfo[0].available_version}).toString(),
                                    timestamp: Date.now(),
                                    title: t('settings:version.new_version_available').toString(),
                                    type: EReportDevBarMessageType.LOG,
                                    severity: "info",
                                    toast: true,
                                    forceInNotificationCenter: true,
                                    buttonLabel: t('settings:version.release_notes').toString(),
                                    buttonURL: versionsInfo[0].url_release_note,
                                    buttonSeverity: "info",
                                    buttonURLInNewTab: true
                                })
                            );
                        }

                        dispatch({type: GOT_VERSIONS_INFO, payload: versionsInfo})
                    })
            }

            console.debug('ws - leave channel: organization.' + payload);
            EchoClient.leave('organization.' + payload);

            console.debug('ws - listen channel: organization.' + payload);
            EchoClient
                .channel('organization.' + payload)
                .listen('APICacheCategoriesUpdated', (categories: Array<TCategory>) => {

                        console.debug('ws - APICategoriesUpdated', categories);
                        dispatch({type: GOT_CATEGORIES, payload: categories});
                    }
                )
                .listen('APICacheConfConnectorsUpdated', (confConnectors: Array<TConnector>) => {

                    console.debug('ws - APICacheConfConnectorsUpdated', confConnectors);
                    dispatch({type: GOT_CONNECTORS, payload: confConnectors});
                })
                .listen('APICacheDirectoriesUpdated', (directories: Array<TDirectory>) => {

                        console.debug('ws - APICacheDirectoriesUpdated', directories);
                        dispatch({type: GOT_DIRECTORIES, payload: directories});
                    }
                )
                .listen('APICacheGroupsUpdated', (groups: Array<TGroup>) => {

                        console.debug('ws - APICacheGroupsUpdated');
                        dispatch({type: GOT_GROUPS, payload: groups});
                    }
                )
                .listen('APICachePrimeReactTreeDirectoriesUpdatedEvent', (directoriesTree: Array<TreeNode.TreeNode>) => {

                        console.debug('ws - APICachePrimeReactTreeDirectoriesUpdatedEvent', directoriesTree);
                        dispatch({type: GOT_DIRECTORIES_TREE, payload: directoriesTree});
                        dispatch({type: UPDATE_DIRECTORIES_TREE_NUM_REPORTS, payload: undefined});
                    }
                )
                .listen('APICacheReportCreated', (report: TReport) => {

                        console.debug('ws - APICacheReportCreated');
                        dispatch({type: REPORT_CREATED, payload: report});
                        dispatch({type: UPDATE_DIRECTORIES_TREE_NUM_REPORTS, payload: undefined});
                    }
                )
                .listen('APICacheReportDeleted', (report: TReport) => {

                        console.debug('ws - APICacheReportDeleted');
                        dispatch({type: REPORT_DELETED, payload: report});
                        dispatch({type: UPDATE_DIRECTORIES_TREE_NUM_REPORTS, payload: undefined});
                    }
                )
                .listen('APICacheServiceMessagesUpdated', (serviceMessages: Array<TServiceMessage>) => {

                        console.debug('ws - APICacheServiceMessagesUpdated');
                        dispatch({type: GOT_SERVICE_MESSAGES, payload: serviceMessages});
                    }
                )
                .listen('APICacheReportParameterInputsUpdated', (reportParameterInputs: Array<TParameterInput>) => {

                        console.debug('ws - APICacheReportParameterInputsUpdated');
                        dispatch({type: GOT_PARAMETER_INPUTS, payload: reportParameterInputs});
                    }
                )
                .listen('APICacheReportUpdated', (report: TReport) => {

                        console.debug('ws - APICacheReportUpdated');
                        dispatch({type: REPORT_UPDATED, payload: report});
                        dispatch({type: UPDATE_DIRECTORIES_TREE_NUM_REPORTS, payload: undefined});
                    }
                )
                .listen('APICacheReportsUpdated', (reports: Array<TReport>) => {

                        console.debug('ws - APICacheReportsUpdated');
                        dispatch({type: GOT_REPORTS, payload: reports});
                        dispatch({type: UPDATE_DIRECTORIES_TREE_NUM_REPORTS, payload: undefined});
                    }
                )
                .listen('APICacheUsersUpdated', (users: Array<TUser>) => {

                        console.debug('ws - APICacheUsersUpdated');
                        dispatch({type: GOT_USERS, payload: users});
                    }
                )
                .listen('APICacheReportUpdateCacheStatus', (reportsCacheStatus: Array<TReportCacheStatus>) => {

                        console.debug('ws - APICacheReportUpdateCacheStatus');
                        dispatch({type: UPDATE_REPORT_CACHE_STATUS, payload: reportsCacheStatus});
                    }
                )
                .listen('APIExceptionFatalError', (exception: TException) => {

                        console.debug('ws - APIExceptionFatalError');
                        document.dispatchEvent(
                            notificationEvent({
                                message: exception.message,
                                timestamp: Date.now(),
                                title: t('common:fatal_error_occurred').toString(),
                                type: EReportDevBarMessageType.ERROR,
                                severity: "error",
                                toast: true,
                                forceInNotificationCenter: true
                            })
                        );
                    }
                );

            break;
    }
};

export default middleware;