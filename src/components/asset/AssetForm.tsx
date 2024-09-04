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

import { Formik }                             from "formik";
import { Button }                             from "primereact/button";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { InputText }                          from "primereact/inputtext";
import { Message }                            from "primereact/message";
import { RadioButton }                        from "primereact/radiobutton";
import * as React                             from "react";
import { useTranslation }                     from "react-i18next";
import * as Yup                               from "yup";

import TAsset                                    from "../../types/TAsset";
import ButtonWithSpinner, { SubmitButtonStatus } from "../common/form/ButtonWithSpinner";
import { apiSendRequest }                        from "../../services/api";
import { EAPIEndPoint }                          from "../../types/EAPIEndPoint";
import CenteredLoading                           from "../common/loading/CenteredLoading";
import { TAPIResponse }                          from "../../types/TAPIResponse";
import DropDownAssetStorageType                  from "../common/form/DropDownAssetStorageType";
import { EAssetSource }                          from "../../types/EAssetSource";
import { EAssetStorageType }                     from "../../types/EAssetStorageType";
import { notificationEvent }                     from "../../utils/events";
import { EReportDevBarMessageType }              from "../../types/application-event/EReportDevBarMessageType";

const CustomEditor = React.lazy(() => import('../common/CustomEditor'));

const AssetForm: React.FC<{
    asset: TAsset,
    isNewAsset?: boolean
}> = ({
          asset,
          isNewAsset = false
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);

    const [completeAsset, setCompleteAsset] = React.useState<TAsset | undefined>();

    const [submitButtonCreate, setSubmitButtonCreate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonUpdate, setSubmitButtonUpdate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonDelete, setSubmitButtonDelete] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [displayError, setDisplayError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const resetStates = (): void => {

        setDisplayError(false);
        setErrorMessage('');
    }

    const handleOnCreate = (asset: TAsset): void => {

        resetStates();
        setSubmitButtonCreate(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.ASSET,
            formValues: asset,
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

    const handleOnUpdate = (asset: TAsset): void => {

        resetStates();
        setSubmitButtonUpdate(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'PUT',
            endPoint: EAPIEndPoint.ASSET,
            formValues: asset,
            resourceId: asset.id,
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

    const handleOnDelete = (asset: TAsset): void => {

        resetStates();
        setSubmitButtonDelete(SubmitButtonStatus.Validating);

        apiSendRequest({
            method: 'DELETE',
            endPoint: EAPIEndPoint.ASSET,
            resourceId: asset.id,
            callbackSuccess: () => {
            },
            callbackError: (error) => {

                setSubmitButtonDelete(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    };

    const uploadHandler = async (event: FileUploadHandlerEvent) => {

        document.dispatchEvent(
            notificationEvent({
                message: t('common:please_wait').toString(),
                timestamp: Date.now(),
                title: t('report:asset.upload_in_progress').toString(),
                type: EReportDevBarMessageType.LOG,
                severity: 'info',
                toast: true,
                forceInNotificationCenter: false
            })
        );

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.ASSET,
            extraUrlPath: 'upload',
            files: event.files,
            resourceId: asset.id,
            callbackSuccess: (asset: TAsset) => {

                setCompleteAsset(asset);
                document.dispatchEvent(
                    notificationEvent({
                        message: t('report:asset.asset_uploaded').toString(),
                        timestamp: Date.now(),
                        title: t('common:uploaded').toString(),
                        type: EReportDevBarMessageType.LOG,
                        severity: 'success',
                        toast: true,
                        forceInNotificationCenter: false
                    })
                );
            },
            callbackError: (error: TAPIResponse) => {
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    };

    // Get all asset content.
    React.useEffect(() => {

        if (asset.id > 0) {

            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.ASSET,
                resourceId: asset.id,
                callbackSuccess: (response: TAsset) => {

                    if (response.storage_type === EAssetStorageType.DATABASE) {

                        response.asset_source = EAssetSource.STRING;
                    }

                    setCompleteAsset(response);
                },
                callbackError: (error: TAPIResponse) => {
                    setDisplayError(true);
                    setErrorMessage(error.message);
                }
            });
        } else {

            setCompleteAsset(asset);
        }

    }, [asset]);

    return (
        <>
            <React.Suspense fallback={<CenteredLoading/>}>
                {completeAsset === undefined
                    ?
                    <CenteredLoading/>
                    :
                    <Formik
                        key={completeAsset.id}
                        validateOnMount={true}
                        validationSchema={Yup.object({
                            id: !isNewAsset ? Yup.number().required() : Yup.number().nullable(),
                            name: Yup.string().required().min(1),
                            storage_type: Yup.string().required().min(1),
                            data_content: Yup.string().when(['storage_type', 'asset_source'], {
                                is: (storage_type: EAssetStorageType, asset_source: EAssetSource) => storage_type === EAssetStorageType.DATABASE && asset_source === EAssetSource.STRING,
                                then: () => Yup.string().required().min(1),
                                otherwise: () => Yup.string(),
                            })
                        })}
                        onSubmit={values => handleOnUpdate(values)}
                        initialValues={{
                            ...completeAsset,
                        }}
                    >
                        {(formik) => (
                            <form onSubmit={formik.handleSubmit}>
                                <div className="formgrid grid">

                                    <div className="field col-12 md:col-6">
                                        <label htmlFor={'name_' + completeAsset.id}>
                                            {t('report:asset.name').toString()}
                                        </label>
                                        <InputText
                                            id={'name_' + completeAsset.id}
                                            type="text"
                                            {...formik.getFieldProps('name')}
                                            className={!!formik.errors.name ? 'p-invalid w-full' : 'w-full'}
                                            placeholder={t('report:form.report_parameter_input_name').toString()}
                                        />
                                    </div>

                                    <div className="field col-12 md:col-3">
                                        <label htmlFor={'storage_type_' + completeAsset.id}>
                                            {t('report:asset.storage_type').toString()}
                                        </label>
                                        <DropDownAssetStorageType
                                            onChange={(event) => {
                                                formik.handleChange({
                                                    target: {value: event.value, name: 'storage_type'}
                                                });
                                            }}
                                            id={'storage_type_' + completeAsset.id}
                                            isInvalid={!!formik.errors.storage_type}
                                            value={formik.values.storage_type}
                                        />
                                    </div>

                                    {formik.values.storage_type === EAssetStorageType.DATABASE &&
                                        <div className="field col-12 md:col-3">
                                            <label htmlFor={'storage_type_' + completeAsset.id}>
                                                {t('report:asset.asset_source').toString()}
                                            </label>
                                            <div className="flex flex-wrap gap-3">
                                                <div className="flex align-items-center">
                                                    <RadioButton
                                                        inputId={'asset_source_file_' + completeAsset.id}
                                                        {...formik.getFieldProps('asset_source')}
                                                        className={!!formik.errors.asset_source ? 'p-invalid w-full' : 'w-full'}
                                                        value={EAssetSource.FILE}
                                                        checked={formik.values.asset_source === EAssetSource.FILE}
                                                    />
                                                    <label htmlFor={'asset_source_file_' + completeAsset.id} className="ml-2">File</label>
                                                </div>
                                                <div className="flex align-items-center">
                                                    <RadioButton
                                                        inputId={'asset_source_string_' + completeAsset.id}
                                                        {...formik.getFieldProps('asset_source')}
                                                        className={!!formik.errors.asset_source ? 'p-invalid w-full' : 'w-full'}
                                                        value={EAssetSource.STRING}
                                                        checked={formik.values.asset_source === EAssetSource.STRING}
                                                    />
                                                    <label htmlFor={'asset_source_string_' + completeAsset.id} className="ml-2">String</label>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {(formik.values.storage_type === EAssetStorageType.DATABASE && formik.values.asset_source === EAssetSource.STRING) &&
                                        <div className="field col-12 md:col-12">
                                            <label htmlFor={'data_content_' + completeAsset.id}>
                                                {t('report:form.query').toString()}
                                            </label>
                                            <div>
                                                <CustomEditor
                                                    id={'data_content_' + completeAsset.id}
                                                    value={formik.values.data_content}
                                                    onChangeCallback={(data_content: string) => {

                                                        formik.handleChange({
                                                            target: {
                                                                value: data_content,
                                                                name: 'data_content'
                                                            }
                                                        });
                                                    }}
                                                    resize="vertical"
                                                    // height="160px"
                                                    displayButtons={false}
                                                    isInvalid={!!formik.errors.data_content}
                                                    enableAutoComplete={false}
                                                />
                                            </div>
                                        </div>
                                    }


                                    {((formik.values.asset_source === EAssetSource.FILE || formik.values.storage_type === EAssetStorageType.FILESYSTEM) && asset.id > 0) &&
                                        <div className="field col-12 md:col-3">
                                            <label htmlFor={'asset_file_' + completeAsset.id}>
                                                {t('report:asset.upload_asset').toString()}
                                            </label>
                                            <div>
                                                <FileUpload
                                                    mode="basic"
                                                    name="asset_file[]"
                                                    accept="text/*"
                                                    maxFileSize={1000000}
                                                    customUpload
                                                    uploadHandler={uploadHandler}
                                                />

                                            </div>
                                        </div>
                                    }

                                    {(asset.id > 0 && completeAsset.pathname != null) &&
                                        <div className="field col-12 md:col-12">
                                            <Message text={`${t('report:asset.current_asset_file')} ${completeAsset.pathname}`} className="col-6 p-2"/>
                                            <Button label={t('common:download')} icon="pi pi-file" className="ml-2">
                                                <a target="_blank" href="https://www.duckduckgo.com"/>
                                            </Button>
                                        </div>
                                    }

                                    {((formik.values.asset_source === EAssetSource.FILE || formik.values.storage_type === EAssetStorageType.FILESYSTEM) && asset.id === 0) &&
                                        <div className="field col-12 md:col-12">
                                            <Message text={t('report:asset.create_to_upload')} className="col-12 p-2"/>
                                        </div>
                                    }
                                </div>

                                <div className="flex justify-content-end">
                                    <div className="flex justify-content-end">
                                        {!isNewAsset ?
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
                }
            </React.Suspense>
        </>
    );
}

export default AssetForm;