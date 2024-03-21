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