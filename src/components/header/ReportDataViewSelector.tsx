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
