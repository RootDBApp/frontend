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

import { RadioButton } from "primereact/radiobutton";
import * as React      from "react";

import TReportParameter from "../../../types/TReportParameter";
import { TNameValue }   from "../../../types/TNameValue";


const ReportParameterRadioButton: React.FC<{
    index: number,
    onChange: CallableFunction,
    parameter: TReportParameter,
    parameterId: string,
    formValue?: TNameValue,
    onChangeWhenSettingDefaultValue?: boolean
}> = ({
          index,
          onChange,
          parameter,
          parameterId,
          formValue,
          onChangeWhenSettingDefaultValue = false,
      }): React.ReactElement => {

    const [value, setValue] = React.useState('');

    React.useEffect(() => {

        if (formValue?.value) {

            setValue(String(formValue.value));
        } else if (parameter.forced_default_value) {

            setValue(parameter.forced_default_value);

            if (onChangeWhenSettingDefaultValue) {

                onChange({
                    'target': {
                        'value': parameter.forced_default_value
                    }
                });
            }
        } else if (parameter?.parameter_input?.default_value) {

            setValue(parameter.parameter_input.default_value);

            if (onChangeWhenSettingDefaultValue) {

                onChange({
                    'target': {
                        'value': parameter.parameter_input.default_value
                    }
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onChangeWhenSettingDefaultValue, parameter.forced_default_value, parameter.parameter_input?.default_value, formValue?.value])

    return (
        <>
            {parameter.parameter_input?.values.map((parameterValue: any, parameterIdx: number) => {
                return (
                    <div key={String('parameters_form_div_radio_' + index + parameterIdx)}
                         className="field-radiobutton">

                        <RadioButton
                            key={"parameters_form_input_radio_" + parameterId + '-' + parameterValue.value}
                            inputId={String(parameterId + '-radio-' + parameterIdx)}
                            name={parameter.variable_name || parameterId}
                            value={parameterValue.value}
                            checked={String(value) === String(parameterValue.value)}
                            onChange={(event) => {
                                setValue(String(event.value));
                                onChange(event);
                            }}
                        />
                        <label
                            className="ml-2"
                            htmlFor={String(parameterId + '-radio-' + parameterIdx)}
                        >
                            {parameterValue.name}
                        </label>
                    </div>
                );
            })}
        </>
    )
}

export default ReportParameterRadioButton;