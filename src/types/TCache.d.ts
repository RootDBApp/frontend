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

import TDirectory                from "./TDirectory";
import TCategory                 from "./TCategory";
import TReport                   from "./TReport";
import TreeNode                  from "primereact/treenode";
import TRole                     from "./TRole";
import TReportDataViewLibType    from "./TReportDataViewLibType";
import TReportDataViewLibVersion from "./TReportDataViewLibVersion";
import TServiceMessage           from "./TServiceMessage";
import TParameterInput           from "./TParameterInput";
import TAsset                    from "./TAsset";

type TCache = {
    assets: Array<TAsset>,
    directories: Array<TDirectory>,
    directoriesPrimeReactTree: Array<TreeNode>,
    categories: Array<TCategory>,
    parameterInputs: Array<TParameterInput>,
    reports: Array<TReport>,
    reportDataViewLibTypes: Array<TReportDataViewLibType>,
    reportDataViewLibVersions: Array<TReportDataViewLibVersion>,
    roles: Array<TRole>
    serviceMessages: Array<TServiceMessage>
}

export = TCache;