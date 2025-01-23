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

import { Formik }                from "formik";
import i18n                      from "i18next";
import { Card }                  from "primereact/card";
import { Dropdown }              from "primereact/dropdown";
import { InputText }             from "primereact/inputtext";
import { Message }               from "primereact/message";
import * as React                from 'react';
import { useTranslation }        from "react-i18next";
import { Navigate, useNavigate } from 'react-router-dom';
import * as Yup                  from "yup"

import { apiSendRequest }                        from '../../services/api';
import { context as authContext }                from "../../contexts/auth/store/context";
import { login }                                 from "../../contexts/auth/store/actions";
import { context as apiDataContext }             from "../../contexts/api_data/store/context";
import { organizationUserChange }                from "../../contexts/api_data/store/actions";
import ButtonWithSpinner, { SubmitButtonStatus } from "../common/form/ButtonWithSpinner";
import { context as preferencesContext }         from "../../contexts/preferences/store/context";
import { defaultOrganizationChanged }            from "../../contexts/preferences/store/actions";
import * as RTReport                             from "../../contexts/report/ReportContextProvider";
import { resetReportsState }                     from "../../contexts/report/store/actions";
import apiDataCacheRefresh                       from "../../contexts/api_data/store/cacheRefresh";
import { EAPIEndPoint }                          from "../../types/EAPIEndPoint";
import { TLogin }                                from "../../types/TLogin";
import { GOT_ORGANIZATIONS }                     from "../../contexts/api_data/store/types";
import TOrganizationUser                         from "../../types/TOrganizationUser";
import env                                       from '../../envVariables';

const Login = () => {

    const {t} = useTranslation('common');
    const navigate = useNavigate();

    const {state: authState, mDispatch: authDispatch} = React.useContext(authContext);
    const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const {preferencesState, preferencesStateDispatch: preferencesDispatch} = React.useContext(preferencesContext);
    const reportDispatch = RTReport.useDispatch();

    const [submitButtonStatus, setSubmitButtonStatus] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);

    const handleOnSubmit = (tlogin: TLogin): void => {

        setSubmitButtonStatus(SubmitButtonStatus.Validating);
        authDispatch(
            login({
                username: tlogin.username,
                password: tlogin.password,
                locale: tlogin.locale,
                organizationId: preferencesState.defaultOrganizationId,
            }));
    }

    // Handle error login
    //
    React.useEffect(() => {

        if (authState.loginError.status === 'Error') {

            setSubmitButtonStatus(SubmitButtonStatus.NotValidated);
        }
    }, [authState.loginError]);

    // Handle password reset, licence setup, organization change, when user is logged.
    //
    React.useEffect(() => {

        if (authState.isLoggedIn) {

            if (authState.user.reset_password === true) {

                navigate("/reset-password");
            }

            const previousUserId = Number(localStorage.getItem('previousUserId'));
            const previousOrganizationId = Number(localStorage.getItem('previousOrganizationId'));

            // @todo check if it's really working
            if (previousUserId !== authState.user.id) {

                reportDispatch(resetReportsState());
            }

            // Organization changed, cleanup everything.
            if (previousOrganizationId > 0 && authState.user.organization_user.organization_id !== previousOrganizationId) {

                apiSendRequest({
                    method: 'GET',
                    endPoint: EAPIEndPoint.USER,
                    extraUrlPath: 'change-organization-user',
                    urlParameters: [{
                        key: 'organization-id',
                        value: authState.user.organization_user.organization_id
                    }],
                    callbackSuccess: () => {

                        apiDataDispatch(organizationUserChange(authState.user.organization_user.organization_id));
                        apiDataCacheRefresh(authState.user.organization_user.organization_id, apiDataDispatch).then();
                        preferencesDispatch(defaultOrganizationChanged(authState.user.organization_user.organization_id));
                        apiDataDispatch({
                            type: GOT_ORGANIZATIONS, payload:
                                authState.user.organization_users.map((organization_user: TOrganizationUser) => {
                                    return organization_user.organization;
                                })
                        });
                    }
                });
            }
            // We logged without Organization being changed, so, let's just refresh the cache.
            else {

                apiDataDispatch({
                    type: GOT_ORGANIZATIONS,
                    payload:
                        authState.user.organization_users.map(
                            (organization_user: TOrganizationUser) => {
                                return organization_user.organization;
                            }
                        )
                });
                apiDataCacheRefresh(authState.user.organization_user.organization_id, apiDataDispatch).then();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        apiDataState.reports,
        authState.user.is_super_admin,
        authState.isLoggedIn,
        authState.user,
        authState.user.id,
        authState.user.organization_user.organization_id,
        navigate,
        preferencesDispatch,
    ]);

    // Handle navigate to tab opened in the last user session.
    //
    if (authState.isLoggedIn) {

        let redirectTo = '/home';
        const previousUrl = sessionStorage.getItem('previousURL') || '';
        if (previousUrl.length > 2) {

            redirectTo = previousUrl;
            sessionStorage.setItem('previousURL', '');
        }

        return <Navigate replace to={redirectTo} state={{fromLogin: true}}/>;
    }

    return (
        <div id="animated-background">
            <div id="div-login" className="vertical-container">
                <Card className="card-login"
                      header={
                          <div>
                              <div className="login-logo"/>
                              <h1 className="flex justify-content-center flex-wrap">{t('common:welcome').toString()}</h1>
                          </div>
                      }
                      footer={
                          <>
                              <div className="flex">
                                  <div className="flex-1 flex align-items-center justify-content-center">
                                      {authState.loginError.status === 'Error' &&
                                          <Message severity="error" text={String(authState.loginError.message)}
                                                   className="mb-3"/>}
                                  </div>
                              </div>
                              <div className="flex">
                                  <div className="flex-1 flex align-items-center justify-content-center">
                                  <span className="text-xs font-light">
                                      <a href="https://www.rootdb.fr"
                                         target="_blank"
                                         rel="noreferrer"
                                         className="underline text-color-secondary"
                                      >RootDB</a>&nbsp;-&nbsp;v{process.env.REACT_APP_ROOTDB_VERSION}&nbsp;-&nbsp;µAtomicWeb
                                  </span>
                                  </div>
                              </div>
                          </>
                      }
                >
                    <Formik
                        validateOnMount
                        validationSchema={Yup.object({
                            username: Yup.string().required(),
                            password: Yup.string().required()
                        })}
                        onSubmit={values => handleOnSubmit(values as TLogin)}
                        initialValues={{
                            username: (env.REACT_APP_DEMO && env.REACT_APP_DEMO === 1) ? 'demo' : '',
                            password: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ?
                                (env.REACT_APP_DEMO && env.REACT_APP_DEMO === 1) ? 'modeedom' : 'localdevpassword'
                                :
                                (env.REACT_APP_DEMO && env.REACT_APP_DEMO === 1) ? 'modeedom' : '',
                            locale: localStorage.getItem('lang') ? localStorage.getItem('lang')?.substring(0, 2) : 'en'
                        }}
                    >
                        {formik => (
                            <form onSubmit={formik.handleSubmit}>
                                <div className="grid">
                                    <div className="field col-12">
                                        <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-user"/>
                                        </span>
                                            <span className="p-float-label">

                                            {(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && (!env.REACT_APP_DEMO || env.REACT_APP_DEMO !== 1) ?
                                                <Dropdown
                                                    id="username"
                                                    optionLabel="name"
                                                    optionValue="name"
                                                    placeholder={t('report:form.choose_users').toString()}
                                                    filter
                                                    {...formik.getFieldProps('username')}
                                                    options={
                                                        [
                                                            {name: 'super-admin'},
                                                            {name: 'admindev_user'},
                                                            {name: 'viewer_user'},
                                                            {name: 'admin_user'},
                                                            {name: 'dev_user'},
                                                        ]
                                                    }
                                                />
                                                :
                                                <InputText
                                                    id="username"
                                                    type="text"
                                                    {...formik.getFieldProps('username')}
                                                    className={!!formik.errors.username ? 'p-invalid w-full' : 'w-full'}
                                                />
                                            }

                                                <label htmlFor="username">{t('form.username')}</label>
                                        </span>
                                        </div>
                                    </div>

                                    <div className="field col-12">
                                        <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-lock"/>
                                        </span>
                                            <span className="p-float-label">
                                            <InputText
                                                id="password"
                                                type="password"
                                                {...formik.getFieldProps('password')}
                                                className={!!formik.errors.password ? 'p-invalid w-full' : 'w-full'}
                                            />
                                           <label htmlFor="password">{t('form.password')}</label>
                                        </span>
                                        </div>
                                    </div>

                                    <div className="field col-12">
                                        <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-flag"/>
                                        </span>
                                            <span className="p-float-label">
                                            <Dropdown
                                                id="locale"
                                                options={[
                                                    {label: 'English', value: 'en'},
                                                    {label: 'Français', value: 'fr'},
                                                ]}
                                                {...formik.getFieldProps('locale')}
                                                className="w-full"
                                                onChange={(e) => {

                                                    formik.handleChange({
                                                        target: {value: e.value, name: 'locale'}
                                                    });

                                                    i18n.changeLanguage(String(e.value)).then(() => {
                                                        localStorage.setItem('lang', e.value);
                                                    });

                                                }}
                                            />
                                           <label
                                               htmlFor="locale">{t('settings:interface_preferences.lang.label')}</label>
                                        </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-content-end">
                                    <ButtonWithSpinner
                                        key={`login_button_${formik.values.locale}`}
                                        type="submit"
                                        disabled={!formik.isValid}
                                        buttonStatus={submitButtonStatus} labels={{
                                        default: t('common:form.login').toString(),
                                        validating: t('common:form.login_validating').toString(),
                                        validated: t('common:form.login__validated').toString(),
                                        notValidated: t('common:form.login_not_validated').toString(),
                                    }}
                                    />
                                </div>
                            </form>
                        )}
                    </Formik>
                </Card>
            </div>
        </div>
    )
        ;
}

export default Login;