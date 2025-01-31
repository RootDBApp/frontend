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

import { Dropdown, DropdownProps }       from "primereact/dropdown";
import { MultiSelect, MultiSelectProps } from "primereact/multiselect";
import * as React                        from "react";
import { useTranslation }                from "react-i18next";

import { EAssetStorageType } from "../../../types/EAssetStorageType";

const DropDownAssetStorageType: React.FC<{
    id: string
    isInvalid: boolean,
    fullWidth?: boolean,
    multiSelect?: boolean
} & DropdownProps> = ({
                          id,
                          isInvalid,
                          fullWidth = true,
                          multiSelect = false, ...props
                      }): React.ReactElement => {

    const {t} = useTranslation(['report']);

    const storage_types = [
        {name: t('report:asset.filesystem').toString(), code: EAssetStorageType.FILESYSTEM},
        {name: t('report:asset.database').toString(), code: EAssetStorageType.DATABASE},
    ];

    return (
        <>
            {multiSelect ? (
                <MultiSelect
                    {...props as MultiSelectProps}
                    name={id}
                    optionLabel="name"
                    optionValue="code"
                    options={storage_types}
                    placeholder={t('report:asset.choose_storage').toString()}
                    filter
                    className={`${fullWidth ? 'w-full' : ''} ${isInvalid ? 'p-invalid' : ''}`}
                    virtualScrollerOptions={{itemSize: 36}}
                />
            ) : (
                <Dropdown
                    {...props}
                    name={id}
                    optionLabel="name"
                    optionValue="code"
                    options={storage_types}
                    placeholder={t('report:asset.choose_storage').toString()}
                    className={`flex ${isInvalid ? 'p-invalid w-full' : 'w-full'}`}
                />
            )
            }
        </>
    )
}
export default DropDownAssetStorageType;