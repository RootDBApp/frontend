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