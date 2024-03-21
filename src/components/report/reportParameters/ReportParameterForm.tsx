import { Form, Formik, FormikProps } from "formik";
import { Calendar }                  from "primereact/calendar";
import { InputText }                 from "primereact/inputtext";
import { InputSwitch }               from "primereact/inputswitch";
import { Message }                   from "primereact/message";
import { Tooltip }                   from "primereact/tooltip";
import * as React                    from "react";
import { useTranslation }            from "react-i18next";
import * as Yup                      from "yup";

import { EParameterInputType }                   from "../../../types/EParameterInputType";
import TReportParameter                          from "../../../types/TReportParameter";
import * as RTReport                             from "../../../contexts/report/ReportContextProvider";
import { updateReportParameters }                from "../../../contexts/report/store/actions";
import DropdownParameterInput                    from "../../common/form/DropdownParameterInput";
import ButtonWithSpinner, { SubmitButtonStatus } from "../../common/form/ButtonWithSpinner";
import { apiSendRequest }                        from "../../../services/api";
import { EAPIEndPoint }                          from "../../../types/EAPIEndPoint";
import env                                       from "../../../envVariables";

const ReportParameterForm: React.FC<{
    parameter: TReportParameter,
    reportId: number,
    confConnectorId?: number,
    isNewParameter?: boolean
    resetOnCreate?: boolean,
}> = ({

          reportId,
          parameter,
          confConnectorId,
          isNewParameter = false,
          resetOnCreate = false,
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);
    const reportDispatch = RTReport.useDispatch();
    const [submitButtonCreate, setSubmitButtonCreate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonUpdate, setSubmitButtonUpdate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonDelete, setSubmitButtonDelete] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [displayError, setDisplayError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const resetStates = (): void => {

        setDisplayError(false);
        setErrorMessage('');
    }

    const getReportParameter = (parameter: TReportParameter): TReportParameter => {

        return {
            id: parameter.id,
            report_id: reportId,
            parameter_input_id: parameter.parameter_input_id,
            name: parameter.name,
            variable_name: parameter.variable_name,
            forced_default_value: parameter.forced_default_value,
            following_parameter_next_to_this_one: parameter.following_parameter_next_to_this_one,
            available_public_access: parameter.available_public_access
        }
    }

    const handleOnCreate = (values: TReportParameter, resetForm: CallableFunction): void => {

        resetStates();
        setSubmitButtonCreate(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.REPORT_PARAMETER,
            formValues: getReportParameter(values),
            callbackSuccess: (reportParameters) => {
                setSubmitButtonCreate(SubmitButtonStatus.Validated);
                reportDispatch(updateReportParameters({report_id: reportId, parameters: reportParameters}))
                if (resetOnCreate) {

                    resetForm(parameter);
                }
            },
            callbackError: (errorResponse) => {
                setSubmitButtonUpdate(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(errorResponse.message);
            }
        });
    };

    const handleOnUpdate = (values: TReportParameter): void => {

        resetStates();
        setSubmitButtonUpdate(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'PUT',
            endPoint: EAPIEndPoint.REPORT_PARAMETER,
            resourceId: values.id,
            formValues: getReportParameter(values),
            callbackSuccess: (reportParameters) => {
                setSubmitButtonUpdate(SubmitButtonStatus.Validated);
                reportDispatch(updateReportParameters({report_id: reportId, parameters: reportParameters}))
            },
            callbackError: (errorResponse) => {
                setSubmitButtonUpdate(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(errorResponse.message);
            }
        });
    };

    const handleOnDelete = (values: TReportParameter): void => {

        resetStates();
        setSubmitButtonDelete(SubmitButtonStatus.Validating);
        apiSendRequest({
            method: 'DELETE',
            endPoint: EAPIEndPoint.REPORT_PARAMETER,
            resourceId: values.id,
            callbackSuccess: (reportParameters) => {
                reportDispatch(updateReportParameters({report_id: reportId, parameters: reportParameters}))
            },
            callbackError: (errorResponse) => {
                setSubmitButtonDelete(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(errorResponse.message);
            }
        });
    };

    const getForcedDefaultValueInput = (parameter: TReportParameter, formik: FormikProps<any>): React.ReactElement => {

        switch (parameter.parameter_input?.parameter_input_type?.name) {

            case EParameterInputType.DATE:

                return <Calendar
                    id={'forced_default_value_' + parameter.id}
                    {...formik.getFieldProps('forced_default_value')}
                    value={new Date(formik.values.forced_default_value)}
                    className={!!formik.errors.forced_default_value ? 'p-invalid w-full' : 'w-full'}
                    placeholder={t('report:form.override_default_value').toString()}
                    onChange={(event) => {

                        formik.handleChange({
                            target: {
                                value: event.value ? event.value.toLocaleString(undefined, {
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric'
                                }) : '',
                                name: 'forced_default_value'
                            }
                        });
                    }}
                />

            default:

                return (
                    <InputText
                        id={'forced_default_value_' + parameter.id}
                        type="text"
                        {...formik.getFieldProps('forced_default_value')}
                        className={!!formik.errors.forced_default_value ? 'p-invalid w-full' : 'w-full'}
                        placeholder={t('report:form.override_default_value').toString()}
                        keyfilter={/[a-zA-Z0-9_,]/}
                    />
                )
        }
    }

    return (
        <Formik
            key={parameter.id}
            validateOnMount={true}
            validationSchema={Yup.object({
                id: Yup.number().required(),
                report_id: Yup.number().required(),
                parameter_input_id: Yup.number().required().min(1),
                name: Yup.string().required().min(2),
                variable_name: Yup.string().required().min(2),
                following_parameter_next_to_this_one: Yup.boolean().required(),
                forced_default_value: Yup.string().notRequired(),
            })}
            onSubmit={(formikValues, formikHelpers) => {
                if (parameter.id === 0) {

                    handleOnCreate(formikValues, formikHelpers.resetForm);

                } else {

                    handleOnUpdate(formikValues)
                }
            }}
            initialValues={{
                id: parameter.id,
                report_id: reportId,
                parameter_input_id: parameter.parameter_input !== undefined ? parameter.parameter_input.id : 0,
                name: parameter.name,
                variable_name: parameter.variable_name,
                following_parameter_next_to_this_one: parameter.following_parameter_next_to_this_one,
                forced_default_value: parameter.forced_default_value !== null ? parameter.forced_default_value : '',
                available_public_access: parameter.available_public_access !== null ? parameter.available_public_access : true
            }}
        >
            {(formik) => (

                <Form placeholder="" onSubmit={formik.handleSubmit}>
                    <div className="formgrid grid">
                        <div className="field md:col-6">
                            <label htmlFor={'name_' + parameter.id}>{t('common:form.name')}</label>
                            <InputText
                                id={'name_' + parameter.id}
                                type="text"
                                {...formik.getFieldProps('name')}
                                className={!!formik.errors.name ? 'p-invalid w-full' : 'w-full'}
                                placeholder={t('common:form.name').toString()}
                                autoFocus
                            />
                        </div>

                        <div className="field md:col-6">
                            <label htmlFor={'variable_name_' + parameter.id}>
                                {t('report:form.report_parameter_variable_name').toString()}
                            </label>
                            <InputText
                                id={'variable_name_' + parameter.id}
                                type="text"
                                {...formik.getFieldProps('variable_name')}
                                className={!!formik.errors.variable_name ? 'p-invalid w-full' : 'w-full'}
                                placeholder={t('report:form.report_parameter_variable_name').toString()}
                                keyfilter="alphanum"
                            />
                        </div>

                        <div className="field md:col-6">
                            <label htmlFor={'parameter_inputs_' + parameter.id}>
                                {t('report:form.choose_parameter').toString()}
                            </label>
                            <DropdownParameterInput
                                confConnectorId={confConnectorId}
                                id={'parameter_inputs_' + parameter.id}
                                isInvalid={!!formik.errors.parameter_input_id}
                                onChange={(event) => {
                                    formik.handleChange({
                                        target: {value: event.value, name: 'parameter_input_id'}
                                    });
                                }}
                                value={formik.values.parameter_input_id}
                            />
                        </div>

                        <div className="field md:col-6">
                            <Tooltip target=".forced-default-value-tooltip"
                                     position="bottom"
                                     content={t('settings:input_parameters.can_use_multiple_value').toString()}
                                     showDelay={env.tooltipShowDelay}
                                     hideDelay={env.tooltipHideDelay}
                            />
                            <label htmlFor={'forced_default_value_' + parameter.id}>
                                {t('report:form.override_default_value').toString()}
                            </label>
                            &nbsp;&nbsp;&nbsp;
                            <i className="pi pi-question-circle forced-default-value-tooltip"/>
                            {getForcedDefaultValueInput(parameter, formik)}
                        </div>

                        <div className="field col-6">
                            <label htmlFor={'following_parameter_next_to_this_one_' + parameter.id}>
                                {t('report:form.following_parameter_next_to_this_one').toString()}
                            </label><br/>
                            <InputSwitch
                                id={'following_parameter_next_to_this_one_' + parameter.id}
                                checked={formik.values.following_parameter_next_to_this_one}
                                {...formik.getFieldProps('following_parameter_next_to_this_one')}
                            />
                        </div>

                        <Tooltip target=".available-public-access-tooltip"
                                 position="bottom"
                                 content={t('report:form.available_public_access_tooltip').toString()}
                                 showDelay={env.tooltipShowDelay}
                                 hideDelay={env.tooltipHideDelay}
                        />

                        <div className="field col-6">
                            <label htmlFor={'available_public_access_' + parameter.id}>
                                {t('report:form.available_public_access').toString()}
                            </label>&nbsp;&nbsp;&nbsp;
                            <i className="pi pi-question-circle available-public-access-tooltip"/>
                            <br/>
                            <InputSwitch
                                id={'available_public_access_' + parameter.id}
                                checked={formik.values.available_public_access}
                                {...formik.getFieldProps('available_public_access')}
                            />
                        </div>
                    </div>

                    <div className="flex justify-content-end">
                        <div className="flex justify-content-end">
                            {!isNewParameter ?
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
                                        buttonStatus={submitButtonCreate}
                                        disabled={!formik.isValid}
                                        labels={{
                                            default: t('common:form.create').toString(),
                                            validating: t('common:form.creating').toString(),
                                            validated: t('common:form.created').toString(),
                                            notValidated: t('common:form.create_failed').toString(),
                                        }}
                                        className="mr-3"
                                        type="submit"
                                    />
                                </div>
                            }
                        </div>
                    </div>

                    {displayError && <div className="col-12">
                        <Message severity="error" text={errorMessage}/>
                    </div>}

                </Form>
            )}

        </Formik>
    )
}

export default ReportParameterForm;
