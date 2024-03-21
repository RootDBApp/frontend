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