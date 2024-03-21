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

import { ICallbackAxiosSuccess } from "../types/ICallBacks";
import { EAPIEndPoint }          from "../types/EAPIEndPoint";
import { apiSendRequest }        from "./api";
import TLaravelPagination        from "../types/TLaravelPagination";
import TUser                     from "../types/TUser";

export const getUsers = (pageNum: number = 1, callBackSuccess: ICallbackAxiosSuccess, forDropDown: boolean = false): void => {

    let urlParameters = [
        {key: 'page', value: pageNum},
        {key: 'for-admin', value: 1}
    ];

    if (forDropDown) {
        urlParameters.push({key: 'for-dropdown', value: 1});
    }

    apiSendRequest({
        method: 'GET',
        endPoint: EAPIEndPoint.USER,
        urlParameters: urlParameters,
        callbackSuccess: (response: Array<TUser>, pagination?: TLaravelPagination) => {

            callBackSuccess(response, pagination);
        }
    });
};