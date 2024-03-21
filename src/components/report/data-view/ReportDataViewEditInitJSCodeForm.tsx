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

import { Message }        from "primereact/message";
import { Form, Formik }   from "formik";
import * as React         from 'react';
import { useTranslation } from "react-i18next";
import * as Yup           from "yup";

import ButtonWithSpinner, { SubmitButtonStatus }           from "../../common/form/ButtonWithSpinner";
import { useReportDataViewStateFromReportIdAndDataViewId } from "../../../contexts/report/ReportContextProvider";
import { defaultDataViewJs }                               from "../../../contexts/report/store/reducer";
import CustomEditor                                        from "../../common/CustomEditor";
import TCallbackResponse                                   from "../../../types/TCallbackResponse";
import { ECallbackStatus }                                 from "../../../types/ECallbackStatus";
import TReportDataViewJs                                   from "../../../types/TReportDataViewJs";
import { EAceEditorMode }                                  from "../../../types/primereact/EAceEditorMode";
import { reportDataViewUpdateQueryJs }                     from "../../../contexts/report/store/actions";
import { EDataViewFieldUpdate }                            from "../../../types/EDataViewFieldUpdate";
import * as RTReport                                       from "../../../contexts/report/ReportContextProvider";

const ReportDataViewEditInitJSCodeForm: React.FC<{
    dataViewId: number,
    onUpdate: CallableFunction,
    reportId: number,
}> = ({
          dataViewId,
          onUpdate,
          reportId,
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);
    const reportDataView = useReportDataViewStateFromReportIdAndDataViewId(reportId, dataViewId);

    const reportDispatch = RTReport.useDispatch();

    const [submitButtonUpdate, setSubmitButtonUpdate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [stateSQLConsoleCallbackResponseQuery,] = React.useState<TCallbackResponse>({status: ECallbackStatus.IDLE})

    const handleOnSubmit = (values: TReportDataViewJs): void => {

        setSubmitButtonUpdate(SubmitButtonStatus.Validating);
        reportDispatch(
            reportDataViewUpdateQueryJs({
                reportId: reportId,
                dataViewId: dataViewId,
                field: EDataViewFieldUpdate.JS_REGISTER,
                contents: String(values.js_register)
            }));
        reportDispatch(
            reportDataViewUpdateQueryJs({
                reportId: reportId,
                dataViewId: dataViewId,
                field: EDataViewFieldUpdate.JS_INIT,
                contents: String(values.js_init)
            }));


        setSubmitButtonUpdate(SubmitButtonStatus.Validated);
        onUpdate(values);
    }

    return (
        <Formik
            validateOnMount
            initialValues={reportDataView.dataView?.report_data_view_js ?? defaultDataViewJs}
            validationSchema={Yup.object({
                js_register: Yup.string().required(),
                js_init: Yup.string().required(),
            })}
            onSubmit={handleOnSubmit}
        >
            {formik => (
                <Form  placeholder="" onSubmit={formik.handleSubmit}>
                    <div className="formgrid grid">

                        <div className="field col-12">
                            <Message
                                severity="warn" style={{width: '100%'}}
                                text={t('report:dataview.warning_register_init_code').toString()}
                            />
                        </div>
                        <div className="field col-12">
                            <label htmlFor="is_visible">{t('report:dataview.register_code')}</label><br/>
                            <div>
                                <CustomEditor
                                    id={'js_register__' + reportDataView.dataView?.id ?? 0}
                                    value={formik.values.js_register}
                                    onChangeCallback={(js_register: string) => {

                                        formik.handleChange({
                                            target: {
                                                value: js_register,
                                                name: 'js_register'
                                            }
                                        });
                                    }}
                                    saveCallbackResponse={stateSQLConsoleCallbackResponseQuery}
                                    resize="vertical"
                                    displayButtons={false}
                                    isInvalid={!!formik.errors.js_register}
                                    mode={EAceEditorMode.JS}
                                />
                            </div>
                        </div>

                        <div className="field col-12">
                            <label htmlFor="is_visible">{t('report:dataview.init_code')}</label><br/>
                            <div>
                                <CustomEditor
                                    id={'js_register_' + reportDataView.dataView?.id ?? 0}
                                    value={formik.values.js_init}
                                    onChangeCallback={(js_init: string) => {

                                        formik.handleChange({
                                            target: {
                                                value: js_init,
                                                name: 'js_init'
                                            }
                                        });
                                    }}
                                    saveCallbackResponse={stateSQLConsoleCallbackResponseQuery}
                                    resize="vertical"
                                    displayButtons={false}
                                    isInvalid={!!formik.errors.js_init}
                                    mode={EAceEditorMode.JS}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-content-end">
                        <div className="mr-2">
                            <ButtonWithSpinner
                                buttonStatus={submitButtonUpdate}
                                disabled={!formik.isValid}
                                labels={{
                                    default: t('common:form.update').toString(),
                                    validating: t('common:form.updating').toString(),
                                    validated: t('common:form.updated').toString(),
                                    notValidated: t('common:form.update_failed').toString(),
                                }}
                                type="submit"
                            />
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default ReportDataViewEditInitJSCodeForm;