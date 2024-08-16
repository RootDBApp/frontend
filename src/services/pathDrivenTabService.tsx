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

import * as React from "react";

import { EPDTTabType }     from "../types/EPDTTabType";
import TPDTabRouteSettings from "../types/pdt/TPDTabRouteSettings";
import { IPDTabRoute }     from "../types/pdt/IPDTabRoute";
import Home                from "../components/home/Home";
import Report              from "../components/report/Report";
import ReportParameters
                           from "../components/parameters-input/ReportParameters";
import SQLConsole
                           from "../components/sqlconsole/SQLConsole";
import Help                from "../components/help/Help";
import {
    extractReportIdFromOtherKeyContainingAReportUniqId,
    extractReportInstanceIddFromOtherKeyContainingAReportUniqId,
}                          from "../utils/tools";
import Debug               from "../components/debug/Debug";
import Assets              from "../components/asset/Assets";

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

        case EPDTTabType.ASSETS:
            return <Assets/>;

        case EPDTTabType.SQL_CONSOLE:
            return <SQLConsole/>;

        case EPDTTabType.HELP:
            return <Help/>;

        case EPDTTabType.DEBUG:
            return <Debug/>;

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
        path: '/assets',
        type: EPDTTabType.ASSETS,
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