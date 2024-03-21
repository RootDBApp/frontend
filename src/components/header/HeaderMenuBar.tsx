import { Menubar }                   from 'primereact/menubar';
import { MenuItem } from "primereact/menuitem";
import React                         from 'react';

import NotificationCenter  from "../common/notifications/NotificationCenter";
import {
    useDebugTabIconButton,
    useHeaderLogo, useHelpIconButton,
    useHomeIconButton,
    useInputParametersIconButton,
    useOrganisationSelect,
    useSQLConsoleIconButton,
    useUserMenu
}                          from "../../utils/headerMenu/userMenu";
import ReportSearchInplace from "./ReportSearchInplace";
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
    //const reportDataViewSelect = useReportDataViewSelect();
    //const createReportDataViewIconButton = useCreateReportDataViewIconButton();
    const reportDataViewMenu = useReportDataViewMenu();
    const isMobile = useMobileLayout();
    const homeIconButton = useHomeIconButton();
    const helpIconButton = useHelpIconButton();
    const sqlConsoleIconButton = useSQLConsoleIconButton();
    const debugTabIconButton = useDebugTabIconButton();
    const inputParametersIconButton = useInputParametersIconButton();

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

        // if (reportDataViewSelect) {
        //     items.push(reportDataViewSelect)
        // }

        //if (createReportDataViewIconButton) {
        //    items.push(createReportDataViewIconButton)
        //}

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
                        <ReportSearchInplace alwaysOpen={isMobile} />
                        <NotificationCenter/>
                    </div>
                }
            />
        </div>
    );
}
