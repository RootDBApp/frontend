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

import { MultiSelect } from "primereact/multiselect";
import * as React      from "react";

import TReportParameter        from "../../../types/TReportParameter";
import { TNameValue }          from "../../../types/TNameValue";
import { getParameterInputAs } from "../../../utils/tools";

const ReportParameterMultiSelect: React.FC<{
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

    const [value, setValue] = React.useState<Array<number | string>>([]);
    const [isDisplayed, setIsDisplayed] = React.useState<Boolean>(false);

    React.useEffect(() => {

        if (formValue && formValue.value !== null && formValue.value !== '' && formValue.value !== 'null') {

            setValue(String(formValue.value).split(',').map(loopedValue => {

                return getParameterInputAs(loopedValue, parameter.parameter_input?.parameter_input_data_type);
            }));
        } else if (parameter.forced_default_value) {

            if (!isDisplayed) {

                const value = parameter.forced_default_value.split(',').map(loopedValue => {

                    return getParameterInputAs(loopedValue, parameter.parameter_input?.parameter_input_data_type);
                });

                setValue(value);

                if (onChangeWhenSettingDefaultValue) {

                    onChange({
                        'target': {
                            'value': value
                        }
                    });
                }
            }
        } else if (parameter?.parameter_input?.default_value) {

            if (!isDisplayed) {

                const value = parameter.parameter_input.default_value.split(',').map(loopedValue => {

                    return getParameterInputAs(loopedValue, parameter.parameter_input?.parameter_input_data_type);
                });

                setValue(value);

                if (onChangeWhenSettingDefaultValue) {

                    onChange({
                        'target': {
                            'value': value
                        }
                    });
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        formValue,
        isDisplayed,
        onChangeWhenSettingDefaultValue,
        parameter.forced_default_value,
        parameter.parameter_input?.parameter_input_data_type,
        parameter.parameter_input?.default_value,
        parameter.variable_name,
    ]);

    React.useEffect(() => {

        setIsDisplayed(true);
    }, []);

    return <MultiSelect
        id={'parameters_form_input_dropdown_' + parameterId + '_' + index}
        name={'parameters_form_input_dropdown_' + parameterId + '_' + index}
        optionLabel="name"
        optionValue="value"
        options={parameter.parameter_input?.values}
        onChange={(event) => {

            setValue(event.target.value);
            onChange(event)
        }}
        placeholder=""
        filter
        display="chip"
        value={value}
        className="w-full"
        virtualScrollerOptions={{itemSize: 36}}
    />
}

export default ReportParameterMultiSelect;