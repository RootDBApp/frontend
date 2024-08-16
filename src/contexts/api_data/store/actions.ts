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

import TreeNode from "primereact/treenode";

import * as types                from './types';
import TGroup                    from "../../../types/TGroup";
import TUser                     from "../../../types/TUser";
import TCategory                 from "../../../types/TCategory";
import TDirectory                from "../../../types/TDirectory";
import TParameterInput           from "../../../types/TParameterInput";
import TReportDataViewLib        from "../../../types/TReportDataViewLib";
import TParameterInputType       from "../../../types/TParameterInputType";
import TParameterInputDataType   from "../../../types/TParameterInputDataType";
import TReport                   from "../../../types/TReport";
import TURLParameter             from "../../../types/common/TURLParameter";
import TReportDataViewLibVersion from "../../../types/TReportDataViewLibVersion";
import TReportDataViewLibType    from "../../../types/TReportDataViewLibType";
import TConnectorDatabase        from "../../../types/TConnectorDatabase";
import TConnector                from "../../../types/TConnector";
import TVersionInfo              from "../../../types/TVersionsInfo";
import TConnectorCompletions     from "../../../types/TConnectorCompletions";
import TConnectorSchemasTree     from "../../../types/TConnectorSchemasTree";
import TRole                     from "../../../types/TRole";
import TOrganization             from "../../../types/TOrganization";
import TServiceMessage           from "../../../types/TServiceMessage";
import { TReportCacheStatus }    from "../../../types/TReportCacheStatus";
import TAsset                    from "../../../types/TAsset";

export interface IAssetsLoading {
    type: types.TAssetsLoading;
    payload: boolean;
}

export interface ICategoriesLoading {
    type: types.TCategoriesLoading;
    payload: boolean;
}

export interface ICleanLocalCache {
    type: types.TCleanLocalCache;
    payload: undefined;
}

export interface ICleanReportsDirectoriesTree {
    type: types.TCleanReportsDirectoriesTree;
    payload: undefined;
}

export interface IDirectoriesLoading {
    type: types.TDirectoriesLoading;
    payload: boolean;
}

export interface IDirectoriesTreeLoading {
    type: types.TDirectoriesTreeLoading;
    payload: boolean;
}

export interface IGetAssets {
    type: types.TGetAssets;
    payload: undefined;
}

export interface IGotAssets {
    type: types.TGotAssets;
    payload: Array<TAsset>;
}

export interface IGetCategories {
    type: types.TGetCategories;
    payload: undefined;
}

export interface IGotCategories {
    type: types.TGotCategories;
    payload: Array<TCategory>;
}

export interface IGetConnectors {
    type: types.TGetConnectors;
    payload: undefined;
}

export interface IGotConnectors {
    type: types.TGotConnectors;
    payload: Array<TConnector>;
}

export interface IGetConnectorCompletions {
    type: types.TGetConnectorCompletions;
    payload: number;
}

export interface IGotConnectorCompletions {
    type: types.TGotConnectorCompletions;
    payload: TConnectorCompletions;
}

export interface IGetConnectorDatabases {
    type: types.TGetConnectorDatabases;
    payload: undefined;
}

export interface IGotConnectorDatabases {
    type: types.TGotConnectorDatabases;
    payload: Array<TConnectorDatabase>;
}

export interface IGetConnectorSchemasTree {
    type: types.TGetConnectorSchemasTree;
    payload: number;
}

export interface IGotConnectorSchemasTree {
    type: types.TGotConnectorsSchemasTree;
    payload: TConnectorSchemasTree;
}

export interface IGetDataViewLibs {
    type: types.TGetDataViewLibs;
    payload: undefined;
}

export interface IGotDataViewLibs {
    type: types.TGotDataViewLibs;
    payload: Array<TReportDataViewLib>;
}

export interface IGetDataViewLibTypes {
    type: types.TGetDataViewLibTypes;
    payload: undefined;
}

export interface IGotDataViewLibTypes {
    type: types.TGotDataViewLibTypes;
    payload: Array<TReportDataViewLibType>;
}

export interface IGetDataViewLibVersions {
    type: types.TGetDataViewLibVersions;
    payload: undefined;
}

export interface IGotDataViewLibVersions {
    type: types.TGotDataViewLibVersions;
    payload: Array<TReportDataViewLibVersion>;
}

export interface IGetDirectories {
    type: types.TGetDirectories;
    payload: undefined;
}

export interface IGotDirectories {
    type: types.TGotDirectories;
    payload: Array<TDirectory>;
}

export interface IGetDirectoriesTree {
    type: types.TGetDirectoriesTree;
    payload: undefined;
}

export interface IGotDirectoriesTree {
    type: types.TGotDirectoriesTree;
    payload: Array<TreeNode.TreeNode>;
}

export interface IGetGroups {
    type: types.TGetGroups;
    payload: undefined;
}

export interface IGotGroups {
    type: types.TGotGroups;
    payload: Array<TGroup>;
}

export interface IGotOrganization {
    type: types.TGotOrganization;
    payload: TOrganization;
}

export interface IGotOrganizations {
    type: types.TGotOrganizations;
    payload: Array<TOrganization>;
}

export interface IGetParameterInputs {
    type: types.TGetParameterInputs;
    payload: undefined;
}

export interface IGotParametersInputs {
    type: types.TGotParameterInputs;
    payload: Array<TParameterInput>;
}

export interface IGotParametersInput {
    type: types.TGotParameterInput;
    payload: TParameterInput;
}

export interface IGetParameterInputTypes {
    type: types.TGetParameterInputTypes;
    payload: undefined;
}

export interface IGotParametersInputTypes {
    type: types.TGotParameterInputTypes;
    payload: Array<TParameterInputType>;
}

export interface IGetParameterInputDataTypes {
    type: types.TGetParameterInputDataTypes;
    payload: undefined;
}

export interface IGotParametersInputDataTypes {
    type: types.TGotParameterInputDataTypes;
    payload: Array<TParameterInputDataType>;
}

export interface IGetReports {
    type: types.TGetReports;
    payload: Array<TURLParameter>;
}

export interface IGotReport {
    type: types.TGotReport;
    payload: TReport;
}

export interface IGotReports {
    type: types.TGotReports;
    payload: Array<TReport>;
}

export interface IGotRoles {
    type: types.TGotRoles;
    payload: Array<TRole>;
}

export interface IGotServiceMessages {
    type: types.TGotServiceMessages;
    payload: Array<TServiceMessage>;
}

export interface IGetUsers {
    type: types.TGetUsers;
    payload: undefined;
}

export interface IGotUsers {
    type: types.TGotUsers;
    payload: Array<TUser>;
}

export interface IGotVersionsInfo {
    type: types.TGotVersionsInfo;
    payload: Array<TVersionInfo>;
}

export interface IListenWSOrganizationChannel {
    type: types.TListenWSOrganizationChannel;
    payload: number;
}

export interface ILeaveWSChannelChannel {
    type: types.TLeaveWSOrganizationChannel;
    payload: number;
}

export interface IOrganizationUserChange {
    type: types.TOrganizationUserChanged;
    payload: number;
}

export interface IRefreshConnectorCompletions {
    type: types.TRefreshConnectorCompletions;
    payload: number;
}

export interface IRefreshConnectorSchemasTree {
    type: types.TRefreshConnectorSchemasTree;
    payload: number;
}

export interface IReportChangeVisibility {
    type: types.TReportChangeVisibility,
    payload: { reportId: number, is_visible: boolean }
}

export interface IReportFavoriteAdd {
    type: types.TReportFavoriteAdd;
    payload: TReport;
}

export interface IReportFavoriteAdded {
    type: types.TReportFavoriteAdded;
    payload: number;
}

export interface IReportFavoriteDelete {
    type: types.TReportFavoriteDelete;
    payload: TReport;
}

export interface IReportFavoriteDeleted {
    type: types.TReportFavoriteDeleted;
    payload: number;
}

export interface IReportsLoading {
    type: types.TReportsLoading;
    payload: boolean;
}

export interface IReportCreated {
    type: types.TReportCreated;
    payload: TReport;
}

export interface IReportDeleted {
    type: types.TReportDeleted;
    payload: TReport;
}

export interface IReportUpdated {
    type: types.TReportUpdated;
    payload: TReport;
}

export interface IReportVisibilityChanged {
    type: types.TReportVisibilityChanged,
    payload: { reportId: number, is_visible: boolean }
}

export interface IUpdateDirectoriesTreeNumReports {
    type: types.TUpdateDirectoriesTreeNumReports;
    payload: undefined;
}

export interface IUpdateReportCacheStatus {
    type: types.TUpdateReportCacheStatus;
    payload: Array<TReportCacheStatus>;
}

export const assetsLoading = (payload: boolean): IAssetsLoading => ({
    type: types.ASSETS_LOADING,
    payload,
});

export const categoriesLoading = (payload: boolean): ICategoriesLoading => ({
    type: types.CATEGORIES_LOADING,
    payload,
});

export const directoriesLoading = (payload: boolean): IDirectoriesLoading => ({
    type: types.DIRECTORIES_LOADING,
    payload,
});

export const directoriesTreeLoading = (payload: boolean): IDirectoriesTreeLoading => ({
    type: types.DIRECTORIES_TREE_LOADING,
    payload,
});

export const getAssets = (): IGetAssets => ({
    type: types.GET_ASSETS,
    payload: undefined
})

export const getCategories = (): IGetCategories => ({
    type: types.GET_CATEGORIES,
    payload: undefined
})

export const getConnectors = (): IGetConnectors => ({
    type: types.GET_CONNECTORS,
    payload: undefined
})

export const getConnectorCompletions = (payload: number): IGetConnectorCompletions => ({
    type: types.GET_CONNECTOR_COMPLETIONS,
    payload
})

export const getConnectorDatabases = (): IGetConnectorDatabases => ({
    type: types.GET_CONNECTOR_DATABASES,
    payload: undefined
})

export const getConnectorSchemaTrees = (payload: number): IGetConnectorSchemasTree => ({
    type: types.GET_CONNECTOR_SCHEMAS_TREE,
    payload
})

export const getDataViewLibs = (): IGetDataViewLibs => ({
    type: types.GET_DATA_VIEW_LIBS,
    payload: undefined
})

export const getDataViewLibTypes = (): IGetDataViewLibTypes => ({
    type: types.GET_DATA_VIEW_LIB_TYPES,
    payload: undefined
})

export const getDataViewLibVersions = (): IGetDataViewLibVersions => ({
    type: types.GET_DATA_VIEW_LIB_VERSIONS,
    payload: undefined
})

export const getDirectories = (): IGetDirectories => ({
    type: types.GET_DIRECTORIES,
    payload: undefined
})

export const getDirectoriesTree = (): IGetDirectoriesTree => ({
    type: types.GET_DIRECTORIES_TREE,
    payload: undefined
})

export const getGroups = (): IGetGroups => ({
    type: types.GET_GROUPS,
    payload: undefined
})

export const gotParameterInput = (payload: TParameterInput): IGotParametersInput => ({
    type: types.GOT_PARAMETER_INPUT,
    payload,
})

export const getParameterInputs = (): IGetParameterInputs => ({
    type: types.GET_PARAMETER_INPUTS,
    payload: undefined
})

export const getParameterInputTypes = (): IGetParameterInputTypes => ({
    type: types.GET_PARAMETER_INPUT_TYPES,
    payload: undefined
})

export const getParameterInputDataTypes = (): IGetParameterInputDataTypes => ({
    type: types.GET_PARAMETER_INPUT_DATA_TYPES,
    payload: undefined
})

export const getReports = (payload: Array<TURLParameter>): IGetReports => ({
    type: types.GET_REPORTS,
    payload
})

export const getUsers = (): IGetUsers => ({
    type: types.GET_USERS,
    payload: undefined
})

export const listenWSOrganizationChannel = (payload: number): IListenWSOrganizationChannel => ({
    type: types.LISTEN_WS_ORGANIZATION_CHANNEL,
    payload
});

export const leaveWSOrganizationChannel = (payload: number): ILeaveWSChannelChannel => ({
    type: types.LEAVE_WS_ORGANIZATION_CHANNEL,
    payload
});

export const organizationUserChange = (payload: number): IOrganizationUserChange => ({
    type: types.ORGANIZATION_USER_CHANGE,
    payload,
});

export const refreshConnectorCompletions = (payload: number): IRefreshConnectorCompletions => ({
    type: types.REFRESH_CONNECTOR_COMPLETIONS,
    payload
})

export const refreshConnectorSchemasTree = (payload: number): IRefreshConnectorSchemasTree => ({
    type: types.REFRESH_CONNECTOR_SCHEMAS_TREE,
    payload
})

export const reportChangeVisibility = (payload: { reportId: number, is_visible: boolean }): IReportChangeVisibility => ({
    type: types.REPORT_CHANGE_VISIBILITY,
    payload,
});

export const reportFavoriteAdd = (payload: TReport): IReportFavoriteAdd => ({
    type: types.REPORT_FAVORITE_ADD,
    payload,
});

export const reportFavoriteRemove = (payload: TReport): IReportFavoriteDelete => ({
    type: types.REPORT_FAVORITE_DELETE,
    payload,
});

export const reportsLoading = (payload: boolean): IReportsLoading => ({
    type: types.REPORTS_LOADING,
    payload,
});


export type TAPIDataAction =
    ICleanLocalCache
    | IAssetsLoading
    | ICategoriesLoading
    | IDirectoriesLoading
    | IDirectoriesTreeLoading
    | ICleanReportsDirectoriesTree
    | IGetAssets
    | IGotAssets
    | IGetCategories
    | IGotCategories
    | IGetConnectors
    | IGotConnectors
    | IGetConnectorCompletions
    | IGotConnectorCompletions
    | IGetConnectorDatabases
    | IGotConnectorDatabases
    | IGetConnectorSchemasTree
    | IGotConnectorSchemasTree
    | IGetDataViewLibs
    | IGotDataViewLibs
    | IGetDataViewLibTypes
    | IGotDataViewLibTypes
    | IGetDataViewLibVersions
    | IGotDataViewLibVersions
    | IGetDirectories
    | IGotDirectories
    | IGetDirectoriesTree
    | IGotDirectoriesTree
    | IGetGroups
    | IGotGroups
    | IGotOrganization
    | IGotOrganizations
    | IGetParameterInputs
    | IGotParametersInputs
    | IGotParametersInput
    | IGetParameterInputTypes
    | IGotParametersInputTypes
    | IGetParameterInputDataTypes
    | IGotParametersInputDataTypes
    | IGetUsers
    | IGotUsers
    | IGotReport
    | IGetReports
    | IGotReports
    | IGotRoles
    | IGotServiceMessages
    | IGotVersionsInfo
    | IListenWSOrganizationChannel
    | ILeaveWSChannelChannel
    | IOrganizationUserChange
    | IRefreshConnectorCompletions
    | IRefreshConnectorSchemasTree
    | IReportChangeVisibility
    | IReportFavoriteAdd
    | IReportFavoriteAdded
    | IReportFavoriteDelete
    | IReportFavoriteDeleted
    | IReportsLoading
    | IReportCreated
    | IReportDeleted
    | IReportUpdated
    | IReportVisibilityChanged
    | IUpdateDirectoriesTreeNumReports
    | IUpdateReportCacheStatus
    ;