export enum EReportPanel {
    QUERY_INIT = 'query-init',
    DATA_VIEWS = 'data-views',
    QUERY_CLEANUP = 'query-cleanup',
}
export type EReportPanels = {
    [EReportPanel.QUERY_INIT]: boolean,
    [EReportPanel.DATA_VIEWS]: boolean,
    [EReportPanel.QUERY_CLEANUP]: boolean,
};