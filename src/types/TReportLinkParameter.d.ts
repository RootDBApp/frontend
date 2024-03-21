import { EReportLinkParameterValueType } from "./EReportLinkParameterValueType";

type TReportLinkParameter = {
    ignore: boolean,
    linkedReportParameterVariableName: string,
    linkedReportParameterVariableValueType: EReportLinkParameterValueType,
    // column name
    // or
    // report parameter variable name
    parameterVariableValueName: string
    emptyValue?: boolean,
}

export = TReportLinkParameter;