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
// import { useTranslation }          from "react-i18next";


import OrganizationForm   from "./OrganizationForm";
import { apiSendRequest } from "../../services/api";
import { EAPIEndPoint }   from "../../types/EAPIEndPoint";
import TOrganization      from "../../types/TOrganization";
import { getUsers }       from "../../services/apiCommon";
import TUser              from "../../types/TUser";

const OrganizationList: React.FC = (): React.ReactElement => {

    // const {t} = useTranslation('common');

    const [organizations, setOrganizations] = React.useState<Array<TOrganization>>([]);
    const [users, setUsers] = React.useState<Array<TUser>>([]);

    const getOrganizations = (): void => {

        apiSendRequest({
            method: 'GET',
            endPoint: EAPIEndPoint.ORGANIZATION,
            urlParameters: [{key: 'for-admin', value: 1}],
            callbackSuccess: (response: Array<TOrganization>) => {

                setOrganizations(response);
            }
        });
    };

    React.useEffect(() => {

        getOrganizations();
        getUsers(1, (response: Array<TUser>) => {

            setUsers(response);
        }, true);
    }, []);

    return (
        <Accordion activeIndex={0}>
            {organizations.map(organization => (
                <AccordionTab key={organization.id} tabIndex={organization.id} header={organization.name}>
                    <OrganizationForm
                        organization={organization}
                        onUpdate={() => getOrganizations()}
                        users={users}
                    />
                </AccordionTab>
            ))}
            {/*<AccordionTab*/}
            {/*    key={9999}*/}
            {/*    header={*/}
            {/*        <span>*/}
            {/*            <i className="pi pi-plus mr-3"/>*/}
            {/*            {t('settings:organization.add_organization')}*/}
            {/*        </span>*/}
            {/*    }*/}
            {/*    headerClassName="accordion-new-organization"*/}
            {/*    contentClassName="accordion-new-organization-content"*/}
            {/*>*/}
            {/*    <OrganizationForm*/}
            {/*        organization={{*/}
            {/*            id: 9999,*/}
            {/*            name: '',*/}
            {/*        }}*/}
            {/*        onUpdate={() => getOrganizations()}*/}
            {/*        isNewOrganization*/}
            {/*        users={users}*/}
            {/*    />*/}
            {/*</AccordionTab>*/}
        </Accordion>
    );
};
export default OrganizationList;