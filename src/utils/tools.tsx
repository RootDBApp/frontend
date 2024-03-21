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

import {t} from "i18next";
import {Buffer} from 'buffer';

import TURLParameter from "../types/common/TURLParameter";
import TDirectoryTreeNode from "../types/TDirectoryTreeNode";
import TReport from "../types/TReport";
import {FAVORITES_DIRECTORY_ID} from "./definitions";
import {TNameValue} from "../types/TNameValue";
import TUser from "../types/TUser";
import {ERole} from "../types/ERole";
import TRole from "../types/TRole";
import {notificationEvent} from "./events";
import TOrganization from "../types/TOrganization";
import {apiSendRequest} from "../services/api";
import {EAPIEndPoint} from "../types/EAPIEndPoint";
import {EReportDevBarMessageType} from "../types/applicationEvent/EReportDevBarMessageType";
import TParameterInputDataType from "../types/TParameterInputDataType";
import TConnector from "../types/TConnector";

const pako = require('pako');

export function capitalizeFirstLetter(string: string): string {

    return String(string[0].toUpperCase() + string.slice(1));
}

export const checkReportPermission = (report: TReport, user: TUser): boolean => {

    // if developer, he can see all reports.
    if (user.organization_user && user.organization_user.ui_grants.report.edit) {

        return true;
    }

    // admin, viewer, can't see not visible report.
    if (!report.is_visible) {

        return false;
    }

    // if admin, no need to check allowed groups / users.
    if (user.organization_user && user.organization_user.ui_grants.user.edit) {

        return true;
    }

    let gotGroupRestriction = false;
    let allowedByGroup = false;

    if (report.allowed_groups && report.allowed_groups?.length > 0) {

        gotGroupRestriction = true;
        for (const group of report.allowed_groups) {

            if (user.organization_user?.group_ids?.includes(group.group_id)) {

                allowedByGroup = true;
                break;
            }
        }
    }

    let gotUserRestriction = false;
    let allowedByUser = false;

    if (report.allowed_users
        && report.allowed_users.length > 0) {

        gotUserRestriction = true;
        for (const userAuthorized of report.allowed_users) {

            if (userAuthorized.user_id === user.id) {

                allowedByUser = true;
                break;
            }
        }
    }

    let allowed = false;

    if (!gotGroupRestriction && !gotUserRestriction) {

        allowed = true;
    } else if (gotGroupRestriction && allowedByGroup) {

        allowed = true;
    } else if (gotUserRestriction && allowedByUser) {

        allowed = true;
    }

    return allowed;
}

// ex usage : runReportInfo.formValues.sort(compareTNameValuesByValue)
// export const compareTNameValuesByValue = (a: TNameValue, b: TNameValue): number => {
//
//     if (a.value && b.value) {
//
//         if (a.value < b.value) {
//             return -1;
//         }
//         if (a.value > b.value) {
//             return 1;
//         }
//     }
//
//     return 0;
// }

export const convertDateToLocalTimeZone = (date: Date | null): string => {

    if (date) {

        return date.toLocaleString('en-US', {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
    }

    return '';
}

export const countReports = (
    directory: TDirectoryTreeNode,
    reports: Array<TReport>,
): TDirectoryTreeNode => {

    const reportCount = reports.filter(report => report?.directory?.id === Number(directory.key)).length;
    let children: TDirectoryTreeNode[] = [];

    if (directory.children !== undefined && directory.children.length > 0) {

        children = directory.children.map(subDirectory => countReports(subDirectory, reports));
    }

    return {
        ...directory,
        childrenReportCount: children.flat().reduce((count, c) => count + (c.reportCount || 0) + (c.childrenReportCount || 0), 0),
        reportCount,
        children,
    };
}

export const dec2hex = (dec: number): any => {

    return (`0${dec.toString(16)}`).substr(-2);
}

// export const formatDateTime = (date: Date) => {
//     return (
//         String(date.getHours()).padStart(2, '0') + ':' +
//         String(date.getMinutes()).padStart(2, '0') + ':' +
//         String(date.getSeconds()).padStart(2, '0')
//     );
// }

export const extractReportIdFromOtherKeyContainingAReportUniqId = (keyContainingReportUniqId: string): number => {

    const match = keyContainingReportUniqId.match(/.*_([0-9]*)_[0-9]*/);
    // console.debug('======> extractReportIdFromOtherKeyContainingAReportUniqId()', match);
    if (match && match[1]) {

        return Number(match[1]);
    }

    return 0;
}

export const extractReportInstanceIddFromOtherKeyContainingAReportUniqId = (keyContainingReportUniqId: string): number => {

    const match = keyContainingReportUniqId.match(/.*_[0-9]*_([0-9]*)/);
    // console.debug('======> extractReportInstanceIddFromOtherKeyContainingAReportUniqId()', match);
    if (match && match[1]) {

        return Number(match[1]);
    }

    return 0;
}

export const extractReportIdFromReportUniqId = (reportUniqId: string): number => {

    const match = reportUniqId.match(/([0-9]*)_[0-9]*/);
    // console.debug('======>  extractReportIdFromReportUniqId()', match);
    if (match && match[1]) {

        return Number(match[1]);
    }

    return 0;
}

export const extractReportInstanceIdFromReportUniqId = (reportUniqId: string): number => {

    const match = reportUniqId.match(/.*_([0-9]*)/);
    // console.debug('======> extractReportInstanceIdFromReportUniqId()', match);
    if (match && match[1]) {

        return Number(match[1]);
    }

    return 0;
}

export const fetchLatestVersion = () => {

    // Response will come on private user websocket channel. (`private-user.<id>`)
    apiSendRequest({
        method: 'GET',
        endPoint: EAPIEndPoint.FETCH_LATEST_VERSION,
        callbackSuccess: () => {
        },
        callbackError: (error) => {
            // @todo - not sure if we should warn officially user here.
            console.error(error);
        }
    });
}

export const filterConnectors = (
    connectors: Array<TConnector>,
    connectorIdsFilter?: Array<number>
): Array<TConnector> => {

    let filteredConnectors: Array<TConnector> = connectors;

    if (connectorIdsFilter) {

        filteredConnectors = filteredConnectors.filter((connector: TConnector) => {

            return !connectorIdsFilter.includes(connector.id);
        })
    }

    return filteredConnectors;
}

export const filterUsers = (
    users: Array<TUser>,
    rolesFilter?: Array<ERole>,
    userIdsFilter?: Array<number>
): Array<TUser> => {

    let filteredUsers: Array<TUser> = users;

    if (rolesFilter) {

        filteredUsers = users
            .filter((user: TUser) => {

                let roleFound = false;
                for (const roleId of rolesFilter) {

                    if (user.organization_user?.roles.map((role: TRole) => role.id).includes(roleId)) {

                        roleFound = true;
                        break;
                    }
                }

                return roleFound;
            })
    }

    if (userIdsFilter) {

        filteredUsers = filteredUsers.filter((user: TUser) => {

            return !userIdsFilter.includes(user.id);
        })
    }

    return filteredUsers;
}

export const formatDateYYYYMMDD = (date: Date) => {

    return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0')
}

export const generateId = (length?: number): string => {

    const arr = new Uint8Array((length || 40) / 2);
    window.crypto.getRandomValues(arr);

    return String(Array.from(arr, dec2hex).join(''));
}

export const getCSVFileName = (reportName: string, dataViewName: string): string => {

    let csvFilename = reportName + ' - ' + dataViewName;
    reportName = csvFilename.replace(' ', ' ')
        .replace('&', ' ')
        .replace('/', ' ')
        .replace(',', ' ')
        .replace(';', ' ')
        .replace('.', ' ')
        .replace(':', ' ')
        .replace('*', ' ')
    return reportName;
}

export const getParameterInputAs = (value: string | number, parameterInputDataType: TParameterInputDataType | undefined): string | number => {

    switch (parameterInputDataType?.type_name) {
        case 'int':
            return Number(value);
    }

    return String(value);
}

export const generateReportUniqId = (reportId: number): string => {

    return reportId + '_' + Date.now();
}

export const isObject = (obj: any): boolean => {

    return obj != null && obj.constructor.name === "Object"
}

export const isThereConnectorConfigured = (connectors: Array<TConnector>, organization: TOrganization): boolean => {

    const checkInLocalStorage = connectors.some((connector: TConnector) => {

        return connector.organization_id === organization.id && !connector.global
    })

    if (checkInLocalStorage) {

        return true;
    }
    // Check in organization user data.
    else if (organization?.conf_connectors &&
        (organization?.conf_connectors && organization.conf_connectors.filter(c => !c.global).length > 0)) {

        return true;
    }

    return false;
}

export const isThereConnectorConfiguredWithNotif = (organization: TOrganization | undefined, sendNotification: boolean = false): boolean => {

    if (organization?.conf_connectors === undefined ||
        (organization?.conf_connectors && organization.conf_connectors.filter(c => !c.global).length === 0)) {

        if (sendNotification) {
            // Sleep here because at login, the event is dispatched before being mounted in the DOM.
            sleep(1000).then(() => {

                document.dispatchEvent(
                    notificationEvent({
                        message: t('settings:global_administration.connector.you_should_setup_a_connector').toString(),
                        timestamp: Date.now(),
                        title: t('settings:global_administration.connector.no_connector_configured').toString(),
                        buttonLabel: t('settings:global_administration.connector.connector_configuration').toString(),
                        buttonSeverity: 'secondary',
                        buttonURL: '/settings/admin/connectors',
                        type: EReportDevBarMessageType.LOG,
                        severity: 'warning',
                        toast: true,
                        forceInNotificationCenter: true,
                    }));
            });
        }

        return false;
    }

    return true;
}

export const nameValuesToString = (formValues: Array<TNameValue>): string => {

    let formValesStringed: Array<string> = [];
    for (const [, formValue] of formValues.entries()) {

        if (formValue.value !== null && formValue.value !== '' && formValue.value !== 'null') {

            formValesStringed.push(formValue.name + '=' + formValue.value);
        }
    }

    return formValesStringed.join('&');
}

export const orderComaSeparatedValues = (comaSeparatedValues: string): string => {

    if (comaSeparatedValues.indexOf(',') !== -1) {

        return comaSeparatedValues.split(',').sort().toString()
    }

    return comaSeparatedValues;
}


export const sleep = (ms: number): Promise<any> => {

    return new Promise(resolve => setTimeout(resolve, ms));
}

export const uncompress = (base64Data: string | undefined): string => {

    const ungzipedData = pako.inflate(new Buffer(String(base64Data), 'base64'));
    return new TextDecoder('utf8').decode(ungzipedData);
}

export const updateDirectoryTreeLabelsWithNumOfReports = (
    directories: Array<TDirectoryTreeNode>,
    reports: Array<TReport>
): Array<TDirectoryTreeNode> => {

    return directories.map(directory => {
        // Favorites
        let dir;
        if (Number(directory.key) === FAVORITES_DIRECTORY_ID) {

            dir = {
                ...directory,
                reportCount: reports.filter(report => report.favorite).length,
                childrenReportCount: 0
            };
        } else {

            dir = countReports(directory, reports);
        }

        return dir;
    });
}

export const URLParameterToString = (formValues: Array<TURLParameter>): string => {

    let formValesStringed: Array<string> = [];
    for (const [, formValue] of formValues.entries()) {

        formValesStringed.push(formValue.key + '=' + formValue.value);
    }

    return formValesStringed.join('&');
}

