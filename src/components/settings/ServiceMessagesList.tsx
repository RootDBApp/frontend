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

import TServiceMessage            from "../../types/TServiceMessage";
import { apiSendRequest }         from "../../services/api";
import { EAPIEndPoint }           from "../../types/EAPIEndPoint";
import ServiceMessageForm         from "./ServiceMessageForm";
import { context as authContext } from "../../contexts/auth/store/context";
import { Message }                from "primereact/message";

const UsersList: React.FC = (): React.ReactElement => {

    const {t} = useTranslation('common, settings');
    const {state: authState} = React.useContext(authContext);

    const [serviceMessages, setServiceMessages] = React.useState<Array<TServiceMessage>>([]);

    // Not using apiCache context because we need to list all service messages from all organization user have access.
    const getServiceMessages = (): void => {

        apiSendRequest({
            method: 'GET',
            endPoint: EAPIEndPoint.SERVICE_MESSAGE,
            callbackSuccess: (response: Array<TServiceMessage>) => {

                setServiceMessages(response);
            }
        });
    }

    React.useEffect(() => {

        getServiceMessages();
    }, []);

    return (
        <>
            <Message
                style={{width: '100%'}}
                className="mb-2"
                severity="info"
                text={t('settings:service_message.service_message_explanation')}
            />
            <Accordion activeIndex={0}>
                {serviceMessages.map((serviceMessage: TServiceMessage) => (
                    <AccordionTab
                        key={serviceMessage.id}
                        tabIndex={serviceMessage.id}
                        header={serviceMessage.title}
                    >
                        <ServiceMessageForm
                            serviceMessage={serviceMessage}
                            onUpdate={() => getServiceMessages()}
                        />
                    </AccordionTab>
                ))}
                {/*I doubt someone will create one day 9999 users.*/}
                <AccordionTab key={9999}
                              tabIndex={9999}
                              header={
                                  <span>
                                    <i className="pi pi-plus mr-3"/>
                                      {t('settings:service_message.add_message').toString()}
                                   </span>
                              }
                              headerClassName="accordion-new-directory"
                              contentClassName="accordion-new-directory-content"
                >
                    <ServiceMessageForm
                        serviceMessage={
                            {
                                id: 0,
                                title: '',
                                contents: '',
                                organizations: authState.user.organization_users?.map(organizationUser => organizationUser.organization)
                            }
                        }
                        isNewServiceMessage
                        onUpdate={() => getServiceMessages()}
                    />
                </AccordionTab>
            </Accordion>
        </>
    );
}

export default UsersList;