import { Accordion, AccordionTab } from "primereact/accordion";
import * as React                  from "react";
import { useTranslation }          from "react-i18next";

import TReportParameter    from "../../types/TReportParameter";
import ReportParameterForm from "./reportParameters/ReportParameterForm";
import { useDispatch }     from "../../contexts/report/ReportContextProvider";
import * as RTReport       from "../../contexts/report/ReportContextProvider";
import { getReport }       from "../../contexts/report/store/asyncAction";
import HelpButton          from "../help/HelpButton";


const ReportParametersForm: React.FC<{
    reportId: number,
    alwaysShowNewParam?: boolean,
}> = ({
          reportId,
          alwaysShowNewParam = false,
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);
    const reportDispatch = useDispatch();
    const {report} = RTReport.useReportState(reportId);

    React.useEffect(() => {

        if (!report?.id && reportId > 0) {

            // reportInstanceId: 9999999999999 because report configuration is common to all instances.
            reportDispatch(getReport({reportId: reportId, reportInstanceId: 9999999999999}));
        }
    }, [reportId, report?.id, reportDispatch])

    return (
        <>
            <div className="flex justify-content-end ">
                <HelpButton
                    className="flex align-items-center justify-content-center mb-2"
                    helpCardPath="report-parameters"
                />
            </div>
            <Accordion activeIndex={alwaysShowNewParam ? null : 0}>

                {report?.parameters?.map(
                    (parameter: TReportParameter) => (

                        <AccordionTab key={parameter.id} tabIndex={parameter.id} header={parameter.name}>
                            <ReportParameterForm
                                confConnectorId={report?.conf_connector_id} parameter={parameter}
                                reportId={Number(report ? report.id : 0)}
                            />
                        </AccordionTab>
                    )
                )}
                {!alwaysShowNewParam && (
                    <AccordionTab
                        key={9999}
                        tabIndex={9999}
                        header={
                            <span>
                      <i className="pi pi-plus mr-3"/>
                                {t('report:form.new_parameter').toString()}
                  </span>
                        }
                        headerClassName="accordion-new-param"
                        contentClassName="accordion-new-param-content"
                    >
                        <ReportParameterForm
                            confConnectorId={report?.conf_connector_id}
                            isNewParameter
                            parameter={{
                                id: 0,
                                report_id: Number(report ? report.id : 0),
                                parameter_input_id: 0,
                                name: '',
                                variable_name: '',
                                following_parameter_next_to_this_one: false,
                                available_public_access: true
                            }}
                            reportId={Number(report ? report.id : 0)}
                            resetOnCreate
                        />
                    </AccordionTab>
                )}

            </Accordion>
            {alwaysShowNewParam && (
                <Accordion activeIndex={0} className="mt-3">
                    <AccordionTab
                        tabIndex={0}
                        header={(
                            <span>
                                <i className="pi pi-plus mr-3"/>
                                {t('report:form.new_parameter').toString()}
                            </span>
                        )}
                        headerClassName="accordion-new-param"
                        contentClassName="accordion-new-param-content"
                    >
                        <ReportParameterForm
                            confConnectorId={report?.conf_connector_id}
                            isNewParameter
                            parameter={{
                                id: 0,
                                report_id: Number(report?.id),
                                parameter_input_id: 0,
                                name: '',
                                variable_name: '',
                                following_parameter_next_to_this_one: false,
                                available_public_access: true
                            }}
                            reportId={Number(report ? report.id : 0)}
                            resetOnCreate
                        />
                    </AccordionTab>
                </Accordion>
            )}
        </>
    )
}

export default ReportParametersForm;