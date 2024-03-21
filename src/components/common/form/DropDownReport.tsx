import { Dropdown, DropdownProps } from "primereact/dropdown";
import * as React                  from "react";
import { useTranslation }          from "react-i18next";

import apiDataContext from "../../../contexts/api_data/store/context";
import TReport        from "../../../types/TReport";

const DropDownReport: React.FC<{
    id: string,
    isInvalid: boolean,
    excludedReportIds?: Array<number>
} & DropdownProps> = ({
                          id,
                          isInvalid,
                          excludedReportIds,
                          ...props
                      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);

    const {state: apiDataState} = React.useContext(apiDataContext);

    return (
        <Dropdown
            {...props}
            name={id}
            optionLabel="name"
            optionValue="id"
            options={apiDataState.reports.filter((report: TReport) => {

                return !(excludedReportIds && excludedReportIds.find((reportId: number) => reportId === report.id));
            })}
            placeholder={t('report:form.choose_report').toString()}
            filter
            // isLoading={apiDataState.formconnectorsLoading}
            className={`flex ${isInvalid ? 'p-invalid w-full' : 'w-full'}`}
            virtualScrollerOptions={{ itemSize: 35.2 }}
        />
    )
};


export default DropDownReport;