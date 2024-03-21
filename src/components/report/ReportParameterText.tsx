import { InputText }     from "primereact/inputtext";
import { KeyFilterType } from "primereact/keyfilter";
import * as React        from "react";

import TReportParameter from "../../types/TReportParameter";
import { TNameValue }   from "../../types/TNameValue";


const ReportParameterText: React.FC<{
    index: number,
    onChange: CallableFunction,
    parameter: TReportParameter,
    parameterId: string
    formValue?: TNameValue,
    keyFilter?: KeyFilterType,
    onChangeWhenSettingDefaultValue?: boolean
}> = ({
          parameter,
          index,
          parameterId,
          onChange,
          formValue,
          keyFilter,
          onChangeWhenSettingDefaultValue = false,
      }): React.ReactElement => {

    const [value, setValue] = React.useState('');

    React.useEffect(() => {
        if (formValue) {

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
    }, [onChangeWhenSettingDefaultValue, parameter.forced_default_value, parameter.parameter_input?.default_value, formValue])

    return <InputText
        id={'parameters_form_input_text_' + parameterId + '_' + index}
        key={String('parameters_form_input_text_' + parameterId + '_' + index)}
        name={parameter.variable_name}
        type="text"
        defaultValue={value}
        onChange={(event) => onChange(event)}
        autoFocus
        keyfilter={keyFilter}
        className="w-full"
    />
}

export default ReportParameterText;