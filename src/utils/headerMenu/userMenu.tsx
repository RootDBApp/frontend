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

import i18n                          from "i18next";
import { PrimeIcons }                from "primereact/api";
import { MenuItem, MenuItemOptions } from "primereact/menuitem";
import { Tooltip }                   from "primereact/tooltip";
import * as React                    from "react";
import { VscDebugConsole }           from "react-icons/vsc";
import { useTranslation }            from "react-i18next";
import { useLocation, useNavigate }  from "react-router-dom";


import { context as apiDataContext }                                           from "../../contexts/api_data/store/context";
import { context as authContext }                                              from "../../contexts/auth/store/context";
import { context as preferencesContext }                                       from "../../contexts/preferences/store/context";
import TVersionInfo                                                            from "../../types/TVersionsInfo";
import { EVersionType }                                                        from "../../types/EVersionType";
import TConnector                                                              from "../../types/TConnector";
import { isThereConnectorConfiguredWithNotif, sleep }                          from "../tools";
import { userCanAdminSomeStuff }                                               from "../user";
import {
    leaveWSOrganizationChannel,
    listenWSOrganizationChannel,
    organizationUserChange as apiOrganizationUserChange
}                                                                              from "../../contexts/api_data/store/actions";
import { resetReportsState }                                                   from "../../contexts/report/store/actions";
import { logout, organizationChanged as authOrganizationChanged, userUpdated } from "../../contexts/auth/store/actions";
import * as RTReport
                                                                               from "../../contexts/report/ReportContextProvider";
import TOrganizationUser                                                       from "../../types/TOrganizationUser";
import { apiSendRequest }                                                      from "../../services/api";
import { EAPIEndPoint }                                                        from "../../types/EAPIEndPoint";
import TUser                                                                   from "../../types/TUser";
import apiDataCacheRefresh
                                                                               from "../../contexts/api_data/store/cacheRefresh";
import { defaultOrganizationChanged }                                          from "../../contexts/preferences/store/actions";
import TOrganization                                                           from "../../types/TOrganization";
import { GOT_ORGANIZATIONS }                                                   from "../../contexts/api_data/store/types";
import env                                                                     from "../../envVariables";
import { useMobileLayout }                                                     from "../windowResize";

const useRootDbMenuItemVersion = (): Array<MenuItem> => {

    const {t} = useTranslation(['common', 'settings']);
    const {state: apiDataState} = React.useContext(apiDataContext);
    const [rootDBItems, setRootDBItems] = React.useState<Array<MenuItem>>(
        [
            {
                label: `RootDB v${process.env.REACT_APP_ROOTDB_VERSION}`,
                icon: 'p-menuitem-icon pi pi-check-circle',
                disabled: true,
            },
            {
                label: t('settings:version.up_to_date').toString(),
                disabled: true,
            }
        ]
    );

    React.useEffect(() => {

        if (apiDataState.versionsInfos.length > 0) {

            const rootDBVersionInfo = apiDataState.versionsInfos.find((versionInfo: TVersionInfo) => {
                return versionInfo.type === EVersionType.rootdb;
            })

            if (rootDBVersionInfo && rootDBVersionInfo.update_available) {

                setRootDBItems([
                    {
                        label: `RootDB v${rootDBVersionInfo.update_available ? rootDBVersionInfo.available_version : rootDBVersionInfo.version}`,
                        icon: `p-menuitem-icon pi pi-${rootDBVersionInfo.update_available ? 'arrow-circle-up' : 'check-circle'}`,
                        disabled: true,
                    }, {
                        label: t('settings:version.new_version_available').toString(),
                        disabled: true,
                    }, {
                        label: t('settings:version.release_notes').toString(),
                        icon: 'p-menuitem-icon pi pi-external-link',
                        url: rootDBVersionInfo.url_release_note,
                        target: '_blank',
                        disabled: false,
                    }
                ]);
            }
        }

    }, [t, apiDataState.versionsInfos]);

    return rootDBItems;
};

export const useHeaderLogo = (): React.ReactNode => {

    const {state: authState} = React.useContext(authContext);

    let logoName = 'header-logo.svg';
    switch (authState.user.organization_user.user_preferences.theme) {
        case 'arya-blue':
        case 'arya-green':
        case 'arya-orange':
        case 'arya-purple':
        case 'bootstrap4-dark-blue':
        case 'bootstrap4-dark-purple':
        case 'lara-dark-blue' :
        case 'lara-dark-indigo' :
        case 'lara-dark-purple' :
        case 'lara-dark-teal' :
        case 'luna-amber':
        case 'luna-blue':
        case 'luna-green':
        case 'luna-pink':
        case 'md-dark-deeppurple':
        case 'md-dark-indigo':
        case 'mdc-dark-deeppurple':
        case 'mdc-dark-indigo':
        case 'vela-blue':
        case 'vela-green':
        case 'vela-orange':
        case 'vela-purple':
            logoName = 'header-logo-white.svg';
    }

    return <img alt="logo" src={`/${logoName}`} height="30"></img>
}

export const useHomeIconButton = (): MenuItem => {

    const currentLocation = useLocation();
    const navigate = useNavigate();
    const isMobile = useMobileLayout();

    const {t} = useTranslation(['common', 'settings']);

    return {
        label: t('common:display_home_tab').toString(),
        icon: 'pi pi-home',
        className: `mobile-only-label ${currentLocation.pathname === '/home' ? 'active' : ''}`,
        command: () => navigate('/home'),
        template: (item: MenuItem, options: MenuItemOptions) => (
            <>
                <Tooltip target="#show-home-tab"
                         position={"bottom"}
                         content={!isMobile ? item.label : undefined}
                         showDelay={env.tooltipShowDelay}
                         hideDelay={env.tooltipHideDelay}
                />
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a style={{width: '100%'}}
                   className={`${options.className} p-button-link rdb-menu-icon-link`}
                   onClick={() => navigate('/home')}
                >
                    <span id="show-home-tab" className={options.iconClassName}/>
                    <span className={options.labelClassName}>{item.label}</span>
                </a>
            </>
        )
    }
}

export const useHelpIconButton = (): MenuItem => {

    const currentLocation = useLocation();
    const navigate = useNavigate();
    const isMobile = useMobileLayout();

    const {t} = useTranslation(['common', 'settings']);

    return {
        label: t('common:display_help_tab').toString(),
        icon: 'pi pi-question',
        className: `mobile-only-label ${currentLocation.pathname === '/help' ? 'active' : ''}`,
        command: () => navigate('/help'),
        template: (item: MenuItem, options: MenuItemOptions) => (
            <>
                <Tooltip target="#show-help-tab"
                         position={"bottom"}
                         content={!isMobile ? item.label : undefined}
                         showDelay={env.tooltipShowDelay}
                         hideDelay={env.tooltipHideDelay}
                />
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a style={{width: '100%'}}
                   className={`${options.className} p-button-link rdb-menu-icon-link`}
                   onClick={() => navigate('/help')}
                >
                    <span id="show-help-tab" className={options.iconClassName}/>
                    <span className={options.labelClassName}>{item.label}</span>
                </a>
            </>
        )
    }
}

export const useSQLConsoleIconButton = (): MenuItem | undefined => {

    const currentLocation = useLocation();
    const {state: apiDataState} = React.useContext(apiDataContext);
    const {state: authState} = React.useContext(authContext);

    const {t} = useTranslation(['common', 'settings']);
    const navigate = useNavigate();
    const isMobile = useMobileLayout();

    const [item, setItem] = React.useState<MenuItem>();

    React.useEffect(() => {

        let disableConfConnectorRelatedOptions: boolean = !apiDataState.connectors.some((connector: TConnector) => {
            return connector.organization_id === authState.user.organization_user.organization_id
        })
        // if no connector in apiDataState for the current organization we search into organization?.conf_connectors
        if (disableConfConnectorRelatedOptions) {

            disableConfConnectorRelatedOptions = !isThereConnectorConfiguredWithNotif(authState.user.organization_user.organization, false);
        }

        if (authState.user.is_super_admin || authState.user.organization_user.ui_grants.report_data_view.edit) {

            setItem({
                    label: t('common:sql_console').toString(),
                    icon: PrimeIcons.DESKTOP,
                    className: `mobile-only-label ${currentLocation.pathname === '/sql-console' ? 'active' : ''}`,
                    command: () => navigate('/sql-console'),
                    disabled: disableConfConnectorRelatedOptions,
                    template: (item, options) => (
                        <>
                            <Tooltip target="#show-sql-console"
                                     position={"bottom"}
                                     content={!isMobile ? item.label : undefined}
                                     showDelay={env.tooltipShowDelay}
                                     hideDelay={env.tooltipHideDelay}
                            />
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a style={{width: '100%'}}
                               className={`${options.className} p-button-link rdb-menu-icon-link`}
                               onClick={() => navigate('/sql-console')}
                            >
                                <span id="show-sql-console" className={options.iconClassName}/>
                                <span className={options.labelClassName}>{item.label}</span>
                            </a>
                        </>
                    )
                },
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        apiDataState.connectors,
        authState.user.is_super_admin,
        authState.user.organization_user.organization,
        authState.user.organization_user.organization_id,
        authState.user.organization_user.ui_grants.report_data_view.edit,
        //currentLocation.pathname,
        navigate,
        t
    ]);

    return item;
}

export const useDebugTabIconButton = (): MenuItem | undefined => {

    const currentLocation = useLocation();
    const {state: authState} = React.useContext(authContext);

    const {t} = useTranslation(['common', 'settings']);
    const navigate = useNavigate();
    const isMobile = useMobileLayout();

    const [item, setItem] = React.useState<MenuItem>();

    React.useEffect(() => {

        if (authState.user.is_super_admin || authState.user.organization_user.ui_grants.report_data_view.edit) {

            setItem({
                    label: t('common:logs').toString(),
                    icon: <VscDebugConsole/>,
                    className: `mobile-only-label ${currentLocation.pathname === '/debug' ? 'active' : ''}`,
                    command: () => navigate('/debug'),
                    template: (item, options) => (
                        <>
                            <Tooltip
                                target="#show-debug"
                                position={"bottom"}
                                content={item.label}
                                showDelay={env.tooltipShowDelay}
                                hideDelay={env.tooltipHideDelay}
                            />
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a
                                id="show-debug"
                                style={{width: '100%'}}
                                className={`${options.className} p-button-link rdb-menu-icon-link`}
                                onClick={() => navigate('/debug')}
                            >
                                {item.icon}
                                <span className={options.labelClassName}>{item.label}</span>
                            </a>
                        </>
                    )
                },
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        authState.user.is_super_admin,
        authState.user.organization_user.ui_grants.report_data_view.edit,
        isMobile,
        navigate,
        t
    ]);

    return item;
}

export const useInputParametersIconButton = (): MenuItem | undefined => {

    const currentLocation = useLocation();
    const {state: apiDataState} = React.useContext(apiDataContext);
    const {state: authState} = React.useContext(authContext);

    const {t} = useTranslation(['common', 'settings']);
    const navigate = useNavigate();
    const isMobile = useMobileLayout();

    const [item, setItem] = React.useState<MenuItem>();

    React.useEffect(() => {

        let disableConfConnectorRelatedOptions: boolean = !apiDataState.connectors.some((connector: TConnector) => {
            return connector.organization_id === authState.user.organization_user.organization_id
        })
        // if no connector in apiDataState for the current organization we search into organization?.conf_connectors
        if (disableConfConnectorRelatedOptions) {

            disableConfConnectorRelatedOptions = !isThereConnectorConfiguredWithNotif(authState.user.organization_user.organization, false);
        }

        if (authState.user.is_super_admin || authState.user.organization_user.ui_grants.report_data_view.edit) {

            setItem({
                    label: t('settings:menu.input_parameters').toString(),
                    icon: PrimeIcons.SLIDERS_H,
                    className: `mobile-only-label  ${currentLocation.pathname === '/input-parameters' ? 'active' : ''}`,
                    command: () => navigate('/input-parameters'),
                    disabled: disableConfConnectorRelatedOptions,
                    template: (item, options) => (
                        <>
                            <Tooltip target="#setup-input-parameters"
                                     position={"bottom"}
                                     content={!isMobile ? item.label : undefined}
                                     showDelay={env.tooltipShowDelay}
                                     hideDelay={env.tooltipHideDelay}
                            />
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a style={{width: '100%'}}
                               className={`${options.className} p-button-link rdb-menu-icon-link`}
                               onClick={() => navigate('/input-parameters')}
                            >
                                <span id="setup-input-parameters" className={options.iconClassName}/>
                                <span className={options.labelClassName}>{item.label}</span>
                            </a>
                        </>
                    )
                },
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        apiDataState.connectors,
        authState.user.is_super_admin,
        authState.user.organization_user.organization,
        authState.user.organization_user.organization_id,
        authState.user.organization_user.ui_grants.report_data_view.edit,
        //currentLocation.pathname,
        navigate,
        t]);

    return item;
}

export const useUserMenu = (): MenuItem => {

    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const {state: authState, mDispatch: authDispatch} = React.useContext(authContext);

    const {t} = useTranslation(['common', 'settings']);
    const navigate = useNavigate();
    const reportDispatch = RTReport.useDispatch();
    const rootDBMenuItemVersion = useRootDbMenuItemVersion();

    const [items, setItems] = React.useState<MenuItem[]>([]);

    React.useEffect(() => {

        const itemsToSet: Array<MenuItem> = [
            {
                label: `${t('settings:menu.preferences')}...`,
                icon: PrimeIcons.COG,
                command: () => navigate('/settings/user-preferences'),
            },
            {
                label: `${t('settings:menu.profile')}...`,
                icon: PrimeIcons.USER,
                command: () => navigate('/settings/user-profile'),
            },
            {
                label: `${t('menu:quick_tour')}...`,
                icon: PrimeIcons.QUESTION,
                command: () => navigate('/overview'),
            },
            {
                label: `${t('menu:credits')}...`,
                icon: PrimeIcons.INFO_CIRCLE,
                command: () => navigate('/credits'),
            },
        ];

        if (authState.user.is_super_admin
            || userCanAdminSomeStuff(authState.user.organization_user.ui_grants)
        ) {

            const administrationItems: Array<MenuItem> = [];

            if (authState.user.organization_user.ui_grants.user.edit) {
                administrationItems.push({
                    label: `${t('common:users')}...`,
                    icon: PrimeIcons.USERS,
                    command: () => navigate('/settings/admin/users')
                });
            }

            if (authState.user.organization_user.ui_grants.category.edit) {
                administrationItems.push({
                    label: `${t('common:categories')}...`,
                    icon: PrimeIcons.TAGS,
                    command: () => navigate('/settings/admin/categories')
                });
            }

            if (authState.user.organization_user.ui_grants.group.edit) {
                administrationItems.push({
                    label: `${t('common:users_group')}...`,
                    icon: PrimeIcons.BOX,
                    command: () => navigate('/settings/admin/groups')
                });
            }

            if (authState.user.organization_user.ui_grants.directory.edit) {
                administrationItems.push({
                    label: `${t('common:directories')}...`,
                    icon: PrimeIcons.FOLDER,
                    command: () => navigate('/settings/admin/directories')
                });
            }

            if (authState.user.organization_user.ui_grants.system_info.edit) {

                administrationItems.push({
                    label: `${t('settings:system_info.system_info')}...`,
                    icon: PrimeIcons.INFO,
                    command: () => navigate('/settings/admin/system-metric')
                });
            }

            if (authState.user.organization_user.ui_grants.service_message.edit) {

                administrationItems.push({
                    label: `${t('settings:service_message.service_message')}...`,
                    icon: PrimeIcons.SEND,
                    command: () => navigate('/settings/admin/service-message')
                });
            }

            if (authState.user.organization_user.ui_grants.conf_connector.edit) {

                administrationItems.push({
                    label: `${t('settings:global_administration.connector.connectors')}...`,
                    icon: PrimeIcons.DATABASE,
                    command: () => navigate('/settings/admin/connectors')
                });
            }

            if (authState.user.is_super_admin) {

                administrationItems.push({
                    label: `${t('common:organizations')}...`,
                    icon: PrimeIcons.SITEMAP,
                    command: () => navigate('/settings/admin/organizations')
                });
            }

            itemsToSet.push({
                label: t('settings:menu.administration').toString(),
                icon: PrimeIcons.SLIDERS_V,
                items: administrationItems
            });
        }

        itemsToSet.push({separator: true});
        itemsToSet.push(
            {
                label: t('common:form.logout').toString(),
                icon: PrimeIcons.SIGN_OUT,
                command: () => {

                    // Properly leave Organization ws.
                    apiDataDispatch(leaveWSOrganizationChannel(authState.user.organization_user.organization_id));
                    // Clean local storage.
                    apiDataDispatch({type: "CLEAN_LOCAL_STORAGE", payload: undefined});
                    // Clean report state.
                    reportDispatch(resetReportsState());
                    // And store logged-out metric.
                    authDispatch(logout(authState.user.id));
                }
            }
        );

        if (rootDBMenuItemVersion
            && (authState.user.is_super_admin
                || userCanAdminSomeStuff(authState.user.organization_user.ui_grants))
        ) {
            itemsToSet.push({separator: true});
            rootDBMenuItemVersion.forEach((menuItemVersion: MenuItem) => {

                itemsToSet.push(menuItemVersion);
            });
        } else {

            itemsToSet.push({separator: true});
            itemsToSet.push({
                label: `RootDB v${process.env.REACT_APP_ROOTDB_VERSION}`,
                icon: 'p-menuitem-icon pi pi-check-circle',
                disabled: true,
            });
        }

        setItems(itemsToSet);

    }, [
        apiDataDispatch,
        apiDataState.connectors,
        apiDataState.versionsInfos,
        authDispatch,
        authState.user.id,
        authState.user.is_super_admin,
        authState.user.organization_user.organization,
        authState.user.organization_user.organization_id,
        authState.user.organization_user.ui_grants,
        authState.user.organization_user.roles,
        authState.user.organization_user.role_ids,
        navigate,
        rootDBMenuItemVersion,
        reportDispatch,
        t
    ]);

    return {
        label: authState.user.name,
        icon: 'pi pi-user',
        items,
    };
}

export const useOrganisationSelect = (): MenuItem => {

    const navigate = useNavigate();
    const reportDispatch = RTReport.useDispatch();
    const {state: authState} = React.useContext(authContext);
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const {mDispatch: authStateDispatch} = React.useContext(authContext);
    const {preferencesStateDispatch: preferencesDispatch} = React.useContext(preferencesContext);

    const [items, setItems] = React.useState<MenuItem[]>();
    const [currentLabel, setCurrentLabel] = React.useState<string>('');

    const onChange = React.useCallback((selectedOrganizationId: number) => {

        const organizationUserSelected: TOrganizationUser | undefined = authState.user.organization_users.find(
            (organizationUser: TOrganizationUser) => {

                return organizationUser.organization.id === selectedOrganizationId
            });

        if (organizationUserSelected) {

            apiDataDispatch(leaveWSOrganizationChannel(authState.user.organization_user.organization_id));

            reportDispatch(resetReportsState());

            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.USER,
                extraUrlPath: 'change-organization-user',
                urlParameters: [{key: 'organization-id', value: organizationUserSelected.organization_id}],
                callbackSuccess: (organizationUser: TOrganizationUser) => {

                    let updatedUser: TUser = authState.user;
                    updatedUser.organization_user = organizationUser;
                    authStateDispatch(userUpdated(updatedUser));
                    i18n.changeLanguage(String(updatedUser.organization_user.user_preferences.lang)).then(() => {
                        localStorage.setItem('lang', updatedUser.organization_user.user_preferences.lang);
                    });

                    apiDataDispatch(apiOrganizationUserChange(organizationUser.organization_id));
                    sleep(500).then(() => {
                        apiDataCacheRefresh(organizationUser.organization_id, apiDataDispatch).then();
                    });
                    authStateDispatch(authOrganizationChanged(organizationUser));
                    preferencesDispatch(defaultOrganizationChanged(organizationUser.organization_id));
                    apiDataDispatch(listenWSOrganizationChannel(organizationUser.organization_id));
                    apiDataDispatch({
                        type: GOT_ORGANIZATIONS, payload:
                            authState.user.organization_users.map((organization_user: TOrganizationUser) => {
                                return organization_user.organization;
                            })
                    });
                }
            });

            navigate('/home');
        }
    }, [apiDataDispatch, authStateDispatch, authState.user, navigate, preferencesDispatch, reportDispatch]);

    React.useEffect(() => {

        if (apiDataState.organizations.length > 0) {

            const currentOrganization = apiDataState.organizations.filter((organization: TOrganization) => {

                return authState.user.organization_user.organization_id === organization.id;
            });

            if (currentOrganization && currentOrganization[0]) {

                setCurrentLabel(currentOrganization[0].name);
            }

            setItems(apiDataState.organizations.map((organization: TOrganization) => ({
                    label: organization.name,
                    command: () => onChange(organization.id),
                    className: authState.user.organization_user.organization_id === organization.id ? 'active' : '',
                })
            ))


        } else {

            setItems(undefined);
        }
    }, [apiDataState.organizations, authState.user.organization_user.organization_id, authState.user.organization_users, onChange]);


    return {
        label: currentLabel,
        items: items && items.length > 1 ? items : undefined,
    };
}


