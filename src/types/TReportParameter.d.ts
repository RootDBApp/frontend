import TParameterInput from "./TParameterInput";

type TReportParameter = {
    available_public_access: boolean,
    following_parameter_next_to_this_one: boolean,
    id: number,
    name: string,
    parameter_input_id: number,
    report_id: number,
    variable_name: string,
    forced_default_value?: string,
    parameter_input?: TParameterInput,
}

export = TReportParameter;