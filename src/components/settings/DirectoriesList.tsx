import { Accordion, AccordionTab } from "primereact/accordion";
import * as React                  from 'react';
import { useTranslation }          from "react-i18next";


import apiDataContext             from "../../contexts/api_data/store/context";
import { context as authContext } from "../../contexts/auth/store/context";
import DirectoryForm              from "./DirectoryForm";

const DirectoriesList: React.FC = (): React.ReactElement => {

    const {state: {directories, reports}} = React.useContext(apiDataContext);
    const {state: authState} = React.useContext(authContext);

    const {t} = useTranslation('common');

    return (
        <Accordion activeIndex={0}>
            {directories.map(directory => (
                <AccordionTab
                    key={directory.id}
                    tabIndex={directory.id}
                    header={directory.name}
                >
                    <DirectoryForm
                        directory={directory}
                        nbReports={reports.filter(r => r.directory?.id === directory.id).length}
                    />
                </AccordionTab>
            ))}
            <AccordionTab
                key={9999}
                tabIndex={9999}
                header={
                    <span>
                        <i className="pi pi-plus mr-3"/>
                        {t('common:add_directory').toString()}
                    </span>
                }
                headerClassName="accordion-new-directory"
                contentClassName="accordion-new-directory-content"
            >
                <DirectoryForm
                    directory={{
                        organization_id: authState.user.organization_user.organization_id,
                        id: 9999,
                        name: '',
                        description: '',
                    }}
                    isNewDirectory
                />
            </AccordionTab>
        </Accordion>
    );
};
export default DirectoriesList;