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

import apiDataContext          from "../../../contexts/api_data/store/context";
import { getDataViewLibTypes } from "../../../contexts/api_data/store/actions";
import TReportDataViewLibType  from "../../../types/TReportDataViewLibType";

const DropDownDataViewLibTypes: React.FC<{
    id: string,
    dataViewLibVersionId: number,
    isInvalid: boolean
} & DropdownProps> = ({id, dataViewLibVersionId, isInvalid, ...props}): React.ReactElement => {

    const {t} = useTranslation(['report']);
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const [tryCounter, setTryCounter] = React.useState<number>(0);

    React.useEffect(() => {

        if (tryCounter < 1 && apiDataState.dataViewLibTypes.length === 0 && !apiDataState.dataViewLibTypesLoading) {

            apiDataDispatch(getDataViewLibTypes());
            setTryCounter(1);
        } else if (apiDataState.dataViewLibTypes.length > 0) {

            setTryCounter(0);
        }

    }, [tryCounter, apiDataState.dataViewLibTypes.length, apiDataState.dataViewLibTypesLoading, apiDataDispatch]);

    return (
        <Dropdown
            {...props}
            name={id}
            optionLabel="name"
            optionValue="id"
            options={apiDataState.dataViewLibTypes.filter((libType: TReportDataViewLibType) => libType.report_data_view_lib_version_id === dataViewLibVersionId)}
            placeholder={t('report:form.choose_chart_model').toString()}
            // isLoading={apiDataState.dataViewLibVersionsLoading}
            className={`flex ${isInvalid ? 'p-invalid w-full' : 'w-full'}`}
        />
    )
};

export default DropDownDataViewLibTypes;