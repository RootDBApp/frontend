import { Formik }         from "formik";
import { Button }         from "primereact/button";
import { Card }           from "primereact/card";
import { Divider }        from "primereact/divider";
import { Message }        from "primereact/message";
import { Password }       from "primereact/password";
import * as React         from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate }    from "react-router-dom";
import * as Yup           from "yup"

import { apiSendRequest }                        from '../../services/api';
import { context as authContext }                from "../../contexts/auth/store/context";
import { context as apiDataContext }             from "../../contexts/api_data/store/context";
import ButtonWithSpinner, { SubmitButtonStatus } from "../common/form/ButtonWithSpinner";
import { EAPIEndPoint }                          from "../../types/EAPIEndPoint";
import TUser                                     from "../../types/TUser";
import * as types                                from "../../contexts/auth/store/types";
import { leaveWSOrganizationChannel }            from "../../contexts/api_data/store/actions";
import { logout }                                from "../../contexts/auth/store/actions";
import { notificationEvent }                     from "../../utils/events";
import { EReportDevBarMessageType }              from "../../types/applicationEvent/EReportDevBarMessageType";

type TPasswords = {
    password: string,
    password2: string
}


const ResetPassword = () => {

    const {t} = useTranslation(['common', 'settings']);

    const navigate = useNavigate();

    const {state: authState, mDispatch: authDispatch} = React.useContext(authContext)
    const {mDispatch: apiDataDispatch} = React.useContext(apiDataContext);

    const [submitButtonStatus, setSubmitButtonStatus] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [displayError, setDisplayError] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    const resetStates = (): void => {

        setDisplayError(false);
        setErrorMessage('');
    }

    const handleOnSubmit = (values: TPasswords): void => {

        resetStates();
        setSubmitButtonStatus(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'PUT',
            endPoint: EAPIEndPoint.USER,
            extraUrlPath: `reset-password/${authState.user.id}`,
            formValues: {'password': values.password},
            callbackSuccess: (user: TUser) => {

                setSubmitButtonStatus(SubmitButtonStatus.Validated);

                authDispatch({type: types.RESET_PASSWORD_SUCCESS, payload: user});

                let redirectTo = '/home';
                const previousUrl = sessionStorage.getItem('previousURL') || '';
                if (previousUrl.length > 2) {

                    redirectTo = previousUrl;
                    sessionStorage.setItem('previousURL', '');
                }

                navigate(redirectTo);
                document.dispatchEvent(
                    notificationEvent({
                        message: t('settings:user.reset_password_success').toString(),
                        timestamp: Date.now(),
                        title: t('settings:user.reset_password_title').toString(),
                        forceInNotificationCenter: true,
                        type: EReportDevBarMessageType.LOG,
                        severity: "success",
                        toast: true,
                    })
                );
            },
            callbackError: (error) => {

                setSubmitButtonStatus(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    }

    const footer = (
        <React.Fragment>
            <Divider/>
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0" style={{lineHeight: '1.5'}}>
                <li>{t('common:form.at_least_one_lowercase')}</li>
                <li>{t('common:form.at_least_one_uppercase')}</li>
                <li>{t('common:form.at_least_one_numeric')}</li>
                <li>{t('common:form.minimum_8_characters')}</li>
            </ul>
        </React.Fragment>
    );

    return (
        <>
            <div id="div-login" className="vertical-container">
                <Card className="card-login"
                      title={t('settings:user.reset_password_title').toString()}
                      footer={
                          <>
                              {displayError && <div className="col-12">
                                  <Message severity="error" text={errorMessage}/>
                              </div>}
                          </>
                      }
                >
                    <Formik
                        validateOnMount
                        validationSchema={Yup.object({
                            password: Yup.string().required().min(8),
                            password2: Yup.string().min(8).required().oneOf([Yup.ref("password"), ''])
                        })}
                        onSubmit={values => handleOnSubmit(values as TPasswords)}
                        initialValues={{
                            password: '',
                            password2: ''
                        }}
                    >
                        {formik => (
                            <form onSubmit={formik.handleSubmit}>
                                <div className="grid">
                                    <Message text={t('common:form.please_setup_new_password').toString()}/>
                                    <Divider/>
                                    <div className="field col-12">
                                        <span className="p-float-label w-full">
                                            <Password
                                                id="password"
                                                type="password"
                                                {...formik.getFieldProps('password')}
                                                inputClassName={!!formik.errors.password ? 'p-invalid w-full' : 'w-full'}
                                                className={!!formik.errors.password ? 'p-invalid w-full' : 'w-full'}
                                                footer={footer}
                                                toggleMask
                                            />
                                            <label htmlFor="password">{t('common:form.new_password')}</label>
                                        </span>
                                    </div>

                                    <div className="field col-12">
                                        <span className="p-float-label w-full">
                                            <Password
                                                id="password2"
                                                type="password2"
                                                {...formik.getFieldProps('password2')}
                                                inputClassName={!!formik.errors.password2 ? 'p-invalid w-full' : 'w-full'}
                                                className={!!formik.errors.password2 ? 'p-invalid w-full' : 'w-full'}
                                            />
                                            <label htmlFor="password">{t('common:form.confirm_new_password')}</label>
                                        </span>
                                        {!!formik.errors.password2 && (
                                            <span>
                                                <small className="p-error">
                                                    {t('common:form.passwords_does_not_match').toString()}
                                                </small>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-content-end">
                                    <Button
                                        label={t('common:form.cancel').toString()}
                                        type="button"
                                        className="p-button-danger mr-2"
                                        onClick={() => {
                                            // Properly leave Organization ws.
                                            apiDataDispatch(leaveWSOrganizationChannel(authState.user.organization_user.organization_id));
                                            // Clean local storage.
                                            apiDataDispatch({type: "CLEAN_LOCAL_STORAGE", payload: undefined});
                                            // And store logged-out metric.
                                            authDispatch(logout(authState.user.id));
                                        }}
                                    />
                                    <ButtonWithSpinner
                                        type="submit"
                                        disabled={!formik.isValid}
                                        buttonStatus={submitButtonStatus} labels={{
                                        default: t('settings:user.change_password').toString(),
                                        validating: t('settings:user.change_password_validating').toString(),
                                        validated: t('settings:user.change_password_validated').toString(),
                                        notValidated: t('settings:user.change_password_not_validated').toString(),
                                    }}
                                    />
                                </div>

                            </form>
                        )}
                    </Formik>
                </Card>
            </div>
        </>
    );
}

export default ResetPassword;