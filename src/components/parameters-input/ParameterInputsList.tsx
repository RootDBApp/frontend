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
import * as React                  from "react";
import { useTranslation }          from "react-i18next";

import apiDataContext             from "../../contexts/api_data/store/context";
import { getParameterInputs }     from "../../contexts/api_data/store/actions";
import ParameterInputForm         from "./ParameterInputForm";
import DropdownParameterInputType from "../common/form/DropdownParameterInputType";
import { InputText }              from "primereact/inputtext";
import { IconField }              from "primereact/iconfield";
import { InputIcon }              from "primereact/inputicon";
// import { sortArrayByKeyStringASC } from "../../utils/commonJs";

const ParameterInputsList = (): React.ReactElement => {

    const {t} = useTranslation(['common', 'report', 'settings']);

    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext)

    const [tryCounter, setTryCounter] = React.useState<number>(0);
    const [nameFilter, setNameFilter] = React.useState('');
    const [inputTypesFilter, setInputTypesFilter] = React.useState<number[]>([]);

    React.useEffect(() => {

        if (tryCounter < 1 && apiDataState.parameterInputs.length === 0 && !apiDataState.parameterInputsLoading) {

            apiDataDispatch(getParameterInputs());
            setTryCounter(1);
        } else if (apiDataState.parameterInputs.length > 0) {

            setTryCounter(0);
        }
    }, [tryCounter, apiDataState.parameterInputs.length, apiDataState.parameterInputsLoading, apiDataDispatch]);

    return (
        <>
            <div id="parameter-inputs-filters">
                <DropdownParameterInputType
                    id="parameter-inputs-filters-input-type-id"
                    fullWidth={false}
                    placeholder={t('settings:input_parameters.filter_by_parameter_input_type').toString()}
                    value={inputTypesFilter}
                    onChange={(e: { value: React.SetStateAction<number[]>; }) => setInputTypesFilter(e.value)}
                    multiSelect
                />
                <IconField iconPosition="left" className="w-full" id="name-filter">
                    <InputIcon className="pi pi-search"> </InputIcon>
                    <InputText
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        placeholder={t('settings:input_parameters.filter_by_name').toString()}
                        className="w-full"
                    />
                </IconField>
            </div>
            <div id="parameter-inputs">
                <Accordion
                    style={{width: '100%'}}
                    activeIndex={0}>
                    {/*{sortArrayByKeyStringASC(apiDataState.parameterInputs, 'name').map(*/}
                    {/*    (parameterInput) => (*/}
                    {/*        <AccordionTab key={parameterInput.id} header={parameterInput.name}>*/}
                    {/*            <ParameterInputForm parameterInput={parameterInput}/>*/}
                    {/*        </AccordionTab>*/}
                    {/*    )*/}
                    {/*)}*/}

                    {apiDataState.parameterInputs
                        .filter(parameterInput => (
                            (inputTypesFilter.length === 0 || inputTypesFilter.includes(parameterInput.parameter_input_type_id))
                            && (!nameFilter || parameterInput.name.toLowerCase().includes(nameFilter.toLowerCase()))
                        ))
                        .map(
                            (parameterInput) => (
                                <AccordionTab key={parameterInput.id} tabIndex={parameterInput.id}
                                              header={parameterInput.name}>
                                    <ParameterInputForm parameterInput={parameterInput}/>
                                </AccordionTab>
                            )
                        )}

                    {/*I doubt someone will create one day 9999 parameters.*/}
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

                        <ParameterInputForm
                            parameterInput={{
                                id: 0,
                                conf_connector_id: 2,
                                parameter_input_type_id: 0,
                                parameter_input_data_type_id: 0,
                                name: '',
                                query: '',
                                query_default_value: '',
                                default_value: '',
                                custom_entry: 1,
                            }}
                            isNewParameterInput
                        />

                    </AccordionTab>
                </Accordion>
            </div>
        </>
    );
}

export default ParameterInputsList;