import TDirectory                from "./TDirectory";
import TCategory                 from "./TCategory";
import TReport                   from "./TReport";
import TreeNode                  from "primereact/treenode";
import TRole                     from "./TRole";
import TReportDataViewLibType    from "./TReportDataViewLibType";
import TReportDataViewLibVersion from "./TReportDataViewLibVersion";
import TServiceMessage           from "./TServiceMessage";
import TParameterInput           from "./TParameterInput";

type TCache = {
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