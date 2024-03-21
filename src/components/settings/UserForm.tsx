import { Form, Formik }        from "formik";
import { Button }              from "primereact/button";
import { Column }              from "primereact/column";
import { ConfirmDialog }       from "primereact/confirmdialog";
import { DataTable }           from "primereact/datatable";
import { DropdownChangeEvent } from "primereact/dropdown";
import { InputSwitch }         from "primereact/inputswitch";
import { InputText }           from "primereact/inputtext";
import { Message }             from "primereact/message";
import { SelectButton }        from "primereact/selectbutton";
import { TabPanel, TabView }   from "primereact/tabview";
import * as React              from "react";
import { useTranslation }      from "react-i18next";
import * as Yup                from "yup";


import ButtonWithSpinner, { SubmitButtonStatus } from "../common/form/ButtonWithSpinner";
import TUser                                     from "../../types/TUser";
import { apiSendRequest }                        from "../../services/api";
import { EAPIEndPoint }                          from "../../types/EAPIEndPoint";
import MultiSelectGroup                          from "../common/form/MultiSelectGroup";
import TGroup                                    from "../../types/TGroup";
import TRole                                     from "../../types/TRole";
import SelectButtonRoles                         from "../common/form/SelectButtonRoles";
import apiDataContext                            from "../../contexts/api_data/store/context";
import { ERole }                                 from "../../types/ERole";
import DropdownUser                              from "../common/form/DropdownUser";
import { capitalizeFirstLetter, filterUsers }    from "../../utils/tools";
import { ICallbackUserUpdate }                   from "../../types/ICallBacks";
import { context as authContext }                from "../../contexts/auth/store/context";
import { testDevUserExists }                     from "../../contexts/auth/store/actions";
import TReport                                   from "../../types/TReport";

enum EDeleteUserMethod {
    DELETE_EVERYTHING,
    ASSIGN_TO_ANOTHER_DEV
}

const UserForm: React.FC<{
    user: TUser | undefined,
    isNewUser?: boolean,
    onUpdate?: ICallbackUserUpdate,
    profileMode?: boolean
}> = ({
          user,
          isNewUser,
          onUpdate,
          profileMode = true
      }): React.ReactElement => {

    const {state: authState, mDispatch: authStateDispatch} = React.useContext(authContext);
    const {state: apiDataState} = React.useContext(apiDataContext);

    const {t} = useTranslation(['common', 'report']);

    const [submitButtonCreate, setSubmitButtonCreate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonUpdate, setSubmitButtonUpdate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonDelete, setSubmitButtonDelete] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [displayError, setDisplayError] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [inputPasswordType, setInputPasswordType] = React.useState('password');
    const [userDeleteMethodExplanation, setUserDeleteMethodExplanation] = React.useState<string>('');
    const [userNbReports, setUserNbReports] = React.useState<number>(0);
    const [userDeleteMethod, setUserDeleteMethod] = React.useState<number>(EDeleteUserMethod.ASSIGN_TO_ANOTHER_DEV);
    const [userDeleteNewUserDevId, setUserDeleteNewUserDevId] = React.useState<number>(0);
    const [userDeleteConfirmVisible, setUserDeleteConfirmVisible] = React.useState<boolean>(false);
    const userDeleteMethods = [
        {label: t('common:delete_all').toString(), value: EDeleteUserMethod.DELETE_EVERYTHING},
        {label: t('settings:user.assign_to_another_dev').toString(), value: EDeleteUserMethod.ASSIGN_TO_ANOTHER_DEV},
    ];

    const resetStates = (): void => {

        setDisplayError(false);
        setErrorMessage('');
    }

    const handleOnCreate = (values: TUser): void => {

        resetStates();
        setSubmitButtonCreate(SubmitButtonStatus.Validating);

        values.organization_id = authState.user.organization_user.organization_id;

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.USER,
            formValues: values,
            callbackSuccess: (response: TUser) => {

                setSubmitButtonCreate(SubmitButtonStatus.Validated);
                if (authState.user.is_super_admin) {

                    authStateDispatch(testDevUserExists(true));
                }
                if (onUpdate) {

                    onUpdate(response);
                }
            },
            callbackError: (error) => {

                setSubmitButtonCreate(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    }

    const handleOnUpdate = (values: TUser): void => {

        resetStates();
        setSubmitButtonUpdate(SubmitButtonStatus.Validating);

        values.organization_id = authState.user.organization_user.organization_id;

        apiSendRequest({
            method: 'PUT',
            endPoint: EAPIEndPoint.USER,
            formValues: {...values, 'for-admin': 1},
            resourceId: values.id,
            callbackSuccess: (response: TUser) => {
                setSubmitButtonUpdate(SubmitButtonStatus.Validated);

                if (authState.user.is_super_admin) {

                    authStateDispatch(testDevUserExists(true));
                }
                if (onUpdate) {
                    onUpdate(response);
                }
            },
            callbackError: (error) => {

                setSubmitButtonUpdate(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    };

    const deleteUser = (values: TUser) => {

        resetStates();
        setSubmitButtonDelete(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'DELETE',
            endPoint: EAPIEndPoint.USER,
            resourceId: values.id,
            urlParameters: userDeleteMethod === EDeleteUserMethod.ASSIGN_TO_ANOTHER_DEV
                ? [{key: 'new-user-dev-id', value: userDeleteNewUserDevId}]
                : [],
            callbackSuccess: () => {

                if (authState.user.is_super_admin) {

                    authStateDispatch(testDevUserExists(true));
                }
                if (onUpdate) {

                    onUpdate(values);
                }
            },
            callbackError: (error) => {

                setSubmitButtonDelete(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    }

    const handleShowPassword = (): void => {

        if (inputPasswordType === 'password') {

            setInputPasswordType('text');
        } else {

            setInputPasswordType('password');
        }
    };

    // To count reports made by a User with a DEVELOPER role.
    //
    React.useEffect(() => {

        if (user && authState.user.organization_user.ui_grants.report.edit) {

            let nbReports = 0;
            for (const report of apiDataState.reports) {

                if (report.user_id === user.id) {

                    nbReports += 1;
                }
            }

            setUserNbReports(nbReports);
        }
    }, [apiDataState.reports, authState.user.organization_user.ui_grants.report.edit, user]);

    // To select the first User with a DEVELOPER role by default.
    // In delete User ConfirmDialog.
    //
    React.useEffect(() => {

        if (user && apiDataState.users.length > 0 && !apiDataState.usersLoading) {

            const filteredUser: Array<TUser> = filterUsers(apiDataState.users, [ERole.DEVELOPER], [user.id]);

            if (filteredUser.length > 0) {

                setUserDeleteNewUserDevId(filteredUser[0].id);
            }
        }
    }, [apiDataState.users, apiDataState.usersLoading, user]);

    // Used to update delete method explanation depending on the one selected.
    //
    React.useEffect(() => {

        if (userDeleteMethod === EDeleteUserMethod.DELETE_EVERYTHING) {

            setUserDeleteMethodExplanation(t('settings:user.will_delete_everything').toString());
        } else {

            setUserDeleteMethodExplanation(t('settings:user.will_update_report_and_input_parameters').toString());
        }

    }, [userDeleteMethod, t]);

    if (user === undefined) {

        return <></>;
    }

    return (
        <>
            {!profileMode &&
                <ConfirmDialog
                    accept={() => {

                        deleteUser(user);
                        setUserDeleteConfirmVisible(false);
                    }}
                    acceptLabel={userDeleteMethod === EDeleteUserMethod.DELETE_EVERYTHING
                        ? t('common:form.delete').toString()
                        : capitalizeFirstLetter(t('settings:user.assign_to_another_dev').toString())
                        + ' ' + t('common:and').toString() + ' ' + t('common:form.delete').toString().toLowerCase()
                    }
                    acceptIcon={'pi pi-check'}
                    acceptClassName={userDeleteMethod === EDeleteUserMethod.DELETE_EVERYTHING ? 'p-button-danger' : 'p-button-secondary'}
                    contentStyle={{height: '550px'}}
                    contentClassName="flex flex-row align-items-start justify-content-start"
                    header={t('settings:user.delete_user_alert', {count: userNbReports}).toString()}
                    message={
                        <TabView className=" ">
                            <TabPanel
                                header={t('settings:global_administration.connector.action_to_perform').toString()}>
                                <div className="formgrid grid">
                                    <div className="field col-12">
                                        <SelectButton
                                            value={userDeleteMethod}
                                            options={userDeleteMethods}
                                            onChange={(event) => {
                                                setUserDeleteMethod(event.value);
                                            }}
                                        />
                                    </div>
                                    <div className="field col-12">
                                        <Message
                                            style={{width: '100%'}}
                                            severity={userDeleteMethod === EDeleteUserMethod.ASSIGN_TO_ANOTHER_DEV ? 'info' : 'warn'}
                                            text={userDeleteMethodExplanation}
                                        />
                                    </div>
                                    <div className="field col-12">
                                        <DropdownUser
                                            disabled={userDeleteMethod !== EDeleteUserMethod.ASSIGN_TO_ANOTHER_DEV}
                                            defaultValue={userDeleteNewUserDevId}
                                            id="user_delete_new_dev_id"
                                            isInvalid={false}
                                            selectFirst
                                            filterOnRoles={[ERole.DEVELOPER]}
                                            excludeUserIds={[user.id]}
                                            onChange={(event: DropdownChangeEvent) => {

                                                setUserDeleteNewUserDevId(event.value);
                                            }}
                                        />
                                    </div>
                                </div>

                            </TabPanel>

                            <TabPanel
                                header={t('settings:global_administration.connector.affected_reports').toString()}>
                                <DataTable
                                    value={apiDataState.reports.filter((report: TReport) => report.user_id === user.id)}
                                    size="small" scrollable scrollHeight="430px">
                                    <Column field="name" header={t('common:form.name').toString()}></Column>
                                    <Column field="description_listing"
                                            header={t('common:form.description').toString()}>
                                    </Column>
                                </DataTable>
                            </TabPanel>
                        </TabView>
                    }
                    onHide={() => setUserDeleteConfirmVisible(false)}
                    reject={() => {

                        setUserDeleteConfirmVisible(false);
                    }}
                    rejectClassName="p-button-info"
                    rejectIcon="pi pi-times"
                    rejectLabel={t('common:form.cancel').toString()}
                    visible={userDeleteConfirmVisible}
                />
            }
            <Formik
                key={user.id}
                validateOnMount={true}
                validationSchema={Yup.object({
                    id: Yup.number().required(),
                    name: Yup.string().min(3).max(50).required(),
                    lastname: Yup.string().nullable(),
                    firstname: Yup.string().nullable(),
                    email: Yup.string().email().nullable(),
                    is_active: Yup.boolean().required(),
                    password: isNewUser ? Yup.string().required().min(8).max(100) : Yup.string().min(8).max(100),
                    role_ids: Yup.array().required().min(1),
                    reset_password: Yup.boolean(),
                    group_ids: Yup.array()
                })}
                onSubmit={values => {
                    if (isNewUser) {
                        handleOnCreate(values);
                    } else {
                        handleOnUpdate(values);
                    }
                }}
                initialValues={{
                    ...user,
                    // email: user.email.length === 0 ? '' : user.email,
                    password: '',
                    reset_password: false,
                    group_ids: user.organization_user?.groups.map((group: TGroup) => group.id) ?? [],
                    role_ids: user.organization_user?.roles.map((role: TRole) => role.id) ?? []
                }}
            >
                {(formik) => (
                    <Form placeholder="" onSubmit={formik.handleSubmit}>

                        <div className="formgrid grid">
                            <div className="field col-12 md:col-4">
                                <label htmlFor={'name' + user.id} className="block">
                                    {t('common:form.username').toString()}
                                </label>
                                <InputText
                                    id={'name' + user.id}
                                    type="text"
                                    {...formik.getFieldProps('name')}
                                    className={!!formik.errors.name ? 'p-invalid w-full' : 'w-full'}
                                    placeholder={t('common:form.username').toString()}
                                    keyfilter="alphanum"
                                    disabled={profileMode}
                                />
                            </div>

                            <div className="field col-12 md:col-4">
                                <label htmlFor={'name' + user.id}>
                                    {t('common:form.email').toString()}
                                </label>
                                <InputText
                                    id={'email' + user.id}
                                    type="email"
                                    {...formik.getFieldProps('email')}
                                    className={!!formik.errors.email ? 'p-invalid w-full' : 'w-full'}
                                    placeholder={t('common:form.email').toString()}
                                    keyfilter="email"
                                />
                            </div>

                            <div className="field col-12 md:col-2"
                                 style={{visibility: profileMode ? 'hidden' : 'visible'}}
                            >
                                <label htmlFor={'is_active' + user.id} className="block">
                                    {t('common:form.account_activation').toString()}
                                </label>
                                <InputSwitch
                                    id={'is_active' + user.id}
                                    checked={formik.values.is_active}
                                    {...formik.getFieldProps('is_active')}
                                />
                            </div>

                            <div className="field col-12 md:col-2"
                                 style={{visibility: profileMode ? 'hidden' : 'visible'}}
                            >
                                <label htmlFor={'is_active' + user.id} className="block">
                                    {t('settings:user.force_user_to_reset_his_password_at_next_login').toString()}
                                </label>
                                <InputSwitch
                                    id={'reset_password' + user.id}
                                    checked={formik.values.reset_password}
                                    {...formik.getFieldProps('reset_password')}
                                />
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col-12 md:col-4">
                                <label htmlFor={'lastname' + user.id} className="block">
                                    {t('settings:user.lastname').toString()}
                                </label>
                                <InputText
                                    id={'lastname' + user.id}
                                    type="text"
                                    {...formik.getFieldProps('lastname')}
                                    className={!!formik.errors.lastname ? 'p-invalid w-full' : 'w-full'}
                                    placeholder={t('settings:user.lastname').toString()}
                                />
                            </div>

                            <div className="field col-12 md:col-8 ">
                                <label
                                    htmlFor="password">{isNewUser ? t('common:form.password') : t('common:form.new_password')}
                                </label><br/>
                                <div className="p-inputgroup">
                                    <InputText
                                        id={'password' + user.id}
                                        type={inputPasswordType}
                                        {...formik.getFieldProps('password')}
                                        className={!!formik.errors.password ? 'p-invalid w-full' : 'w-full'}
                                        placeholder={t('common:form.new_password').toString()}
                                    />
                                    <Button
                                        icon={`pi ${inputPasswordType === 'password' ? 'pi-eye-slash' : 'pi-eye'}`}
                                        className="p-button-help w-1"
                                        onClick={() => handleShowPassword()}
                                        type="button"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col-12 md:col-4">
                                <label htmlFor={'firstname' + user.id}
                                       className="block">
                                    {t('settings:user.firstname').toString()}
                                </label>
                                <InputText
                                    id={'firstname' + user.id}
                                    type="text"
                                    {...formik.getFieldProps('firstname')}
                                    className={!!formik.errors.firstname ? 'p-invalid w-full' : 'w-full'}
                                    placeholder={t('settings:user.firstname').toString()}
                                />
                            </div>

                            <div className="field col-12 md:col-8">
                                <label htmlFor="group_ids" className="block">{t('common:groups')}</label>
                                <MultiSelectGroup
                                    onChange={(event) => {
                                        formik.handleChange({
                                            target: {
                                                value: event.value,
                                                name: 'group_ids'
                                            }
                                        });
                                    }}
                                    id={'group_ids' + user.id}
                                    isInvalid={!!formik.errors.group_ids}
                                    values={formik.values.group_ids}
                                    disabled={profileMode}
                                />
                            </div>

                        </div>

                        <div className="formgrid grid">
                            <div className="field col-12 md:col-12">
                                <label htmlFor="role_ids" className="block">{t('common:form.roles')}</label>
                                <SelectButtonRoles
                                    onChange={(event) => {
                                        formik.handleChange({
                                            target: {
                                                value: event.value,
                                                name: 'role_ids'
                                            }
                                        });
                                    }}
                                    id={'role_ids' + user.id}
                                    isInvalid={!!formik.errors.role_ids}
                                    values={formik.values.role_ids}
                                    disabled={profileMode}
                                />
                            </div>

                        </div>

                        <div className="flex justify-content-end">
                            <div className="flex justify-content-end">
                                {!isNewUser ?
                                    <>
                                        {!profileMode &&
                                            <div className="mr-2">
                                                <ButtonWithSpinner
                                                    type="button"
                                                    buttonStatus={submitButtonDelete}
                                                    disabled={!formik.isValid}
                                                    id={`delete-user.${formik.values.id}`}
                                                    labels={{
                                                        default: t('common:form.delete').toString(),
                                                        validating: t('common:form.deleting').toString(),
                                                        validated: t('common:form.deleted').toString(),
                                                        notValidated: t('common:form.delete_failed').toString(),
                                                    }}
                                                    severity="danger"
                                                    validateAction={userNbReports === 0}
                                                    validateActionCallback={() => deleteUser(formik.values)}
                                                    onClick={(event) => {
                                                        event.preventDefault();

                                                        if (userNbReports > 0) {

                                                            setUserDeleteConfirmVisible(true);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        }
                                        <div className="mr-2">
                                            <ButtonWithSpinner
                                                type="submit"
                                                buttonStatus={submitButtonUpdate}
                                                disabled={!formik.isValid}
                                                labels={{
                                                    default: t('common:form.update').toString(),
                                                    validating: t('common:form.updating').toString(),
                                                    validated: t('common:form.updated').toString(),
                                                    notValidated: t('common:form.update_failed').toString(),
                                                }}
                                            />
                                        </div>
                                    </>
                                    :
                                    <div>
                                        <ButtonWithSpinner
                                            type="submit"
                                            buttonStatus={submitButtonCreate}
                                            disabled={!formik.isValid}
                                            labels={{
                                                default: t('common:form.create').toString(),
                                                validating: t('common:form.creating').toString(),
                                                validated: t('common:form.created').toString(),
                                                notValidated: t('common:form.create_failed').toString(),
                                            }}
                                            className="mr-3"
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
        </>
    );
}

export default UserForm;