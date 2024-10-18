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

import { CalendarViewChangeEvent } from "primereact/calendar";
import * as React              from 'react';
import { ChangeEvent }         from "react";


import TReportParameter           from "../../../types/TReportParameter";
import ReportParameterCalendar    from "./ReportParameterCalendar";
import { formatDateYYYYMMDD }     from "../../../utils/tools";
import ReportParameterText        from "../ReportParameterText";
import ReportParameterMultiSelect from "./ReportParameterMultiSelect";
import { MultiSelectChangeEvent } from "primereact/multiselect";
import ReportParameterRadioButton from "./ReportParameterRadioButton";
import ReportParameterDropdown    from "./ReportParameterDropdown";
import { TNameValue }             from "../../../types/TNameValue";
import apiDataContext             from "../../../contexts/api_data/store/context";
import ReportParameterCheckboxes  from "./ReportParameterCheckboxes";
import ReportParameterDateSelector from "./ReportParameterDateSelector";

const ReportParameter: React.FC<{
    index: number,
    onChange?: CallableFunction,
    parameter: TReportParameter,
    parameterId?: string,
    value?: TNameValue,
}> = ({
          index,
          onChange,
          parameter,
          parameterId,
          value,
      }): React.ReactElement => {

    const {state: apiDataState} = React.useContext(apiDataContext);

    const paramId: string = parameterId || parameter.id + '-' + parameter.variable_name;
    const paramDataType = apiDataState.parameterInputDataTypes.find(dataType => dataType.id === parameter.parameter_input?.parameter_input_data_type_id);

    switch (parameter.parameter_input?.parameter_input_type?.name) {

        case 'auto-complete'  :
            return <>auto-complete</>;

        case 'checkbox'  :
            return <ReportParameterCheckboxes
                parameter={parameter}
                index={index}
                parameterId={paramId}
                formValue={value}
                onChange={(values: string) => {

                    if (onChange) {

                        onChange({
                            name: parameter.variable_name,
                            value: values,
                        });
                    }
                }}
            />;

        case 'date':
            return <ReportParameterCalendar
                parameter={parameter}
                index={index}
                parameterId={paramId}
                onChange={(event: CalendarViewChangeEvent) => {

                    if (event.value instanceof Date) {

                        if (onChange) {

                            onChange({
                                name: parameter.variable_name,
                                value: formatDateYYYYMMDD(event.value),
                            });
                        }
                    }
                }}
                formValue={value}
            />

        case 'date-selector':
            return <ReportParameterDateSelector
                parameter={parameter}
                index={index}
                parameterId={paramId}
                onChange={(event: CalendarViewChangeEvent) => {

                    if (event.value instanceof Date) {

                        if (onChange) {

                            onChange({
                                name: parameter.variable_name,
                                value: formatDateYYYYMMDD(event.value),
                            });
                        }
                    }
                }}
                formValue={value}
            />

        case 'text':
            return <ReportParameterText
                parameter={parameter}
                index={index}
                parameterId={paramId}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {

                    if (onChange) {

                        onChange({
                            name: parameter.variable_name,
                            value: event.target.value,
                        });
                    }
                }}
                formValue={value}
                keyFilter={paramDataType && paramDataType.name === 'integer' ? 'int' : undefined}
            />

        case 'multi-select':
            return <ReportParameterMultiSelect
                parameter={parameter}
                index={index}
                parameterId={paramId}
                onChange={(event: MultiSelectChangeEvent) => {

                    if (onChange) {

                        onChange({
                            name: parameter.variable_name,
                            value: event.target.value.join(','),
                        });
                    }
                }}
                formValue={value}
            />

        case 'radio':
            return <ReportParameterRadioButton
                parameter={parameter}
                index={index}
                parameterId={paramId}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {

                    if (onChange) {

                        onChange({
                            name: parameter.variable_name,
                            value: event.target.value,
                        });
                    }
                }}
                formValue={value}
            />

        case 'select':
            return <ReportParameterDropdown
                parameter={parameter}
                index={index}
                parameterId={paramId}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {

                    if (onChange) {

                        onChange({
                            name: parameter.variable_name,
                            value: event.target.value,
                        });
                    }
                }}
                formValue={value}
            />

        default:
            return <></>;
    }
}

export default ReportParameter;