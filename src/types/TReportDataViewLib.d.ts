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

import { EDataViewType }         from "./EDataViewType";
import TReportDataViewLibVersion from "./TReportDataViewLibVersion";

type TReportDataViewLib = {
    id: number,
    type: EDataViewType,
    name: string,
    url_website: string,
    default: boolean,
    report_data_view_lib_versions: Array<TReportDataViewLibVersion>
}

export = TReportDataViewLib;