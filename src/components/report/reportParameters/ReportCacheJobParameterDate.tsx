import { MultiSelect }    from "primereact/multiselect";
import * as React         from "react";
import { useTranslation } from "react-i18next";

import TReportParameter        from "../../../types/TReportParameter";
import { TNameValue }          from "../../../types/TNameValue";
import { getParameterInputAs } from "../../../utils/tools";

const ReportCacheJobParameterDate: React.FC<{
    index: number,
    onChange: CallableFunction,
    parameter: TReportParameter,
    parameterId: string,
    formValue?: TNameValue,
}> = ({
          index,
          onChange,
          parameter,
          parameterId,
          formValue,
      }): React.ReactElement => {

    const {t} = useTranslation('common');

    const [value, setValue] = React.useState<Array<number | string>>([]);

    React.useEffect(() => {

        if (formValue && formValue.value !== null && formValue.value !== '' && formValue.value !== 'null') {

            setValue(String(formValue.value).split(',').map(loopedValue => {

                return getParameterInputAs(loopedValue, parameter.parameter_input?.parameter_input_data_type);
            }));
        } else {

            setValue(['default']);
            onChange({
                'target': {
                    'value': ['default']
                }
            });
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        formValue,
        parameter.forced_default_value,
        parameter.parameter_input?.parameter_input_data_type,
        parameter.parameter_input?.default_value,
        parameter.variable_name,
    ]);

    return <MultiSelect
        id={'parameters_form_input_dropdown_' + parameterId + '_' + index}
        name={'parameters_form_input_dropdown_' + parameterId + '_' + index}
        optionLabel="name"
        optionValue="value"
        options={[
            {value: 'default', name: t('common:dates.default').toString()},
            {value: '1-week', name: t('common:dates.week', {count: 1}).toString()},
            {value: '2-weeks', name: t('common:dates.week', {count: 2}).toString()},
            {value: '3-weeks', name: t('common:dates.week', {count: 3}).toString()},
            {value: '4-weeks', name: t('common:dates.week', {count: 4}).toString()},
            {value: '1-month', name: t('common:dates.month', {count: 1}).toString()},
            {value: '2-months', name: t('common:dates.month', {count: 2}).toString()},
            {value: '3-months', name: t('common:dates.month', {count: 3}).toString()},
            {value: '4-months', name: t('common:dates.month', {count: 4}).toString()},
            {value: '5-months', name: t('common:dates.month', {count: 5}).toString()},
            {value: '6-months', name: t('common:dates.month', {count: 6}).toString()},
            {value: '1-year', name: t('common:dates.year', {count: 1}).toString()},
            {value: '2-years', name: t('common:dates.year', {count: 2}).toString()},
            {value: '3-years', name: t('common:dates.year', {count: 3}).toString()},
            {value: '4-years', name: t('common:dates.year', {count: 4}).toString()},
            {value: '5-years', name: t('common:dates.year', {count: 5}).toString()},
        ]}
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

export default ReportCacheJobParameterDate;