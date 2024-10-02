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

import { Dropdown, DropdownProps }       from "primereact/dropdown";
import { MultiSelect, MultiSelectProps } from "primereact/multiselect";
import * as React                        from "react";
import { useTranslation }                from "react-i18next";

import apiDataContext             from "../../../contexts/api_data/store/context";
import { getParameterInputTypes } from "../../../contexts/api_data/store/actions";
import TParameterInputType        from "../../../types/TParameterInputType";

const DropdownParameterInputType: React.FC<{
    id: string,
    isInvalid?: boolean,
    placeholder?: string,
    fullWidth?: boolean,
    multiSelect?: boolean
} & (DropdownProps | MultiSelectProps)> = ({
                                               id,
                                               isInvalid = false,
                                               placeholder,
                                               fullWidth = true,
                                               multiSelect = false,
                                               ...props
                                           }): React.ReactElement => {

    const {t} = useTranslation(['report']);
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const [tryCounter, setTryCounter] = React.useState<number>(0);

    React.useEffect(() => {

        if (tryCounter < 1 && apiDataState.parameterInputTypes.length === 0 && !apiDataState.parameterInputTypesLoading) {

            apiDataDispatch(getParameterInputTypes());
            setTryCounter(1);
        } else if (apiDataState.parameterInputTypes.length > 0) {

            setTryCounter(0);
        }
    }, [tryCounter, apiDataState.parameterInputTypes.length, apiDataState.parameterInputTypesLoading, apiDataDispatch]);

    return (
        <>
            {multiSelect ? (
                <MultiSelect
                    {...props as MultiSelectProps}
                    name={id}
                    optionLabel="name"
                    optionValue="id"
                    options={apiDataState.parameterInputTypes.filter((parameterInput: TParameterInputType) => parameterInput.name !== 'auto-complete')}
                    placeholder={placeholder || t('report:form.choose_parameter_input_type').toString()}
                    filter
                    className={`${fullWidth ? 'w-full' : ''} ${isInvalid ? 'p-invalid' : ''}`}
                    virtualScrollerOptions={{ itemSize: 36 }}
                />
            ) : (
                <Dropdown
                    {...props as DropdownProps}
                    name={id}
                    optionLabel="name"
                    optionValue="id"
                    options={apiDataState.parameterInputTypes.filter((parameterInput: TParameterInputType) => parameterInput.name !== 'auto-complete')}
                    placeholder={placeholder || t('report:form.choose_parameter_input_type').toString()}
                    filter
                    className={`${fullWidth ? 'w-full' : ''} ${isInvalid ? 'p-invalid' : ''}`}
                    virtualScrollerOptions={{ itemSize: 35.2 }}
                />
            )}
        </>
    )
};

export default DropdownParameterInputType;