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

import TReportDataView   from "../types/TReportDataView";
import TDataViewPosition from "../types/TDataViewPosition";
import { EDataViewType } from "../types/EDataViewType";

export const getDataViewsPositions = (dataViews: TReportDataView[]): TDataViewPosition[] => {
    const positions: TDataViewPosition[] = [];
    dataViews.forEach((dataView) => {
        let position: any;
        try {

            position = JSON.parse(dataView.position);
        } catch (e) {
            console.debug('position was not a valid json');
        }
        if (position) {
            positions.push({...position, dataViewId: dataView.id});
        }
    });
    return positions;
}

export const getNewDataViewPosition = (dataViews: TReportDataView[], dataViewType: EDataViewType): TDataViewPosition => {
    const positions = getDataViewsPositions(dataViews);
    let yMax = 0;
    if (positions && positions.length > 0) {
        yMax = Math.max(...positions.map(pos => pos.y + pos.h));
    }
    return {x: 0, y: yMax, w: dataViewType === EDataViewType.GRAPH ? 6 : 12, h: 4};
}

export const getDataViewTypeText = (dataViewType: EDataViewType): string => {
    switch (dataViewType) {
        case EDataViewType.TABLE:
            return 'table';
        case EDataViewType.METRIC:
            return 'info';
        case EDataViewType.CRON:
            return 'cron';
        case EDataViewType.GRAPH:
            return 'graph';
        case EDataViewType.TREND:
            return 'trend';
        case EDataViewType.TEXT:
            return 'text';
        default:
            return '';
    }
}

const checkId = (id: string, existing?: string[]): boolean => {
    let match = existing?.find(function(item) {
        return item === id;
    });
    return !match;
};

const randomId = (length = 6): string => {
    return Math.random().toString(36).substring(2, length+2);
};

export const generateUniqueIdInsideView = (length: number, existing?: string[]): string => {
    let attempts = 0; // how many attempts
    let id = '';
    while(!id && attempts <= (existing?.length || 0)) {
        id = randomId(length); // create id
        if(!checkId(id, existing)) { // check unique
            id = ''; // reset id
            attempts++; // record failed attempt
        }
    }
    return id; // the id or false if did not get unique after max attempts
};