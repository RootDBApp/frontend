import { InputText }      from "primereact/inputtext";
import { InputTextarea }  from "primereact/inputtextarea";
import { Tooltip }        from "primereact/tooltip";
import * as React         from "react";
import { useTranslation } from "react-i18next";
import { Form, Formik }   from "formik";
import * as Yup           from "yup";

import ButtonWithSpinner, { SubmitButtonStatus } from "../common/form/ButtonWithSpinner";
import DropdownCategory                          from "../common/form/DropdownCategory";
import TreeSelectDirectory                       from "../common/form/TreeSelectDirectory";
import { FAVORITES_DIRECTORY_ID }                from "../../utils/definitions";
import DropdownConnector                         from "../common/form/DropdownConnector";
import { apiSendRequest }                        from "../../services/api";
import { EAPIEndPoint }                          from "../../types/EAPIEndPoint";
import TReport                                   from "../../types/TReport";
import apiDataContext                            from "../../contexts/api_data/store/context";
import { ICallbackOnReportCreateSuccess }        from "../../types/ICallBacks";
import { context as authContext }                from "../../contexts/auth/store/context";
import env                                       from "../../envVariables";
import TConnector                                from "../../types/TConnector";
import { TAPIResponse }                          from "../../types/TAPIResponsed";
import { Message }                               from "primereact/message";


interface IQuickReportFormValues {
    category_id: number,
    conf_connector_id: number,
    description: string,
    description_listing: string,
    directory_id: number,
    has_parameters: boolean
    name: string,
    public_access: boolean,
    public_authorized_referers: Array<string>
}

const ReportCreateForm: React.FC<{
    onSuccess: ICallbackOnReportCreateSuccess
    directoryId?: number,
}> = (
    {
        onSuccess,
        directoryId = 0,

    }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);
    const {state: apiDataState} = React.useContext(apiDataContext);
    const {state: authState} = React.useContext(authContext);

    const [submitButtonStatus, setSubmitButtonStatus] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [displayError, setDisplayError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleOnSubmit = (values: IQuickReportFormValues): void => {

        setSubmitButtonStatus(SubmitButtonStatus.Validating);
        setDisplayError(false);
        setErrorMessage('');

        apiSendRequest({
            method: 'POST',
            endPoint: EAPIEndPoint.REPORT,
            formValues: {
                id: 0,
                organization_id: authState.user.organization_user.organization_id,
                conf_connector_id: values.conf_connector_id,
                category_id: values.category_id,
                directory_id: values.directory_id,
                name: values.name,
                description: values.description,
                description_listing: values.description_listing,
                public_access: values.public_access,
                public_authorized_referers: values.public_authorized_referers,
                has_parameters: false
            },
            callbackSuccess: (response: TReport) => {

                //reportDispatch(gotReport(response));
                setSubmitButtonStatus(SubmitButtonStatus.Validated);
                onSuccess(response);
            },
            callbackError: (error: TAPIResponse) => {

                setSubmitButtonStatus(SubmitButtonStatus.NotValidated);
                setDisplayError(true);
                setErrorMessage(error.message);
            }
        });
    }

    return (
        <Formik
            validateOnMount={true}
            validationSchema={Yup.object({
                name: Yup.string().required(),
                title: Yup.string(),
                description: Yup.string(),
                description_listing: Yup.string(),
                category_id: Yup.number().required().min(1),
                directory_id: Yup.number().required().min(1),
                conf_connector_id: Yup.number().required().min(1),
            })}
            onSubmit={values => handleOnSubmit(values)}
            initialValues={{
                name: '',
                title: '',
                description: '',
                description_listing: '',
                category_id: apiDataState.categories[0] ? apiDataState.categories[0].id : 0, // Should always be up-to-date.
                directory_id: (directoryId > 0 && directoryId !== FAVORITES_DIRECTORY_ID) ? directoryId : 0,
                conf_connector_id: apiDataState.connectors.find((connector: TConnector) => !connector.global)?.id ?? 0,
                public_access: false,
                public_authorized_referers: [],
                has_parameters: false,
            }}
        >
            {formik => (
                <Form placeholder="" onSubmit={formik.handleSubmit}>
                    <div className="formgrid grid">
                        <div className="field col-12">
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
                        <div className="field col-12">
                            <label htmlFor="title">{t('common:form.title')}</label>
                            <InputText
                                id="title"
                                type="text"
                                {...formik.getFieldProps('title')}
                                className={!!formik.errors.title ? 'p-invalid w-full' : 'w-full'}
                                placeholder={t('report:form.title_placeholder').toString()}
                            />
                        </div>

                        {/*<div className="field col-12">*/}
                        {/*    <label htmlFor="description">Description</label>*/}
                        {/*    <InputTextarea*/}
                        {/*        id="description"*/}
                        {/*        {...formik.getFieldProps('description')}*/}
                        {/*        className={!!formik.errors.description ? 'p-invalid w-full' : 'w-full'}*/}
                        {/*        autoResize*/}
                        {/*    />*/}
                        {/*</div>*/}

                        <Tooltip target=".parameter-description_listing-tooltip"
                                 position="bottom"
                                 content={t('report:form.help_description_listing').toString()}
                                 showDelay={env.tooltipShowDelay}
                                 hideDelay={env.tooltipHideDelay}
                        />

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
                                name="category_id"
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
                            <label
                                htmlFor="description">{t('settings:global_administration.connector.connector')}</label>
                            <DropdownConnector
                                onChange={(event) => {
                                    formik.handleChange({
                                        target: {value: event.value, name: 'conf_connector_id'}
                                    });
                                }}
                                id="conf_connector_id"
                                isInvalid={!!formik.errors.conf_connector_id}
                                defaultValue={formik.values.conf_connector_id}
                            />
                        </div>
                    </div>

                    <div className="flex justify-content-end">
                        <ButtonWithSpinner
                            disabled={!formik.isValid}
                            buttonStatus={submitButtonStatus}
                            type="submit"
                        />
                    </div>

                    {displayError && <div className="col-12">
                        <Message severity="error" text={errorMessage}/>
                    </div>}
                </Form>
            )}
        </Formik>
    );
}

export default ReportCreateForm;
