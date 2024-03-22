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

import * as React         from "react";
import { useTranslation } from "react-i18next";
import { Formik }   from "formik";

import TDataViewMetricForm from "../../../../types/TDataViewMetricForm";
import { Dropdown }        from "primereact/dropdown";
import { PrimeIcons }      from 'primereact/api';

const DataViewMetricGlobalForm: React.FC<{
    globalForm: TDataViewMetricForm['global'],
    onChangeCallback: CallableFunction,
}> = ({
          globalForm,
          onChangeCallback,
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);

    const iconOptionTemplate = (option?: { key: string, icon: string }) => {
        return !!option
            ? (
                <React.Fragment key={option.key}>
                    <i className={`mr-3 ${option.icon}`}/>
                    <small>{option.key.replaceAll('_', ' ').toLowerCase()}</small>
                </React.Fragment>
            )
            : <></>;
    };

    return (
        <Formik
            onSubmit={values => onChangeCallback(values)}
            initialValues={{
                icon: globalForm?.icon || '',
                footer: globalForm?.footer || '',
            }}
            enableReinitialize
        >
            {(formik) => (
                <form>
                    <div className="formgrid grid mx-0 justify-content-between flex-grow-1">
                        <div className="field">
                            <label
                                id="label_icon"
                                htmlFor="icon"
                            >
                                {t('report:dataview.info_view_form.icon').toString()}
                            </label><br/>
                            <Dropdown
                                multiple={false}
                                options={Object.entries(PrimeIcons).map(([key, value]) => ({
                                    key,
                                    icon: value
                                }))}
                                optionValue="icon"
                                optionLabel="key"
                                itemTemplate={iconOptionTemplate}
                                valueTemplate={iconOptionTemplate}
                                filter
                                {...formik.getFieldProps('icon')}
                                onChange={(event) => {
                                    formik.setFieldValue('icon', event.value);
                                    onChangeCallback({...formik.values, icon: event.value});
                                }}
                            />
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    )
}

export default DataViewMetricGlobalForm;
