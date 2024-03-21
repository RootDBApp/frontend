import { Form, Formik }               from "formik";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { InputText }                  from "primereact/inputtext";
import { InputTextarea }              from "primereact/inputtextarea";
import { Message }                    from "primereact/message";
import * as React                     from "react";
import { useTranslation }             from "react-i18next";
import * as Yup                       from "yup";

import TDirectory                                from "../../types/TDirectory";
import ButtonWithSpinner, { SubmitButtonStatus } from "../common/form/ButtonWithSpinner";
import { apiSendRequest }                        from "../../services/api";
import { EAPIEndPoint }                          from "../../types/EAPIEndPoint";
import TreeSelectDirectory                       from "../common/form/TreeSelectDirectory";
import { Divider }                               from "primereact/divider";
import { DropdownChangeEvent }                   from "primereact/dropdown";
import apiDataContext                            from "../../contexts/api_data/store/context";

const DirectoryForm: React.FC<{
    directory: TDirectory | undefined,
    isNewDirectory?: boolean
    nbReports?: number
}> = ({
          directory,
          isNewDirectory = false,
          nbReports = 0,
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'settings']);

    const {state: apiDataState} = React.useContext(apiDataContext);

    const [submitButtonCreate, setSubmitButtonCreate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonUpdate, setSubmitButtonUpdate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonDelete, setSubmitButtonDelete] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [moveReportButtonStatus, setMoveReportButtonStatus] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [displayError, setDisplayError] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [moveToDirectoryId, setMoveToDirectoryId] = React.useState<number>(
        apiDataState.directories.find((loopedDirectory: TDirectory) => loopedDirectory.id !== directory?.id)?.id ?? 0
    );

    if (directory === undefined) {

        return <></>;
    }

    const resetStates = (): void => {

        setDisplayError(false);
        setErrorMessage('');
    }

    const handleOnCreate = (values: TDirectory): void => {

        resetStates();
        setSubmitButtonCreate(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.DIRECTORY,
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

    const handleOnUpdate = (values: TDirectory): void => {

        resetStates();
        setSubmitButtonUpdate(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'PUT',
            endPoint: EAPIEndPoint.DIRECTORY,
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

    const deleteDirectory = (values: TDirectory) => {

        resetStates();
        setSubmitButtonDelete(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'DELETE',
            endPoint: EAPIEndPoint.DIRECTORY,
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

    const handleMoveReports = (): void => {

        resetStates();
        setMoveReportButtonStatus(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.DIRECTORY,
            resourceId: directory.id,
            extraUrlPath: 'move-reports',
            formValues: {'move-to-directory-id': moveToDirectoryId},
            callbackSuccess: () => {
                setMoveReportButtonStatus(SubmitButtonStatus.Validated);
            },
            callbackError: (error) => {

                setMoveReportButtonStatus(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    }

    const confirmDelete = (event: React.MouseEvent<HTMLButtonElement>, cat: TDirectory) => {

        confirmPopup({
            target: event.currentTarget,
            message: (
                <>
                    <strong>{t('settings:directory.delete_directory_alert', {count: nbReports})}</strong>
                    <br/>
                    {t('common:proceed_question').toString()}
                </>
            ),
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteDirectory(cat),
            acceptLabel: t('common:yes').toString(),
            acceptIcon: 'pi pi-check',
            acceptClassName: 'p-button-danger',
            rejectLabel: t('common:no').toString(),
            rejectIcon: 'pi pi-times',
            rejectClassName: 'p-button-metric',
        });
    }

    return (
        <>
            <Formik
                key={directory.id}
                validateOnMount={true}
                validationSchema={Yup.object({
                    id: Yup.number().required(),
                    name: Yup.string().required(),
                })}
                onSubmit={values => {
                    if (isNewDirectory) {
                        handleOnCreate(values);
                    } else {
                        handleOnUpdate(values);
                    }
                }}
                initialValues={{...directory}}
            >
                {(formik) => (
                    <Form placeholder="" onSubmit={formik.handleSubmit}>
                        <div className="formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor={'name' + directory.id}>
                                    {t('common:form.name').toString()}
                                </label>
                                <InputText
                                    id={'name' + directory.id}
                                    type="text"
                                    {...formik.getFieldProps('name')}
                                    className={!!formik.errors.name ? 'p-invalid w-full' : 'w-full'}
                                    placeholder={t('common:form.name').toString()}
                                />
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor={'name'}>
                                    {t('common:parent_directory').toString()}
                                </label>
                                <TreeSelectDirectory
                                    onChange={(event) => {
                                        formik.handleChange({
                                            target: {value: event.value, name: 'parent_id'}
                                        });
                                    }}
                                    id="parent_id"
                                    isInvalid={!!formik.errors.parent_id}
                                    value={formik.values.parent_id}
                                />
                            </div>

                            <div className="field col-12">
                                <label htmlFor={'description' + directory.id}>
                                    {t('common:form.description').toString()}
                                </label>
                                <InputTextarea
                                    id={'description' + directory.id}
                                    {...formik.getFieldProps('description')}
                                    className={!!formik.errors.description ? 'p-invalid w-full' : 'w-full'}
                                    placeholder={t('common:form.description').toString()}
                                />
                            </div>
                        </div>

                        <div className="flex justify-content-end">
                            <div className="flex justify-content-end">
                                {!isNewDirectory ?
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
                                                validateAction={nbReports === 0}
                                                validateActionCallback={() => deleteDirectory(formik.values)}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    if (nbReports > 0) confirmDelete(event, formik.values);
                                                }}
                                            />
                                            <ConfirmPopup/>
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
            {nbReports > 0 ?
                <>
                    <Divider align="left">
                        <div className="inline-flex align-items-center">
                            <i className="pi pi-arrow-circle-right mr-2"></i>
                            <b>{t('common:form.move_reports').toString()}</b>
                        </div>
                    </Divider>
                    <div className="formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label
                                htmlFor="firstname1">{t('settings:directory.move_report_to_this_directory', {count: nbReports}).toString()}</label>
                            <TreeSelectDirectory
                                id={`category_move_id_${directory.id}`}
                                isInvalid={false}
                                value={moveToDirectoryId}
                                disableDirectoryIds={[directory.id]}
                                onChange={(event: DropdownChangeEvent) => setMoveToDirectoryId(event.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-content-end">
                        <div className="flex justify-content-end">
                            <ButtonWithSpinner
                                buttonStatus={moveReportButtonStatus}
                                disabled={false}
                                labels={{
                                    default: t('common:form.move_reports').toString(),
                                    validating: t('common:form.move_reports_moving').toString(),
                                    validated: t('common:form.move_reports_moved').toString(),
                                    notValidated: t('common:form.move_reports_move_failed').toString(),
                                }}
                                className="mr-3"
                                onClick={() => handleMoveReports()}
                            />
                        </div>
                    </div>
                </>
                :
                <Divider align="left">
                    <div className="inline-flex align-items-center">
                        <i className="pi pi-times-circle mr-2"></i>
                        <b>{t('settings:directory.no_reports_in_this_directory').toString()}</b>
                    </div>
                </Divider>
            }
        </>
    );
}

export default DirectoryForm;