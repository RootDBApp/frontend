import { Accordion, AccordionTab } from "primereact/accordion";
import * as React                  from 'react';
import { useTranslation }          from "react-i18next";

import apiDataContext             from "../../contexts/api_data/store/context";
import CategoryForm               from "./CategoryForm";
import { context as authContext } from "../../contexts/auth/store/context";

const CategoriesList: React.FC = (): React.ReactElement => {

    const {state: authState} = React.useContext(authContext);
    const {state: {categories, reports}} = React.useContext(apiDataContext);

    const {t} = useTranslation('common');

    return (
        <Accordion activeIndex={0}>
            {categories.map(cat => (
                <AccordionTab key={cat.id} tabIndex={cat.id} header={cat.name}>
                    <CategoryForm category={cat} nbReports={reports.filter(r => r.category?.id === cat.id).length}/>
                </AccordionTab>
            ))}
            <AccordionTab
                key={9999}
                tabIndex={9999}
                header={
                    <span>
                        <i className="pi pi-plus mr-3"/>
                        {t('common:add_category').toString()}
                    </span>
                }
                headerClassName="accordion-new-category"
                contentClassName="accordion-new-category-content"
            >
                <CategoryForm
                    category={{
                        organization_id: authState.user.organization_user.organization_id,
                        id: 9999,
                        name: '',
                        color_hex: 'FF0000',
                        description: '',
                    }}
                    isNewCategory
                />
            </AccordionTab>
        </Accordion>
    );
};
export default CategoriesList;