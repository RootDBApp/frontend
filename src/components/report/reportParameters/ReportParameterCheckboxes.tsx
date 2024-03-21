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

import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import * as React                        from "react";

import TReportParameter from "../../../types/TReportParameter";
import { TNameValue }   from "../../../types/TNameValue";

const ReportParameterCheckboxes: React.FC<{
    index: number,
    onChange: CallableFunction,
    parameter: TReportParameter,
    parameterId: string,
    formValue?: TNameValue,
    onChangeWhenSettingDefaultValue?: boolean
}> = ({
          index,
          parameter,
          parameterId,
          onChange,
          formValue,
          onChangeWhenSettingDefaultValue = false,
      }) => {

    const [values, setValues] = React.useState<string[]>([]);

    const onCheckChange = (event: CheckboxChangeEvent) => {

        let options = [...values];

        if (event.checked) {
            options.push(String(event.value));
        } else {
            options.splice(options.indexOf(String(event.value)), 1);
        }

        setValues(options);

        onChange(options.join(','));
    }

    React.useEffect(() => {

        if (formValue && formValue.value) {

            setValues(String(formValue.value).split(',').map(value => value));
            // do nothing.
        } else if (parameter.forced_default_value) {

            const values = parameter.forced_default_value.split(',').map(value => value);
            setValues(values);

            if (onChangeWhenSettingDefaultValue) {

                onChange({
                    'target': {
                        'value': values
                    }
                });
            }

        } else if (parameter?.parameter_input?.default_value) {

            const values = parameter.parameter_input.default_value.split(',').map(value => value);
            setValues(values);

            if (onChangeWhenSettingDefaultValue) {

                onChange({
                    'target': {
                        'value': values
                    }
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onChangeWhenSettingDefaultValue, parameter.forced_default_value, parameter.parameter_input?.default_value, parameter.variable_name, formValue]);

    return (
        <div className="flex flex-column">
            {parameter.parameter_input?.values.map((parameterValue: any, parameterIdx: number) => (
                <div className="col-12" key={String('parameters_form_div_checkbox_' + index + parameterIdx)}>
                    <Checkbox
                        inputId={String(parameterId + '-checkbox-' + parameterIdx)}
                        value={parameterValue.value}
                        onChange={(event) => onCheckChange(event)}
                        checked={values.includes(String(parameterValue.value))}
                    />
                    <label
                        htmlFor={String(parameterId + '-checkbox-' + parameterIdx)}
                        className="ml-2"
                    >
                        {parameterValue.name}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default ReportParameterCheckboxes;