import * as React from "react";

import { EPDTTabType }     from "../types/EPDTTabType";
import TPDTabRouteSettings from "../types/pdt/TPDTabRouteSettings";
import { IPDTabRoute }     from "../types/pdt/IPDTabRoute";
import Home                from "../components/home/Home";
import Report              from "../components/report/Report";
import ReportParameters
                           from "../components/settings/ReportParameters";
import SQLConsole
                           from "../components/sqlconsole/SQLConsole";
import Help                from "../components/help/Help";
import {
    extractReportIdFromOtherKeyContainingAReportUniqId,
    extractReportInstanceIddFromOtherKeyContainingAReportUniqId,
}                          from "../utils/tools";
import Debug               from "../components/debug/Debug";

export function getPTabRouteComponent(tab: IPDTabRoute): React.ReactElement {

    switch (tab.type) {
        case EPDTTabType.HOME:
            return <Home/>;

        case EPDTTabType.REPORT:
            return <Report reportId={extractReportIdFromOtherKeyContainingAReportUniqId(tab.id)}
                           instanceId={extractReportInstanceIddFromOtherKeyContainingAReportUniqId(tab.id)}
            />;

        case EPDTTabType.INPUT_PARAMETERS:
            return <ReportParameters/>;

        case EPDTTabType.SQL_CONSOLE:
            return <SQLConsole/>;

        case EPDTTabType.HELP:
            return <Help/>;

        case EPDTTabType.DEBUG:
            return <Debug />;

        default:
            console.debug('-- [pathDrivenTabService] getComponent: unknown tab type ' + tab.type);
            return <></>;
    }
}

export const tabRouteHome: TPDTabRouteSettings = {
    path: '/home',
    type: EPDTTabType.HOME,
};

export const tabRouteHelp: TPDTabRouteSettings = {
    path: '/help',
    type: EPDTTabType.HELP,
};

export const allTabRouteSettings: Array<TPDTabRouteSettings> = [
    tabRouteHome,
    {
        path: '/report/:reportId',
        children: [{
            path: 'data-view/:dataViewId',
        }],
        type: EPDTTabType.REPORT,
    },
    {
        path: '/help',
        type: EPDTTabType.HELP,
    },
    {
        path: '/input-parameters',
        type: EPDTTabType.INPUT_PARAMETERS,
    },
    {
        path: '/sql-console',
        type: EPDTTabType.SQL_CONSOLE,
    },
    {
        path: '/debug',
        children: [{
            path: 'report/:reportId',
        }],
        type: EPDTTabType.DEBUG,
    },
    tabRouteHelp
];