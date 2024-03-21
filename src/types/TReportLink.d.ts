import TReportLinkParameter from "./TReportLinkParameter";

type TReportLink = {
    reportId: number,
    label: string,
    canBeOpenInSameTab: boolean,
    parameters: Array<TReportLinkParameter>,
    handleClick?: Function,
}

export = TReportLink;