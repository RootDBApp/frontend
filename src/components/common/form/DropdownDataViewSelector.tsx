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
