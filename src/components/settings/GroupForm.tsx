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
import { Message }        from "primereact/message";
import * as React         from "react";
import { useTranslation } from "react-i18next";
import * as Yup           from "yup";

import TGroup                                    from "../../types/TGroup";
import ButtonWithSpinner, { SubmitButtonStatus } from "../common/form/ButtonWithSpinner";
import { apiSendRequest }                        from "../../services/api";
import { EAPIEndPoint }                          from "../../types/EAPIEndPoint";

const GroupForm: React.FC<{
    group: TGroup | undefined,
    isNewGroup?: boolean
}> = ({
          group,
          isNewGroup = false,
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'settings']);

    const [submitButtonCreate, setSubmitButtonCreate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonUpdate, setSubmitButtonUpdate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonDelete, setSubmitButtonDelete] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [displayError, setDisplayError] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    if (group === undefined) {

        return <></>;
    }

    const resetStates = (): void => {

        setDisplayError(false);
        setErrorMessage('');
    }

    const handleOnCreate = (values: TGroup): void => {

        resetStates();
        setSubmitButtonCreate(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.GROUP,
            formValues: values,
            callbackSuccess: () => {
                setSubmitButtonCreate(SubmitButtonStatus.Validated);
            },
            callbackError: (error) => {

                setSubmitButtonCreate(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    }

    const handleOnUpdate = (values: TGroup): void => {

        resetStates();
        setSubmitButtonUpdate(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'PUT',
            endPoint: EAPIEndPoint.GROUP,
            formValues: values,
            resourceId: values.id,
            callbackSuccess: () => {
                setSubmitButtonUpdate(SubmitButtonStatus.Validated);
            },
            callbackError: (error) => {

                setSubmitButtonUpdate(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    };

    const deleteGroup = (values: TGroup) => {

        resetStates();
        setSubmitButtonDelete(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'DELETE',
            endPoint: EAPIEndPoint.GROUP,
            resourceId: values.id,
            callbackSuccess: () => {
            },
            callbackError: (error) => {

                setSubmitButtonDelete(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    }

    return (
        <Formik
            key={group.id}
            validateOnMount={true}
            validationSchema={Yup.object({
                id: Yup.number().required(),
                name: Yup.string().required(),
            })}
            onSubmit={values => {
                if (isNewGroup) {
                    handleOnCreate(values);
                } else {
                    handleOnUpdate(values);
                }
            }}
            initialValues={{...group}}
        >
            {(formik) => (
                <form onSubmit={formik.handleSubmit}>
                    <div className="formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor={'name' + group.id}>
                                {t('common:form.name').toString()}
                            </label>
                            <InputText
                                id={'name' + group.id}
                                type="text"
                                {...formik.getFieldProps('name')}
                                className={!!formik.errors.name ? 'p-invalid w-full' : 'w-full'}
                                placeholder={t('common:form.name').toString()}
                            />
                        </div>
                    </div>

                    <div className="flex justify-content-end">
                        <div className="flex justify-content-end">
                            {!isNewGroup ?
                                <>
                                    <div className="mr-2">
                                        <ButtonWithSpinner
                                            type="button"
                                            buttonStatus={submitButtonDelete}
                                            disabled={!formik.isValid}
                                            id={`delete-category-${formik.values.id}`}
                                            labels={{
                                                default: t('common:form.delete').toString(),
                                                validating: t('common:form.deleting').toString(),
                                                validated: t('common:form.deleted').toString(),
                                                notValidated: t('common:form.delete_failed').toString(),
                                            }}
                                            severity="danger"
                                            validateAction
                                            validateActionCallback={() => deleteGroup(formik.values)}
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

    );
}

export default GroupForm;