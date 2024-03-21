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

import { Form, Formik }   from "formik";
import { InputText }      from "primereact/inputtext";
import { Message }        from "primereact/message";
import * as React         from "react";
import { useTranslation } from "react-i18next";
import * as Yup           from "yup";


import ButtonWithSpinner, { SubmitButtonStatus } from "../common/form/ButtonWithSpinner";
import { apiSendRequest }                        from "../../services/api";
import { EAPIEndPoint }                          from "../../types/EAPIEndPoint";
import apiDataContext                            from "../../contexts/api_data/store/context";
import { ICallbackOrganizationUpdate, }          from "../../types/ICallBacks";
import TOrganization                             from "../../types/TOrganization";
// import { ConfirmPopup, confirmPopup }            from "primereact/confirmpopup";
import TOrganizationUser                         from "../../types/TOrganizationUser";
import MultiSelectUser                           from "../common/form/MultiSelectUser";
import TUser                                     from "../../types/TUser";
import { GOT_ORGANIZATION }                      from "../../contexts/api_data/store/types";


const OrganizationForm: React.FC<{
    organization: TOrganization | undefined,
    users: Array<TUser>,
    isNewOrganization?: boolean,
    onUpdate?: ICallbackOrganizationUpdate,
}> = ({
          organization,
          users,
          isNewOrganization,
          onUpdate,
      }): React.ReactElement => {

    const {t} = useTranslation(['common']);
    // const {state: apiDataState, mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const {mDispatch: apiDataDispatch} = React.useContext(apiDataContext);

    const [submitButtonCreate, setSubmitButtonCreate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonUpdate, setSubmitButtonUpdate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    // const [submitButtonDelete, setSubmitButtonDelete] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [displayError, setDisplayError] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    const resetStates = (): void => {

        setDisplayError(false);
        setErrorMessage('');
    }

    const handleOnCreate = (values: TOrganization): void => {

        resetStates();
        setSubmitButtonCreate(SubmitButtonStatus.Validating);

        values.organization_users = [];

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.ORGANIZATION,
            formValues: values,
            callbackSuccess: (response: TOrganization) => {

                setSubmitButtonCreate(SubmitButtonStatus.Validated);
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

    const handleOnUpdate = (values: TOrganization): void => {

        resetStates();
        setSubmitButtonUpdate(SubmitButtonStatus.Validating);

        values.organization_users = [];

        apiSendRequest({
            method: 'PUT',
            endPoint: EAPIEndPoint.ORGANIZATION,
            formValues: values,
            resourceId: values.id,
            callbackSuccess: (response: TOrganization) => {
                setSubmitButtonUpdate(SubmitButtonStatus.Validated);

                apiDataDispatch({type: GOT_ORGANIZATION, payload: response})
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

    // const deleteOrganization = (values: TOrganization) => {
    //
    //     resetStates();
    //     // setSubmitButtonDelete(SubmitButtonStatus.Validating);
    //
    //     values.organization_users = [];
    //
    //     apiSendRequest({
    //         method: 'DELETE',
    //         endPoint: EAPIEndPoint.ORGANIZATION,
    //         resourceId: values.id,
    //         callbackSuccess: () => {
    //
    //             if (onUpdate) {
    //
    //                 onUpdate(values);
    //             }
    //         },
    //         callbackError: (error) => {
    //
    //             // setSubmitButtonDelete(SubmitButtonStatus.NotValidated);
    //             setDisplayError(true);
    //             setErrorMessage(error.message);
    //         }
    //     });
    // }

    // const confirmDelete = (event: React.MouseEvent<HTMLButtonElement>, organization: TOrganization) => {
    //
    //     confirmPopup({
    //         target: event.currentTarget,
    //         message: (
    //             <>
    //                 <strong>{t('settings:organization.delete_organization_alert', {count: organization.reports_count})}</strong>
    //                 <br/>
    //                 {t('common:proceed_question').toString()}
    //             </>
    //         ),
    //         icon: 'pi pi-exclamation-triangle',
    //         accept: () => deleteOrganization(organization),
    //         acceptLabel: t('common:yes').toString(),
    //         acceptIcon: 'pi pi-check',
    //         acceptClassName: 'p-button-danger',
    //         rejectLabel: t('common:no').toString(),
    //         rejectIcon: 'pi pi-times',
    //         rejectClassName: 'p-button-metric',
    //     });
    // }

    if (organization === undefined) {

        return <></>;
    }

    return (
        <>
            <Formik
                key={organization.id}
                validateOnMount={true}
                validationSchema={Yup.object({
                    id: Yup.number().required(),
                    name: Yup.string().min(3).max(50).required(),
                })}
                onSubmit={values => {
                    if (isNewOrganization) {
                        handleOnCreate(values);
                    } else {
                        handleOnUpdate(values);
                    }
                }}
                initialValues={{
                    ...organization,
                    user_ids: organization?.organization_users?.map((organizationUser: TOrganizationUser) => organizationUser.user_id) ?? [],
                }}
            >
                {(formik) => (
                    <Form placeholder="" onSubmit={formik.handleSubmit}>

                        <div className="formgrid grid">
                            <div className="field col-12 md:col-4">
                                <label htmlFor={'name' + organization.id} className="block">
                                    {t('common:form.name').toString()}
                                </label>
                                <InputText
                                    id={'name' + organization.id}
                                    type="text"
                                    {...formik.getFieldProps('name')}
                                    className={!!formik.errors.name ? 'p-invalid w-full' : 'w-full'}
                                    placeholder={t('common:form.name').toString()}
                                />
                            </div>
                            <div className="field col-12 md:col-8">
                                <label htmlFor={'user_ids' + organization.id} className="block">
                                    {t('common:users').toString()}
                                </label>
                                <MultiSelectUser
                                    onChange={(event) => {
                                        formik.handleChange({
                                            target: {
                                                value: event.value,
                                                name: 'user_ids'
                                            }
                                        });
                                    }}
                                    id={'user_ids' + organization.id}
                                    isInvalid={!!formik.errors.user_ids}
                                    values={formik.values.user_ids ?? []}
                                    users={users}
                                />
                            </div>
                        </div>

                        <div className="flex justify-content-end">
                            <div className="flex justify-content-end">
                                {!isNewOrganization ?
                                    <>
                                        <div className="mr-2">
                                            {/*<ButtonWithSpinner*/}
                                            {/*    type="button"*/}
                                            {/*    buttonStatus={submitButtonDelete}*/}
                                            {/*    disabled={!formik.isValid}*/}
                                            {/*    id={`delete-user.${formik.values.id}`}*/}
                                            {/*    labels={{*/}
                                            {/*        default: t('common:form.delete').toString(),*/}
                                            {/*        validating: t('common:form.deleting').toString(),*/}
                                            {/*        validated: t('common:form.deleted').toString(),*/}
                                            {/*        notValidated: t('common:form.delete_failed').toString(),*/}
                                            {/*    }}*/}
                                            {/*    severity="danger"*/}
                                            {/*    validateAction={apiDataState.reports.length === 0}*/}
                                            {/*    validateActionCallback={() => deleteOrganization(formik.values)}*/}
                                            {/*    onClick={(event) => {*/}
                                            {/*        event.preventDefault();*/}

                                            {/*        if (apiDataState.reports.length > 0) {*/}
                                            {/*            confirmDelete(event, formik.values);*/}
                                            {/*        }*/}
                                            {/*    }}*/}
                                            {/*/>*/}
                                            {/*<ConfirmPopup/>*/}
                                        </div>

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

export default OrganizationForm;