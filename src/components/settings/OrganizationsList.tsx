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