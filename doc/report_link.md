# Components

```
DataView                                          <- dispatch event to update dataviewjs code (code, data view params)
|->DataViewTable
|  |-> DataViewTableView
|      |-> DataViewTableLinkedCell                 <- we display link here
|   
|   -> DataViewTableParamsForm
|      |-> DataViewTableColumnParameterForm        <- main button to setup report links on column
|                                                     handle formik state 
|          |-> ReportLinks                         <- handle 
|              |-> ReportLinkForm                  <- handle link parameters update from below coponent (formik state only)
|                                                     crud butons for report link
|                  |-> ReportLinkParameters        <- list all linked report's input' parameters
```


