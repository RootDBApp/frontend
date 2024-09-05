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

// General helpers functions

import TURLParameter                                  from "../types/common/TURLParameter";
import { generateReportUniqId, URLParameterToString } from "./tools";
import { reportDevBarEvent }                          from "./events";
import { EReportDevBarMessageType }                   from "../types/application-event/EReportDevBarMessageType";
import { apiSendRequest }                             from "../services/api";
import { EAPIEndPoint }                               from "../types/EAPIEndPoint";
import TAsset                                         from "../types/TAsset";

export const getDocumentStyle = (): CSSStyleDeclaration => {

    return getComputedStyle(document.documentElement)
};

export const getTextColor = (): string => {
    return getDocumentStyle().getPropertyValue('--text-color')
};

export const getTextColorSecondary = (): string => {
    return getDocumentStyle().getPropertyValue('--text-color-secondary')
};

export const getSurfaceBorder = (): string => {
    return getDocumentStyle().getPropertyValue('--surface-border')
};

export const backgroundColors = [
    '#58595b',
    '#4dc9f6',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#8549ba',
    '#1abc9c',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#34495e',
    '#16a085',
    '#27ae60',
    '#2980b9',
    '#8e44ad',
    '#2c3e50',
    '#f1c40f',
    '#e67e22'
];

export const getReportPathWithParams = (reportId: number, parameters: Array<TURLParameter>): string => {

    return '/report/' + generateReportUniqId(reportId) + '?' + URLParameterToString(parameters) + '&run';
}


export const groupBy = (data: Array<any>, groupBy: string) => data.reduce((acc, curr) => {

    const {[groupBy]: key, ...val} = curr;

    (acc[key] = acc[key] || []).push(val);

    return acc;
}, {});


export const log = (object: any): void => {

    const matchesReportId = new RegExp(/report\/([0-9]{1,10})/g).exec(document.location.pathname);
    let reportId: number | undefined;

    if (matchesReportId) {

        reportId = Number(matchesReportId[1]);
    }

    document.dispatchEvent(
        reportDevBarEvent({
            reportId: reportId,
            timestamp: Date.now(),
            title: 'Log',
            message: JSON.stringify(object, null, 2),
            type: EReportDevBarMessageType.LOG,
        }));
}

// For chartJS
export const cjsOnHoverCursor = (event: any, chart: any): void => {

    if (chart === undefined) {

        console.warn('\'chart\' undefined !');
    } else {

        const points = chart.getElementsAtEventForMode(event, 'nearest', {intersect: true}, true);

        if (points.length) {

            event.native.target.style.cursor = 'pointer';
        } else {

            event.native.target.style.cursor = 'default';
        }
    }
}

export const sortArrayByKeyStringASC = (array: Array<any>, key: string): Array<any> => {

    return array.sort((a, b) => {

        let fa = a[key].toLowerCase(),
            fb = b[key].toLowerCase();

        if (fa < fb) {

            return -1;
        }

        if (fa > fb) {

            return 1;
        }

        return 0;
    });
}

export const shallowEqual = (object1: any, object2: any): boolean => {

    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {

        if (object1[key] !== object2[key]) {

            return false;
        }
    }

    return true;
}

export const getJSON = async (resourceId: number): Promise<JSON> => {

    return new Promise<JSON>((resolve, reject) => {

        apiSendRequest({
            method: 'GET',
            endPoint: EAPIEndPoint.ASSET,
            resourceId: resourceId,
            extraUrlPath: 'get-json',
            callbackSuccess: (json: string) => {

                resolve(JSON.parse(json))
            }
        });
    });
}