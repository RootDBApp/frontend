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

import TGroup                    from "../../../types/TGroup";
import TUser                     from "../../../types/TUser";
import TCategory                 from "../../../types/TCategory";
import TDirectory                from "../../../types/TDirectory";
import TReportDataViewLib        from "../../../types/TReportDataViewLib";
import TParameterInput           from "../../../types/TParameterInput";
import TParameterInputType       from "../../../types/TParameterInputType";
import TParameterInputDataType   from "../../../types/TParameterInputDataType";
import TConnector                from "../../../types/TConnector";
import TReport                   from "../../../types/TReport";
import TDirectoryTreeNode        from "../../../types/TDirectoryTreeNode";
import TReportDataViewLibType    from "../../../types/TReportDataViewLibType";
import TReportDataViewLibVersion from "../../../types/TReportDataViewLibVersion";
import TConnectorDatabase        from "../../../types/TConnectorDatabase";
import TVersionInfo              from "../../../types/TVersionsInfo";
import TConnectorCompletions     from "../../../types/TConnectorCompletions";
import TConnectorSchemasTree     from "../../../types/TConnectorSchemasTree";
import TRole                     from "../../../types/TRole";
import TOrganization             from "../../../types/TOrganization";
import TServiceMessage           from "../../../types/TServiceMessage";

export interface IAPIDataState {
    categories: Array<TCategory>;
    categoriesLoading: boolean;

    connectors: Array<TConnector>;
    connectorsLoading: boolean;

    connectorCompletions: Array<TConnectorCompletions>;
    connectorCompletionsLoading: boolean;

    connectorDatabases: Array<TConnectorDatabase>;
    connectorDatabasesLoading: boolean;

    connectorSchemasTree: Array<TConnectorSchemasTree>;
    connectorSchemasTreeLoading: boolean;

    dataViewLibs: Array<TReportDataViewLib>;
    dataViewLibsLoading: boolean;

    dataViewLibTypes: Array<TReportDataViewLibType>;
    dataViewLibTypesLoading: boolean;

    dataViewLibVersions: Array<TReportDataViewLibVersion>;
    dataViewLibVersionsLoading: boolean;

    directories: Array<TDirectory>;
    directoriesLoading: boolean;

    directoriesTree: Array<TDirectoryTreeNode>;
    directoriesTreeLoading: boolean;

    groups: Array<TGroup>;
    groupsLoading: boolean;

    organizations: Array<TOrganization>;
    organizationsLoading: boolean;

    parameterInputs: Array<TParameterInput>;
    parameterInputsLoading: boolean;

    parameterInputTypes: Array<TParameterInputType>;
    parameterInputTypesLoading: boolean;

    parameterInputDataTypes: Array<TParameterInputDataType>;
    parameterInputDataTypesLoading: boolean;

    reports: Array<TReport>;
    reportsLoading: boolean;

    roles: Array<TRole>;

    serviceMessages: Array<TServiceMessage>;
    users: Array<TUser>;
    usersLoading: boolean;

    versionsInfos: Array<TVersionInfo>
}

export const initialState: IAPIDataState = {
    categories: JSON.parse(String(localStorage.getItem('categories'))) || [],
    categoriesLoading: false,

    connectors: JSON.parse(String(localStorage.getItem('connectors'))) || [],
    connectorsLoading: false,

    connectorCompletions: JSON.parse(String(localStorage.getItem('connectorCompletions'))) || [],
    connectorCompletionsLoading: false,

    connectorDatabases: JSON.parse(String(localStorage.getItem('connectorDatabases'))) || [],
    connectorDatabasesLoading: false,

    connectorSchemasTree: JSON.parse(String(localStorage.getItem('connectorSchemasTree'))) || [],
    connectorSchemasTreeLoading: false,

    dataViewLibs: JSON.parse(String(localStorage.getItem('dataViewLibs'))) || [],
    dataViewLibsLoading: false,

    dataViewLibTypes: JSON.parse(String(localStorage.getItem('dataViewLibTypes'))) || [],
    dataViewLibTypesLoading: false,

    dataViewLibVersions: JSON.parse(String(localStorage.getItem('dataViewLibVersions'))) || [],
    dataViewLibVersionsLoading: false,

    directories: JSON.parse(String(localStorage.getItem('directories'))) || [],
    directoriesLoading: false,

    directoriesTree: JSON.parse(String(localStorage.getItem('directoriesTree'))) || [],
    directoriesTreeLoading: false,

    groups: JSON.parse(String(localStorage.getItem('groups'))) || [],
    groupsLoading: false,

    organizations: JSON.parse(String(localStorage.getItem('organizations'))) || [],
    organizationsLoading: false,

    parameterInputs: JSON.parse(String(localStorage.getItem('parameterInputs'))) || [],
    parameterInputsLoading: false,

    parameterInputTypes: JSON.parse(String(localStorage.getItem('parameterInputTypes'))) || [],
    parameterInputTypesLoading: false,

    parameterInputDataTypes: JSON.parse(String(localStorage.getItem('parameterInputDataTypes'))) || [],
    parameterInputDataTypesLoading: false,

    reports: JSON.parse(String(localStorage.getItem('reports'))) || [],
    reportsLoading: false,

    roles: JSON.parse(String(localStorage.getItem('roles'))) || [],

    // serviceMessages: JSON.parse(String(localStorage.getItem('serviceMessages'))) || [],
    serviceMessages:  [], // fetched at login.

    users: JSON.parse(String(localStorage.getItem('users'))) || [],
    usersLoading: false,

    versionsInfos: JSON.parse(String(localStorage.getItem('versionsInfos'))) || [],
    // versionsInfosLoading: boolean,
}

export default initialState;
