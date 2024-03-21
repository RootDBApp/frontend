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