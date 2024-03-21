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