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

import { Button }                                           from "primereact/button";
import { ConfirmPopup, confirmPopup }                       from 'primereact/confirmpopup';
import { TabPanel, TabPanelHeaderTemplateOptions, TabView } from "primereact/tabview";
import { TabMenuTabChangeEvent }                            from "primereact/tabmenu";
import * as React                                           from 'react';
import { useTranslation }                                   from "react-i18next";

import TCallbackResponse                                            from "../../types/TCallbackResponse";
import { ECallbackStatus }                                          from "../../types/ECallbackStatus";
import EchoClient                                                   from "../../services/EchoClient";
import DropdownConnector                                            from "../common/form/DropdownConnector";
import { EAceEditorMode }                                           from "../../types/primereact/EAceEditorMode";
import { EAceEditorButton }                                         from "../../types/primereact/EAceEditorButton";
import { apiSendRequest }                                           from "../../services/api";
import { EAPIEndPoint }                                             from "../../types/EAPIEndPoint";
import { sleep }                                                    from "../../utils/tools";
import TDraft                                                       from "../../types/TDraft";
import TDraftQuery                                                  from "../../types/TDraftQuery";
import TDraftQueries                                                from "../../types/TDraftQuery";
import TSQLConsoleQuery                                             from "../../types/TSQLConsoleQuery";
import { notificationEvent }                                        from "../../utils/events";
import SQLConsoleResult                                             from "./SQLConsoleResult";
import apiDataContext                                               from "../../contexts/api_data/store/context";
import { refreshConnectorCompletions, refreshConnectorSchemasTree } from "../../contexts/api_data/store/actions";
import CenteredLoading                                              from "../common/loading/CenteredLoading";
import SchemaTree                                                   from "./SchemaTree";
import { EReportDevBarMessageType }                                 from "../../types/applicationEvent/EReportDevBarMessageType";
import { context as authContext }                                   from "../../contexts/auth/store/context";
import TSQLConsoleQueryResult                                       from "../../types/TSQLConsoleQueryResut";
import CenteredError                                                from "../common/loading/CenteredError";
import TConnector                                                   from "../../types/TConnector";
import { TAPIResponse }                                             from "../../types/TAPIResponsed";

const CustomEditor = React.lazy(() => import('../common/CustomEditor'));

const SQLConsole: React.FC<{
    cssClassName?: string,
}> = ({cssClassName}): React.ReactElement => {

    const {state: authState} = React.useContext(authContext);
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext)

    const {t} = useTranslation();

    // Take the first available ConfConnector.
    const [confConnectorId, setConfConnectorId] = React.useState<number>(0);
    const [confConnectorLoading, setConfConnectorLoading] = React.useState<boolean>(false);
    const [tabActiveIndex, setTabActiveIndex] = React.useState<number>(0);
    const [draft, setDraft] = React.useState<TDraft>({id: 0, draft_queries: []});
    const [sqlQuery, setSqlQuery] = React.useState<string>('');
    const [stateSQLConsoleCallbackResponseQueryRun, setStateSQLConsoleCallbackResponseQueryRun] = React.useState<TCallbackResponse>({status: ECallbackStatus.IDLE});
    const [stateSQLConsoleCallbackResponseQuerySave, setStateSQLConsoleCallbackResponseQuerySave] = React.useState<TCallbackResponse>({status: ECallbackStatus.IDLE});
    const [sqlConsoleQueries, setSqlConsoleQueries] = React.useState<Array<TSQLConsoleQuery>>([]);
    const [refreshCompletion, setRefreshCompletion] = React.useState<boolean>(false);
    const [showTree, setShowTree] = React.useState<boolean>(true);

    const tabHeaderTemplate = (options: TabPanelHeaderTemplateOptions) => {

        return (
            <button type="button" onClick={options.onClick} className={options.className}>
                {options.titleElement}
                <i className="pi pi-times-circle ml-2 clickable-icon"
                   onClick={(event) => {
                       confirmPopup({
                           target: event.currentTarget,
                           message: t('common:draft.do_you_really_want_to_delete_this_draft_queries').toString(),
                           icon: 'pi pi-metric-circle',
                           acceptClassName: 'p-button-danger',
                           accept: () => {

                               if (draft.id > 0 && draft.draft_queries[options.index]) {

                                   apiSendRequest({
                                       method: 'DELETE',
                                       endPoint: EAPIEndPoint.DRAFT_QUERIES,
                                       resourceId: draft.draft_queries[options.index].id,
                                       callbackSuccess: () => {

                                           setDraft({
                                               ...draft,
                                               draft_queries: draft.draft_queries.filter(
                                                   (draftQueries: TDraftQueries) => draftQueries.id !== draft.draft_queries[options.index].id
                                               )
                                           });
                                           setTabActiveIndex(draft.draft_queries.length - 2);


                                           document.dispatchEvent(
                                               notificationEvent({
                                                   message: '',
                                                   reportId: 0,
                                                   timestamp: Date.now(),
                                                   title: t('common:draft.draft_queries_delete').toString(),
                                                   type: EReportDevBarMessageType.LOG,
                                                   severity: "success",
                                                   toast: true,
                                               })
                                           );
                                       },
                                       callbackError: () => {
                                       }
                                   });
                               }
                           }

                       });
                   }}
                />
                <ConfirmPopup/>
            </button>
        );
    };

    const addSqlConsoleQueriesTab = React.useCallback((): void => {

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.DRAFT_QUERIES,
            formValues: {draft_id: draft.id, queries: ""},
            callbackSuccess: (draftQueries: TDraftQueries) => {

                draft.draft_queries.push(draftQueries);
                setDraft(draft);

                setTabActiveIndex(draft.draft_queries.length === 1 ? 0 : draft.draft_queries.length - 1);

                document.dispatchEvent(
                    notificationEvent({
                        new: true,
                        message: '',
                        reportId: 0,
                        timestamp: Date.now(),
                        title: t('common:draft.draft_queries_created').toString(),
                        type: EReportDevBarMessageType.LOG,
                        severity: "success",
                        toast: true,
                    })
                );
            },
            callbackError: () => {
            }
        });
    }, [draft, t]);

    const onSave = React.useCallback((queries: string): void => {

        if (draft.id > 0 && draft.draft_queries[tabActiveIndex]) {

            const draft_query_id = draft.draft_queries[tabActiveIndex].id;

            apiSendRequest({
                method: 'PUT',
                endPoint: EAPIEndPoint.DRAFT_QUERIES,
                resourceId: draft_query_id,
                formValues: {draft_id: draft.id, queries: queries},
                callbackSuccess: (draft_query: TDraftQuery) => {
                    setStateSQLConsoleCallbackResponseQuerySave({status: ECallbackStatus.ACTION_OK});
                    setDraft((previousDraft: TDraft) => ({
                        ...previousDraft,
                        draft_queries: previousDraft.draft_queries.map(dq => dq.id === draft_query.id ? draft_query : dq),
                    }));
                },
                callbackError: () => {
                    setStateSQLConsoleCallbackResponseQuerySave({status: ECallbackStatus.ACTION_KO});
                }
            });
        }
    }, [draft.id, draft.draft_queries, tabActiveIndex]);

    const onExecute = React.useCallback((queries: string): void => {

        if (draft.id > 0 && draft.draft_queries[tabActiveIndex]) {

            const draft_query_id = draft.draft_queries[tabActiveIndex].id;

            apiSendRequest({
                method: 'POST',
                endPoint: EAPIEndPoint.CONF_CONNECTOR,
                resourceId: confConnectorId,
                extraUrlPath: 'exec-queries',
                formValues: {
                    draft_query_id: draft_query_id,
                    queries: queries
                },
                callbackSuccess: () => {
                    setStateSQLConsoleCallbackResponseQueryRun({status: ECallbackStatus.ACTION_OK});
                },
                callbackError: (error: TAPIResponse) => {
                    setStateSQLConsoleCallbackResponseQueryRun({status: ECallbackStatus.ACTION_KO});
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
    }, [draft.id, draft.draft_queries, tabActiveIndex, confConnectorId, t]);

    const getSqlConsoleQueriesTabHeader = React.useCallback((draftQueries: TDraftQueries): React.ReactElement => {

        const sqlConsoleQueriesFound = sqlConsoleQueries.filter((sqlConsoleQuery: TSQLConsoleQuery) => sqlConsoleQuery.draft_query_id === draftQueries.id);

        if (sqlConsoleQueriesFound && sqlConsoleQueriesFound.length > 0) {

            let content = <></>;
            if (sqlConsoleQueriesFound.some((sqlConsoleQuery: TSQLConsoleQuery) => sqlConsoleQuery.loading)) {
                content =
                    <i key={`queries-tab-${draftQueries.id}-i`}
                       className="pi pi-spin pi-spinner mr-2"/>;
            }

            return (
                <React.Fragment
                    key={`queries-tab-${draftQueries.id}-loading`}
                >
                    {content}
                </React.Fragment>
            );
        }

        return <></>

    }, [sqlConsoleQueries]);

    const getSqlConsoleQueriesTabContents = React.useCallback((draftQueries: TDraftQueries): React.ReactElement[] => {

        return sqlConsoleQueries.map((sqlConsoleQueryLooped: TSQLConsoleQuery, index) => {
            let result = <></>;

            if (sqlConsoleQueryLooped.draft_query_id === draftQueries.id && !sqlConsoleQueryLooped.loading && sqlConsoleQueryLooped.results.stdout.length > 0) {

                result = (<SQLConsoleResult
                        sqlConsoleQuery={sqlConsoleQueryLooped}
                        adjustWidthToContent
                    />
                );
            } else if (sqlConsoleQueryLooped.draft_query_id === draftQueries.id && !sqlConsoleQueryLooped.loading && sqlConsoleQueryLooped.results.stderr.length > 0) {

                result = (
                    <CenteredError
                        extraMessage={sqlConsoleQueryLooped.results.stderr}/>
                );
            } else if (sqlConsoleQueryLooped.loading) {

                result = <CenteredLoading/>;
            }

            return <React.Fragment
                key={`queries-tab-${draftQueries.id}-${sqlConsoleQueryLooped.query_index}-${index}`}
            >
                {result}
            </React.Fragment>
        });


    }, [sqlConsoleQueries]);


    // Websocket events
    //
    React.useEffect(() => {

        if (authState.isLoggedIn) {

            console.debug('ws - listening to SQL Queries events')
            EchoClient
                .private('user.' + authState.websocketSessionId)
                .listen('SQLQueriesStart', (sqlConsoleQueryResult: TSQLConsoleQueryResult) => {
                    console.debug('ws - SQLQueriesStart', sqlConsoleQueryResult, sqlConsoleQueries);

                    // @note - we don't have sqlConsoleQueries state in this useEffect, so we need to update it in
                    //         state "context".
                    setSqlConsoleQueries(
                        (currentSqlConsoleQueries: Array<TSQLConsoleQuery>) => {

                            return currentSqlConsoleQueries.filter(
                                (sqlResultsLooped: TSQLConsoleQuery) => sqlResultsLooped.draft_query_id !== sqlConsoleQueryResult.draft_query_id
                            );
                        }
                    );
                })
                .listen('SQLSubQueryStart', (sqlConsoleQueryResult: TSQLConsoleQueryResult) => {
                    console.debug('ws - SQLSubQueryStart', sqlConsoleQueryResult);

                    // @note - we don't have sqlConsoleQueries state in this useEffect, so we need to update it in
                    //         state "context".
                    setSqlConsoleQueries(
                        (currentSqlConsoleQueries: Array<TSQLConsoleQuery>) => ([
                            ...currentSqlConsoleQueries,
                            {
                                draft_query_id: sqlConsoleQueryResult.draft_query_id,
                                loading: true,
                                query_index: sqlConsoleQueryResult.query_index,
                                results: {
                                    stdout: [],
                                    stderr: [],
                                    timings: {
                                        start: Date.now(),
                                        end: 0
                                    }
                                }
                            }
                        ])
                    );
                })
                .listen('SQLQueriesErrorReceived', (sqlConsoleQueryResult: TSQLConsoleQueryResult) => {
                    console.debug('ws - SQLQueriesErrorReceived');

                    setSqlConsoleQueries(
                        (currentSqlConsoleQueries: Array<TSQLConsoleQuery>) => {

                            return currentSqlConsoleQueries.map(
                                (sqlResultsLooped: TSQLConsoleQuery) => {

                                    if (sqlResultsLooped.draft_query_id === sqlConsoleQueryResult.draft_query_id
                                        && sqlResultsLooped.query_index === sqlConsoleQueryResult.query_index
                                    ) {

                                        sqlResultsLooped.results.stderr = sqlConsoleQueryResult.results.stderr;
                                    }

                                    return sqlResultsLooped;
                                });
                        }
                    );
                })
                .listen('SQLQueriesResultsReceived', (sqlConsoleQueryResult: TSQLConsoleQueryResult) => {
                    console.debug('ws - SQLQueriesResultsReceived', sqlConsoleQueryResult);

                    setSqlConsoleQueries(
                        (currentSqlConsoleQueries: Array<TSQLConsoleQuery>) => {

                            return currentSqlConsoleQueries.map(
                                (sqlResultsLooped: TSQLConsoleQuery) => {

                                    if (sqlResultsLooped.draft_query_id === sqlConsoleQueryResult.draft_query_id
                                        && sqlResultsLooped.query_index === sqlConsoleQueryResult.query_index) {

                                        sqlResultsLooped.results.stdout = sqlConsoleQueryResult.results.stdout;
                                    }

                                    return sqlResultsLooped;
                                });
                        }
                    );
                })
                .listen('SQLSubQueryEnd', (sqlConsoleQueryResult: TSQLConsoleQueryResult) => {
                    console.debug('ws - SQLSubQueryEnd', sqlConsoleQueryResult);

                    setSqlConsoleQueries(
                        (currentSqlConsoleQueries: Array<TSQLConsoleQuery>) => {

                            return currentSqlConsoleQueries.map(
                                (sqlResultsLooped: TSQLConsoleQuery) => {

                                    if (sqlResultsLooped.draft_query_id === sqlConsoleQueryResult.draft_query_id
                                        && sqlResultsLooped.query_index === sqlConsoleQueryResult.query_index) {

                                        sqlResultsLooped.loading = false;
                                        sqlResultsLooped.results.timings.end = Date.now();
                                    }

                                    return sqlResultsLooped;
                                });
                        }
                    );
                })
                .listen('SQLQueriesEnd', (sqlConsoleQueryResult: TSQLConsoleQueryResult) => {
                    console.debug('ws - SQLQueriesEnd', sqlConsoleQueryResult);
                });
        }

        return () => {

            if (authState.isLoggedIn) {

                console.debug('ws - stop listening to SQL Queries events')
                EchoClient
                    .private('user.' + authState.websocketSessionId)
                    .stopListening('SQLQueriesStart')
                    .stopListening('SQLSubQueryStart')
                    .stopListening('SQLQueriesResultsReceived')
                    .stopListening('SQLQueriesErrorReceived')
                    .stopListening('SQLSubQueryEnd')
                    .stopListening('SQLQueriesEnd');
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        authState.isLoggedIn,
        authState.user.id,
    ])

    // Select the first available ConfConnector.
    //
    React.useEffect(() => {

        if (authState.isLoggedIn
            && authState.user.organization_user.organization
            && apiDataState.connectors.length > 0

        ) {

            const connectorsAvailable = apiDataState.connectors.filter((connector: TConnector) => {

                return connector.organization_id === authState.user.organization_user.organization.id && !connector.global;
            });


            if (connectorsAvailable.length > 0) {

                setConfConnectorId(connectorsAvailable[0].id);
            }
        }
    }, [
        apiDataState.connectors,
        authState.isLoggedIn,
        authState.user.id,
        authState.user.organization_user.organization
    ]);

    // Get all user's drafts for selected conf-connector.
    //
    React.useEffect(() => {

        if (confConnectorId) {

            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.DRAFT,
                resourceId: confConnectorId,
                callbackSuccess: (response: TDraft) => {
                    setRefreshCompletion(true);
                    setTabActiveIndex(0);
                    setDraft(response);
                },
                callbackError: () => {
                }
            });
        }
    }, [confConnectorId]);

    // Set the current queries in CustomEditor component.
    //
    React.useEffect(() => {

        if (draft.id > 0) {

            if (draft.draft_queries[tabActiveIndex]) {

                setSqlQuery(String(draft.draft_queries[tabActiveIndex].queries || ''));
            } else if (draft.draft_queries[0]) {

                setSqlQuery(String(draft.draft_queries[0].queries || ''));
            }
        }
    }, [draft, tabActiveIndex]);

    // Handle shortcuts
    //
    React.useEffect(() => {

        function handleRunShortcut(event: KeyboardEvent): void {

            const {
                altKey,
                shiftKey,
                code,
            } = event;

            // ALT + SHIFT + T
            if (code === 'KeyT' && altKey && shiftKey) {

                event.preventDefault();

                setShowTree(!showTree)
            }
        }

        // Bind the Event listener
        document.addEventListener("keydown", handleRunShortcut);
        return () => {

            // Unbind the event listener on clean up
            document.removeEventListener("keydown", handleRunShortcut);
        };
    }, [showTree]);

    // Make sure there's always at least on draft queries in db.
    //
    React.useEffect(() => {

        if (draft && draft.id > 0 && draft.draft_queries.length === 0) {
            addSqlConsoleQueriesTab();
        }

    }, [addSqlConsoleQueriesTab, draft, draft.draft_queries]);

    return (
        <div className="sql-console-splitter-container">
            <div id="sql-console-tree-db-container" className={showTree ? 'show-tree' : 'hide-tree'}>
                <Button
                    icon={showTree ? 'pi pi-chevron-left' : 'pi pi-chevron-right'}
                    id="sql-console-tree-db-container-toggle"
                    onClick={() => setShowTree(!showTree)}
                    className="p-button-outlined p-button-secondary"
                />
                <div className="splitter-sql-console-tree-db">
                    <div className="p-inputgroup">
                        <Button
                            type="button"
                            className="p-inputgroup-addon"
                            icon="pi pi-undo"
                            loading={confConnectorLoading}
                            onClick={() => {

                                apiDataDispatch(refreshConnectorSchemasTree(confConnectorId));
                                apiDataDispatch(refreshConnectorCompletions(confConnectorId));
                                setRefreshCompletion(true);
                            }}
                        />
                        <DropdownConnector
                            className="p-inputgroup-addon"
                            onChange={(event) => {
                                // setConfConnectorId(0);
                                // To let the time for react state to take into account that we changed the current
                                // conf-connector, and so it has time to unmount the CustomEditor component.
                                sleep(1000).then(() => {

                                    setConfConnectorId(Number(event.target.value));
                                })
                            }}
                            id="sql_console_tree_db_connector_id"
                            isInvalid={false}
                            defaultValue={confConnectorId}
                        />

                    </div>
                    <SchemaTree
                        cssClassName={`tree-db ${cssClassName || ''}`}
                        connectorId={confConnectorId}
                        loadingStatusCallback={(status: boolean) => {

                            setConfConnectorLoading(status);
                        }}
                        seeTableDataHandler={(query: string) => onExecute(query)}
                    />
                </div>
            </div>

            <div className="flex sql-console-console-results" style={{overflow: 'hidden'}}>
                <div>
                    <React.Suspense fallback={<CenteredLoading/>}>
                        {confConnectorId > 0 && <CustomEditor
                            id={`custom-editor-id-${confConnectorId}`}
                            confConnectorId={confConnectorId}
                            classNameAce=""
                            value={sqlQuery}
                            onCompletionCallback={() => setRefreshCompletion(false)}
                            onExecuteCallback={(queries: string) => onExecute(queries)}
                            onSaveCallback={(queries: string) => onSave(queries)}
                            runCallbackResponse={stateSQLConsoleCallbackResponseQueryRun}
                            saveCallbackResponse={stateSQLConsoleCallbackResponseQuerySave}
                            onLoad={true}
                            refreshCompletion={refreshCompletion}
                            resize="vertical"
                            mode={EAceEditorMode.MYSQL}
                            activeButtons={[EAceEditorButton.RUN, EAceEditorButton.SAVE]}
                        />}
                    </React.Suspense>
                </div>
                <div className="sql-console-results-panel">
                    {confConnectorId > 0 && draft.id > 0 &&
                        <TabView
                            key="add-tab"
                            renderActiveOnly={false}
                            activeIndex={tabActiveIndex}
                            onTabChange={(event: TabMenuTabChangeEvent) => {

                                // Handle new tab
                                //
                                // @ts-ignore - add a new draft queries
                                if (event.originalEvent.target.outerHTML.match('pi-plus')) {

                                    addSqlConsoleQueriesTab();
                                } else {

                                    setTabActiveIndex(event.index);
                                }
                            }}
                        >
                            {draft.draft_queries.map((draftQueriesLooped: TDraftQueries) => (

                                <TabPanel
                                    key={`queries-tab-${draftQueriesLooped.id}`}
                                    header={(
                                        <>
                                            {getSqlConsoleQueriesTabHeader(draftQueriesLooped)}
                                            <span key={`queries-tab-${draftQueriesLooped.id}-span`}
                                                  className="p-tabview-title">
                                                    {`#${draftQueriesLooped.id}`}
                                                </span>
                                        </>
                                    )}
                                    headerTemplate={tabHeaderTemplate}
                                    contentClassName="sql-console-results"
                                >
                                    {getSqlConsoleQueriesTabContents(draftQueriesLooped)}
                                </TabPanel>
                            ))}

                            <TabPanel header="" leftIcon="pi pi-plus"/>
                        </TabView>
                    }
                </div>
            </div>

        </div>
    );
}

export default SQLConsole;