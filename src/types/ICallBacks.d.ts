import TCallbackResponse             from "./TCallbackResponse";
import TDataViewTableColumnParameter from "./TDataViewTableParameter";
import TReportLinkParameter          from "./TReportLinkParameter";
import TReportLink                   from "./TReportLink";
import TLaravelPagination            from "./TLaravelPagination";
import TDataViewTableForm            from "./TDataViewTableForm";
import TUser                         from "./TUser";
import TOrganization                 from "./TOrganization";
import { MenuItem }                  from "primereact/menuitem";
import TExternalLink                 from "./TExternalLink";
import TDataViewMetricForm           from "./TDataViewMetricForm";
import TDataViewMetricRow            from "./TDataViewMetricRow";
import TDataViewTextForm             from "./TDataViewTextForm";

export interface ICallbackCreateDataViewSuccess {
    (dataView: TReportDataView, dataViewJs?: TReportDataViewJs | undefined): void
}

export interface ICallbackGetReportDateViewsAndResponseStatus {
    (reportId: number, callbackResponse: TCallbackResponse): void
}

export interface ICallbackTableJsonFormOnChange {
    (jsonForm: TDataViewTableForm): void
}

export interface ICallbackInfoJsonFormOnChange {
    (jsonForm: TDataViewMetricForm): void
}

export interface ICallbackTextJsonFormOnChange {
    (jsonForm: TDataViewTextForm): void
}

// export interface ICallbackNumber {
//     (value: number): void
// }

export interface ICallbackReportDataView {
    (dataView: TReportDataView): void
}

export interface ICallbackOnCreateOrUpdateDataViewTableParam {
    (column: TDataViewTableColumnParameter): void
}

export interface ICallbackOnCreateOrUpdateDataViewInfoParam {
    (column: TDataViewMetricRow): void
}

export interface ICallbackOnReportLinkParamatersUpdate {
    (reportLinkParameters: Array<TReportLinkParameter>): void
}

export interface ICallbackOnReportLinkUpdate {
    (reportLink: TReportLink): void
}

export interface ICallbackOnReportLinkDelete {
    (reportLink: TReportLink): void
}

export interface ICallbackOnReportLinksUpdate {
    (reportLinks: Array<TReportLink>): void
}


export interface ICallbackOnExternalLinkUpdate {
    (link: TExternalLink): void
}

export interface ICallbackOnExternalLinkDelete {
    (link: TExternalLink): void
}

export interface ICallbackOnExternalLinksUpdate {
    (links: Array<TExternalLink>): void
}

export interface ICallbackPaginate {
    (page: number): void
}

export interface ICallbackSQLEditorOnChange {
    (value: string): void
}

// @todo - type response
export interface ICallbackAxiosSuccess {
    (response: any, pagination?: TLaravelPagination): void
}

export interface ICallbackAxiosError {
    (response: any): void
}

export interface ICallbackOnReportCreateSuccess {
    (report: TReport): void
}

export interface ICallbackUserUpdate {
    (user: TUser): void
}

export interface ICallbackOrganizationUpdate {
    (user: TOrganization): void
}

export interface ICallbackOverviewItems {
    (items: Array<MenuItem>): void
}