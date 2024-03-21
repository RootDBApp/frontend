import { Dropdown, DropdownProps } from "primereact/dropdown";
import * as React                  from 'react';
import { useTranslation }          from "react-i18next";

import TReportDataView from "../../../types/TReportDataView";

const DropdownDataViewSelector: React.FC<{
    className?: string,
    dataViews: TReportDataView[],
    dataViewId?: number,
    onChange: DropdownProps["onChange"],
}> = (
    {
        className,
        dataViews,
        dataViewId,
        onChange,
    }
): React.ReactElement => {
    const {t} = useTranslation('report');

    return <Dropdown
        className={className}
        name="data_view_selector"
        placeholder={t('report:dataview.available_data_views').toString()}
        optionLabel="name"
        optionValue="id"
        options={dataViews}
        value={dataViewId}
        onChange={onChange}
    />
};

export default DropdownDataViewSelector;
