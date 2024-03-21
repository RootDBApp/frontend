import { ETableAggregateType } from "./ETableAggregateType";
import TReportLink             from "./TReportLink";
import { ColumnDef }              from "@tanstack/react-table";
import TExternalLink from "./TExternalLink";

// ?
type TDataViewTableColumnV8 = ColumnDef<any> & {
    footerMethod: ETableAggregateType,
    footerText?: string,
    footerRounding?: number,
    groupBy: boolean,
    asImage?: boolean,
    asImageThumbnailWidth?: number,
    asImageThumbnailHeight?: number,
    asImageFullSize?: boolean,
    reportLinks?: TReportLink[],
    externalLinks?: TExternalLink[],
    collapsible?: boolean,
};

export = TDataViewTableColumnV8;