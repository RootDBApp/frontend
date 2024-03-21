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

import apiDataContext from "../../../contexts/api_data/store/context";
import { getUsers }   from "../../../contexts/api_data/store/actions";
import TUser          from "../../../types/TUser";

const MultiSelectUser: React.FC<{
    id: string,
    isInvalid: boolean,
    values: Array<number>,
    users?: Array<TUser>
} & MultiSelectProps> = ({id, isInvalid, values, users, ...props}): React.ReactElement => {

    const {t} = useTranslation(['report']);
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const [value, setValue] = React.useState<Array<number>>([]);
    const [tryCounter, setTryCounter] = React.useState<number>(0);

    React.useEffect(() => {

        if (users && users.length > 0) {

            setValue(values);
        } else {

            if (tryCounter < 1 && apiDataState.users.length === 0 && !apiDataState.usersLoading) {

                apiDataDispatch(getUsers());
                setTryCounter(1);
            } else if (apiDataState.users.length > 0 && !apiDataState.usersLoading) {

                setTryCounter(0);
                setValue(values);
            }
        }

    }, [users, tryCounter, apiDataState.users.length, apiDataState.usersLoading, apiDataDispatch, values]);

    return (
        <MultiSelect
            {...props}
            name={id}
            optionLabel="name"
            optionValue="id"
            placeholder={t('report:form.choose_users').toString()}
            value={value}
            options={users && users.length > 0 ? users : apiDataState.users}
            filter
            className={isInvalid ? 'p-invalid w-full' : 'w-full'}
            display="chip"
            scrollHeight="400px"
            virtualScrollerOptions={{ itemSize: 36 }}
        />
    )
};

export default MultiSelectUser;