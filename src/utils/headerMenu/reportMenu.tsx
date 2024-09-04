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

import { t }                         from "i18next";
import { confirmDialog }             from "primereact/confirmdialog";
import { MenuItem, MenuItemOptions } from "primereact/menuitem";
import { OverlayPanel }              from "primereact/overlaypanel";
import { Tooltip }                   from "primereact/tooltip";
import * as React                    from "react";
import { useTranslation }            from "react-i18next";
import { useLocation, useNavigate }  from "react-router-dom";

import * as RTReport                                                                                                                from "../../contexts/report/ReportContextProvider";
import { isThereConnectorConfigured, nameValuesToString }                                                                           from "../tools";
import MenuItemShortcutTemplate                                                                                                     from "../../components/common/menu/MenuItemShortcutTemplate";
import { EReportPanel }                                                                                                             from "../../types/EReportPanels";
import { closeReportInstance, reportInstanceSetUseCache, reportSetFavorite, reportSetVisibility, reportTogglePanel, TReportAction } from "../../contexts/report/store/actions";
import { EReportViewMode }                                                                                                          from "../../types/EReportViewMode";
import { apiSendRequest }                                                                                                           from "../../services/api";
import { EAPIEndPoint }                                                                                                             from "../../types/EAPIEndPoint";
import { context as apiDataContext }                                                                                                from "../../contexts/api_data/store/context";
import ReportParameters                                                                                                             from "../../components/report/ReportParameters";
import OverlayButton                                                                                                                from "../../components/common/OverlayButton";
import { context as authContext }                                                                                                   from "../../contexts/auth/store/context";
import TReportDataView                                                                                                              from "../../types/TReportDataView";
import { useMobileLayout }                                                                                                          from "../windowResize";
import TReport                                                                                                                      from "../../types/TReport";
import { reportChangeVisibility, reportFavoriteAdd, reportFavoriteRemove, TAPIDataAction }                                          from "../../contexts/api_data/store/actions";
import { TReportAsyncAction }                                                                                                       from "../../contexts/report/store/asyncAction";
import env                                                                                                                          from "../../envVariables";
import TDataViewInstance                                                                                                            from "../../types/TDataViewInstance";
import { EReportDevBarMessageType }                                                                                                 from "../../types/application-event/EReportDevBarMessageType";
import { notificationEvent, reportDevBarEvent }                                                                                     from "../events";
import TTTL                                                                                                                         from "../../types/TTTL";

export const handleFavoriteReportChange = (
    report: TReport | null,
    apiDataDispatch: React.Dispatch<TAPIDataAction>,
    reportDispatch: React.Dispatch<TReportAction | TReportAsyncAction>
) => {

    if (report) {

        if (report.favorite) {

            apiDataDispatch(reportFavoriteRemove(report));
        } else {

            apiDataDispatch(reportFavoriteAdd(report));
        }

        reportDispatch(reportSetFavorite({report_id: report.id, favorite: !report.favorite}));
    }
}

export const handleVisibilityReportChange = (
    payload: { reportId: number, is_visible: boolean },
    apiDataDispatch: React.Dispatch<TAPIDataAction>,
    reportDispatch: React.Dispatch<TReportAction | TReportAsyncAction>
) => {

    apiDataDispatch(reportChangeVisibility(payload));
    reportDispatch(reportSetVisibility(payload));
}

export const handleUseCacheReportInstanceChange = (
    payload: { reportId: number, reportInstanceId: number, useCache: boolean },
    reportDispatch: React.Dispatch<TReportAction | TReportAsyncAction>
) => {

    reportDispatch(reportInstanceSetUseCache(payload));

    document.dispatchEvent(
        notificationEvent({
            message: payload.useCache ? t('report:cache.cache_activated').toString() : t('report:cache.cache_deactivated').toString(),
            reportId: payload.reportId,
            timestamp: Date.now(),
            title: t('report:cache.cache_system').toString(),
            type: EReportDevBarMessageType.LOG,
            severity: payload.useCache ? 'success' : 'info',
            toast: true,
            life: 1000,
        })
    );
}

export const useCreateReportIconButton = (): MenuItem | undefined => {

    const {state: authState} = React.useContext(authContext);
    const {state: apiDataState} = React.useContext(apiDataContext);

    const {t} = useTranslation();
    const navigate = useNavigate();

    const [createReportMenu, setCreateReportMenu] = React.useState<MenuItem | undefined>(undefined);

    const isMobile = useMobileLayout();

    React.useEffect(() => {

        if (authState.user.organization_user.ui_grants.report.edit
            && !authState.user.is_super_admin
            && isThereConnectorConfigured(apiDataState.connectors, authState.user.organization_user.organization)
        ) {
            setCreateReportMenu({
                label: t('report:form.create_report').toString(),
                icon: "pi pi-plus",
                className: "mobile-only-label",
                command: () => navigate('/create-report'),
            });
        } else {
            setCreateReportMenu(undefined);
        }
    }, [
        apiDataState.connectors,
        authState.user.is_super_admin,
        authState.user.organization_user.ui_grants.report.edit,
        authState.user.organization_user.organization,
        authState.user.organization_user.organization.conf_connectors,
        isMobile,
        navigate,
        t,
    ])

    return createReportMenu;
}

export const useReportFavoriteIconButton = (): MenuItem | undefined => {

    const {t} = useTranslation();

    const reportState = RTReport.useReportStateReportInstanceDataViewInstanceFromLocation(useLocation().pathname);
    const isMobile = useMobileLayout();

    const reportDispatch = RTReport.useDispatch();

    const {mDispatch: apiDataDispatch} = React.useContext(apiDataContext);

    const [reportFavoriteMenu, setReportFavoriteMenu] = React.useState<MenuItem | undefined>(undefined);

    React.useEffect(() => {

        if (reportState.report) {

            setReportFavoriteMenu({
                    label: reportState.report.favorite ? t('report:added_to_favorites').toString() : t('report:add_to_favorites').toString(),
                    icon: reportState.report.favorite ? 'pi pi-fw pi-bookmark-fill' : 'pi pi-fw pi-bookmark',
                    className: "mobile-only-label",
                    template: (item, options) => (
                        <>
                            <Tooltip target={`#report-add-favorites-${reportState.report.id}`}
                                     position={"bottom"}
                                     content={!isMobile ? item.label : undefined}
                                     showDelay={env.tooltipShowDelay}
                                     hideDelay={env.tooltipHideDelay}
                            />
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a style={{width: '100%'}}
                               className={`rdb-menu-icon-link ${options.className} p-button-link`}
                               onClick={() => handleFavoriteReportChange(reportState.report, apiDataDispatch, reportDispatch)}
                            >
                                <span id={`report-add-favorites-${reportState.report.id}`}
                                      className={options.iconClassName}/>
                                <span className={options.labelClassName}>{item.label}</span>
                            </a>
                        </>
                    )
                }
            )
        } else {
            setReportFavoriteMenu(undefined);
        }
    }, [
        apiDataDispatch,
        isMobile,
        reportDispatch,
        reportState?.report,
        reportState?.report?.id,
        reportState?.report?.favorite,
        t
    ]);

    return reportFavoriteMenu;
}

export const useReportVisibilityButton = (): MenuItem | undefined => {

    const {t} = useTranslation();

    const reportState = RTReport.useReportStateReportInstanceDataViewInstanceFromLocation(useLocation().pathname);
    const isMobile = useMobileLayout();

    const reportDispatch = RTReport.useDispatch();

    const {mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const {state: authState} = React.useContext(authContext);

    const [reportVisibilityMenu, setReportVisibilityMenu] = React.useState<MenuItem | undefined>(undefined);

    React.useEffect(() => {

        if (reportState.report
            && !authState.user.is_super_admin
            && authState.user.organization_user.ui_grants.report.edit
        ) {

            setReportVisibilityMenu({
                    label: t('report:change_report_visibility').toString(),
                    icon: reportState.report.is_visible ? 'pi pi-eye' : 'pi pi-eye-slash',
                    className: "mobile-only-label",
                    template: (item, options) => (
                        <>
                            <Tooltip target={`#report-visibility-button-${reportState.report.id}`}
                                     position={"bottom"}
                                     content={!isMobile
                                         ? reportState.report.is_visible ?
                                             `${t('report:change_report_visibility').toString()}
${t('report:currently_visible').toString()}`
                                             :
                                             `${t('report:change_report_visibility').toString()}
${t('report:currently_not_visible').toString()}`
                                         : undefined}
                                     showDelay={env.tooltipShowDelay}
                                     hideDelay={env.tooltipHideDelay}
                            />
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a style={{width: '100%'}}
                               className={`rdb-menu-icon-link ${options.className} p-button-link`}
                               onClick={() => handleVisibilityReportChange(
                                   {reportId: reportState.report.id, is_visible: !reportState.report.is_visible},
                                   apiDataDispatch,
                                   reportDispatch
                               )}
                            >
                                <span id={`report-visibility-button-${reportState.report.id}`}
                                      className={options.iconClassName}/>
                                <span className={options.labelClassName}>{item.label}</span>
                            </a>
                        </>
                    )
                }
            )
        } else {
            setReportVisibilityMenu(undefined);
        }
    }, [
        apiDataDispatch,
        authState.user.is_super_admin,
        authState.user.organization_user.ui_grants.report.edit,
        isMobile,
        reportDispatch,
        reportState?.report,
        reportState?.report?.id,
        reportState?.report?.is_visible,
        t
    ]);

    return reportVisibilityMenu;
}

export const useRunReportWithDefaultParamsIconButton = (): MenuItem | undefined => {

    const navigate = useNavigate();
    const {t} = useTranslation();
    const isMobile = useMobileLayout();

    const reportState = RTReport.useReportStateReportInstanceDataViewInstanceFromLocation(useLocation().pathname);

    const [runReportMenu, setRunReportMenu] = React.useState<MenuItem | undefined>(undefined);

    React.useEffect(() => {

        if (reportState.report && reportState.instance) {

            setRunReportMenu({
                label: reportState.report.has_parameters ? t('report:run_report_with_current_parameters').toString() : t('report:run_report').toString(),
                icon: "pi pi-play",
                className: `mobile-only-label ${!isMobile ? 'active' : ''}`,
                template: (item, options) => (
                    <>
                        <Tooltip target={`#report-run-button-${reportState.report.id}`}
                                 position={"bottom"}
                                 content={!isMobile ? item.label : undefined}
                                 showDelay={env.tooltipShowDelay}
                                 hideDelay={env.tooltipHideDelay}
                        />
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a style={{width: '100%'}}
                           className={`rdb-menu-icon-link ${options.className} p-button-link menu-item-with-tooltip`}
                           onClick={() => {

                               if (reportState.report.has_parameters) {

                                   // @ts-ignore - verified earlier
                                   navigate('/report/' + reportState.report?.id + '_' + reportState.instance.id + '?' + nameValuesToString(reportState.instance.reportParameterInputValues) + '&run');
                               } else {

                                   // @ts-ignore - verified earlier
                                   navigate('/report/' + reportState.report?.id + '_' + reportState.instance.id + '?run');
                               }
                           }}
                        >
                            <span id={`report-run-button-${reportState.report.id}`} className={options.iconClassName}/>
                            <span className={options.labelClassName}>{item.label}</span>
                        </a>
                    </>
                )
            })
        } else {

            setRunReportMenu(undefined);
        }
    }, [
        isMobile,
        navigate,
        reportState?.instance,
        reportState?.instance?.id,
        reportState?.report,
        reportState?.report?.id,
        reportState?.report?.has_parameters,
        t
    ]);

    return runReportMenu;
}

export const useSetupInputParamsAndExecuteIconButton = (): MenuItem | undefined => {

    const {t} = useTranslation();
    const isMobile = useMobileLayout();
    const navigate = useNavigate();

    const reportState = RTReport.useReportStateReportInstanceDataViewInstanceFromLocation(useLocation().pathname);

    const [runReportMenu, setRunReportMenu] = React.useState<MenuItem | undefined>(undefined);

    React.useEffect(() => {


        if (reportState?.report && reportState?.report.has_parameters) {

            setRunReportMenu({
                label: t('report:input_parameters').toString(),
                icon: 'icon-play-parameters',
                className: `mobile-only-label ${!isMobile ? 'active' : ''} ${!isMobile ? 'rdb-menu-icon-link-with-overlay' : ''}`,
                template: (item, options) => (
                    <>
                        <Tooltip target={`#report-run-button-with-parameters-${reportState.report.id}`}
                                 position={"bottom"}
                                 content={!isMobile ? item.label : undefined}
                                 showDelay={env.tooltipShowDelay}
                                 hideDelay={env.tooltipHideDelay}
                        />
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a style={{width: '100%'}}
                           className={`rdb-menu-icon-link ${options.className} p-button-link`}
                           onClick={() => navigate(`/report-run/with-input-parameters/${reportState.report.id}/${reportState.instance?.id}`)}
                        >
                                <span id={`report-run-button-with-parameters-${reportState.report.id}`}
                                      className={options.iconClassName}/>
                            <span className={options.labelClassName}>{item.label}</span>
                        </a>
                    </>
                ),
            })
        } else {

            setRunReportMenu(undefined);
        }
    }, [
        isMobile,
        reportState?.instance?.id,
        reportState?.report,
        reportState?.report?.id,
        reportState?.report?.has_parameters,
        t,
        navigate
    ]);

    return runReportMenu;
}

export const useReportMenu = (): MenuItem | undefined => {

    const {t} = useTranslation(['menu', 'common', 'report']);
    const currentLocation = useLocation();
    const navigate = useNavigate();

    const reportState = RTReport.useReportStateReportInstanceDataViewInstanceFromLocation(currentLocation.pathname, true);

    const {state: authState} = React.useContext(authContext);

    const reportDispatch = RTReport.useDispatch();

    const [reportMenu, setReportMenu] = React.useState<MenuItem | undefined>(undefined);

    const ttls: Array<TTTL> = [
        {label: t('report:cache.ttl_15_m').toString(), value: 900},
        {label: t('report:cache.ttl_1_h').toString(), value: 3600},
        {label: t('report:cache.ttl_6_h').toString(), value: 21600},
        {label: t('report:cache.ttl_1_d').toString(), value: 86400}
    ];

    React.useEffect(() => {

        let items: Array<MenuItem> = [];

        if (reportState.report) {
            items = items.concat([
                {
                    label: `${t('report:report').toString()} ID`,
                    disabled: true,
                    template: (item: MenuItem, options) => (
                        <span className={`${options.className} font-bold flex justify-content-center align-items-center`}>
                                {item.label}
                            &nbsp;
                            <span className="text-lg" style={{userSelect: "text"}}>{reportState.report.id}</span>
                            </span>
                    )
                },
                {separator: true}
            ]);
        }

        if (reportState.instance) {

            items = items.concat([
                {
                    label: t('report:cache.cache_results').toString(),
                    icon: 'pi pi-save',
                    items: ttls.map((ttl: TTTL) => {
                        return {
                            label: ttl.label,
                            command: () => {

                                apiSendRequest({
                                    method: 'POST',
                                    endPoint: EAPIEndPoint.REPORT,
                                    resourceId: reportState.report.id,
                                    extraUrlPath: 'cache-results',
                                    formValues: {
                                        ttl: ttl.value,
                                        parameters: reportState.instance?.reportParameterInputValues ?? [],
                                        results: reportState.instance?.dataViewInstances.map((dataViewInstance: TDataViewInstance) => {

                                            return {
                                                reportDataViewId: dataViewInstance.id,
                                                results: dataViewInstance.results
                                            }
                                        }) ?? []
                                    },
                                    callbackSuccess: () => {

                                        document.dispatchEvent(
                                            notificationEvent({
                                                message: t('report:cache.results_cached').toString(),
                                                reportId: reportState.report.id,
                                                timestamp: Date.now(),
                                                title: t('report:cache.cache_system').toString(),
                                                type: EReportDevBarMessageType.LOG,
                                                severity: 'success',
                                                toast: true,
                                                life: 1000,
                                            })
                                        );
                                    },
                                    callbackError: () => {

                                        document.dispatchEvent(
                                            reportDevBarEvent({
                                                reportId: reportState.report.id,
                                                timestamp: Date.now(),
                                                title: 'Report Id #' + reportState.report.id,
                                                message: t('report:cache.caching_error').toString(),
                                                type: EReportDevBarMessageType.ERROR_REPORT,
                                            })
                                        );
                                    }
                                });
                            },
                            icon: 'pi pi-fw pi-',
                        }
                    })
                },
                {
                    label: (reportState.instance?.useCache) ? t('report:cache.deactivate_cache').toString() : t('report:cache.activate_cache').toString(),
                    icon: (reportState.instance && reportState.instance?.useCache) ? 'pi pi-times' : 'pi pi-check',
                    disabled: !reportState.report.has_cache,
                    command: () => {

                        handleUseCacheReportInstanceChange(
                            {reportId: reportState.report.id, reportInstanceId: Number(reportState.instance?.id), useCache: !reportState.instance?.useCache},
                            reportDispatch
                        )
                    }
                },
            ]);

            if (authState.user.organization_user.ui_grants.report.edit) {

                if (reportState.report.parameters.length > 0) {

                    items = items.concat([
                        {
                            label: t('report:cache.delete_user_cache_params').toString(),
                            icon: 'pi pi-trash',
                            disabled: !reportState.report.has_user_cache,
                            command: () => {

                                apiSendRequest({
                                    method: 'POST',
                                    endPoint: EAPIEndPoint.REPORT,
                                    resourceId: reportState.report.id,
                                    extraUrlPath: 'delete-user-cache',
                                    formValues: {
                                        parameters: reportState.instance?.reportParameterInputValues ?? [],
                                    },
                                    callbackSuccess: () => {

                                        document.dispatchEvent(
                                            notificationEvent({
                                                message: t('report:cache.user_cache_deleted').toString(),
                                                reportId: reportState.report.id,
                                                timestamp: Date.now(),
                                                title: t('report:cache.user_cache_deleted').toString(),
                                                type: EReportDevBarMessageType.LOG,
                                                severity: 'success',
                                                toast: true,
                                                life: 1000,
                                            })
                                        );
                                    },
                                    callbackError: () => {

                                        document.dispatchEvent(
                                            reportDevBarEvent({
                                                reportId: reportState.report.id,
                                                timestamp: Date.now(),
                                                title: 'Report Id #' + reportState.report.id,
                                                message: t('report:cache.issue_deleting_user_cache').toString(),
                                                type: EReportDevBarMessageType.ERROR_REPORT,
                                            })
                                        );
                                    }
                                });
                            }
                        },
                    ]);
                }
                items = items.concat([
                    {
                        label: t('report:cache.delete_user_cache').toString(),
                        icon: 'pi pi-trash',
                        disabled: !reportState.report.has_user_cache,
                        command: () => {

                            apiSendRequest({
                                method: 'POST',
                                endPoint: EAPIEndPoint.REPORT,
                                resourceId: reportState.report.id,
                                extraUrlPath: 'delete-user-cache',
                                callbackSuccess: () => {

                                    document.dispatchEvent(
                                        notificationEvent({
                                            message: t('report:cache.user_cache_deleted').toString(),
                                            reportId: reportState.report.id,
                                            timestamp: Date.now(),
                                            title: t('report:cache.user_cache_deleted').toString(),
                                            type: EReportDevBarMessageType.LOG,
                                            severity: 'success',
                                            toast: true,
                                            life: 1000,
                                        })
                                    );
                                },
                                callbackError: () => {

                                    document.dispatchEvent(
                                        reportDevBarEvent({
                                            reportId: reportState.report.id,
                                            timestamp: Date.now(),
                                            title: 'Report Id #' + reportState.report.id,
                                            message: t('report:cache.issue_deleting_user_cache').toString(),
                                            type: EReportDevBarMessageType.ERROR_REPORT,
                                        })
                                    );
                                }
                            });
                        }
                    },
                    {separator: true}
                ]);
            }
        }

        if (
            !authState.user.is_super_admin
            && reportState.report
            && reportState.instance
            && authState.user.organization_user.ui_grants.report.edit
        ) {

            items = items.concat([
                {
                    label: t('report:form.add_data_view').toString(),
                    icon: 'pi pi-plus',
                    command: () => navigate(`/report-configuration/configuration-data-view/${Number(reportState.report.id)}/0`),
                    className: reportState.instance.viewMode === EReportViewMode.LAYOUT_CONFIG ? 'active' : '',
                },
                {
                    label: t('report:edit_a_view').toString(),
                    icon: 'pi pi-fw pi-chart-bar',
                    disabled: !reportState?.report?.dataViews || (reportState?.report?.dataViews && reportState?.report?.dataViews.length === 0),
                    items: reportState?.report?.dataViews?.map((dataView: TReportDataView) => {
                        return {
                            label: dataView.name,
                            command: () => {
                                if (dataView.id > 0) {
                                    // @ts-ignore - verified earlier
                                    navigate(`/report/${reportState.report?.id}_${reportState.instance.id}/data-view/${dataView.id}?${nameValuesToString(reportState.instance.reportParameterInputValues.filter(param => param.name !== 'run'))}`);
                                } else {
                                    // @ts-ignore - verified earlier
                                    navigate(`/report/${reportState.report?.id}_${reportState.instance.id}?${nameValuesToString(reportState.instance.reportParameterInputValues.filter(param => param.name !== 'run'))}`);
                                }
                            },
                            className: (reportState.instance?.expandedDataViewId || -1) === dataView.id ? 'active' : '',
                            icon: 'pi pi-fw pi-pencil',
                        }
                    })
                },
                {separator: true},
                {
                    label: t('report:view_mode.all_views').toString(),
                    icon: 'pi pi-fw pi-th-large',
                    command: () => {

                        // @ts-ignore - verified earlier
                        navigate(`/report/${reportState.report?.id}_${reportState.instance.id}?view-mode=${EReportViewMode.CLIENT}&${nameValuesToString(reportState.instance.reportParameterInputValues.filter(param => param.name !== 'run'))}`);
                    },
                    className: reportState.instance.viewMode === EReportViewMode.CLIENT ? 'active' : '',
                },
                {separator: true},
                {
                    label: t('report:sections.initialization').toString(),
                    icon: reportState.instance.panels && reportState.instance.panels[EReportPanel.QUERY_INIT] ? 'pi pi-fw pi-eye' : 'pi pi-fw pi-eye-slash',
                    className: `${reportState.instance.panels && reportState.instance.panels[EReportPanel.QUERY_INIT] ? 'active' : ''} hover-menu-item`,
                    disabled: !!currentLocation.search.match('view-mode=layout'),
                    command: () => {

                        reportDispatch(reportTogglePanel({
                            panel: EReportPanel.QUERY_INIT,
                            reportId: reportState.report.id,
                            // @ts-ignore - verified earlier
                            reportInstanceId: reportState.instance.id,
                            // @ts-ignore - verified earlier
                            show: !(reportState.instance.panels && reportState.instance.panels[EReportPanel.QUERY_INIT]),
                        }));
                    },
                    template: (item: MenuItem, options: any) => <MenuItemShortcutTemplate
                        item={item}
                        options={options}
                        shortcut="Alt+Shift+I"
                    />,
                },
                {
                    label: t('report:sections.cleanup').toString(),
                    icon: reportState.instance.panels && reportState.instance.panels[EReportPanel.QUERY_CLEANUP] ? 'pi pi-fw pi-eye' : 'pi pi-fw pi-eye-slash',
                    className: `${reportState.instance.panels && reportState.instance.panels[EReportPanel.QUERY_CLEANUP] ? 'active' : ''} hover-menu-item`,
                    disabled: !!currentLocation.search.match('view-mode=layout'),
                    command: () => {

                        reportDispatch(reportTogglePanel({
                            panel: EReportPanel.QUERY_CLEANUP,
                            reportId: reportState.report.id,
                            // @ts-ignore - verified earlier
                            reportInstanceId: reportState.instance.id,
                            // @ts-ignore - verified earlier
                            show: !(reportState.instance.panels && reportState.instance.panels[EReportPanel.QUERY_CLEANUP]),
                        }));
                    },
                    template: (item: MenuItem, options: any) => <MenuItemShortcutTemplate
                        item={item}
                        options={options}
                        shortcut="Alt+Shift+C"
                    />,
                },
                {separator: true},
                {
                    label: `${t('common:configuration').toString()}...`,
                    icon: 'pi pi-fw pi-sliders-v',
                    command: () => {

                        navigate(`/report-configuration/${reportState.report?.id}`);
                        // reportDispatch(reportShowOptions({show: true, report_id: Number(reportState.report?.id)}))
                    }
                },
                {
                    label: `${t('report:setup_input_parameters')}...`,
                    icon: 'pi pi-fw pi-sliders-h',
                    command: () => {

                        navigate(`/report-configuration/input-parameters-configuration/${reportState.report?.id}`);
                    }
                },
                {
                    label: `${t('report:cache.setup_cache_jobs').toString()}...`,
                    icon: 'pi pi-fw pi-server',
                    command: () => {

                        navigate(`/report-configuration/cache-jobs-configuration/${reportState.report?.id}`);
                    },
                },
                {
                    label: t('common:form.delete').toString(),
                    icon: 'pi pi-fw pi-trash',
                    command: () => {
                        confirmDialog({
                            appendTo: document.body,
                            message: t('report:delete_report').toString(),
                            header: reportState.report.name,
                            icon: 'pi pi-metric-circle',
                            acceptClassName: 'p-button-danger',
                            position: 'top',
                            acceptLabel: t('common:yes').toString(),
                            rejectLabel: t('common:no').toString(),
                            accept: () => {

                                apiSendRequest({
                                    method: 'DELETE',
                                    endPoint: EAPIEndPoint.REPORT,
                                    resourceId: Number(reportState.report?.id),
                                    callbackSuccess: () => {

                                        reportDispatch(closeReportInstance({
                                            reportId: reportState.report.id,
                                            // @ts-ignore - verified earlier
                                            reportInstanceId: reportState.instance.id
                                        }));
                                    },
                                    callbackError: () => {
                                    }
                                });
                            }
                        });
                    },
                },
            ]);
        }

        if (items.length > 0) {

            setReportMenu({
                label: t('report:report').toString(),
                items: items
            })
        } else {

            setReportMenu(undefined);
        }


        // to ignore `ttls` const defined above.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        authState.user.is_super_admin,
        authState.user.organization_user.ui_grants.report.edit,
        currentLocation.search,
        navigate,
        reportDispatch,
        reportState?.instance,
        reportState?.instance?.id,
        reportState?.instance?.viewMode,
        reportState?.instance?.dataViewInstances,
        reportState?.instance?.expandedDataViewId,
        reportState?.instance?.reportParameterInputValues,
        reportState?.instance?.panels,
        reportState?.instance?.useCache,
        reportState?.report,
        reportState?.report?.dataViews,
        reportState?.report?.id,
        reportState?.report?.has_cache,
        reportState?.report?.has_user_cache,
        reportState?.temporaryLayout,
        t,
    ]);

    return reportMenu;
}