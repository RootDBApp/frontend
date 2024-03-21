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

import { InputNumber }    from "primereact/inputnumber";
import { InputSwitch }    from "primereact/inputswitch";
import { SelectButton }   from "primereact/selectbutton";
import * as React         from "react";
import { useTranslation } from "react-i18next";
import { Form, Formik }   from "formik";

import TDataViewTableForm from "../../../../types/TDataViewTableForm";
import TCallbackResponse  from "../../../../types/TCallbackResponse";


const DataViewTableGlobalForm: React.FC<{
    callBackResponse?: TCallbackResponse,
    globalForm: TDataViewTableForm['global'],
    onChangeCallback: CallableFunction,
}> = ({
          callBackResponse,
          globalForm,
          onChangeCallback,
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);

    const handleOnUpdate = (values: TDataViewTableForm['global']): void => {

        onChangeCallback(values);
    };

    return (
        <Formik
            onSubmit={values => handleOnUpdate(values)}
            initialValues={{
                adjust_width: globalForm.adjust_width,
                pagination: globalForm.pagination,
                expanded: globalForm.expanded,
                expanded_paginate: globalForm.expanded_paginate,
                groupBy: globalForm.groupBy,
            }}
            enableReinitialize
        >
            {(formik) => (
                <Form placeholder="">
                    <div className="formgrid grid">
                        <h4 className="col-12 flex p-justify-between">
                            <span
                                className="flex-grow-1">{t('report:dataview.table_form.adjust_width_to_content')}</span>
                            <InputSwitch
                                id="adjust_width"
                                {...formik.getFieldProps('adjust_width')}
                                checked={Boolean(formik.values.adjust_width)}
                                onChange={(event) => {
                                    formik.setFieldValue('adjust_width', event.value);
                                    handleOnUpdate({...formik.values, adjust_width: Boolean(event.value)});
                                }}
                            />
                        </h4>
                        <h4 className="col-12 flex p-justify-between">
                            <span className="flex-grow-1">{t('common:pagination.pagination')}</span>
                            <InputSwitch
                                tooltip={t('report:dataview.table_form.activate_pagination').toString()}
                                tooltipOptions={{position: 'left'}}
                                id="pagination"
                                {...formik.getFieldProps('pagination.active')}
                                checked={formik.values.pagination.active}
                                onChange={(event) => {
                                    formik.setFieldValue('pagination.active', event.value);
                                    handleOnUpdate({
                                        ...formik.values,
                                        pagination: {...formik.values.pagination, active: Boolean(event.value)}
                                    });
                                }}
                            />
                        </h4>
                        <div className="field md:col-6">
                            <label
                                id="label_rows_per_page"
                                htmlFor="rows_per_page"
                            >
                                {t('common:pagination.page_size_label').toString()}
                            </label><br/>
                            <InputNumber
                                disabled={!formik.values.pagination.active}
                                id="rows_per_page"
                                inputId="rows_per_page_input"
                                {...formik.getFieldProps('pagination.rowsPerPage')}
                                onChange={(event) => {
                                    formik.setFieldValue('pagination.rowsPerPage', event.value);
                                    handleOnUpdate({
                                        ...formik.values,
                                        pagination: {...formik.values.pagination, rowsPerPage: Number(event.value)}
                                    });
                                }}
                                step={10}
                                showButtons
                                mode="decimal"
                            />
                        </div>
                        <div className="field md:col-6">
                            <label
                                id="label_position"
                                htmlFor="position"
                            >
                                {t('common:position.position').toString()}
                            </label><br/>
                            <SelectButton
                                disabled={!formik.values.pagination.active}
                                id="position"
                                options={[
                                    {label: t('common:position.top').toString(), value: 'top'},
                                    {label: t('common:position.bottom').toString(), value: 'bottom'},
                                ]}
                                {...formik.getFieldProps('pagination.position')}
                                multiple
                                onChange={(event) => {
                                    formik.setFieldValue('pagination.position', event.value);
                                    handleOnUpdate({
                                        ...formik.values,
                                        pagination: {...formik.values.pagination, position: event.value}
                                    });
                                }}
                            />
                        </div>
                        <h3 className="col-12">
                            <span>{t('report:dataview.table_form.group_by_config_title')}</span>
                        </h3>
                        <div className="field md:col-6">
                            <label
                                id="label_groupBy"
                                htmlFor="groupBy"
                            >
                                {t('report:dataview.table_form.group_by_switch_tooltip').toString()}
                            </label><br/>
                            <InputSwitch
                                id="groupBy"
                                checked={formik.values.groupBy}
                                {...formik.getFieldProps('groupBy')}
                                onChange={(event) => {
                                    formik.setFieldValue('groupBy', event.value);
                                    handleOnUpdate({...formik.values, groupBy: Boolean(event.value)});
                                }}
                            />
                        </div>
                        <div className="field md:col-6">
                            <label
                                id="label_expanded"
                                htmlFor="expanded"
                            >
                                {t('report:dataview.table_form.group_by_expanded_default').toString()}
                            </label><br/>
                            <InputSwitch
                                id="expanded"
                                checked={formik.values.expanded}
                                {...formik.getFieldProps('expanded')}
                                onChange={(event) => {
                                    formik.setFieldValue('expanded', event.value);
                                    handleOnUpdate({...formik.values, expanded: Boolean(event.value)});
                                }}
                            />
                        </div>
                        <div className="field md:col-6">
                            <label
                                id="label_expanded_paginate"
                                htmlFor="expanded_paginate"
                            >
                                {t('report:dataview.table_form.group_by_expanded_paginate').toString()}
                            </label><br/>
                            <InputSwitch
                                id="expanded_paginate"
                                checked={formik.values.expanded_paginate}
                                {...formik.getFieldProps('expanded_paginate')}
                                onChange={(event) => {
                                    formik.setFieldValue('expanded_paginate', event.value);
                                    handleOnUpdate({...formik.values, expanded_paginate: Boolean(event.value)});
                                }}
                            />
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default DataViewTableGlobalForm;
