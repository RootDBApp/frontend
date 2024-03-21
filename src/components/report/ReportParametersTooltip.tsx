import { Column }         from "primereact/column";
import { DataTable }      from "primereact/datatable";
import React              from "react";
import { useTranslation } from "react-i18next";

import TReportParameter        from "../../types/TReportParameter";
import { TNameValue }          from "../../types/TNameValue";
import { getPlaceholderValue } from "../../utils/report";

const ReportParametersTooltip: React.FC<{
    reportParameters: Array<TReportParameter>,
    reportParameterInputValues: Array<TNameValue>,
}> = ({reportParameters, reportParameterInputValues}) => {

    const {t} = useTranslation(['common']);

    const parameterNameTemplate = (colValue: { parameterName: string, parameterValue: string }) => {

        return <span className={(colValue.parameterValue === null || colValue.parameterValue === '') ? 'disabled' : ''}>
            {colValue.parameterName}
        </span>;
    };

    const parameterValueTemplate = (colValue: { parameterName: string, parameterValue: string }) => {

        return <span className={(colValue.parameterValue === null || colValue.parameterValue === '') ? 'disabled' : ''}>
            {(colValue.parameterValue === null || colValue.parameterValue === '') ? t('common:undefined') : colValue.parameterValue}
        </span>;
    };

    return (
        <DataTable
            value={
                reportParameters.map(
                    (reportParameter: TReportParameter) => {

                        return {
                            parameterName: reportParameter.name,
                            parameterValue: getPlaceholderValue(reportParameter.variable_name, reportParameterInputValues, reportParameters)
                        }
                    }
                )
            }
            size="small"
            responsiveLayout="scroll"
            header={t('report:input_parameters_in_use')}
            className="no-header"
        >
            <Column field="parameterName" body={parameterNameTemplate} className="first-letter-uppercase font-semibold"/>
            <Column field="parameterValue" body={parameterValueTemplate}/>
        </DataTable>
    );
};

export default ReportParametersTooltip;