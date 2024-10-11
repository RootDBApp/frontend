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

import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText }               from "primereact/inputtext";
import * as React                  from 'react';
import { useTranslation }          from "react-i18next";

import UserForm           from "./UserForm";
import TLaravelPagination from "../../types/TLaravelPagination";
import TUser              from "../../types/TUser";
import LaravelPaginator   from "../common/LaravelPaginator";
import { getUsers }       from "../../services/apiCommon";
import { dummyUser }      from "../../contexts/auth/store/initialState";
import { IconField }      from "primereact/iconfield";
import { InputIcon }      from "primereact/inputicon";


const UsersList: React.FC = (): React.ReactElement => {

    const {t} = useTranslation('common');

    const [users, setUsers] = React.useState<Array<TUser>>([]);
    const [filteredUsers, setFilteredUsers] = React.useState<Array<TUser>>([]);
    const [pagination, setPagination] = React.useState<TLaravelPagination | undefined>();

    const getUsersCallBackSuccess = (response: Array<TUser>, pagination?: TLaravelPagination): void => {

        setUsers(response);
        setFilteredUsers(response);
        if (pagination) {

            setPagination(pagination);
        }
    };

    React.useEffect(() => {

        getUsers(1, getUsersCallBackSuccess);
    }, []);

    return (
        <>
            <div className="grid">

                <div className="col">
                    <LaravelPaginator
                        paginateCallback={(page: number) => getUsers(page, getUsersCallBackSuccess)}
                        pagination={pagination}
                    />
                </div>

                <div className="col" style={{textAlign: 'center', padding: '1rem'}}>
                    <IconField iconPosition="left" className="w-full">
                        <InputIcon className="pi pi-search"> </InputIcon>
                        <InputText
                            style={{width: '100%'}}
                            placeholder={t('settings:user.search_user').toString()}
                            onKeyUp={(event) => {
                                if (event.key.length > 0) {
                                    setFilteredUsers(
                                        users.filter((user: TUser) => {
                                            return user.name.toLowerCase().search(event.currentTarget.value) !== -1;
                                        }));
                                } else {

                                    setFilteredUsers(users);
                                }
                            }}
                        />
                    </IconField>
                </div>
            </div>

            <Accordion activeIndex={0}>
                {filteredUsers.map(user => (
                    <AccordionTab
                        key={user.id}
                        tabIndex={user.id}
                        header={user.name}
                    >
                        <UserForm
                            user={user}
                            onUpdate={() => getUsers(pagination?.current_page, getUsersCallBackSuccess)}
                            profileMode={false}
                        />
                    </AccordionTab>
                ))}
                {/*I doubt someone will create one day 9999 users.*/}
                <AccordionTab key={9999}
                              tabIndex={9999}
                              header={
                                  <span>
                                    <i className="pi pi-plus mr-3"/>
                                      {t('common:add_user').toString()}
                                   </span>
                              }
                              headerClassName="accordion-new-directory"
                              contentClassName="accordion-new-directory-content"
                >
                    <UserForm
                        user={dummyUser}
                        isNewUser
                        onUpdate={() => getUsers(pagination?.current_page, getUsersCallBackSuccess)}
                        profileMode={false}
                    />
                </AccordionTab>
            </Accordion>
        </>
    );
}

export default UsersList;