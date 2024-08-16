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

import { Menubar }  from 'primereact/menubar';
import { MenuItem } from "primereact/menuitem";
import React        from 'react';

import NotificationCenter        from "../common/notifications/NotificationCenter";
import {
    useAssetTabIconButton,
    useDebugTabIconButton,
    useHeaderLogo, useHelpIconButton,
    useHomeIconButton,
    useInputParametersTabIconButton,
    useOrganisationSelect,
    useSQLConsoleIconButton,
    useUserMenu
}                                from "../../utils/headerMenu/userMenu";
import ReportSearchInplace       from "./ReportSearchInplace";
import {
    useCreateReportIconButton,
    useReportFavoriteIconButton,
    useReportMenu, useReportVisibilityButton,
    useRunReportWithDefaultParamsIconButton, useSetupInputParamsAndExecuteIconButton
}                                from "../../utils/headerMenu/reportMenu";
import { useReportDataViewMenu } from "../../utils/headerMenu/dataViewMenu";
import { useMobileLayout }       from "../../utils/windowResize";

export const HeaderMenuBar = () => {

    const userMenu = useUserMenu();
    const headerLogo = useHeaderLogo();
    const organisationMenu = useOrganisationSelect();
    const reportMenu = useReportMenu();
    const createReportIconButton = useCreateReportIconButton();
    const reportFavoriteIconButton = useReportFavoriteIconButton();
    const reportVisibilityIconButton = useReportVisibilityButton();
    const runReportWithDefaultParamsIconButton = useRunReportWithDefaultParamsIconButton();
    const setupInputParamsAndExecuteIconButton = useSetupInputParamsAndExecuteIconButton();
    const reportDataViewMenu = useReportDataViewMenu();
    const isMobile = useMobileLayout();
    const homeIconButton = useHomeIconButton();
    const helpIconButton = useHelpIconButton();
    const sqlConsoleIconButton = useSQLConsoleIconButton();
    const debugTabIconButton = useDebugTabIconButton();
    const inputParametersIconButton = useInputParametersTabIconButton();
    const assetTabIconButton = useAssetTabIconButton();

    const burgerMenuItems = React.useMemo(() => {
        const items: MenuItem[] = [];
        items.push(organisationMenu);

        items.push(userMenu);

        items.push(helpIconButton);

        items.push(homeIconButton);

        if (sqlConsoleIconButton) {
            items.push(sqlConsoleIconButton);
        }

        if (debugTabIconButton) {
            items.push(debugTabIconButton);
        }

        if (inputParametersIconButton) {
            items.push(inputParametersIconButton);
        }

        if (assetTabIconButton) {
            items.push(assetTabIconButton as MenuItem);
        }

        if (createReportIconButton) {
            items.push(createReportIconButton);
        }

        return items;
    }, [
        createReportIconButton,
        debugTabIconButton,
        helpIconButton,
        homeIconButton,
        inputParametersIconButton,
        assetTabIconButton,
        organisationMenu,
        sqlConsoleIconButton,
        userMenu
    ])

    const reportMenuItems = React.useMemo(() => {

        const items: MenuItem[] = [];

        if (reportMenu) {
            items.push(reportMenu);
        }

        if (reportVisibilityIconButton) {
            items.push(reportVisibilityIconButton);
        }

        if (reportFavoriteIconButton) {
            items.push(reportFavoriteIconButton);
        }

        if (runReportWithDefaultParamsIconButton) {
            items.push(runReportWithDefaultParamsIconButton);
        }

        if (setupInputParamsAndExecuteIconButton) {
            items.push(setupInputParamsAndExecuteIconButton);
        }

        if (reportDataViewMenu) {
            items.push(reportDataViewMenu)
        }

        return items;
    }, [
        reportDataViewMenu,
        reportFavoriteIconButton,
        reportMenu,
        runReportWithDefaultParamsIconButton,
        reportVisibilityIconButton,
        setupInputParamsAndExecuteIconButton
    ]);

    return (
        <div className="card rdb-menu-bar">
            <Menubar
                className="header py-0"
                model={[...burgerMenuItems, ...reportMenuItems]}
                start={headerLogo}
                end={
                    <div className="flex align-items-center justify-content-end">
                        <ReportSearchInplace alwaysOpen={isMobile}/>
                        <NotificationCenter/>
                    </div>
                }
            />
        </div>
    );
}
