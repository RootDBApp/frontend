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