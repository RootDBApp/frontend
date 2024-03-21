import { Button }                 from "primereact/button";
import { Steps }                  from "primereact/steps";
import * as React                 from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation }         from "react-i18next";

import ReportCreateForm         from "./ReportCreateForm";
import ReportDataViewForm       from "./data-view/ReportDataViewForm";
import ReportParametersForm     from "./ReportParametersForm";
import TReport                  from "../../types/TReport";
import TReportDataView          from "../../types/TReportDataView";
import { generateReportUniqId } from "../../utils/tools";

const ReportCreateWizard: React.FC = (): React.ReactElement => {

    const [activeIndex, setActiveIndex] = React.useState<number>(0);
    const [report, setReport] = React.useState<TReport | undefined>();
    const [dataView, setDataView] = React.useState<TReportDataView | undefined>();

    const {t} = useTranslation(['common', 'report']);
    const navigate = useNavigate();
    const {directoryId} = useParams();

    const items = [
        {label: t('report:form.create_report')},
        {label: t('report:form.create_dataview')},
        {label: t('report:form.parameters')},
    ];

    return (
        <>
            <Steps model={items} activeIndex={activeIndex} className="mb-4"/>

            {activeIndex === 0 && (
                <ReportCreateForm
                    directoryId={directoryId && Number(directoryId) >= 0 ? Number(directoryId) : undefined}
                    onSuccess={(report: TReport) => {

                        setReport(report);
                        setActiveIndex(1);
                    }}
                />
            )}

            {activeIndex === 1 && report && (
                <ReportDataViewForm
                    dataViewId={0}
                    reportId={report.id}
                    onSuccess={(dataView: TReportDataView) => {

                        setDataView(dataView);
                        setActiveIndex(2);
                    }}
                />
            )}

            {activeIndex === 2 && report && (
                <>
                    <ReportParametersForm
                        alwaysShowNewParam
                        reportId={report.id}
                    />
                    <div className="flex justify-content-end">
                        <Button
                            type="button"
                            className="p-button p-button-primary p-button-outlined mt-4"
                            label={t('report:form.close_and_edit_data_view').toString()}
                            onClick={() => {

                                // @ts-ignore
                                navigate(`/report/${generateReportUniqId(report.id)}/data-view/${dataView.id}?run`);
                            }}
                        />
                    </div>
                </>
            )}
        </>
    );
}

export default ReportCreateWizard;