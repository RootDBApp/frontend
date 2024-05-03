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

import { Tooltip }        from "primereact/tooltip";
import * as React         from "react";
import { useTranslation } from "react-i18next";

import TReport                 from "../../types/TReport";
import { TNameValue }          from "../../types/TNameValue";
import TReportParameter        from "../../types/TReportParameter";
import ReportCacheJobParameter from "./reportParameters/ReportCacheJobParameter";
import env                     from "../../envVariables";

const ReportCacheJobParameters: React.FC<{
    cacheJobParameterSetConfigs: Array<TCacheJobParameterSetConfig>,
    onChange: CallableFunction,
    report: TReport | null,
}> = ({
          cacheJobParameterSetConfigs,
          onChange,
          report,
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);

    const [reportParameters, setReportParameters] = React.useState<Array<TReportParameter>>([]);
    const [inputComponents, setInputComponents] = React.useState<React.ReactElement>(<></>);

    const warningLabel = (parameter: TReportParameter): React.ReactElement => {

        switch (parameter.parameter_input?.parameter_input_type?.name) {

            case 'date':

                return <>&nbsp;&nbsp;&nbsp;<i className="pi pi-exclamation-circle parameter-warning-label-date"/></>

            case 'select':

                return <>&nbsp;&nbsp;&nbsp;<i className="pi pi-exclamation-circle parameter-warning-label-select"/></>

            default:

                return <></>;
        }
    }

    const getValue = (parameter: TReportParameter): TNameValue => {

        const cacheJobParameterSetConfig = cacheJobParameterSetConfigs?.find((cacheJobParameterSetConfig: TCacheJobParameterSetConfig) => cacheJobParameterSetConfig.report_parameter_id === parameter.id);
        if (cacheJobParameterSetConfig !== undefined) {

            switch (parameter.parameter_input?.parameter_input_type?.name) {

                case 'date':

                    return {name: parameter.name, value: cacheJobParameterSetConfig.date_start_from_values?.values?.toString()};

                case 'multi-select':

                    return {name: parameter.name, value: cacheJobParameterSetConfig.multi_select_values?.values?.toString()};

                case 'select':

                    return {name: parameter.name, value: cacheJobParameterSetConfig.select_values?.values?.toString()};

                default:

                    return {name: parameter.name, value: cacheJobParameterSetConfig.value}
            }
        }

        return {name: '', value: ''};
    }

    // Used to display all the report's input parameters.
    //
    React.useEffect(() => {

        if (reportParameters.length > 0) {

            let inputGroups: React.ReactElement[] = [];
            let nextToThisOneActivated: boolean;

            const classNamePMd: Array<string> = [
                'md:col-12', //  1 row, 1 parameter
                'md:col-6',  //  1 row, 2 parameters
                'md:col-6',
                'md:col-3',  //  1 row, 3-4 parameters
                'md:col-2',  //  1 row, 5~6 parameters
                'md:col-2',
            ];

            // Determinate the classname 'pd-md-x' to use.
            let componentByRow: number = 1;
            let componentByRowMax: number = 1;

            reportParameters.forEach((parameter: TReportParameter) => {

                if (parameter.following_parameter_next_to_this_one) {

                    nextToThisOneActivated = true;
                    componentByRow++;
                } else {

                    if (componentByRow > componentByRowMax) {
                        componentByRowMax = componentByRow;
                    }

                    nextToThisOneActivated = false;
                    componentByRow = 1;
                }
            });

            nextToThisOneActivated = false;
            reportParameters.forEach((parameter: TReportParameter, index: number) => {

                let className = 'col-12 mb-1 p-p-1 ';
                if (parameter.following_parameter_next_to_this_one || nextToThisOneActivated) {

                    className += classNamePMd[componentByRowMax];

                    if (!nextToThisOneActivated) {

                        nextToThisOneActivated = true
                    } else if (nextToThisOneActivated && !parameter.following_parameter_next_to_this_one) {

                        nextToThisOneActivated = false;
                    }
                }

                inputGroups.push(
                    <div key={String('parameters-form-field-' + index)} className={`field ${className}`}>
                        <label key={String('parameter-form-label-' + index)}
                               htmlFor={parameter.variable_name}
                        >
                            {parameter.name}
                        </label>
                        {warningLabel(parameter)}
                        <ReportCacheJobParameter
                            index={index}
                            parameter={parameter}
                            onChange={(inputNameValue: TNameValue, parameter: TReportParameter) => {
                                onChange(inputNameValue, parameter);
                            }}
                            value={getValue(parameter)}
                        />
                    </div>
                );
            });

            // Display inputs components.
            setInputComponents(
                <div key={`key-report-cache-job-parameters-${report?.id}`}
                     id={`report-cache-job-parameters-${report?.id}`}
                     className="grid"
                >
                    <Tooltip target=".parameter-warning-label-date"
                             position="bottom"
                             content={t('report:form.cache_job.warning_label_date').toString()}
                             showDelay={env.tooltipShowDelay}
                             hideDelay={env.tooltipHideDelay}
                    />
                    <Tooltip target=".parameter-warning-label-select"
                             position="bottom"
                             content={t('report:form.cache_job.warning_label_select').toString()}
                             showDelay={env.tooltipShowDelay}
                             hideDelay={env.tooltipHideDelay}
                    />
                    {inputGroups}
                </div>
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportParameters, report?.id, t,]);

    // Initialize all report's input parameters, if we have a report loaded. (we should..)
    //
    React.useEffect(() => {

        if (report && report.parameters) {

            setReportParameters(report.parameters);
        }
    }, [report]);

    return (<>{inputComponents}</>)
}

export default ReportCacheJobParameters;