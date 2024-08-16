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

import { Formik }         from "formik";
import { Button }         from "primereact/button";
import { InputText }      from "primereact/inputtext";
import { Message }        from "primereact/message";
import { OverlayPanel }   from "primereact/overlaypanel";
import { Tooltip }        from "primereact/tooltip";
import * as React         from "react";
import { useTranslation } from "react-i18next";
import * as Yup           from "yup";

import TParameterInput                           from "../../types/TParameterInput";
import ButtonWithSpinner, { SubmitButtonStatus } from "../common/form/ButtonWithSpinner";
import DropdownParameterInputType                from "../common/form/DropdownParameterInputType";
import DropdownParameterInputDataType            from "../common/form/DropdownParameterInputDataType";
import TCallbackResponse                         from "../../types/TCallbackResponse";
import { ECallbackStatus }                       from "../../types/ECallbackStatus";
import DropdownConnector                         from "../common/form/DropdownConnector";
import { apiSendRequest }                        from "../../services/api";
import { EAPIEndPoint }                          from "../../types/EAPIEndPoint";
import TReportParameter                          from "../../types/TReportParameter";
import CenteredLoading                           from "../common/loading/CenteredLoading";
import apiDataContext                            from "../../contexts/api_data/store/context";
import TParameterInputType                       from "../../types/TParameterInputType";
import ReportParameter                           from "../report/report-Parameters/ReportParameter";
import env                                       from "../../envVariables";
import { TAPIResponse }                          from "../../types/TAPIResponse";

const CustomEditor = React.lazy(() => import('../common/CustomEditor'));

const getParameterInputDefaultQuery = (parametersInputTypes: TParameterInputType[], inputTypeId: number): string | undefined => {
    return parametersInputTypes.find((inputType: TParameterInputType) => {
        return inputType.id === inputTypeId;
    })?.query;
}

const ParameterInputForm: React.FC<{
    parameterInput: TParameterInput,
    isNewParameterInput?: boolean
}> = ({
          parameterInput,
          isNewParameterInput = false
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);

    const reportParameterFormOverlayRef = React.useRef<OverlayPanel>(null);

    const {state: apiDataState} = React.useContext(apiDataContext);

    const [submitButtonCreate, setSubmitButtonCreate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonUpdate, setSubmitButtonUpdate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonDelete, setSubmitButtonDelete] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [displayError, setDisplayError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [stateSQLConsoleCallbackResponseQuery,] = React.useState<TCallbackResponse>({status: ECallbackStatus.IDLE})
    const [stateSQLConsoleCallbackResponseQueryDefaultValue,] = React.useState<TCallbackResponse>({status: ECallbackStatus.IDLE})
    const [testReportParameter, setTestReportParameter] = React.useState<TReportParameter | undefined>();
    const [isReportParametersLoading, setIsReportParametersLoading] = React.useState<boolean>(false);
    const [refreshCompletion, setRefreshCompletion] = React.useState<boolean>(false);

    const resetStates = (): void => {

        setDisplayError(false);
        setErrorMessage('');
    }

    const handleOnCreate = (parameterInput: TParameterInput): void => {

        resetStates();
        setSubmitButtonCreate(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.REPORT_PARAMETER_INPUT,
            formValues: parameterInput,
            callbackSuccess: () => {

                setSubmitButtonCreate(SubmitButtonStatus.Validated);
            },
            callbackError: (error: TAPIResponse) => {

                setSubmitButtonCreate(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    };

    const handleOnUpdate = (parameterInput: TParameterInput): void => {

        resetStates();
        setSubmitButtonUpdate(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'PUT',
            endPoint: EAPIEndPoint.REPORT_PARAMETER_INPUT,
            formValues: parameterInput,
            resourceId: parameterInput.id,
            callbackSuccess: () => {
                setSubmitButtonUpdate(SubmitButtonStatus.Validated);
                // reportDispatch(updateReportParameter({report_id: parameter.report_id, parameter: parameterUpdated}))
            },
            callbackError: (error) => {

                setSubmitButtonUpdate(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    };

    const handleOnDelete = (parameterInput: TParameterInput): void => {

        resetStates();
        setSubmitButtonDelete(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'DELETE',
            endPoint: EAPIEndPoint.REPORT_PARAMETER_INPUT,
            resourceId: parameterInput.id,
            callbackSuccess: () => {
            },
            callbackError: (error) => {

                setSubmitButtonDelete(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    };

    const handleOnPreview = (e: any, parameterInput: TParameterInput): void => {

        resetStates();

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.REPORT_PARAMETER_INPUT,
            extraUrlPath: 'test',
            formValues: parameterInput,
            callbackSuccess: (response: TParameterInput) => {
                setTestReportParameter({
                    available_public_access: true,
                    following_parameter_next_to_this_one: false,
                    id: 0,
                    name: '',
                    parameter_input_id: 0,
                    report_id: 0,
                    variable_name: '',
                    parameter_input: response
                });

                setIsReportParametersLoading(false);
            },
            callbackError: (error) => {

                setIsReportParametersLoading(false);
                setSubmitButtonDelete(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    };

    const getReportParameterPreview = (): React.ReactElement => {

        if (testReportParameter === undefined) {

            return <></>
        } else {
            return <ReportParameter
                parameter={testReportParameter}
                index={0}
                parameterId="test_parameter_id"
            />;
        }
    };

    return (
        <>
            <OverlayPanel
                ref={reportParameterFormOverlayRef}
                id={`overlay-report-parameter-form`}
                className=""
                style={{width: '400px'}}
                showCloseIcon
            >
                <form>
                    <div className="flex justify-content-center" style={{marginBottom: '2rem'}}>
                        {isReportParametersLoading ? <CenteredLoading/> : getReportParameterPreview()}
                    </div>
                </form>
            </OverlayPanel>

            <React.Suspense fallback={<CenteredLoading/>}>
                <Formik
                    key={parameterInput.id}
                    validateOnMount={true}
                    validationSchema={Yup.object({
                        id: Yup.number().required(),
                        conf_connector_id: Yup.number().required().min(1),
                        parameter_input_type_id: Yup.number().required().min(1),
                        parameter_input_data_type_id: Yup.number().required().min(1),
                        name: Yup.string().required(),
                        query: Yup.string().when('parameter_input_type_id', {
                            is: (value: number) => {
                                return value === 2 || value === 3 || value === 4
                            },
                            then: () => Yup.string().required().min(1),
                            otherwise: () => Yup.string().nullable(),
                        }),
                        query_default_value: Yup.string().nullable(),
                        default_value: Yup.string().nullable(),
                    })}
                    onSubmit={values => handleOnUpdate(values)}
                    initialValues={{
                        ...parameterInput
                    }}
                >
                    {(formik) => (
                        <form onSubmit={formik.handleSubmit}>
                            <div className="formgrid grid">
                                <div className="field col-12 md:col-6">
                                    <label htmlFor={'name' + parameterInput.id}>
                                        {t('report:form.report_parameter_input_name').toString()}
                                    </label>
                                    <InputText
                                        id={'name' + parameterInput.id}
                                        type="text"
                                        {...formik.getFieldProps('name')}
                                        className={!!formik.errors.name ? 'p-invalid w-full' : 'w-full'}
                                        placeholder={t('report:form.report_parameter_input_name').toString()}
                                    />
                                </div>

                                <div className="field col-12 md:col-6">
                                    <Tooltip target=".default-value-tooltip"
                                             position="bottom"
                                             content={t('settings:input_parameters.can_use_multiple_value').toString()}
                                             showDelay={env.tooltipShowDelay}
                                             hideDelay={env.tooltipHideDelay}
                                    />
                                    <label htmlFor={'default_value_' + parameterInput.id}>
                                        {t('report:form.default_value').toString()}
                                    </label>
                                    &nbsp;&nbsp;&nbsp;
                                    <i className="pi pi-question-circle default-value-tooltip"/>

                                    <InputText
                                        id={'default_value' + parameterInput.id}
                                        type="text"
                                        {...formik.getFieldProps('default_value')}
                                        className={!!formik.errors.default_value ? 'p-invalid w-full' : 'w-full'}
                                        placeholder={t('report:form.default_value').toString()}
                                        keyfilter={/[a-zA-Z0-9_,]/}
                                    />
                                </div>

                                <div className="field col-12 md:col-4">
                                    <div className="flex align-items-center justify-content-between mb-2">
                                        <label htmlFor={'parameter_input_type_id_' + parameterInput.id}>
                                            {t('report:input_parameter_type').toString()}
                                        </label>
                                        {
                                            !!getParameterInputDefaultQuery(apiDataState.parameterInputTypes, formik.values.parameter_input_type_id)
                                            && (
                                                getParameterInputDefaultQuery(apiDataState.parameterInputTypes, formik.values.parameter_input_type_id)
                                                !== formik.values.query
                                            ) &&
                                            <Button
                                                className="p-button-link p-0"
                                                label={t('settings:input_parameters.show_default_query').toString()}
                                                onClick={() => {
                                                    const defaultQuery = getParameterInputDefaultQuery(apiDataState.parameterInputTypes, formik.values.parameter_input_type_id);
                                                    formik.setFieldValue('query', `${formik.values.query}\n\n/*\n${defaultQuery}\n*/`);
                                                }}
                                            />
                                        }
                                    </div>
                                    <DropdownParameterInputType
                                        onChange={(event: { value: number; }) => {
                                            const previousInputTypeId = formik.values.parameter_input_type_id;

                                            formik.setFieldValue('parameter_input_type_id', event.value);

                                            const previousDefaultQuery = getParameterInputDefaultQuery(apiDataState.parameterInputTypes, previousInputTypeId);

                                            if (!formik.values.query || formik.values.query === '' || previousDefaultQuery === formik.values.query) {

                                                const query = getParameterInputDefaultQuery(apiDataState.parameterInputTypes, event.value);

                                                formik.setFieldValue('query', query)
                                            }
                                        }}
                                        id={'parameter_input_type_id_' + parameterInput.id}
                                        isInvalid={!!formik.errors.parameter_input_type_id}
                                        value={formik.values.parameter_input_type_id}
                                    />
                                </div>

                                <div className="field col-12 md:col-4">
                                    <label htmlFor={'parameter_input_data_type_id_' + parameterInput.id}>
                                        {t('report:input_parameter_data_type').toString()}
                                    </label>
                                    <DropdownParameterInputDataType
                                        onChange={(event) => {
                                            formik.handleChange({
                                                target: {value: event.value, name: 'parameter_input_data_type_id'}
                                            });
                                        }}
                                        id={'parameter_input_data_type_id_' + parameterInput.id}
                                        isInvalid={!!formik.errors.parameter_input_data_type_id}
                                        value={formik.values.parameter_input_data_type_id}
                                    />
                                </div>

                                <div className="field col-12 md:col-4">
                                    <Tooltip target=".droddown-connector-tooltip"
                                             position="bottom"
                                             content={t('settings:input_parameters.will_be_available_regardless_of_the_report_connector ').toString()}
                                             showDelay={env.tooltipShowDelay}
                                             hideDelay={env.tooltipHideDelay}
                                    />
                                    <label htmlFor={'conf_connector_id_' + parameterInput.id}>
                                        {t('settings:global_administration.connector.connector').toString()}
                                    </label>
                                    &nbsp;&nbsp;&nbsp;
                                    <i className="pi pi-question-circle droddown-connector-tooltip"/>
                                    <DropdownConnector
                                        includeGlobalConnector
                                        onChange={(event) => {

                                            setRefreshCompletion(true);
                                            formik.handleChange({
                                                target: {value: event.value, name: 'conf_connector_id'}
                                            });
                                        }}
                                        id={'conf_connector_id_' + parameterInput.id}
                                        isInvalid={!!formik.errors.conf_connector_id}
                                        defaultValue={formik.values.conf_connector_id}
                                    />
                                </div>

                                <div className="field col-12 md:col-6">
                                    <label htmlFor={'query_' + parameterInput.id}>
                                        {t('report:form.query').toString()}
                                    </label>
                                    <div>
                                        <CustomEditor
                                            id={'query_' + parameterInput.id}
                                            confConnectorId={formik.values.conf_connector_id}
                                            value={formik.values.query}
                                            onChangeCallback={(query: string) => {

                                                formik.handleChange({
                                                    target: {
                                                        value: query,
                                                        name: 'query'
                                                    }
                                                });
                                            }}
                                            onCompletionCallback={() => setRefreshCompletion(false)}
                                            saveCallbackResponse={stateSQLConsoleCallbackResponseQuery}
                                            refreshCompletion={refreshCompletion}
                                            resize="vertical"
                                            // height="160px"
                                            displayButtons={false}
                                            isInvalid={!!formik.errors.query}
                                        />
                                    </div>
                                </div>

                                <div className="field col-12 md:col-6">
                                    <label htmlFor={'query_default_value_' + parameterInput.id}>
                                        {t('report:form.query_default_value').toString()}
                                    </label>
                                    <div>
                                        <CustomEditor
                                            id={'query_default_value_' + parameterInput.id}
                                            value={formik.values.query_default_value}
                                            onChangeCallback={(query_default_value: string) => {
                                                formik.handleChange({
                                                    target: {
                                                        value: query_default_value,
                                                        name: 'query_default_value'
                                                    }
                                                });
                                            }}
                                            saveCallbackResponse={stateSQLConsoleCallbackResponseQueryDefaultValue}
                                            resize="vertical"
                                            // height="160px"
                                            displayButtons={false}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-content-end">
                                <div className="flex justify-content-end">
                                    <Button
                                        type="button"
                                        label={t('settings:input_parameters.preview').toString()}
                                        className="mr-3 p-button-info"
                                        onClick={(e) => {

                                            reportParameterFormOverlayRef?.current?.show(e, e.target);
                                            setIsReportParametersLoading(true);
                                            handleOnPreview(e, formik.values);
                                        }}
                                    />
                                    {!isNewParameterInput ?
                                        <>
                                            <div className="mr-2">
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
                                                />
                                            </div>
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
                                        </>
                                        :
                                        <div>
                                            <ButtonWithSpinner
                                                type="button"
                                                buttonStatus={submitButtonCreate}
                                                disabled={!formik.isValid}
                                                labels={{
                                                    default: t('common:form.create').toString(),
                                                    validating: t('common:form.creating').toString(),
                                                    validated: t('common:form.created').toString(),
                                                    notValidated: t('common:form.create_failed').toString(),
                                                }}
                                                className="mr-3"
                                                onClick={() => handleOnCreate(formik.values)}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>

                            {displayError && <div className="col-12">
                                <Message severity="error" text={errorMessage}/>
                            </div>}

                        </form>
                    )}

                </Formik>
            </React.Suspense>
        </>
    );
}

export default ParameterInputForm;