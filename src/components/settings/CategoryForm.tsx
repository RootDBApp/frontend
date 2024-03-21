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

import { Form, Formik }               from "formik";
import { ColorPicker }                from "primereact/colorpicker";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Divider }                    from "primereact/divider";
import { DropdownChangeEvent }        from "primereact/dropdown";
import { InputText }                  from "primereact/inputtext";
import { InputTextarea }              from "primereact/inputtextarea";
import { Message }                    from "primereact/message";
import * as React                     from "react";
import { useTranslation }             from "react-i18next";
import * as Yup                       from "yup";

import TCategory                                 from "../../types/TCategory";
import ButtonWithSpinner, { SubmitButtonStatus } from "../common/form/ButtonWithSpinner";
import { apiSendRequest }                        from "../../services/api";
import { EAPIEndPoint }                          from "../../types/EAPIEndPoint";
import DropdownCategory                          from "../common/form/DropdownCategory";
import apiDataContext                            from "../../contexts/api_data/store/context";

const CategoryForm: React.FC<{
    category: TCategory | undefined,
    isNewCategory?: boolean
    nbReports?: number
}> = ({
          category,
          isNewCategory = false,
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
    const [moveToCategoryId, setMoveToCategoryId] = React.useState<number>(
        apiDataState.categories.find((loopedCategory: TCategory) => loopedCategory.id !== category?.id)?.id ?? 0
    );

    if (category === undefined) {

        return <></>;
    }

    const resetStates = (): void => {

        setDisplayError(false);
        setErrorMessage('');
    }

    const handleOnCreate = (values: TCategory): void => {

        resetStates();
        setSubmitButtonCreate(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.CATEGORY,
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

    const handleOnUpdate = (values: TCategory): void => {

        resetStates();
        setSubmitButtonUpdate(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'PUT',
            endPoint: EAPIEndPoint.CATEGORY,
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

    const handleOnDelete = (values: TCategory): void => {

        resetStates();
        setSubmitButtonDelete(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'DELETE',
            endPoint: EAPIEndPoint.CATEGORY,
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
            endPoint: EAPIEndPoint.CATEGORY,
            resourceId: category.id,
            extraUrlPath: 'move-reports',
            formValues: {'move-to-category-id': moveToCategoryId},
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

    const confirmDelete = (event: React.MouseEvent<HTMLButtonElement>, category: TCategory) => {

        confirmPopup({
            target: event.currentTarget,
            message: (
                <>
                    <strong>{t('settings:category.delete_category_alert', {count: nbReports})}</strong>
                    <br/>
                    {t('common:proceed_question').toString()}
                </>
            ),
            icon: 'pi pi-exclamation-triangle',
            accept: () => handleOnDelete(category),
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
                key={category.id}
                validateOnMount={true}
                validationSchema={Yup.object({
                    id: Yup.number().required(),
                    name: Yup.string().required(),
                    color_hex: Yup.string().required(),
                    description: Yup.string().notRequired(),
                })}
                onSubmit={values => {
                    if (isNewCategory) {
                        handleOnCreate(values);
                    } else {
                        handleOnUpdate(values);
                    }
                }}
                initialValues={{...category, description: category.description ?? ''}}
            >
                {(formik) => (
                    <Form  placeholder="" onSubmit={formik.handleSubmit}>
                        <div className="formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor={'name' + category.id}>
                                    {t('common:form.name').toString()}
                                </label>
                                <InputText
                                    id={'name' + category.id}
                                    type="text"
                                    {...formik.getFieldProps('name')}
                                    className={!!formik.errors.name ? 'p-invalid w-full' : 'w-full'}
                                    placeholder={t('common:form.name').toString()}
                                />
                            </div>

                            <div className="field col-12 md:col-6">
                                <label htmlFor={'color_hex' + category.id} className="block">
                                    {t('common:form.color').toString()}
                                </label>
                                <ColorPicker
                                    id={'color_hex' + category.id}
                                    {...formik.getFieldProps('color_hex')}
                                    className={!!formik.errors.color_hex ? 'p-invalid w-full' : 'w-full'}
                                />
                            </div>

                            <div className="field col-12">
                                <label htmlFor={'description' + category.id}>
                                    {t('common:form.description').toString()}
                                </label>
                                <InputTextarea
                                    id={'description' + category.id}
                                    {...formik.getFieldProps('description')}
                                    // value={formik.values.description || 'fdsfds'}
                                    className={!!formik.errors.description ? 'p-invalid w-full' : 'w-full'}
                                    placeholder={t('common:form.description').toString()}
                                />
                            </div>
                        </div>

                        <div className="flex justify-content-end">
                            <div className="flex justify-content-end">
                                {!isNewCategory ?
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
                                                validateActionCallback={() => handleOnDelete(formik.values)}
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
                            <label htmlFor="firstname1">{t('settings:category.move_report_to_this_category', {count: nbReports}).toString()}</label>
                            <DropdownCategory
                                id={`category_move_id_${category.id}`}
                                isInvalid={false}
                                value={moveToCategoryId}
                                excludeCategoryIds={[category.id]}
                                onChange={(event: DropdownChangeEvent) => setMoveToCategoryId(event.value)}
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
                        <b>{t('settings:category.no_reports_in_this_category').toString()}</b>
                    </div>
                </Divider>
            }
        </>
    );
}

export default CategoryForm;