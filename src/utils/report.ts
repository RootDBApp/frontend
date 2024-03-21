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

import TReportParameter from "../types/TReportParameter";
import React            from "react";

import {
    reportParameterInputValuesInitialized,
    TReportAction,
    updateReportParameterInputValue
}                                   from "../contexts/report/store/actions";
import { TReportAsyncAction }       from "../contexts/report/store/asyncAction";
import { TNameValue }               from "../types/TNameValue";
import TReportRunInfo               from "../types/TReportRunInfo";
import TDirectoryTreeNode           from "../types/TDirectoryTreeNode";
import { EParameterInputType }      from "../types/EParameterInputType";
import TParameterInput              from "../types/TParameterInput";
import { orderComaSeparatedValues } from "./tools";

// const JSum = require('jsum');

export const getDirectoryFamilyReportsCount = (directoryTreeNode: TDirectoryTreeNode): number => {
    const childrenReportsCount = directoryTreeNode.children?.reduce(
        (count: number, child) => count + getDirectoryFamilyReportsCount(child),
        0
    );

    return (directoryTreeNode.reportCount ?? 0) + (childrenReportsCount ?? 0);
}

export const getPlaceholderValue = (variableName: string, reportParameterInputValues: TNameValue[], reportParameters: TReportParameter[]): string => {

    const parameterInput = reportParameterInputValues.find(p => p.name === variableName);

    const parameter = reportParameters.find(rp => rp.variable_name === variableName);

    if (parameter?.parameter_input?.parameter_input_type?.name === EParameterInputType.MULTI_SELECT) {

        const values = String(parameterInput?.value).split(',');

        return parameter.parameter_input.values
            .filter((v: any) => values.includes(String(v.value)))
            .map(((v: TParameterInput) => v.name))
            .join(',');
    }
    if (parameter?.parameter_input?.parameter_input_type?.name === EParameterInputType.SELECT) {

        return parameter.parameter_input.values
            .find((v: any) => parameterInput?.value === String(v.value))
            ?.name || '';
    }

    return String(parameterInput?.value);
};

// export const getReportHashParameters = (reportId: number, reportParameters: any): string => {
//
//     return reportId + JSum.digest(reportParameters, 'SHA256', 'hex')
// }

export const getReportRunInfo = (
    reportDispatch: React.Dispatch<TReportAction | TReportAsyncAction>,
    reportInstanceId: number,
    reportId: number,
    reportHasParameters: boolean,
    reportParamsFromURL: object, // {variable_name_x: value,  variable_name_y: value}
    run: boolean,
    useCache: boolean,
    reportParameters?: TReportParameter[],
): TReportRunInfo => {

    let reportRunInfo: TReportRunInfo = {run, instanceId: reportInstanceId, formValues: [], useCache: useCache}

    // if we have some report url parameters, let's use it directly.
    //
    if (reportParamsFromURL && Object.keys(reportParamsFromURL).length > 0) {

        // Add missing parameters if needed.
        if (Object.keys(reportParamsFromURL).length !== reportParameters?.length) {

            reportParameters?.forEach((reportParameter: TReportParameter) => {

                if (!Object.keys(reportParamsFromURL).includes(reportParameter.variable_name)) {

                    Object.defineProperty(
                        reportParamsFromURL,
                        reportParameter.variable_name,
                        {
                            value: orderComaSeparatedValues(
                                reportParameter.forced_default_value
                                    ? reportParameter.forced_default_value
                                    : (reportParameter.parameter_input?.default_value ? reportParameter.parameter_input.default_value : '')
                            ),
                            writable: false,
                            enumerable: true
                        }
                    );
                }
            });
        }

        // Update report state.
        updateReportInstanceParamInputValues(reportDispatch, reportId, reportInstanceId, reportParamsFromURL);

        Object.entries(reportParamsFromURL).forEach(([variableName, value]) => {

            // If below condition is activated, we are not sending empty value, needed
            // when making sql stuff like (@paramName = '' OR find_in_set(column_name, @paramName))
            // use-cache = parameter added to URI when running the report for the first time.
            if (variableName !== 'use-cache') {

                reportRunInfo.formValues.push({name: variableName, value: orderComaSeparatedValues(String(value))});
            }
        })
    }
    // else check if we have report parameters with all default values set.
    else if (reportHasParameters && reportParameters) {

        const reportParametersWithEmptyDefaultValue = reportParameters.find(
            (reportParameter) => {

                return reportParameter.parameter_input?.default_value === '' && reportParameter.forced_default_value === ''
            }
        );

        // It means that there is a report parameter with no default value, so we do not execute the report.
        if (reportParametersWithEmptyDefaultValue) {

            reportRunInfo.run = false;
        } else {

            reportRunInfo.formValues = reportParametersValuesToFormValues(reportParameters);
        }
    }

    return reportRunInfo;
}

export const reportParametersValuesToFormValues = (reportParameters?: TReportParameter[]): Array<TNameValue> => {

    const formValues: Array<TNameValue> = [];

    if (reportParameters && reportParameters.length > 0) {

        reportParameters.forEach((reportParameter: TReportParameter) => {

            let value = '';
            // Determine value.
            if (reportParameter.forced_default_value && reportParameter.forced_default_value?.length > 0) {

                value = String(reportParameter.forced_default_value);

            } else if (reportParameter.parameter_input && reportParameter.parameter_input.default_value && reportParameter.parameter_input.default_value.length && reportParameter.parameter_input.default_value.length > 0) {

                value = String(reportParameter.parameter_input.default_value);
            }

            formValues.push({
                name: reportParameter.variable_name,
                value: reportParameter.parameter_input?.parameter_input_type?.name === 'multi-select' ? orderComaSeparatedValues(value) : value
            });
        })
    }

    return formValues;
}

export const updateReportInstanceParamInputValues = (
    reportDispatch: React.Dispatch<TReportAction | TReportAsyncAction>,
    reportId: number,
    reportInstanceId: number,
    reportParamsFromURL: object, // {variable_name_x: value,  variable_name_y: value}
): void => {

    reportDispatch(
        reportParameterInputValuesInitialized({
            initialized: false,
            reportId: Number(reportId),
            reportInstanceId
        }));

    Object.entries(reportParamsFromURL).forEach(([variableName, value]) => {

        if (variableName !== 'use-cache') {

            reportDispatch(
                updateReportParameterInputValue({
                    reportId: Number(reportId),
                    reportInstanceId: reportInstanceId,
                    name: variableName,
                    value: String(value),
                })
            );
        }
    })

    reportDispatch(
        reportParameterInputValuesInitialized({
            initialized: true,
            reportId: Number(reportId),
            reportInstanceId
        }));
}
