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

export const CATEGORIES_LOADING = 'CATEGORIES_LOADING';
export type TCategoriesLoading = typeof CATEGORIES_LOADING;

export const CLEAN_LOCAL_STORAGE = 'CLEAN_LOCAL_STORAGE';
export type TCleanLocalCache = typeof CLEAN_LOCAL_STORAGE;

export const CLEAN_REPORT_DIRECTORIES_TREE = 'CLEAN_REPORT_DIRECTORIES_TREE';
export type TCleanReportsDirectoriesTree = typeof CLEAN_REPORT_DIRECTORIES_TREE;

export const DIRECTORIES_LOADING = 'DIRECTORIES_LOADING';
export type TDirectoriesLoading = typeof DIRECTORIES_LOADING;

export const DIRECTORIES_TREE_LOADING = 'DIRECTORIES_TREE_LOADING';
export type TDirectoriesTreeLoading = typeof DIRECTORIES_TREE_LOADING;

export const GET_CATEGORIES = 'GET_CATEGORIES';
export type TGetCategories = typeof GET_CATEGORIES;

export const GOT_CATEGORIES = 'GOT_CATEGORIES';
export type TGotCategories = typeof GOT_CATEGORIES;

export const GET_CONNECTORS = 'GET_CONNECTORS';
export type TGetConnectors = typeof GET_CONNECTORS;

export const GOT_CONNECTORS = 'GOT_CONNECTORS';
export type TGotConnectors = typeof GOT_CONNECTORS;

export const GET_CONNECTOR_COMPLETIONS = 'GET_CONNECTOR_COMPLETIONS';
export type TGetConnectorCompletions = typeof GET_CONNECTOR_COMPLETIONS;

export const GOT_CONNECTOR_COMPLETIONS = 'GOT_CONNECTOR_COMPLETIONS';
export type TGotConnectorCompletions = typeof GOT_CONNECTOR_COMPLETIONS;

export const GET_CONNECTOR_DATABASES = 'GET_CONNECTOR_DATABASES';
export type TGetConnectorDatabases = typeof GET_CONNECTOR_DATABASES;

export const GOT_CONNECTOR_DATABASES = 'GOT_CONNECTOR_DATABASES';
export type TGotConnectorDatabases = typeof GOT_CONNECTOR_DATABASES;

export const GET_CONNECTOR_SCHEMAS_TREE = 'GET_CONNECTOR_SCHEMAS_TREE';
export type TGetConnectorSchemasTree = typeof GET_CONNECTOR_SCHEMAS_TREE;

export const GOT_CONNECTOR_SCHEMAS_TREE = 'GOT_CONNECTOR_SCHEMAS_TREE';
export type TGotConnectorsSchemasTree = typeof GOT_CONNECTOR_SCHEMAS_TREE;

export const GET_DATA_VIEW_LIBS = 'GET_DATA_VIEW_LIBS';
export type TGetDataViewLibs = typeof GET_DATA_VIEW_LIBS;

export const GOT_DATA_VIEW_LIBS = 'GOT_DATA_VIEW_LIBS';
export type TGotDataViewLibs = typeof GOT_DATA_VIEW_LIBS;

export const GET_DATA_VIEW_LIB_TYPES = 'GET_DATA_VIEW_LIB_TYPES';
export type TGetDataViewLibTypes = typeof GET_DATA_VIEW_LIB_TYPES;

export const GOT_DATA_VIEW_LIB_TYPES = 'GOT_DATA_VIEW_LIB_TYPES';
export type TGotDataViewLibTypes = typeof GOT_DATA_VIEW_LIB_TYPES;

export const GET_DATA_VIEW_LIB_VERSIONS = 'GET_DATA_VIEW_LIB_VERSIONS';
export type TGetDataViewLibVersions = typeof GET_DATA_VIEW_LIB_VERSIONS;

export const GOT_DATA_VIEW_LIB_VERSIONS = 'GOT_DATA_VIEW_LIB_VERSIONS';
export type TGotDataViewLibVersions = typeof GOT_DATA_VIEW_LIB_VERSIONS;

export const GET_DIRECTORIES = 'GET_DIRECTORIES';
export type TGetDirectories = typeof GET_DIRECTORIES;

export const GOT_DIRECTORIES = 'GOT_DIRECTORIES';
export type TGotDirectories = typeof GOT_DIRECTORIES;

export const GET_DIRECTORIES_TREE = 'GET_DIRECTORIES_TREE ';
export type TGetDirectoriesTree = typeof GET_DIRECTORIES_TREE;

export const GOT_DIRECTORIES_TREE = 'GOT_DIRECTORIES_TREE ';
export type TGotDirectoriesTree = typeof GOT_DIRECTORIES_TREE;

export const GET_GROUPS = 'GET_GROUPS';
export type TGetGroups = typeof GET_GROUPS;

export const GOT_GROUPS = 'GOT_GROUPS';
export type TGotGroups = typeof GOT_GROUPS;

export const GOT_ORGANIZATION = 'GOT_ORGANIZATION';
export type TGotOrganization = typeof GOT_ORGANIZATION;

export const GOT_ORGANIZATIONS = 'GOT_ORGANIZATIONS';
export type TGotOrganizations = typeof GOT_ORGANIZATIONS;

export const GET_PARAMETER_INPUTS = 'GET_PARAMETER_INPUTS';
export type TGetParameterInputs = typeof GET_PARAMETER_INPUTS;

export const GOT_PARAMETER_INPUTS = 'GOT_PARAMETER_INPUTS';
export type TGotParameterInputs = typeof GOT_PARAMETER_INPUTS;

export const GOT_PARAMETER_INPUT = 'GOT_PARAMETER_INPUT';
export type TGotParameterInput = typeof GOT_PARAMETER_INPUT;

export const GET_PARAMETER_INPUT_TYPES = 'GET_PARAMETER_INPUT_TYPES';
export type TGetParameterInputTypes = typeof GET_PARAMETER_INPUT_TYPES;

export const GOT_PARAMETER_INPUT_TYPES = 'GOT_PARAMETER_INPUT_TYPES';
export type TGotParameterInputTypes = typeof GOT_PARAMETER_INPUT_TYPES;

export const GET_PARAMETER_INPUT_DATA_TYPES = 'GET_PARAMETER_INPUT_DATA_TYPES';
export type TGetParameterInputDataTypes = typeof GET_PARAMETER_INPUT_DATA_TYPES;

export const GOT_PARAMETER_INPUT_DATA_TYPES = 'GOT_PARAMETER_INPUT_DATA_TYPES';
export type TGotParameterInputDataTypes = typeof GOT_PARAMETER_INPUT_DATA_TYPES;

export const GET_REPORTS = 'GET_REPORTS';
export type TGetReports = typeof GET_REPORTS;

export const GOT_REPORT = 'GOT_REPORT';
export type TGotReport = typeof GOT_REPORT;

export const GOT_REPORTS = 'GOT_REPORTS';
export type TGotReports = typeof GOT_REPORTS;

export const GOT_ROLES = 'GOT_ROLES';
export type TGotRoles = typeof GOT_ROLES;

export const GOT_SERVICE_MESSAGES = 'GOT_SERVICE_MESSAGES';
export type TGotServiceMessages = typeof GOT_SERVICE_MESSAGES;

export const GET_USERS = 'GET_USERS';
export type TGetUsers = typeof GET_USERS;

export const GOT_USERS = 'GOT_USERS';
export type TGotUsers = typeof GOT_USERS;

export const GOT_VERSIONS_INFO = 'GOT_VERSIONS_INFO';
export type TGotVersionsInfo = typeof GOT_VERSIONS_INFO;

export const LISTEN_WS_ORGANIZATION_CHANNEL = 'LISTEN_WS_ORGANIZATION_CHANNEL';
export type TListenWSOrganizationChannel = typeof LISTEN_WS_ORGANIZATION_CHANNEL;

export const LEAVE_WS_ORGANIZATION_CHANNEL = 'LEAVE_WS_ORGANIZATION_CHANNEL';
export type TLeaveWSOrganizationChannel = typeof LEAVE_WS_ORGANIZATION_CHANNEL;

export const ORGANIZATION_USER_CHANGE = 'ORGANIZATION_USER_CHANGE';
export type TOrganizationUserChanged = typeof ORGANIZATION_USER_CHANGE;

export const REFRESH_CONNECTOR_COMPLETIONS = 'REFRESH_CONNECTOR_COMPLETIONS';
export type TRefreshConnectorCompletions = typeof REFRESH_CONNECTOR_COMPLETIONS;

export const REFRESH_CONNECTOR_SCHEMAS_TREE = 'REFRESH_CONNECTOR_SCHEMAS_TREE';
export type TRefreshConnectorSchemasTree = typeof REFRESH_CONNECTOR_SCHEMAS_TREE;

export const REPORT_CHANGE_VISIBILITY = 'REPORT_CHANGE_VISIBILITY';
export type TReportChangeVisibility = typeof REPORT_CHANGE_VISIBILITY;

export const REPORT_FAVORITE_ADD = 'REPORT_FAVORITE_ADD';
export type TReportFavoriteAdd = typeof REPORT_FAVORITE_ADD;

export const REPORT_FAVORITE_ADDED = 'REPORT_FAVORITE_ADDED';
export type TReportFavoriteAdded = typeof REPORT_FAVORITE_ADDED;

export const REPORT_FAVORITE_DELETE = 'REPORT_FAVORITE_DELETE';
export type TReportFavoriteDelete = typeof REPORT_FAVORITE_DELETE;

export const REPORT_FAVORITE_DELETED = 'REPORT_FAVORITE_DELETED';
export type TReportFavoriteDeleted = typeof REPORT_FAVORITE_DELETED;

export const REPORTS_LOADING = 'REPORTS_LOADING';
export type TReportsLoading = typeof REPORTS_LOADING;

export const REPORT_CREATED = 'REPORT_CREATED';
export type TReportCreated = typeof REPORT_CREATED;

export const REPORT_DELETED = 'REPORT_DELETED';
export type TReportDeleted = typeof REPORT_DELETED;

export const REPORT_UPDATED = 'REPORT_UPDATED';
export type TReportUpdated = typeof REPORT_UPDATED;

export const REPORT_VISIBILITY_CHANGED = 'REPORT_VISIBILITY_CHANGED';
export type TReportVisibilityChanged = typeof REPORT_VISIBILITY_CHANGED;

export const UPDATE_DIRECTORIES_TREE_NUM_REPORTS = 'UPDATE_DIRECTORIES_TREE_NUM_REPORTS';
export type TUpdateDirectoriesTreeNumReports = typeof UPDATE_DIRECTORIES_TREE_NUM_REPORTS;

export const UPDATE_REPORT_CACHE_STATUS = 'UPDATE_REPORT_CACHE_STATUS';
export type TUpdateReportCacheStatus = typeof UPDATE_REPORT_CACHE_STATUS;
