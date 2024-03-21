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
import { Dropdown }       from "primereact/dropdown";
import { InputSwitch }    from "primereact/inputswitch";
import { InputText }      from "primereact/inputtext";
import { Message }        from "primereact/message";
import { SelectButton }   from "primereact/selectbutton";
import { Tooltip }        from "primereact/tooltip";
import { Slider }         from "primereact/slider";
import * as React         from 'react';
import { useTranslation } from "react-i18next";
import * as Yup           from "yup";

import ButtonWithSpinner, { SubmitButtonStatus } from "../../common/form/ButtonWithSpinner";
import TReportDataView                           from "../../../types/TReportDataView";
import ReportParameterPlaceholderAutocomplete    from "../../common/form/ReportParameterPlaceholderAutocomplete";
import { EReportDataViewDescriptionDisplayType } from "../../../types/EReportDataViewDescriptionDisplayType";
import { EDataViewType }                         from "../../../types/EDataViewType";
import TReportDataViewJs                         from "../../../types/TReportDataViewJs";
import DropDownDataViewLibVersion                from "../../common/form/DropDownDataViewLibVersion";
import DropDownDataViewLibTypes                  from "../../common/form/DropDownDataViewLibTypes";
import { ICallbackCreateDataViewSuccess }        from "../../../types/ICallBacks";
import { apiSendRequest }                        from "../../../services/api";
import { EAPIEndPoint }                          from "../../../types/EAPIEndPoint";
import {
    useReportDataViewStateFromReportIdAndDataViewId,
    useReportState
}                                                from "../../../contexts/report/ReportContextProvider";
import { getNewDataViewPosition }                from "../../../utils/dataView";
import { context as authContext }                from "../../../contexts/auth/store/context";
import { defaultDataView }                       from "../../../contexts/report/store/reducer";
import env                                       from "../../../envVariables";
import { TAPIResponse }                          from "../../../types/TAPIResponsed";
import TReportDataViewState                      from "../../../types/TReportDataViewState";

const ReportDataViewForm: React.FC<{
    dataViewId: number,
    reportId: number,
    onSuccess: ICallbackCreateDataViewSuccess
}> = ({
          dataViewId,
          reportId,
          onSuccess,
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);
    const {state: authState} = React.useContext(authContext);
    const reportDataView: TReportDataViewState = useReportDataViewStateFromReportIdAndDataViewId(reportId, dataViewId);

    const [submitButtonUpdate, setSubmitButtonUpdate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const reportState = useReportState(reportId);
    const [displayError, setDisplayError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleOnSubmit = (values: TReportDataView): void => {

        setDisplayError(false);
        setErrorMessage('');
        setSubmitButtonUpdate(SubmitButtonStatus.Validating);

        if (reportDataView.dataView && reportDataView.dataView.id > 0) {

            apiSendRequest({
                method: 'PUT',
                endPoint: EAPIEndPoint.REPORT_DATA_VIEW,
                formValues: {
                    report_id: reportId,
                    name: values.name,
                    type: values.type,
                    title: values.title,
                    description: values.description,
                    description_display_type: values.description_display_type,
                    report_data_view_lib_version_id: values.report_data_view_lib_version_id,
                    report_data_view_lib_type_id: values.report_data_view_lib_type_id,
                    max_width: values.max_width,
                    by_chunk: values.by_chunk,
                    chunk_size: values.chunk_size,
                    is_visible: values.is_visible,
                    on_queue: values.on_queue
                },
                resourceId: values.id,
                callbackSuccess: (response: TReportDataView) => {

                    setSubmitButtonUpdate(SubmitButtonStatus.Validated);
                    onSuccess(response);
                },
                callbackError: (error: TAPIResponse) => {
                    setSubmitButtonUpdate(SubmitButtonStatus.NotValidated);
                    setDisplayError(true);
                    setErrorMessage(error.message);
                }
            });
        } else {

            apiSendRequest({
                method: 'POST',
                endPoint: EAPIEndPoint.REPORT_DATA_VIEW,
                formValues: {
                    report_id: reportId,
                    name: values.name,
                    type: values.type,
                    title: values.title,
                    description: values.description,
                    description_display_type: values.description_display_type,
                    report_data_view_lib_version_id: values.report_data_view_lib_version_id,
                    report_data_view_lib_type_id: values.report_data_view_lib_type_id,
                    organization_id: authState.user.organization_user.organization_id,
                    max_width: values.max_width,
                    position: JSON.stringify(getNewDataViewPosition(reportState.report?.dataViews || [], values.type)),
                    by_chunk: values.by_chunk,
                    chunk_size: values.chunk_size,
                    is_visible: values.is_visible,
                    on_queue: values.on_queue
                },
                callbackSuccess: (response: TReportDataView) => {

                    apiSendRequest({
                        method: 'POST',
                        endPoint: EAPIEndPoint.REPORT_DATA_VIEW_JS,
                        formValues: {
                            report_data_view_id: response.id,
                            report_data_view_lib_version_id: values.report_data_view_lib_version_id,
                            report_data_view_lib_type_id: values.report_data_view_lib_type_id,
                        },
                        callbackSuccess: (response2: TReportDataViewJs) => {
                            onSuccess(response, response2);
                            setSubmitButtonUpdate(SubmitButtonStatus.Validated);
                        },
                        callbackError: () => {

                            setSubmitButtonUpdate(SubmitButtonStatus.NotValidated);
                        }
                    });
                },
                callbackError: (error: TAPIResponse) => {

                    setSubmitButtonUpdate(SubmitButtonStatus.NotValidated);
                    setDisplayError(true);
                    setErrorMessage(error.message);
                }
            });
        }
    }

    return (
        <Formik
            validateOnMount
            initialValues={reportDataView.dataView ?? defaultDataView}
            validationSchema={Yup.object({
                name: Yup.string().required(),
                title: Yup.string().nullable(''),
                description: Yup.string().nullable(''),
                description_display_type: Yup.number().oneOf([EReportDataViewDescriptionDisplayType.OVERLAY, EReportDataViewDescriptionDisplayType.SUBTITLE]).nullable(),
                type: Yup.number().required(),
                report_data_view_lib_version_id: Yup.number().required(),
                report_data_view_lib_type_id: Yup.number(),
                by_chunk: Yup.boolean(),
                chunk_size: Yup.number(),
                max_width: Yup.number().nullable(),
                is_visible: Yup.boolean(),
                on_queue: Yup.boolean()
            })}
            onSubmit={handleOnSubmit}
        >
            {formik => (
                <Form placeholder="" onSubmit={formik.handleSubmit}>
                    <div className="formgrid grid">

                        <div className="field col-3">
                            <label htmlFor="is_visible">{t('report:form.data_view_is_visible')}</label><br/>
                            <InputSwitch
                                id="is_visible"
                                checked={formik.values.is_visible}
                                {...formik.getFieldProps('is_visible')}
                            />
                        </div>

                        {/*<div className="field col-2 ">*/}
                        {/*    <label htmlFor="on_queue">{t('report:form.data_view_on_queue')}</label><br/>*/}
                        {/*    <InputSwitch*/}
                        {/*        id="on_queue"*/}
                        {/*        checked={formik.values.on_queue}*/}
                        {/*        {...formik.getFieldProps('on_queue')}*/}
                        {/*    />*/}
                        {/*</div>*/}

                        <div className="field col-9">
                            <label htmlFor="name">{t('common:form.name')}</label>
                            <InputText
                                id="name"
                                type="text"
                                placeholder={t('report:dataview.name_placeholder').toString()}
                                {...formik.getFieldProps('name')}
                                className={!!formik.errors.name ? 'p-invalid w-full' : 'w-full'}
                                autoFocus
                            />
                        </div>

                        {(reportState.report?.parameters || []).length > 0 && (
                            <Tooltip
                                target=".parameter-placeholder-tooltip"
                                position="bottom"
                                content={t('report:form.help_parameter_placeholder').toString()}
                                showDelay={env.tooltipShowDelay}
                                hideDelay={env.tooltipHideDelay}
                            />
                        )}
                        <div className="field col-12">
                            <label htmlFor="title">{t('common:form.title')}</label>
                            {(reportState.report?.parameters || []).length > 0 && (
                                <>
                                    &nbsp;&nbsp;&nbsp;
                                    <i className="pi pi-question-circle parameter-placeholder-tooltip"/>
                                </>
                            )}
                            <ReportParameterPlaceholderAutocomplete
                                parameters={reportState.report?.parameters || []}
                                inputId="title"
                                id="title"
                                {...formik.getFieldProps('title')}
                                value={formik.values.title || ''}
                                inputClassName={!!formik.errors.title ? 'p-invalid w-full' : 'w-full'}
                                placeholder={t('report:dataview.title_placeholder').toString()}
                                // @ts-ignore
                                rows={1}
                                autoResize
                            />
                        </div>

                        <div className="field col-12">
                            <label htmlFor="description">Description</label>
                            {(reportState.report?.parameters || []).length > 0 && (
                                <>
                                    &nbsp;&nbsp;&nbsp;
                                    <i className="pi pi-question-circle parameter-placeholder-tooltip"/>
                                </>
                            )}
                            <ReportParameterPlaceholderAutocomplete
                                parameters={reportState.report?.parameters || []}
                                inputId="description"
                                id="description"
                                {...formik.getFieldProps('description')}
                                value={formik.values.description || ''}
                                inputClassName={!!formik.errors.description ? 'p-invalid w-full' : 'w-full'}
                                placeholder="Description"
                                autoResize
                            />
                        </div>

                        <div className="field col-12">
                            <label htmlFor="description_display_type">
                                {t('report:dataview.description_display_type').toString()}
                            </label>
                            <div className="flex align-items-center">
                                <SelectButton
                                    disabled={!formik.values.description}
                                    options={[
                                        {
                                            label: t('common:overlay').toString(),
                                            value: EReportDataViewDescriptionDisplayType.OVERLAY
                                        },
                                        {
                                            label: t('common:subtitle').toString(),
                                            value: EReportDataViewDescriptionDisplayType.SUBTITLE
                                        },
                                    ]}
                                    {...formik.getFieldProps('description_display_type')}
                                />
                                <div className="ml-3">
                                    {formik.values.description_display_type === EReportDataViewDescriptionDisplayType.OVERLAY && (
                                        <>{t('report:dataview.description_display_type_overlay_help')}</>
                                    )}
                                    {formik.values.description_display_type === EReportDataViewDescriptionDisplayType.SUBTITLE && (
                                        <>{t('report:dataview.description_display_type_subtitle_help')}</>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={`field col-12 ${formik.values.type === EDataViewType.GRAPH ? 'md:col-3' : ''}`}
                             style={{display: `${(!reportDataView.dataView?.id) ? 'block' : 'none'}`}}
                        >
                            <label htmlFor="type" className="block">{t('common:form.type')}</label>
                            <Dropdown
                                value={formik.values.type}
                                id="type"
                                name="type"
                                optionLabel="name"
                                optionValue="id"
                                options={[
                                    {
                                        id: EDataViewType.TABLE,
                                        name: t('report:types.table').toString(),
                                    },
                                    {
                                        id: EDataViewType.GRAPH,
                                        name: t('report:types.graph').toString(),
                                    },
                                    // {
                                    //     id: EDataViewType.TREND,
                                    //     name: t('report:types.trend').toString(),
                                    // },
                                    {
                                        id: EDataViewType.METRIC,
                                        name: t('report:types.metric').toString(),
                                    },
                                    {
                                        id: EDataViewType.TEXT,
                                        name: t('report:types.text').toString(),
                                    },
                                ]}
                                onChange={(event) => {

                                    formik.setFieldValue('type', event.value)

                                    // We handle only on table lib, react-table
                                    switch (event.value) {
                                        case EDataViewType.TABLE:
                                            // from bdd
                                            formik.setFieldValue('report_data_view_lib_version_id', 1)
                                            break;

                                        case EDataViewType.GRAPH: {
                                            // formik.values.report_data_view_lib_version_id = 3; // from bdd
                                            formik.setFieldValue('report_data_view_lib_type_id', 22)
                                            formik.setFieldValue('report_data_view_lib_version_id', 3)
                                            break;
                                        }

                                        case EDataViewType.TREND: {
                                            // from bdd
                                            formik.setFieldValue('report_data_view_lib_version_id', 6)
                                            break;
                                        }

                                        case EDataViewType.METRIC: {
                                            // from bdd
                                            formik.setFieldValue('report_data_view_lib_version_id', 5)

                                            break;
                                        }
                                    }

                                }}
                            />
                        </div>

                        <div className="field col-12 md:col-4"
                             style={{display: `${(formik.values.type === EDataViewType.GRAPH && !reportDataView.dataView?.id) ? 'block' : 'none'}`}}
                        >
                            <label htmlFor="report_data_view_lib_version_id"
                                   className="block">{t('report:form.library')}</label>
                            <DropDownDataViewLibVersion
                                disabled={formik.values.type === EDataViewType.TABLE}
                                onChange={(event) => {

                                    formik.setFieldValue('report_data_view_lib_version_id', event.value)

                                    // For d3.js, default to.... default model.
                                    if (event.value === 4) { // from bdd

                                        // formik.values.report_data_view_lib_type_id = 8; // from bdd
                                        formik.setFieldValue('report_data_view_lib_type_id', 29)
                                    } // For ChartJS, default to Bar, because why not.
                                    else {
                                        formik.setFieldValue('report_data_view_lib_type_id', 22)
                                    }
                                }}
                                id="report_data_view_lib_version_id"
                                dataViewTypeId={formik.values.type}
                                isInvalid={!!formik.errors.report_data_view_lib_version_id}
                                value={formik.values.report_data_view_lib_version_id}
                            />
                        </div>

                        <div className="field col-12 md:col-5"
                             style={{display: `${(formik.values.type === EDataViewType.GRAPH && !reportDataView.dataView?.id) ? 'block' : 'none'}`}}
                        >
                            <label htmlFor="report_data_view_lib_type_id"
                                   className="block">{t('report:form.chart_model')}</label>
                            <DropDownDataViewLibTypes
                                disabled={formik.values.type === EDataViewType.TABLE}
                                onChange={(event) => {
                                    formik.setFieldValue('report_data_view_lib_type_id', event.value)
                                }}
                                id="report_data_view_lib_type_id"
                                dataViewLibVersionId={formik.values.report_data_view_lib_version_id}
                                isInvalid={!!formik.errors.report_data_view_lib_type_id}
                                value={formik.values.report_data_view_lib_type_id}
                            />
                        </div>

                        {/*{formik.values.type === EDataViewType.GRAPH && (*/}
                        {/*    <div className="field col-12">*/}
                        {/*        <label htmlFor="max_width" className="block">{t('common:form.maxWidth')}</label>*/}
                        {/*        <InputNumber*/}
                        {/*            inputId="max_width"*/}
                        {/*            {...formik.getFieldProps('max_width')}*/}
                        {/*            className={!!formik.errors.max_width ? 'p-invalid' : ''}*/}
                        {/*            onChange={(event) => {*/}
                        {/*                formik.setFieldValue('max_width', event.value)*/}
                        {/*            }}*/}
                        {/*            showButtons*/}
                        {/*            step={50}*/}
                        {/*            suffix=" px"*/}
                        {/*        />*/}
                        {/*    </div>*/}
                        {/*)}*/}

                        <div className="field col-2">
                            <label htmlFor="by_chunk">{t('report:dataview.by_chunk')}</label><br/>
                            <InputSwitch
                                id="by_chunk"
                                checked={formik.values.by_chunk}
                                {...formik.getFieldProps('by_chunk')}
                            />
                        </div>
                        <div className="field col-10 ">
                            <label htmlFor="chunk_size">{t('report:dataview.chunk_size')}</label>
                            <InputText id="chunk_size_view"
                                       value={String(formik.values.chunk_size)} className="w-full"
                                       readOnly/>
                            <Slider
                                disabled={!formik.values.by_chunk}
                                id="chunk_size"
                                value={formik.values.chunk_size}
                                step={10}
                                min={10}
                                max={10000}
                                onChange={(event) => {
                                    formik.setFieldValue('chunk_size', event.value)
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-content-end">
                        <div className="mr-2">
                            <ButtonWithSpinner
                                buttonStatus={submitButtonUpdate}
                                disabled={!formik.isValid}
                                labels={
                                    (reportDataView.dataView && reportDataView.dataView.id > 0)
                                        ? {
                                            default: t('common:form.update').toString(),
                                            validating: t('common:form.updating').toString(),
                                            validated: t('common:form.updated').toString(),
                                            notValidated: t('common:form.update_failed').toString(),
                                        }
                                        : {
                                            default: t('common:form.create').toString(),
                                            validating: t('common:form.creating').toString(),
                                            validated: t('common:form.created').toString(),
                                            notValidated: t('common:form.create_failed').toString(),
                                        }
                                }
                                type="submit"
                            />
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

export default ReportDataViewForm;