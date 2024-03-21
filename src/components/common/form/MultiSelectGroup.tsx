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

import { MultiSelect, MultiSelectProps } from "primereact/multiselect";
import * as React                        from "react";
import { useTranslation }                from "react-i18next";

import apiDataContext from "../../../contexts/api_data/store/context"
import { getGroups }  from "../../../contexts/api_data/store/actions";


const MultiSelectGroup: React.FC<{
    id: string,
    isInvalid: boolean,
    values: Array<number>
} & MultiSelectProps> = ({id, isInvalid, values, ...props}): React.ReactElement => {

    const {t} = useTranslation(['report']);
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const [value, setValue] = React.useState<Array<number>>([]);
    const [tryCounter, setTryCounter] = React.useState<number>(0);

    React.useEffect(() => {

        if (tryCounter < 1 && apiDataState.groups.length === 0 && !apiDataState.groupsLoading) {

            apiDataDispatch(getGroups());
            setTryCounter(1);
        } else if (apiDataState.groups.length > 0 && !apiDataState.groupsLoading) {

            setTryCounter(0);
            setValue(values)
        }
    }, [tryCounter, apiDataState.groups.length, apiDataState.groupsLoading, apiDataDispatch, values]);

    return (<MultiSelect
            {...props}
            name={id}
            optionLabel="name"
            optionValue="id"
            placeholder={t('report:form.choose_groups').toString()}
            value={value}
            options={apiDataState.groups}
            filter
            className={isInvalid ? 'p-invalid w-full' : 'w-full'}
            display="chip"
            scrollHeight="400px"
        />
    )
};

export default MultiSelectGroup;