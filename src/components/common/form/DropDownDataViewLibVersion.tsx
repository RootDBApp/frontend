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
import * as React                  from "react";
import { useTranslation }          from "react-i18next";

import apiDataContext             from "../../../contexts/api_data/store/context";
import { getDataViewLibVersions } from "../../../contexts/api_data/store/actions";
import TReportDataViewLibVersion  from "../../../types/TReportDataViewLibVersion";
import { EDataViewType }          from "../../../types/EDataViewType";


const DropDownDataViewLibVersion: React.FC<{
    id: string,
    dataViewTypeId: EDataViewType,
    isInvalid: boolean
} & DropdownProps> = ({id, dataViewTypeId, isInvalid, ...props}): React.ReactElement => {

    const {t} = useTranslation(['report']);
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const [tryCounter, setTryCounter] = React.useState<number>(0);

    React.useEffect(() => {

        if (tryCounter < 1 && apiDataState.dataViewLibVersions.length === 0 && !apiDataState.dataViewLibVersionsLoading) {

            apiDataDispatch(getDataViewLibVersions());
            setTryCounter(1);
        } else if (apiDataState.dataViewLibVersions.length > 0) {

            setTryCounter(0);
        }

    }, [tryCounter, apiDataState.dataViewLibVersions.length, apiDataState.dataViewLibVersionsLoading, apiDataDispatch]);

    return (
        <Dropdown
            {...props}
            name={id}
            optionLabel="name"
            optionValue="id"
            options={apiDataState.dataViewLibVersions.filter((libVersion: TReportDataViewLibVersion) => Number(libVersion.report_data_view_lib.type) === dataViewTypeId)}
            placeholder={t('report:form.choose_library').toString()}
            // isLoading={apiDataState.dataViewLibVersionsLoading}
            className={`flex ${isInvalid ? 'p-invalid w-full' : 'w-full'}`}
        />
    )
};

export default DropDownDataViewLibVersion;