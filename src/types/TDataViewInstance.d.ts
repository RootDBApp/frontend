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

type TDataViewInstance = {
    id: number, // report.dataview.id
    loading: boolean,
    results: Array<any>,
    results_from_cache: boolean,
    showQuery: boolean,
    waitingData: boolean,
    end?: number, // Hold end timestamp when query finished to run
    errors?: Array<string>,
    start?: number, // Hold start timestamp when query start to run
    elapsedTime?: number // elapsed time coming from the api
}

export = TDataViewInstance;