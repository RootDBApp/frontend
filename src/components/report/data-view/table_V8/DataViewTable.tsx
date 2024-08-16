/*
 * This file is part of RootDB.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * AUTHORS
 * PORQUET Sébastien <sebastien.porquet@ijaz.fr>
 * ROBIN Brice <brice@robri.net>
 */

import { Message }        from "primereact/message";
import * as React         from 'react';
import { useTranslation } from "react-i18next";

import { ICallbackTableJsonFormOnChange }            from "../../../../types/ICallBacks";
import DataViewTableParamsForm                       from "../table_V8/DataViewTableParamsForm";
import DataViewTableView                             from "../table_V8/DataViewTableView";
import TDataViewTableColumnParameter                 from "../../../../types/TDataViewTableColumnParameter";
import { columnsV8FormToJS, paginationInitialState } from "../../../../utils/tableView";
import TDataViewTablePagination                      from "../../../../types/TDataViewTablePagination";
import { EReportDevBarMessageType }                  from "../../../../types/application-event/EReportDevBarMessageType";
import { reportDevBarEvent }                         from "../../../../utils/events";
import TDataViewTableForm                            from "../../../../types/TDataViewTableForm";
import { uncompress }                                from "../../../../utils/tools";
import TReportDataView                               from "../../../../types/TReportDataView";
import CenteredError                                 from "../../../common/loading/CenteredError";
import TDataViewTableColumnV8                        from "../../../../types/TDataViewTableColumnV8";
import TDataViewInstance                             from "../../../../types/TDataViewInstance";
import TReport                                       from "../../../../types/TReport";
import TReportInstance                               from "../../../../types/TReportInstance";
import TCallbackResponse                             from "../../../../types/TCallbackResponse";

const DataViewTable: React.FC<{
    callBackResponse?: TCallbackResponse,
    dataView: TReportDataView,
    dataViewInstance: TDataViewInstance,
    expanded: boolean,
    onChangeCallback: ICallbackTableJsonFormOnChange,
    mountParams: boolean,
    report: TReport,
    reportInstance: TReportInstance
    showView: boolean,
    loading?: boolean, // true when data view is loaded don't have yet results.
    results?: Array<Object>,
}> = ({
          callBackResponse,
          dataView,
          dataViewInstance,
          expanded,
          onChangeCallback,
          mountParams,
          report,
          reportInstance,
          showView,
          loading = false,
          results,
      }): React.ReactElement => {

    const {t} = useTranslation();

    const [dbColumnsParameters, setDbColumnsParameters] = React.useState<TDataViewTableColumnParameter[]>([]);
    const [columnsParameters, setColumnsParameters] = React.useState<TDataViewTableColumnParameter[]>([]);
    const [columns, setColumns] = React.useState<TDataViewTableColumnV8[]>([]);
    const [errorEmptyColumnId, setErrorEmptyColumnId] = React.useState<boolean>(false);
    const [pagination, setPagination] = React.useState<TDataViewTablePagination>(paginationInitialState);
    const [groupBy, setGroupBy] = React.useState<boolean>(false);
    const [expandedParam, setExpandedParam] = React.useState<boolean>(false);
    const [expanded_paginate, setExpandedPaginate] = React.useState<boolean>(true);
    const [adjustWidth, setAdjustWidth] = React.useState<boolean>(false);

    const resetColumns = (columns: TDataViewTableColumnParameter[]): void => {

        onChangeCallback({
            // exclude removed columns and remove new flag on new columns
            columns: columns.filter(c => !c.removed).map(c => ({...c, new: false})),
            global: {pagination, groupBy, expanded: expandedParam, expanded_paginate}
        });
    }

    const handleOnChange = (jsonForm: TDataViewTableForm): void => {

        onChangeCallback(jsonForm);

        const {
            global: {
                pagination: propsPagination = paginationInitialState,
                groupBy: propsGroupBy = false,
                expanded: propsExpanded = false,
                expanded_paginate: propsExpanded_paginate = true,
                adjust_width: propsAdjustWidth = false,
            }
        } = jsonForm;

        setPagination(propsPagination);
        setGroupBy(propsGroupBy);
        setExpandedParam(propsExpanded);
        setExpandedPaginate(propsExpanded_paginate);
        setAdjustWidth(propsAdjustWidth)
    }

    //
    //
    React.useEffect((): void => {

        if (dataView.report_data_view_js.json_form) {
            try {
                const {
                    columns: propColumnParameters = [],
                    global: {
                        pagination: propsPagination = paginationInitialState,
                        groupBy: propsGroupBy = false,
                        expanded: propsExpanded = false,
                        expanded_paginate: propsExpanded_paginate = true,
                        adjust_width: propsAdjustWidth = false,
                    } = {},
                } = dataView.report_data_view_js.json_form_minified ? JSON.parse(uncompress(dataView.report_data_view_js.json_form)) : JSON.parse(dataView.report_data_view_js.json_form);

                setDbColumnsParameters(propColumnParameters);
                setColumnsParameters(propColumnParameters);
                setPagination(propsPagination);
                setGroupBy(propsGroupBy);
                setExpandedParam(propsExpanded);
                setExpandedPaginate(propsExpanded_paginate);
                setAdjustWidth(propsAdjustWidth)
            } catch (e) {

                console.debug(e)
            }
        }
    }, [dataView.report_data_view_js.json_form, dataView.report_data_view_js.json_form_minified]);

    //
    //
    React.useEffect((): void => {

        if (dbColumnsParameters.length === 0 && results && results.length > 0) {

            const [result] = results;

            const generatedColumns: TDataViewTableColumnParameter[] = Object.entries({...result})
                .filter(([column]) => {
                    if (!column) {
                        setErrorEmptyColumnId(true);
                        return false;
                    }
                    return true;
                })
                .map(([column]) => ({
                        header: column,
                        column: column.replace('.', ''),
                        hidden: false,
                        groupBy: false,
                        reportLinks: [],
                        externalLinks: [],
                    }
                ));

            setColumnsParameters(generatedColumns);
            setColumns(columnsV8FormToJS(generatedColumns));
        } else if (dbColumnsParameters.length > 0) {

            if (results && results.length > 0) {

                const [result] = results;

                const columns: TDataViewTableColumnParameter[] = dbColumnsParameters.map(c => ({
                    ...c,
                    removed: !Object.entries({...result}).find(([column]) => c.column === column)
                }));

                Object.entries({...result})
                    .filter(([column]) => {
                        if (!column) {
                            setErrorEmptyColumnId(true);
                            return false;
                        }
                        return true;
                    })
                    .filter(([column]) => !dbColumnsParameters.map(c => c.column).includes(column))
                    .forEach(([column]) => {
                        columns.push({
                            header: column,
                            column: column,
                            hidden: false,
                            new: true,
                            groupBy: false,
                            reportLinks: [],
                            externalLinks: [],
                        })
                    });

                setColumnsParameters(columns);
                setColumns(columnsV8FormToJS(columns));
            } else {

                setColumnsParameters(dbColumnsParameters);
                setColumns(columnsV8FormToJS(dbColumnsParameters));
            }
        }
    }, [
        dbColumnsParameters,
        results,
    ]);

    //
    //
    React.useEffect((): void => {

        if (errorEmptyColumnId) {

            document.dispatchEvent(
                reportDevBarEvent({
                    message: t('report:dataview.table_empty_column_id').toString(),
                    reportId: report.id,
                    timestamp: Date.now(),
                    title: t('report:dataview.table_sql_error').toString(),
                    type: EReportDevBarMessageType.ERROR_REPORT,
                })
            );
        }
    }, [errorEmptyColumnId, report, t]);

    // React.useEffect(() => {
    //
    //     console.debug('======> [RENDER] DataViewTable');
    // }, []);

    return (
        <>
            <div className={showView ? 'subgrid-area-data-view-view' : 'hidden subgrid-area-data-view-view'}>
                {dataViewInstance?.errors && dataViewInstance.errors.length > 0 ? (
                    <CenteredError extraMessage={dataViewInstance.errors.map((error, index) => (
                        <Message
                            key={`data-view-message-error${index}`}
                            className="data-view-message-error"
                            severity="error" text={error}
                        />
                    ))}/>
                ) : (
                    <DataViewTableView
                        expanded={mountParams}
                        report={report}
                        reportInstance={reportInstance}
                        loading={loading}
                        jsCode={columns}
                        dataViewId={dataView.id}
                        globalForm={{
                            pagination,
                            groupBy,
                            expanded: expandedParam,
                            expanded_paginate,
                            adjust_width: adjustWidth
                        }}
                        jsonResults={results}
                    />
                )}
            </div>
            {mountParams && (
                <div className={`subgrid-area-data-view-params ${!expanded ? 'hidden' : ''}`}>
                    <DataViewTableParamsForm
                        callBackResponse={callBackResponse}
                        columnParameters={columnsParameters}
                        globalForm={{
                            pagination,
                            groupBy,
                            expanded: expandedParam,
                            expanded_paginate,
                            adjust_width: adjustWidth
                        }}
                        resetColumns={resetColumns}
                        onChangeCallback={(jsonForm: TDataViewTableForm) => {

                            handleOnChange(jsonForm);
                        }}
                        className="dataview-panel params flex"
                    />
                </div>
            )}
        </>
    )
}

export default DataViewTable;