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

import { EPDTTabType } from "../EPDTTabType";

// Interface Path Driven Tab - store the current tab setup.
export interface IPDTabRoute {
    id: string,                              // id = 'tab_id_'  + location.pathname + Date.now() + Math.random()      ( with "/" replaced by "_" )
                                             // or
                                             // id = 'tab_id_' + tabRouteSettings.id + Date.now() + Math.random()
    locationPathname: string,                // location.pathname by default.
    tabDisplayed: boolean,
    type: EPDTTabType,
    component?: React.ReactElement,
    previousLocationPathname?: string,       // When the TPDRoute handle multiple pathname we need to store which one was previously activated.
    reportInstanceID?: number
    reportId?: number,
    reportDataViewId?: number,
    title?: string | React.ReactElement,
}