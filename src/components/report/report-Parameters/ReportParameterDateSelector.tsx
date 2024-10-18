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

import { Calendar }       from "primereact/calendar";
import { Dropdown }       from "primereact/dropdown";
import { Nullable }       from "primereact/ts-helpers";
import * as React         from "react";
import { useTranslation } from "react-i18next";

import TReportParameter                       from "../../../types/TReportParameter";
import DropDownPreDefinedDate, { offSetType } from "../../common/form/DropDownPreDefinedDate";
import { TNameValue }                         from "../../../types/TNameValue";
import { context as authContext }             from "../../../contexts/auth/store/context";
import { Button }                             from "primereact/button";
import InputDateSelector                      from "../../common/form/InputDateSelector";
import ReportParameterCalendar                from "./ReportParameterCalendar";

const ReportParameterDateSelector: React.FC<{
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
          formValue
      }): React.ReactElement => {

    const [value, setValue] = React.useState<Nullable<Date>>();

    const defaultValue = React.useMemo(() => {
        if (parameter.forced_default_value) {

            return new Date(parameter.forced_default_value);
        }

        if (parameter?.parameter_input?.default_value) {

            return new Date(parameter.parameter_input.default_value);
        }
    }, [parameter.forced_default_value, parameter.parameter_input?.default_value])

    React.useEffect(() => {
        if (formValue) {
            if (String(formValue.value).indexOf('/') !== -1) {

                const dateFragments = String(formValue.value).split('/');
                setValue(new Date(dateFragments[2] + '-' + dateFragments[1] + '-' + dateFragments[0]));
            } else {

                setValue(new Date(String(formValue.value)));
            }
            // do nothing.
        } else if (defaultValue) {

            setValue(new Date(defaultValue));
        }
    }, [formValue, defaultValue, parameter.variable_name]);

    return (
        <div className="input-date-selector">
            <ReportParameterCalendar
                formValue={{ name: formValue?.name || 'calendar', value: value?.toString()}}
                parameter={parameter}
                index={index}
                parameterId={parameterId}
                onChange={onChange}
            />
            <InputDateSelector
                value={value}
                options={parameter.parameter_input?.values}
                onChange={(date: Date) => {
                    setValue(date);
                    onChange({value: date})
                }}
            />
        </div>
    );
}

export default ReportParameterDateSelector;