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
