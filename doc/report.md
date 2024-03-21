# Load

1. `Report.tsx` -> `// get Report if we don't have it yet`
2. GET for main report info made here : `asyncActionHandlers.ts` -> `GET_REPORT`
3. State updated here : `report/store/reducer.ts` -> `GOT_REPORT`
4. GET for all report's data views made here : `asyncActionHandlers.ts` -> `getReportDataViews()`
5. State updated here :  `report/store/reducer.ts` -> `GOT_REPORT_DATAVIEWS`

# Run

From Home tab :

`ReportListing.tsx` -> `onClick={() => navigate('/report/' + generateReportUniqId(report.id) + '?run')}`

OR

`ReportParameters.tsx` -> `navigate('/report/' + generateReportUniqId(Number(reportId)) + '?' + nameValuesToString(reportParameterInputValues) + '&run');`

THEN

1. From `Header.tsx` -> `// Handle report run options.`
2. Events & results handled by websocket inside `asyncActionsHandler.ts` -> `LISTEN_*`

# Dev views

When editing a view from data view's options overlay :
1. Calling `handleExpand()` in `DataViewClient` 
2. to navigate to `report/<report_id>_<instance_id>/data-view/<data_view_id>`
3. which is handled by `PathDrivenTabs`
4. and we fall in `Report` -> `ReportDev`
5. 

# Components

```
Report
|-> ReportDev
|   |-> ReportExpandedDataView
|       |-> DataViewDev
|           |-> DataView
|               |-> ...
|---`-> ReportClient     <- - - - - - - - - - - we get all we need from reportState, we lopp here all data views.
|       |-> DataViewClient
|           |-> DataView <- - - - - - - - - - - props results setup, loading component, overlay option menu...
|               |-> DataViewGraph
|                   |-> DataViewGraphView
|                   |-> DataViewGraphParamsJs
|               |-> DataViewTable
|                   |-> DataViewTableView
|                   |-> DataViewTableParamsForm


PublicReport
|-> ReportClient
|   -> ...
```


Report 
ReportClient

Below, useEffect not working

# DataView state
loading : the view's query is running  

waitingData : 
- the view didn't yet receive data
- set to true when RUN_REPORT
- set top false when REPORT_RUN_END or REPORT_DATAVIEW_RUN_ERROR or REPORT_DATAVIEW_RUN_END