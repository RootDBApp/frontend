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
import { EAssetStorageType }      from "../../types/EAssetStorageType";
import { context as authContext } from "../../contexts/auth/store/context";
import apiDataContext             from "../../contexts/api_data/store/context";
import TAsset                     from "../../types/TAsset";
import { EAssetSource }           from "../../types/EAssetSource";
import DropDownAssetStorageType   from "../common/form/DropDownAssetStorageType";

const AssetsList = (): React.ReactElement => {

    const {t} = useTranslation(['common', 'report', 'settings']);

    const {state: authState} = React.useContext(authContext);
    const {state: {assets}} = React.useContext(apiDataContext);

    const [nameFilter, setNameFilter] = React.useState<string>('');
    const [storageTypeFilter, setStorageTypeFilter] = React.useState<Array<EAssetStorageType>>([]);

    return (
        <>
            <div id="parameter-inputs-filters">
                <DropDownAssetStorageType
                    id="parameter-inputs-filters-input-type-id"
                    placeholder={t('report:asset.asset_filter_by_storage').toString()}
                    value={storageTypeFilter}
                    onChange={(e: { value: React.SetStateAction<Array<EAssetStorageType>>; }) => setStorageTypeFilter(e.value)}
                    isInvalid={false}
                    fullWidth={false}
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
                    {assets
                        .filter((asset: TAsset) => (
                            (storageTypeFilter.length === 0 || storageTypeFilter.includes(asset.storage_type))
                            && (!nameFilter || asset.name.toLowerCase().includes(nameFilter.toLowerCase()))
                        ))
                        .map(
                            (asset: TAsset) => (
                                <AccordionTab key={asset.id}
                                              tabIndex={asset.id}
                                              header={
                                                  <span>
                                                    <i className={`pi pi-${asset.storage_type === EAssetStorageType.DATABASE ? 'database' : 'file'} mr-3`}/>
                                                      {`#${asset.id} - ${asset.name}`}
                                                  </span>
                                              }>
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
                                          {t('report:asset.new_asset').toString()}
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
                                asset_source: EAssetSource.STRING,
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