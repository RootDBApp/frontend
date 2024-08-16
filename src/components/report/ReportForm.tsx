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
import { Button }         from "primereact/button";
import { Chips }          from "primereact/chips";
import { Divider }        from "primereact/divider";
import { InputSwitch }    from "primereact/inputswitch";
import { InputText }      from "primereact/inputtext";
import { InputTextarea }  from "primereact/inputtextarea";
import { Message }        from "primereact/message";
import { Tooltip }        from "primereact/tooltip";
import * as React         from "react";
import { useTranslation } from "react-i18next";
import * as Yup           from "yup";

import ButtonWithSpinner, { SubmitButtonStatus } from "../common/form/ButtonWithSpinner";
import TReport                                   from "../../types/TReport";
import DropdownCategory                          from "../common/form/DropdownCategory";
import TreeSelectDirectory                       from "../common/form/TreeSelectDirectory";
import MultiSelectUser                           from "../common/form/MultiSelectUser";
import TReportUser                               from "../../types/TReportUser";
import TReportGroup                              from "../../types/TReportGroup";
import MultiSelectGroup                          from "../common/form/MultiSelectGroup";
import { useDispatch }                           from "../../contexts/report/ReportContextProvider";
import { gotReport, reportUpdateInfo }           from "../../contexts/report/store/actions";
import DropdownConnector                         from "../common/form/DropdownConnector";
import { notificationEvent }                     from "../../utils/events";
import ReportParameterPlaceholderAutocomplete    from "../common/form/ReportParameterPlaceholderAutocomplete";
import { apiSendRequest }                        from "../../services/api";
import { EAPIEndPoint }                          from "../../types/EAPIEndPoint";
import * as RTReport                             from "../../contexts/report/ReportContextProvider";
import { getReport }                             from "../../contexts/report/store/asyncAction";
import CenteredLoading                           from "../common/loading/CenteredLoading";
import { context as authContext }                from "../../contexts/auth/store/context";
import { EReportDevBarMessageType }              from "../../types/application-event/EReportDevBarMessageType";
import env                                       from "../../envVariables";
import { TAPIResponse }                          from "../../types/TAPIResponse";


interface IQuickReportFormValues {
    conf_connector_id: number,
    description: string,
    description_listing: string,
    has_parameters: boolean,
    id: number,
    is_visible: boolean,
    on_queue: boolean,
    name: string,
    organization_id: number,
    public_access: boolean,
    public_authorized_referers: Array<string>,
    title: string | undefined,
    allowed_groups_id?: Array<number>,
    allowed_users_id?: Array<number>,
    category_id?: number,
    directory_id?: number,
}

const ReportForm: React.FC<{
    reportId: number,
    onSubmitSuccess: Function
}> = ({
          reportId,
          onSubmitSuccess
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);

    const {state: authState} = React.useContext(authContext);
    const reportDispatch = useDispatch();

    const {report} = RTReport.useReportState(reportId);
    const [submitButtonStatus, setSubmitButtonStatus] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const publicSecurityHashRef = React.useRef(null);
    const [displayError, setDisplayError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    React.useEffect(() => {

        if (!report?.id && reportId > 0) {
            // reportInstanceId: 9999999999999 because report configuration is common to all instances.
            reportDispatch(getReport({reportId: reportId, reportInstanceId: 9999999999999}));
        }
    }, [reportId, report?.id, reportDispatch])

    const areTherePermissions = (values: IQuickReportFormValues): boolean => {

        return !(values.allowed_users_id?.length === 0 && values.allowed_groups_id?.length === 0);
    }

    const handleOnSubmit = (values: IQuickReportFormValues): void => {

        setSubmitButtonStatus(SubmitButtonStatus.Validating);
        setDisplayError(false);
        setErrorMessage('');

        reportDispatch(
            reportUpdateInfo({
                report_id: reportId,
                name: values.name
            })
        );

        apiSendRequest({
            method: 'PUT',
            endPoint: EAPIEndPoint.REPORT,
            resourceId: values.id,
            formValues: {
                category_id: values.category_id || 0,
                conf_connector_id: values.conf_connector_id,
                description: values.description,
                description_listing: values.description_listing,
                directory_id: values.directory_id || 0,
                group_ids: values.allowed_groups_id,
                has_parameters: values.has_parameters,
                is_visible: values.is_visible,
                on_queue: values.on_queue,
                id: values.id,
                name: values.name,
                organization_id: values.organization_id,
                public_access: values.public_access,
                public_authorized_referers: values.public_authorized_referers,
                title: values.title,
                user_ids: values.allowed_users_id,
            },
            callbackSuccess: (reportUpdated: TReport) => {

                reportDispatch(gotReport(reportUpdated));
                setSubmitButtonStatus(SubmitButtonStatus.Validated);
                onSubmitSuccess(reportUpdated);

            },
            callbackError: (error: TAPIResponse) => {

                setSubmitButtonStatus(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    }

    const copyToClipboard = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {

        e.preventDefault();

        if (publicSecurityHashRef.current && window.isSecureContext) {

            // @ts-ignore
            navigator.clipboard.writeText(publicSecurityHashRef.current.value)
                .then(() => {

                    document.dispatchEvent(
                        notificationEvent({
                            message: '',
                            timestamp: Date.now(),
                            title: t('common:link_copied').toString(),
                            type: EReportDevBarMessageType.LOG,
                            severity: 'info',
                            toast: true,
                            forceInNotificationCenter: true
                        })
                    );
                })
                .catch((e) => {

                    document.dispatchEvent(
                        notificationEvent({
                            message: e.message,
                            timestamp: Date.now(),
                            title: t('common:link_not_copied').toString(),
                            type: EReportDevBarMessageType.LOG,
                            severity: 'danger',
                            toast: true,
                            forceInNotificationCenter: true
                        })
                    );
                })
        } else {

            document.dispatchEvent(
                notificationEvent({
                    message: '',
                    timestamp: Date.now(),
                    title: t('common:link_not_copied').toString(),
                    type: EReportDevBarMessageType.LOG,
                    severity: 'danger',
                    toast: true,
                    forceInNotificationCenter: true
                })
            );
        }
    }

    return (
        <>
            {!report ? (
                <CenteredLoading/>
            ) : (
                <Formik
                    validateOnMount={true}
                    validationSchema={Yup.object({
                        allowed_groups_id: Yup.array().min(0),
                        allowed_users_id: Yup.array().min(0),
                        category_id: Yup.number().required().min(1),
                        conf_connector_id: Yup.number().required().min(1),
                        description: Yup.string(),
                        directory_id: Yup.number().required().min(1),
                        description_listing: Yup.string(),
                        has_parameters: Yup.boolean().required(),
                        is_visible: Yup.boolean(),
                        on_queue: Yup.boolean(),
                        name: Yup.string().required(),
                        organization_id: Yup.number().required().min(1),
                        public_access: Yup.boolean(),
                        public_security_hash: Yup.string().length(40),
                        public_authorized_referers: Yup.array().of(Yup.string()),
                        title: Yup.string(),

                    })}
                    onSubmit={values => handleOnSubmit(values as IQuickReportFormValues)}
                    initialValues={{
                        allowed_groups_id: report?.allowed_groups?.map((allowed_group: TReportGroup) => allowed_group.group_id),
                        allowed_users_id: report?.allowed_users?.map((allowed_user: TReportUser) => allowed_user.user_id),
                        category_id: report.category?.id,
                        conf_connector_id: report.conf_connector_id,
                        description: report.description || '',
                        description_listing: report.description_listing || '',
                        directory_id: report.directory?.id,
                        has_parameters: report?.has_parameters,
                        id: report.id,
                        is_visible: report.is_visible,
                        on_queue: report.on_queue,
                        name: report.name,
                        organization_id: report.organization_id,
                        public_access: report.public_access,
                        public_security_hash: report?.public_security_hash,
                        public_authorized_referers: report?.public_authorized_referers,
                        title: report.title || '',
                    }}
                >
                    {(formik) => (

                        <form onSubmit={formik.handleSubmit}>
                            <div className="formgrid grid">

                                <div className="field col-3">
                                    <label htmlFor="is_visible">{t('report:form.report_visibility')}</label><br/>
                                    <InputSwitch
                                        id="is_visible"
                                        checked={formik.values.is_visible}
                                        {...formik.getFieldProps('is_visible')}
                                    />
                                </div>

                                {/*<div className="field col-2 ">*/}
                                {/*    <label htmlFor="on_queue">{t('report:form.on_queue')}</label><br/>*/}
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
                                        {...formik.getFieldProps('name')}
                                        className={!!formik.errors.name ? 'p-invalid w-full' : 'w-full'}
                                        placeholder={t('report:form.name_placeholder').toString()}
                                        autoFocus
                                    />
                                </div>


                                <Tooltip target=".parameter-description_listing-tooltip"
                                         position="bottom"
                                         content={t('report:form.help_description_listing').toString()}
                                         showDelay={env.tooltipShowDelay}
                                         hideDelay={env.tooltipHideDelay}
                                />

                                <Tooltip target=".parameter-placeholder-tooltip"
                                         position="bottom"
                                         content={t('report:form.help_parameter_placeholder').toString()}
                                         showDelay={env.tooltipShowDelay}
                                         hideDelay={env.tooltipHideDelay}
                                />

                                <div className="field col-12">
                                    <label htmlFor="title">{t('common:form.title')}</label>
                                    &nbsp;&nbsp;&nbsp;
                                    <i className="pi pi-question-circle parameter-placeholder-tooltip"/>
                                    <ReportParameterPlaceholderAutocomplete
                                        parameters={report.parameters ? report.parameters : []}
                                        inputId="title"
                                        id="title"
                                        {...formik.getFieldProps('title')}
                                        inputClassName={!!formik.errors.title ? 'p-invalid w-full' : 'w-full'}
                                        placeholder={t('report:form.title_placeholder').toString()}
                                        // @ts-ignore
                                        rows={1}
                                        autoResize
                                    />
                                </div>

                                <div className="field col-12">
                                    <label htmlFor="description_listing">{t('report:form.description_listing')}</label>
                                    &nbsp;&nbsp;&nbsp;
                                    <i className="pi pi-question-circle parameter-description_listing-tooltip"/>
                                    <InputTextarea
                                        className="w-full"
                                        id="description_listing"
                                        {...formik.getFieldProps('description_listing')}
                                        autoResize
                                    />
                                </div>

                                <div className="field col-12">
                                    <label htmlFor="description">Description</label>
                                    &nbsp;&nbsp;&nbsp;
                                    <i className="pi pi-question-circle parameter-placeholder-tooltip"/>
                                    <ReportParameterPlaceholderAutocomplete
                                        parameters={report.parameters ? report.parameters : []}
                                        inputId="description"
                                        id="description"
                                        {...formik.getFieldProps('description')}
                                        inputClassName={!!formik.errors.description ? 'p-invalid w-full' : 'w-full'}
                                        placeholder="Description"
                                        autoResize
                                    />
                                </div>


                                <div className="field col-12 mb-1">
                                    <label> {t('report:form.location')}</label>
                                </div>
                                <div className="field md:col-6">
                                    <DropdownCategory
                                        onChange={(event) => {
                                            formik.handleChange({
                                                target: {value: event.value, name: 'category_id'}
                                            });
                                        }}
                                        id="category_id"
                                        isInvalid={!!formik.errors.category_id}
                                        value={formik.values.category_id}
                                    />
                                </div>

                                <div className="field md:col-6">
                                    <TreeSelectDirectory
                                        onChange={(event) => {
                                            formik.handleChange({
                                                target: {value: event.value, name: 'directory_id'}
                                            });
                                        }}
                                        id="directory_id"
                                        isInvalid={!!formik.errors.directory_id}
                                        value={formik.values.directory_id}
                                    />
                                </div>

                                <div className="field col-12">
                                    <label htmlFor="description">
                                        {t('settings:global_administration.connector.connector').toString()}
                                    </label>
                                    <DropdownConnector
                                        onChange={(event) => {
                                            formik.handleChange({
                                                target: {value: event.value, name: 'conf_connector_id'}
                                            });
                                        }}
                                        id="conf_connector_id"
                                        isInvalid={!!formik.errors.conf_connector_id}
                                        value={formik.values.conf_connector_id}
                                        defaultValue={formik.values.conf_connector_id}
                                    />
                                </div>

                                <Divider align="center">
                                    <div className={'inline-flex align-items-center'}>
                                        <i className="pi pi-share-alt mr-2"/>
                                        <b>{t('common:sharing_options')}</b>
                                    </div>
                                </Divider>
                                <div className="field col-12">
                                    <label htmlFor="name">{t('report:form.integration_link')}</label>
                                </div>

                                <div className="field col-12 md:col-1">
                                    <InputSwitch
                                        id="public_access"
                                        checked={formik.values.public_access}
                                        {...formik.getFieldProps('public_access')}
                                    />
                                </div>
                                <div className="field col-12 md:col-10">
                                    <InputText
                                        className={!!formik.errors.public_security_hash ? 'p-invalid w-full' : 'w-full'}
                                        ref={publicSecurityHashRef}
                                        id="public_security_hash"
                                        name="public_security_hash"
                                        type="text"
                                        value={`${window.location.protocol}//${window.location.hostname}/public/report/${formik.values.id}?sh=${formik.values.public_security_hash}&run`}
                                        disabled={!formik.values.public_access}
                                    />
                                </div>

                                <div className="field col-12 md:col-1">
                                    <Button
                                        type="button"
                                        icon="pi pi-copy"
                                        onClick={copyToClipboard}
                                        disabled={!formik.values.public_access}
                                    />
                                </div>

                                <div className="field col-12 flex flex-row align-items-center">
                                    <label
                                        className="mb-0"
                                        htmlFor="public_authorized_referers"
                                    >
                                        {t('report:form.authorized_hosts').toString()}
                                    </label>
                                    &nbsp;&nbsp;&nbsp;<i
                                    className="pi pi-question-circle public_authorized_referers mr-2"/>
                                    <Tooltip target=".public_authorized_referers"
                                             position="bottom"
                                             content={t('report:form.help_public_authorized_referers').toString()}
                                             showDelay={env.tooltipShowDelay}
                                             hideDelay={env.tooltipHideDelay}
                                    />
                                    <Chips
                                        className="flex-grow-1"
                                        id="public_authorized_referers"
                                        {...formik.getFieldProps('public_authorized_referers')}
                                        value={formik.values.public_authorized_referers}
                                        onChange={(event) => {
                                            formik.handleChange({
                                                target: {value: event.value, name: 'public_authorized_referers'}
                                            });
                                        }}
                                        separator=","
                                        disabled={!formik.values.public_access}
                                        addOnBlur
                                    />
                                </div>

                                <div className="field col-12">
                                    <Divider align="center">
                                        <div className="inline-flex align-items-center">
                                            <i className="pi pi-eye mr-2"/>
                                            <b>{t('report:form.report_permissions')}</b>
                                        </div>
                                    </Divider>
                                    <div>
                                        {areTherePermissions(formik.values) ?
                                            <>
                                                <p>
                                                    {((formik.values.allowed_users_id && formik.values.allowed_users_id?.length > 0) ||
                                                            (formik.values.allowed_groups_id && formik.values.allowed_groups_id?.length))
                                                        &&
                                                        <>
                                                            {`${t('common:authorized_for')} `}
                                                            {formik.values.allowed_users_id && formik.values.allowed_users_id?.length > 0 &&
                                                                <> {formik.values.allowed_users_id?.length}
                                                                    <span className="p-text-lowercase">
                                                         {(formik.values.allowed_users_id?.length > 1) ? ` ${t('common:users')}` : ` ${t('common:user')}`}
                                                    </span>
                                                                </>
                                                            }

                                                            {(formik.values.allowed_users_id && formik.values.allowed_users_id?.length > 0 &&
                                                                    formik.values.allowed_groups_id && formik.values.allowed_groups_id?.length > 0) &&
                                                                <>{` ${t('common:and')} `}</>
                                                            }

                                                            {formik.values.allowed_groups_id && formik.values.allowed_groups_id?.length > 0 &&
                                                                <>
                                                                    {formik.values.allowed_groups_id?.length}
                                                                    <span className="p-text-lowercase">
                                                        {(formik.values.allowed_groups_id?.length > 1) ? ` ${t('common:users_groups')}` : ` ${t('common:users_group')}`}
                                                    </span>
                                                                </>
                                                            }
                                                        </>
                                                    }

                                                </p>

                                            </>
                                            : t('report:form.report_permission_fully_opened')
                                        }
                                    </div>
                                </div>

                                <div className="field col-12">
                                    <label htmlFor="allowed_users_id"
                                           style={{display: 'block'}}
                                    >
                                        {t('common:users').toString()}
                                    </label>
                                    <MultiSelectUser
                                        onChange={(event) => {
                                            formik.handleChange({
                                                target: {
                                                    value: event.value,
                                                    name: 'allowed_users_id'
                                                }
                                            });
                                        }}
                                        id="allowed_users_id"
                                        isInvalid={!!formik.errors.allowed_users_id}
                                        values={formik.values.allowed_users_id ?? []}
                                        disabled={!authState.user.organization_user.ui_grants.user.edit}
                                    />
                                </div>

                                <div className="field col-12">
                                    <label htmlFor="allowed_groups_id">{t('common:users_groups')}</label><br/>
                                    <MultiSelectGroup
                                        onChange={(event) => {
                                            formik.handleChange({
                                                target: {
                                                    value: event.value,
                                                    name: 'allowed_groups_id'
                                                }
                                            });
                                        }}
                                        id="allowed_groups_id"
                                        isInvalid={!!formik.errors.allowed_groups_id}
                                        values={formik.values.allowed_groups_id ?? []}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-content-end">
                                <div>
                                    <ButtonWithSpinner
                                        buttonStatus={submitButtonStatus}
                                        disabled={!formik.isValid}
                                        type="submit"
                                    />
                                </div>
                            </div>

                            {displayError && <div className="col-12">
                                <Message severity="error" text={errorMessage}/>
                            </div>}

                        </form>
                    )}
                </Formik>
            )}
        </>
    );
}

export default ReportForm;
