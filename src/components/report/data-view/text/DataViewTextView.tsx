import * as React from 'react';

import ReportErrorBoundary                                           from "../../ReportErrorBoundary";
import { context as authContext }                                    from "../../../../contexts/auth/store/context";
import GraphSkeleton                                                 from "../../../skeleton/GraphSkeleton";
import TReportInstance                                               from "../../../../types/TReportInstance";
import TReport                                                       from "../../../../types/TReport";
import { Card }                                                      from "primereact/card";
import TReportDataView                                               from "../../../../types/TReportDataView";
import { DataViewTitle }                                             from "../DataViewTitle";
import { replaceColumnsPlaceholders, replaceParametersPlaceholders } from "../../../../utils/parameterPlaceholder";
import TDataViewTextForm                                             from "../../../../types/TDataViewTextForm";

const DataViewTextView: React.FC<{
        report: TReport,
        reportInstance: TReportInstance,
        jsonResults?: Array<Object>,
        loading?: boolean, // true when data view is loaded don't have yet results.
        config?: TDataViewTextForm,
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
            <div
                className="ql-editor"
                dangerouslySetInnerHTML={{
                    __html: replaceColumnsPlaceholders(
                        replaceParametersPlaceholders(
                            config?.text || '',
                            reportInstance.reportParameterInputValues, report.parameters || []
                        ),
                        jsonResults && jsonResults.length > 0 ? Object.entries(jsonResults[0]).map(([key, value]: [string, any]) => ({name: key, value})) : []
                    )
                }}
            />
        );

        const replacedTitle = replaceParametersPlaceholders(dataView.title || '', reportInstance.reportParameterInputValues, report.parameters || []);
        const replacedDesc = replaceParametersPlaceholders(dataView.description || '', reportInstance.reportParameterInputValues, report.parameters || []);


        return (
            <>
                {loading
                    ? <GraphSkeleton animation/>
                    : (
                        <ReportErrorBoundary
                            uiGrants={authState.user.organization_user.ui_grants}
                            reportId={report.id}
                        >
                            {expanded
                                ? (
                                    <Card className="dev-text">
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

export default DataViewTextView;