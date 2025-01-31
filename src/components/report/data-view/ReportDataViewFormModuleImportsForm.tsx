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

import * as React    from 'react';
import { Formik }    from "formik";
import { t }         from "i18next";
import { InputText } from "primereact/inputtext";
import { Message }   from "primereact/message";
import * as Yup      from "yup";

import TJSModuleImport                           from "../../../types/TJSmoduleImport";
import ButtonWithSpinner, { SubmitButtonStatus } from "../../common/form/ButtonWithSpinner";
import { apiSendRequest }                        from "../../../services/api";
import { EAPIEndPoint }                          from "../../../types/EAPIEndPoint";
import TReportDataView                           from "../../../types/TReportDataView";
import { TAPIResponse }                          from "../../../types/TAPIResponse";
import TReportDataViewState                      from "../../../types/TReportDataViewState";
import TReportDataViewJsRuntimeConfiguration     from "../../../types/TReportDataViewJsRuntimeConfiguration";
import { ICallbackOnDataViewJsModuleUpdated }    from "../../../types/ICallBacks";

const ReportDataViewFormModuleImportsForm: React.FC<{
    jsModuleImport: TJSModuleImport,
    reportDataViewState: TReportDataViewState
    callbackOnDataViewJsModuleUpdated: ICallbackOnDataViewJsModuleUpdated
}> = ({jsModuleImport, reportDataViewState, callbackOnDataViewJsModuleUpdated}) => {

    const [submitButtonUpdate, setSubmitButtonUpdate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonDelete, setSubmitButtonDelete] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [displayError, setDisplayError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const updateReportDataViewJs = (runtimeConfiguration: TReportDataViewJsRuntimeConfiguration): void => {

        apiSendRequest({
            method: 'PUT',
            endPoint: EAPIEndPoint.REPORT_DATA_VIEW_JS,
            formValues: {json_runtime_configuration: runtimeConfiguration},
            resourceId: reportDataViewState?.dataView?.report_data_view_js_id,
            extraUrlPath: 'json-runtime-configuration',
            callbackSuccess: (response: TReportDataView) => {

                callbackOnDataViewJsModuleUpdated(runtimeConfiguration.jsModules.length);
            },
            callbackError: (error: TAPIResponse) => {

                setSubmitButtonUpdate(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    }

    const getReportDataViewRuntimeConfiguration = (): TReportDataViewJsRuntimeConfiguration => {

        if (reportDataViewState.dataView && reportDataViewState.dataView.report_data_view_js) {
            // Recompute all IDs
            reportDataViewState.dataView.report_data_view_js.json_runtime_configuration.jsModules = [

                ...reportDataViewState.dataView.report_data_view_js.json_runtime_configuration.jsModules.map((jsModuleImport: TJSModuleImport, index: number) => {

                    return {...jsModuleImport, id: (index + 1)};
                })
            ];

            return reportDataViewState.dataView.report_data_view_js.json_runtime_configuration;
        }

        return {jsModules: []};
    }

    const handleOnCreate = (values: TJSModuleImport): void => {

        let runtimeConfiguration: TReportDataViewJsRuntimeConfiguration = getReportDataViewRuntimeConfiguration();
        runtimeConfiguration.jsModules = [
            ...runtimeConfiguration.jsModules,
            {
                ...values,
                id: runtimeConfiguration.jsModules.length + 1
            }
        ];
        updateReportDataViewJs(runtimeConfiguration);
    }

    const handleOnUpdate = (values: TJSModuleImport): void => {

        setSubmitButtonUpdate(SubmitButtonStatus.Validating);
        let runtimeConfiguration: TReportDataViewJsRuntimeConfiguration = getReportDataViewRuntimeConfiguration();
        runtimeConfiguration.jsModules = [
            ...runtimeConfiguration.jsModules.map((jsModuleImport: TJSModuleImport) => {
                if (jsModuleImport.id === values.id) {
                    return values;
                }

                return jsModuleImport;
            })
        ];
        updateReportDataViewJs(runtimeConfiguration);
        setSubmitButtonUpdate(SubmitButtonStatus.Validated);

    };

    const handleOnDelete = (values: TJSModuleImport): void => {

        setSubmitButtonDelete(SubmitButtonStatus.Validating);
        let runtimeConfiguration: TReportDataViewJsRuntimeConfiguration = getReportDataViewRuntimeConfiguration();
        runtimeConfiguration.jsModules = [
            ...runtimeConfiguration.jsModules.filter((jsModuleImport: TJSModuleImport) => (jsModuleImport.id !== values.id))
        ];
        updateReportDataViewJs(runtimeConfiguration);
        setSubmitButtonDelete(SubmitButtonStatus.Validated);
    }

    return (<Formik
            key={jsModuleImport.url}
            validateOnMount={true}
            validationSchema={Yup.object({
                url: Yup.string().required(),
                as: Yup.string().required(),
            })}
            onSubmit={values => {

                if (jsModuleImport.url === '') {
                    handleOnCreate(values);
                } else {
                    handleOnUpdate(values);
                }
            }}
            initialValues={{...jsModuleImport}}
        >
            {(formik) => (
                <form onSubmit={formik.handleSubmit}>
                    <div className="formgrid grid">
                        <div className="field col-12">
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">{t("report:dataview.runtime_configuration.module_url")}</span>
                                <InputText
                                    id={'jsmodule-import-url-' + jsModuleImport.id}
                                    {...formik.getFieldProps('url')}
                                    placeholder={t("report:dataview.runtime_configuration.module_url")}
                                />
                                <span className="p-inputgroup-addon">{t("report:dataview.runtime_configuration.imported_as")}</span>
                                <InputText
                                    id={'jsmodule-import-as-' + jsModuleImport.id}
                                    {...formik.getFieldProps('as')}
                                    placeholder={t("report:dataview.runtime_configuration.variable_name")}
                                />

                                <ButtonWithSpinner
                                    buttonStatus={submitButtonUpdate}
                                    disabled={!formik.isValid}
                                    labels={
                                        (jsModuleImport && jsModuleImport.id !== 0)
                                            ? {
                                                default: t('common:form.update').toString(),
                                                validating: t('common:form.updating').toString(),
                                                validated: t('common:form.updated').toString(),
                                                notValidated: t('common:form.update_failed').toString(),
                                            }
                                            : {
                                                default: t('common:form.create').toString(),
                                                validating: t('common:form.creating').toString(),
                                                validated: t('common:form.created').toString(),
                                                notValidated: t('common:form.create_failed').toString(),
                                            }
                                    }
                                    onClick={(event) => {
                                        event.preventDefault();
                                        jsModuleImport.id === 0 ? handleOnCreate(formik.values) : handleOnUpdate(formik.values);
                                    }}
                                />
                                {jsModuleImport.id !== 0 &&
                                    <ButtonWithSpinner
                                        type="button"
                                        buttonStatus={submitButtonDelete}
                                        disabled={!formik.isValid}
                                        labels={{
                                            default: t('common:form.delete').toString(),
                                            validating: t('common:form.deleting').toString(),
                                            validated: t('common:form.deleted').toString(),
                                            notValidated: t('common:form.delete_failed').toString(),
                                        }}
                                        severity="danger"
                                        validateAction
                                        validateActionCallback={() => handleOnDelete(formik.values)}
                                        onClick={(event) => {
                                            event.preventDefault();
                                        }}
                                    />}
                            </div>
                        </div>

                        {displayError && <div className="col-12">
                            <Message severity="error" text={errorMessage}/>
                        </div>}
                    </div>
                </form>
            )}
        </Formik>
    );
}

export default ReportDataViewFormModuleImportsForm;
