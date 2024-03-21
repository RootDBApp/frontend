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
import * as React                  from 'react';
import { useTranslation }          from "react-i18next";


import apiDataContext             from "../../contexts/api_data/store/context";
import GroupForm                  from "./GroupForm";
import { context as authContext } from "../../contexts/auth/store/context";
import { getGroups }              from "../../contexts/api_data/store/actions";

const GroupsList: React.FC = (): React.ReactElement => {

    const {t} = useTranslation('common');

    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext)
    const {state: {groups}} = React.useContext(apiDataContext);
    const {state: authState} = React.useContext(authContext);

    const [tryCounter, setTryCounter] = React.useState<number>(0);

    React.useEffect(() => {

        if (tryCounter < 1 && apiDataState.groups.length === 0 && !apiDataState.groupsLoading) {

            apiDataDispatch(getGroups());
            setTryCounter(1);
        } else if (apiDataState.groups.length > 0) {

            setTryCounter(0);
        }
    }, [tryCounter, apiDataState.groups.length, apiDataState.groupsLoading, apiDataDispatch]);

    return (
        <Accordion activeIndex={0}>
            {groups.map(group => (
                <AccordionTab key={group.id} tabIndex={group.id} header={group.name}>
                    <GroupForm group={group}/>
                </AccordionTab>
            ))}
            <AccordionTab
                key={9999}
                tabIndex={9999}
                header={
                    <span>
                        <i className="pi pi-plus mr-3"/>
                        {t('common:add_group').toString()}
                    </span>
                }
                headerClassName="accordion-new-category"
                contentClassName="accordion-new-category-content"
            >
                <GroupForm
                    group={{
                        organization_id: authState.user.organization_user.organization_id,
                        id: 9999,
                        name: '',
                    }}
                    isNewGroup
                />
            </AccordionTab>
        </Accordion>
    );
};
export default GroupsList;