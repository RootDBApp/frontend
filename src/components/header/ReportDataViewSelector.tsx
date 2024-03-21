import { MenuItem }       from "primereact/menuitem";
import * as React         from 'react';
import { useTranslation } from "react-i18next";

import DropDownMenu    from "../common/menu/DropDownMenu";
import TReportDataView from "../../types/TReportDataView";

const ReportDataViewSelector: React.FC<{
    dataViews: TReportDataView[],
    expandedDataView?: number,
    onChange: CallableFunction,
}> = (
    {
        dataViews,
        expandedDataView,
        onChange,
    }
): React.ReactElement => {

    const {t} = useTranslation('report');
    const [label, setLabel] = React.useState<string>(t('report:dataview.available_data_views').toString());
    const [items, setItems] = React.useState<Array<MenuItem>>([]);

    React.useEffect(() => {

        if (expandedDataView && expandedDataView > -1) {

            const dataView = dataViews.find(d => d.id === expandedDataView);
            if (dataView) {
                setLabel(dataView.name);
            } else {

                setLabel(t('report:dataview.available_data_views').toString());
            }
        } else {

            setLabel(t('report:dataview.available_data_views').toString());
        }

        setItems(dataViews.map(dataView => ({

            label: dataView.name,
            command: () => onChange(dataView.id),
            className: (expandedDataView || -1) === dataView.id ? 'active' : '',
        })));

        // We don't care about onChange()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expandedDataView, dataViews, t]);


    return <DropDownMenu
        id="data-view-selector"
        label={label.length > 25 ? `${label.substring(0, 25)}...` : label}
        items={items}
        icon="pi pi-angle-down"
        iconPos="right"
        className="p-button-secondary"
    />;
};

export default ReportDataViewSelector;
