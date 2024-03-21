import { ETableFilterType }     from "./ETableFilterType";
import { ETableAggregateType } from "./ETableAggregateType";
import TReportLink             from "./TDataViewTableReportLink";
import TExternalLink            from "./TExternalLink";

type TDataViewTableColumnParameter = {
    removed?: boolean,
    new?: boolean,
    header: string,
    column: string,
    hidden?: boolean,
    filter?: ETableFilterType,
    footerMethod?: ETableAggregateType,
    footerText?: string,
    footerRounding?: number,
    groupBy: boolean,
    reportLinks: Array<TReportLink>,
    externalLinks: Array<TExternalLink>,
    collapsible?: boolean,
    asImage?: boolean,
    asImageThumbnailWidth?: number,
    asImageThumbnailHeight?: number,
    asImageFullSize?: boolean,
}

export = TDataViewTableColumnParameter;