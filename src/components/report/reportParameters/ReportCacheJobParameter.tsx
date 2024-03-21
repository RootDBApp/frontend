import * as React      from 'react';
import { ChangeEvent } from "react";


import TReportParameter            from "../../../types/TReportParameter";
import ReportParameterText         from "../ReportParameterText";
import ReportParameterMultiSelect  from "./ReportParameterMultiSelect";
import { MultiSelectChangeEvent }  from "primereact/multiselect";
import ReportParameterRadioButton  from "./ReportParameterRadioButton";
import { TNameValue }              from "../../../types/TNameValue";
import apiDataContext              from "../../../contexts/api_data/store/context";
import ReportParameterCheckboxes   from "./ReportParameterCheckboxes";
import ReportCacheJobParameterDate from "./ReportCacheJobParameterDate";

const ReportCacheJobParameter: React.FC<{
    index: number,
    parameter: TReportParameter,
    value: TNameValue,
    onChange: CallableFunction,
}> = ({
          index,
          parameter,
          onChange,
          value,
      }): React.ReactElement => {

    const {state: apiDataState} = React.useContext(apiDataContext);

    const paramId: string = parameter.id + '-' + parameter.variable_name;
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

                    onChange(
                        {
                            name: parameter.variable_name,
                            value: values,
                        },
                        parameter);
                }}
                onChangeWhenSettingDefaultValue
            />;

        case 'date':
            return <ReportCacheJobParameterDate
                parameter={parameter}
                index={index}
                parameterId={paramId}
                onChange={(event: MultiSelectChangeEvent) => {

                    onChange(
                        {
                            name: parameter.variable_name,
                            value: event.target.value.join(','),
                        },
                        parameter
                    );
                }}
                formValue={value}
            />

        case 'text':
            return <ReportParameterText
                parameter={parameter}
                index={index}
                parameterId={paramId}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {

                    onChange(
                        {
                            name: parameter.variable_name,
                            value: event.target.value,
                        },
                        parameter
                    );
                }}
                onChangeWhenSettingDefaultValue
                formValue={value}
                keyFilter={paramDataType && paramDataType.name === 'integer' ? 'int' : undefined}
            />

        case 'multi-select':
            return <ReportParameterMultiSelect
                parameter={parameter}
                index={index}
                parameterId={paramId}
                onChange={(event: MultiSelectChangeEvent) => {

                    onChange(
                        {
                            name: parameter.variable_name,
                            value: event.target.value.join(','),
                        },
                        parameter
                    );
                }}
                onChangeWhenSettingDefaultValue
                formValue={value}
            />

        case 'radio':
            return <ReportParameterRadioButton
                parameter={parameter}
                index={index}
                parameterId={paramId}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {

                    onChange(
                        {
                            name: parameter.variable_name,
                            value: event.target.value,
                        },
                        parameter
                    );
                }}
                onChangeWhenSettingDefaultValue
                formValue={value}
            />

        case 'select':
            return <ReportParameterMultiSelect
                parameter={parameter}
                index={index}
                parameterId={paramId}
                onChange={(event: MultiSelectChangeEvent) => {

                    onChange(
                        {
                            name: parameter.variable_name,
                            value: event.target.value.join(','),
                        },
                        parameter
                    );
                }}
                onChangeWhenSettingDefaultValue
                formValue={value}
            />

        default:
            return <></>;
    }
}

export default ReportCacheJobParameter;