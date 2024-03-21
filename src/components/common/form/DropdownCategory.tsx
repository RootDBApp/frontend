import { Dropdown, DropdownProps } from "primereact/dropdown";
import * as React                  from "react";
import { useTranslation }          from "react-i18next";

import apiDataContext from "../../../contexts/api_data/store/context";
import TCategory      from "../../../types/TCategory";

const DropdownCategory: React.FC<{
    id: string,
    isInvalid: boolean,
    excludeCategoryIds?: Array<number>,
} & DropdownProps> = (
    {
        id,
        isInvalid,
        excludeCategoryIds,
        ...props
    }): React.ReactElement => {

    const {t} = useTranslation(['report']);
    const {state: apiDataState} = React.useContext(apiDataContext);

    return (
        <Dropdown
            {...props}
            name={id}
            optionLabel="name"
            optionValue="id"
            options={apiDataState.categories.filter((category: TCategory) => !excludeCategoryIds?.find((categoryId: number) => categoryId === category.id))}
            placeholder={t('report:form.choose_category').toString()}
            filter
            // isLoading={apiDataState.categoriesLoading}
            className={`flex ${isInvalid ? 'p-invalid w-full' : 'w-full'}`}
        />
    )
};

export default DropdownCategory;