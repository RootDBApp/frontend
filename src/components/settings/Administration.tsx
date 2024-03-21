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

import { TabPanel, TabView, TabViewTabChangeEvent } from "primereact/tabview";
import * as React                                   from 'react';
import { useTranslation }                           from "react-i18next";
import { useLocation, useNavigate }                 from "react-router-dom";

import CategoriesList             from "./CategoriesList";
import GroupsList                 from "./GroupsList";
import OrganizationList           from "./OrganizationsList";
import ConnectorList              from "./ConnectorList";
import DirectoriesList            from "./DirectoriesList";
import UsersList                  from "./UsersList";
import TSettingsTab               from "../../types/TSettingsTab";
import { context as authContext } from "../../contexts/auth/store/context";
import SystemInfo                 from "./SystemInfo";
import ServiceMessagesList        from "./ServiceMessagesList";

const Administration: React.FC = (): React.ReactElement => {

    const {t} = useTranslation();
    const currentLocation = useLocation();
    const navigate = useNavigate();
    const {state: authState} = React.useContext(authContext);

    const [activeTabIndex, setActiveTabIndex] = React.useState<number>(0);
    const [settingsTabs, setSettingTabs] = React.useState <Array<TSettingsTab>>([]);
    const [settingsTabsInitialized, setSettingsTabsInitialized] = React.useState <boolean>(false);


    React.useEffect(() => {

        let settingTabsToPush: Array<TSettingsTab> = [];

        if (authState.user.organization_user.ui_grants.user.edit) {

            settingTabsToPush.push({
                path: '/settings/admin/users',
                translationKey: 'common:users',
                tab: <UsersList/>
            });
        }

        if (authState.user.organization_user.ui_grants.category.edit) {

            settingTabsToPush.push({
                path: '/settings/admin/categories',
                translationKey: 'common:categories',
                tab: <CategoriesList/>
            },);
        }

        if (authState.user.organization_user.ui_grants.group.edit) {

            settingTabsToPush.push({
                path: '/settings/admin/groups',
                translationKey: 'common:users_group',
                tab: <GroupsList/>
            },);
        }

        if (authState.user.organization_user.ui_grants.directory.edit) {

            settingTabsToPush.push({
                path: '/settings/admin/directories',
                translationKey: 'common:directories',
                tab: <DirectoriesList/>
            },);
        }

        if (authState.user.organization_user.ui_grants.conf_connector.edit) {

            settingTabsToPush.push({
                path: '/settings/admin/connectors',
                translationKey: 'settings:global_administration.connector.connectors',
                tab: <ConnectorList/>
            },);
        }

        if (authState.user.organization_user.ui_grants.service_message.edit) {

            settingTabsToPush.push({
                path: '/settings/admin/service-message',
                translationKey: 'settings:service_message.service_message',
                tab: <ServiceMessagesList/>
            },);
        }

        if (authState.user.organization_user.ui_grants.system_info.edit) {

            settingTabsToPush.push({
                path: '/settings/admin/system-metric',
                translationKey: 'settings:system_info.system_info',
                tab: <SystemInfo/>
            },);
        }

        if (authState.user.is_super_admin) {

            settingTabsToPush.push({
                path: '/settings/admin/organizations',
                translationKey: 'common:organizations',
                tab: <OrganizationList/>
            },);
        }

        setSettingTabs(settingTabsToPush);
        setSettingsTabsInitialized(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Used to set up the active tab and location.pathname.
    //
    React.useEffect(() => {

        if (settingsTabsInitialized) {

            // Find the index to activate.
            let tabIndex: number = settingsTabs.findIndex((tab: TSettingsTab) => {

                return tab.path === currentLocation.pathname;
            });

            if (tabIndex === 0) {
                navigate(settingsTabs[0].path);
            } else {
                setActiveTabIndex(tabIndex);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settingsTabsInitialized]);

    return (
        <TabView
            renderActiveOnly
            onTabChange={(event: TabViewTabChangeEvent) => {

                setActiveTabIndex(event.index);
                navigate(settingsTabs[event.index].path);
            }}
            activeIndex={activeTabIndex}
        >
            {settingsTabs.map((tab) => <TabPanel
                    key={tab.translationKey}
                    header={t(tab.translationKey).toString()}>
                    {tab.tab}
                </TabPanel>
            )}
        </TabView>
    );
}

export default Administration;