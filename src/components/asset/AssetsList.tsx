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
import { InputText }               from "primereact/inputtext";
import * as React                  from "react";
import { useTranslation }          from "react-i18next";

import AssetForm                  from "./AssetForm";
import DropdownParameterInputType from "../common/form/DropdownParameterInputType";
import { EAssetStorageType }      from "../../types/EAssetStorageType";
import { context as authContext } from "../../contexts/auth/store/context";
import apiDataContext             from "../../contexts/api_data/store/context";
import TAsset                     from "../../types/TAsset";
import { EAssetStorageDataType }  from "../../types/EAssetStorageDataType";

const AssetsList = (): React.ReactElement => {

    const {t} = useTranslation(['common', 'report', 'settings']);

    const {state: authState} = React.useContext(authContext);
    const {state: {assets}} = React.useContext(apiDataContext);

    const [nameFilter, setNameFilter] = React.useState<string>('');
    const [storageTypeFilter, setStorageTypeFilter] = React.useState<number[]>([]);

    return (
        <>
            <div id="parameter-inputs-filters">
                <DropdownParameterInputType
                    id="parameter-inputs-filters-input-type-id"
                    fullWidth={false}
                    placeholder={t('settings:input_parameters.filter_by_parameter_input_type').toString()}
                    value={storageTypeFilter}
                    onChange={(e: { value: React.SetStateAction<number[]>; }) => setStorageTypeFilter(e.value)}
                    multiSelect
                />
                <div className="p-input-icon-left" id="name-filter">
                    <i className="pi pi-search"/>
                    <InputText
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        placeholder={t('settings:input_parameters.filter_by_name').toString()}
                        className="w-full"
                    />
                </div>
            </div>
            <div id="parameter-inputs">
                <Accordion
                    style={{width: '100%'}}
                    activeIndex={0}>
                    {assets.map(
                        (asset: TAsset) => (
                            <AccordionTab key={asset.id} tabIndex={asset.id}
                                          header={asset.name}>
                                <AssetForm asset={asset}/>
                            </AccordionTab>
                        )
                    )}

                    {/*I doubt someone will create one day 9999 assets.*/}
                    <AccordionTab key={9999}
                                  tabIndex={9999}
                                  header={
                                      <span>
                                   <i className="pi pi-plus mr-3"/>
                                          {t('report:form.new_input_parameter').toString()}
                               </span>
                                  }
                                  headerClassName="accordion-new-param"
                                  contentClassName="accordion-new-param-content"
                    >

                        <AssetForm
                            asset={{
                                id: 0,
                                organization_id: authState.user.organization_user.organization_id,
                                storage_type: EAssetStorageType.DATABASE,
                                name: '',
                                data_content: '',
                                data_type: EAssetStorageDataType.STRING,
                                url: '',
                                pathname: '',
                            }}
                            isNewAsset
                        />

                    </AccordionTab>
                </Accordion>
            </div>
        </>
    );
}

export default AssetsList;