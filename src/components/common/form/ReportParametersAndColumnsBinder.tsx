import * as React         from 'react';
import { Button }         from "primereact/button";
import { useTranslation } from "react-i18next";
import TReportParameter   from "../../../types/TReportParameter";

const ReportParametersAndColumnsBinder: React.FC<{
    reportParameters?: TReportParameter[],
    columns?: Array<string>,
    onReportParameterClick: Function,
    onColumnClick: Function,
}> = ({
          reportParameters = [],
          columns = [],
          onReportParameterClick,
          onColumnClick
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);

    return (
        <>
            <div className="flex flex-row mt-3">
                {reportParameters && reportParameters.length > 0 && (
                    <div className="col-6 flex flex-column">
                        <strong>{t('report:report_link.report_parameter').toString()}</strong>
                        <ul className="report-column-binder flex-grow-1">
                            {reportParameters.map(p => (
                                <li key={p.id}>
                                    <Button
                                        type="button"
                                        text
                                        className="p-button-secondary w-full"
                                        onClick={() => onReportParameterClick(p.variable_name)}
                                    >
                                        {p.variable_name}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {columns && columns.length > 0 && (
                    <div className="col-6 flex flex-column">
                        <strong>{t('report:report_link.column_value').toString()}</strong>
                        <ul className="report-column-binder flex-grow-1">
                            {columns.map(column => (
                                <li key={column}>
                                    <Button
                                        type="button"
                                        text
                                        className="p-button-secondary w-full"
                                        onClick={() => onColumnClick(column)}
                                    >
                                        {column}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
}

export default ReportParametersAndColumnsBinder;