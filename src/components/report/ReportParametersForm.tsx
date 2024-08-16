/*
 * This file is part of RootDB.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * AUTHORS
 * PORQUET Sébastien <sebastien.porquet@ijaz.fr>
 * ROBIN Brice <brice@robri.net>
 */

import { Accordion, AccordionTab } from "primereact/accordion";
import * as React                  from "react";
import { useTranslation }          from "react-i18next";

import TReportParameter    from "../../types/TReportParameter";
import ReportParameterForm from "./report-Parameters/ReportParameterForm";
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