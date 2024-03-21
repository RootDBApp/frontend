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

import apiDataContext  from "../../../contexts/api_data/store/context";
import { getUsers }    from "../../../contexts/api_data/store/actions";
import { ERole }       from "../../../types/ERole";
import TUser           from "../../../types/TUser";
import { filterUsers } from "../../../utils/tools";

const DropdownUser: React.FC<{
    id: string,
    isInvalid: boolean,
    defaultValue?: number,
    excludeUserIds?: Array<number>,
    filterOnRoles?: Array<ERole>,
    selectFirst?: boolean,
} & DropdownProps> = (
    {
        id,
        isInvalid,
        defaultValue,
        excludeUserIds,
        filterOnRoles,
        selectFirst = false,
        ...props
    }): React.ReactElement => {

    const {t} = useTranslation(['report']);
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const [value, setValue] = React.useState<number>(0);
    const [tryCounter, setTryCounter] = React.useState<number>(0);
    const [filteredUsers, setFilteredUsers] = React.useState<Array<TUser>>([]);


    // Used to get data from API is not already in web browser cache.
    //
    React.useEffect(() => {

        if (tryCounter < 1 && apiDataState.users.length === 0 && !apiDataState.usersLoading) {

            apiDataDispatch(getUsers());
            setTryCounter(1);
        } else if (apiDataState.users.length > 0 && !apiDataState.usersLoading) {

            setFilteredUsers(filterUsers(apiDataState.users, filterOnRoles, excludeUserIds));
            setTryCounter(0);
        }

    }, [
        excludeUserIds,
        filterOnRoles,
        selectFirst,
        tryCounter,
        apiDataState.users,
        apiDataState.users.length,
        apiDataState.usersLoading,
        apiDataDispatch
    ]);

    // Used to select a custom value if asked.
    //
    React.useEffect(() => {

        if (filteredUsers.length > 0 && selectFirst) {

            if (defaultValue) {

                setValue(defaultValue)
            } else if (selectFirst) {

                setValue(filteredUsers.find(
                        (user: TUser) => {

                            return user;
                        })?.id
                    ?? 0
                );
            }
        }

    }, [defaultValue, filteredUsers, selectFirst]);


    return (
        <Dropdown
            {...props}
            name={id}
            optionLabel="name"
            optionValue={"id"}
            placeholder={t('report:form.choose_users').toString()}
            value={value}
            options={filteredUsers}
            filter
            className={isInvalid ? 'p-invalid w-full' : 'w-full'}
            virtualScrollerOptions={{ itemSize: 35.2 }}
        />
    )
};

export default DropdownUser;