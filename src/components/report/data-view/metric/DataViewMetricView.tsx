import * as React from 'react';

import CenteredNoData                                                from "../../../common/loading/CenteredNoData";
import ReportErrorBoundary                                           from "../../ReportErrorBoundary";
import { context as authContext }                                    from "../../../../contexts/auth/store/context";
import GraphSkeleton                                                 from "../../../skeleton/GraphSkeleton";
import TReportInstance                                               from "../../../../types/TReportInstance";
import TReport                                                       from "../../../../types/TReport";
import TDataViewMetricForm                                           from "../../../../types/TDataViewMetricForm";
import { Card }                                                      from "primereact/card";
import TReportDataView                                               from "../../../../types/TReportDataView";
import { DataViewTitle }                                             from "../DataViewTitle";
import { replaceColumnsPlaceholders, replaceParametersPlaceholders } from "../../../../utils/parameterPlaceholder";
import { EDataViewMetricFontWeight }                                 from "../../../../types/EDataViewMetricFontWeight";
import { EDataViewMetricFontSize }                                   from "../../../../types/EDataViewMetricFontSize";

const DataViewMetricView: React.FC<{
        report: TReport,
        reportInstance: TReportInstance,
        jsonResults?: Array<Object>,
        loading?: boolean, // true when data view is loaded don't have yet results.
        config?: TDataViewMetricForm,
        expanded: boolean,
        dataView: TReportDataView,
    }> = ({
              report,
              reportInstance,
              jsonResults,
              loading = false,
              config,
              expanded,
              dataView,
          }): React.ReactElement => {

        const {state: authState} = React.useContext(authContext);

        const content = (
            <>
                {!!config?.global?.icon && (
                    <span className="icon">
                        <i className={config.global.icon}/>
                    </span>
                )}
                <div className="p-card-body dataview-info-view-content">
                    {config?.rows.map(row => (
                        <p
                            key={row.id}
                            className={`${row.fontWeight || EDataViewMetricFontWeight.normal} ${row.fontSize || EDataViewMetricFontSize.normal} ${row.italic ? 'italic' : ''}`}
                            style={{color: row.color ? `#${row.color}` : 'var(--text-color)'}}
                            dangerouslySetInnerHTML={{
                                __html: replaceColumnsPlaceholders(
                                    replaceParametersPlaceholders(
                                        row.text || '',
                                        reportInstance.reportParameterInputValues, report.parameters || []
                                    ),
                                    jsonResults && jsonResults.length > 0 ? Object.entries(jsonResults[0]).map(([key, value]: [string, any]) => ({name: key, value})) : []
                                )
                            }}
                        />

                    ))}
                </div>
                {!!config?.global?.footer && <div className="p-card-footer">{config.global.footer}</div>}
            </>
        );

        const replacedTitle = replaceParametersPlaceholders(dataView.title || '', reportInstance.reportParameterInputValues, report.parameters || []);
        const replacedDesc = replaceParametersPlaceholders(dataView.description || '', reportInstance.reportParameterInputValues, report.parameters || []);


        return (
            <>
                {(jsonResults?.length === 0) ? (
                    loading
                        ? <GraphSkeleton animation/>
                        : <CenteredNoData/>
                ) : (
                    <ReportErrorBoundary
                        uiGrants={authState.user.organization_user.ui_grants}
                        reportId={report.id}
                    >
                        {expanded
                            ? (
                                <Card className="dev-info">
                                    <DataViewTitle
                                        title={replacedTitle || dataView.name}
                                        descriptionDisplayType={dataView.description_display_type}
                                        replacedDesc={replacedDesc}
                                        id={dataView.id}
                                    />
                                    {content}
                                </Card>
                            )
                            : content
                        }
                    </ReportErrorBoundary>
                )}
            </>
        )
    }
;

export default DataViewMetricView;