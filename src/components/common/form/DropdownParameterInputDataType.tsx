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

import apiDataContext                 from "../../../contexts/api_data/store/context";
import { getParameterInputDataTypes } from "../../../contexts/api_data/store/actions";

const DropdownParameterInputDataType: React.FC<{
    id: string,
    isInvalid: boolean
} & DropdownProps> = ({id, isInvalid, ...props}): React.ReactElement => {

    const {t} = useTranslation(['report']);
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const [tryCounter, setTryCounter] = React.useState<number>(0);

    React.useEffect(() => {

        if (tryCounter < 1 && apiDataState.parameterInputDataTypes.length === 0 && !apiDataState.parameterInputDataTypesLoading) {

            apiDataDispatch(getParameterInputDataTypes());
            setTryCounter(1);
        } else if (apiDataState.parameterInputDataTypes.length > 0) {

            setTryCounter(0);
        }
    }, [tryCounter, apiDataState.parameterInputDataTypes.length, apiDataState.parameterInputDataTypesLoading, apiDataDispatch]);

    return (
        <Dropdown
            {...props}
            name={id}
            optionLabel="name"
            optionValue="id"
            options={apiDataState.parameterInputDataTypes}
            placeholder={t('report:form.choose_parameter_input_data_type').toString()}
            filter
            // isLoading={apiDataState.formParameterInputDataTypesLoading}
            className={isInvalid ? 'p-invalid w-full' : 'w-full'}
        />
    )
};

export default DropdownParameterInputDataType;