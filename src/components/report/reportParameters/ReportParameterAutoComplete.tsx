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

import { Dropdown } from "primereact/dropdown";
import * as React   from "react";

import TReportParameter from "../../../types/TReportParameter";
import { TNameValue }   from "../../../types/TNameValue";

const ReportParameterAutoComplete: React.FC<{
    parameter: TReportParameter,
    index: number,
    parameterId: string,
    onChange: CallableFunction,
    formValue?: TNameValue,
}> = ({
          index,
          parameter,
          parameterId,
          onChange,
          formValue,
      }): React.ReactElement => {

    const [value, setValue] = React.useState<string>('');

    React.useEffect(() => {
        if (formValue?.value) {

            setValue(String(formValue.value));
        } else if (parameter.forced_default_value) {

            setValue(String(parameter.forced_default_value));
        } else if (parameter?.parameter_input?.default_value) {

            setValue(String(parameter.parameter_input.default_value));
        }
    }, [parameter.forced_default_value, parameter.parameter_input?.default_value, formValue?.value]);

    return <Dropdown
        id={'parameters_form_input_dropdown_' + parameterId + '_' + index}
        name={'parameters_form_input_dropdown_' + parameterId + '_' + index}
        optionLabel="name"
        optionValue="id"
        options={parameter.parameter_input?.values.map(
            (option: {name: string, value: any}) => ({name: option.name, id: String(option.value)})
        )}
        onChange={(event) => {

            setValue(event.target.value);
            onChange(event)
        }}
        placeholder=""
        filter
        value={value}
        className="flex"
        virtualScrollerOptions={{ itemSize: 35.2 }}
    />
}

export default ReportParameterAutoComplete;