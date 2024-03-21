import { Column }              from "react-table";
import { ETableFilterType }    from "./ETableFilterType";
import { ETableAggregateType } from "./ETableAggregateType";
import TReportLink             from "./TReportLink";

// ?
type TDataViewTableColumn = Column<Object> & {
    filterType: ETableFilterType,
    footerMethod: ETableAggregateType,
    footerText?: string,
    footerRounding?: number,
    groupBy: boolean,
    reportLinks?: TReportLink[],
    collapsible?: boolean,
    asImage?: boolean,
    asImageThumbnailWidth?: number,
    asImageThumbnailHeight?: number,
    asImageFullSize?: boolean,
};

export = TDataViewTableColumn;