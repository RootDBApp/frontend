import TParameterInputType     from "./TParameterInputType";
import TParameterInputDataType from "./TParameterInputDataType";
import TConnector              from "./TConnector";

type TParameterInput = {
    conf_connector_id: number,
    custom_entry: number,
    default_value: string,
    id: number,
    name: string,
    parameter_input_type_id: number,
    parameter_input_data_type_id: number,
    query: string,
    query_default_value: string,
    conf_connector?: TConnector,
    parameter_input_type?: TParameterInputType,
    parameter_input_data_type?: TParameterInputDataType,
    values?: any,
};
export = TParameterInput;