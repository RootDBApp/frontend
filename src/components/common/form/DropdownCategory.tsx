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