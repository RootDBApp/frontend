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
import { InputText }      from "primereact/inputtext";
import { InputTextarea }  from "primereact/inputtextarea";
import { Message }        from "primereact/message";
import * as React         from "react";
import { useTranslation } from "react-i18next";
import * as Yup           from "yup";


import ButtonWithSpinner, { SubmitButtonStatus } from "../common/form/ButtonWithSpinner";
import { apiSendRequest }                        from "../../services/api";
import { EAPIEndPoint }                          from "../../types/EAPIEndPoint";
import MultiSelectOrganization                   from "../common/form/MultiSelectOrganization";
import TOrganization                             from "../../types/TOrganization";
import TServiceMessage                           from "../../types/TServiceMessage"

const ServiceMessageForm: React.FC<{
    serviceMessage: TServiceMessage,
    isNewServiceMessage?: boolean,
    onUpdate?: CallableFunction,
}> = ({
          serviceMessage,
          isNewServiceMessage,
          onUpdate
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'settings']);

    const [submitButtonCreate, setSubmitButtonCreate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonUpdate, setSubmitButtonUpdate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonDelete, setSubmitButtonDelete] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [displayError, setDisplayError] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    const resetStates = (): void => {

        setDisplayError(false);
        setErrorMessage('');
    }

    const handleOnCreate = (values: TServiceMessage): void => {

        resetStates();
        setSubmitButtonCreate(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.SERVICE_MESSAGE,
            formValues: values,
            callbackSuccess: () => {

                setSubmitButtonCreate(SubmitButtonStatus.Validated);
                if (onUpdate) {

                    onUpdate();
                }
            },
            callbackError: (error) => {

                setSubmitButtonCreate(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    }

    const handleOnUpdate = (values: TServiceMessage): void => {

        resetStates();
        setSubmitButtonUpdate(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'PUT',
            endPoint: EAPIEndPoint.SERVICE_MESSAGE,
            formValues: {...values},
            resourceId: values.id,
            callbackSuccess: () => {

                setSubmitButtonUpdate(SubmitButtonStatus.Validated);
                if (onUpdate) {

                    onUpdate();
                }
            },
            callbackError: (error) => {

                setSubmitButtonUpdate(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    };

    const handleOnDelete = (values: TServiceMessage) => {

        resetStates();
        setSubmitButtonDelete(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'DELETE',
            endPoint: EAPIEndPoint.SERVICE_MESSAGE,
            resourceId: values.id,
            callbackSuccess: () => {
                if (onUpdate) {

                    onUpdate();
                }
            },
            callbackError: (error) => {

                setSubmitButtonDelete(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    }

    return (
        <>
            <Formik
                key={serviceMessage.id}
                validateOnMount={true}
                validationSchema={Yup.object({
                    id: Yup.number().required(),
                    title: Yup.string().min(1).max(255).required(),
                    contents: Yup.string().min(1).required(),
                    organization_ids: Yup.array().required().min(1),
                })}
                onSubmit={values => {
                    if (isNewServiceMessage) {
                        handleOnCreate(values);
                    } else {
                        handleOnUpdate(values);
                    }
                }}
                initialValues={{
                    ...serviceMessage,
                    organization_ids: serviceMessage.organizations.map((organization: TOrganization) => organization.id) ?? []
                }}
            >
                {(formik) => (
                    <form onSubmit={formik.handleSubmit}>

                        <div className="field col-12">
                            <label htmlFor={'title' + serviceMessage.id} className="block">
                                {t('settings:service_message.summary').toString()}
                            </label>
                            <InputText
                                id={'title' + serviceMessage.id}
                                type="text"
                                {...formik.getFieldProps('title')}
                                className={!!formik.errors.title ? 'p-invalid w-full' : 'w-full'}
                                placeholder={t('common:form.title').toString()}
                            />
                        </div>

                        <div className="field col-12">
                            <label htmlFor={'organization_ids' + serviceMessage.id} className="block">
                                {t('common:organizations').toString()}
                            </label>
                            <MultiSelectOrganization
                                onChange={(event) => {
                                    formik.handleChange({
                                        target: {
                                            value: event.value,
                                            name: 'organization_ids'
                                        }
                                    });
                                }}
                                id={'organization_ids' + serviceMessage.id}
                                isInvalid={!!formik.errors.organization_ids}
                                values={formik.values.organization_ids ?? []}
                            />
                        </div>

                        <div className="field col-12">
                            <label
                                htmlFor="{'contents' + serviceMessage.id}">{t('settings:service_message:message')}</label>
                            <InputTextarea
                                id={'contents' + serviceMessage.id}
                                {...formik.getFieldProps('contents')}
                                className={!!formik.errors.contents ? 'p-invalid w-full' : 'w-full'}
                                // @ts-ignore
                                rows={10}
                                placeholder="service message here..."
                            />
                        </div>

                        <div className="flex justify-content-end">
                            <div className="flex justify-content-end">
                                {!isNewServiceMessage ?
                                    <>
                                        <div className="mr-2">
                                            <ButtonWithSpinner
                                                type="button"
                                                buttonStatus={submitButtonDelete}
                                                disabled={!formik.isValid}
                                                id={`delete-service-messagee-${formik.values.id}`}
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
                    </form>
                )}
            </Formik>
        </>
    );
}

export default ServiceMessageForm;