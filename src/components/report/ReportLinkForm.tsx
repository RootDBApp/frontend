import { Form, Formik }   from "formik";
import { Divider }        from "primereact/divider";
import { InputSwitch }    from "primereact/inputswitch";
import { InputText }      from "primereact/inputtext";
import { Tooltip }        from "primereact/tooltip";
import * as React         from "react";
import { useLocation }    from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Yup           from "yup";

import DropDownReport                                               from "../common/form/DropDownReport";
import ReportLinkParameters                                         from "./ReportLinkParameters";
import TReportLink                                                  from "../../types/TReportLink";
import TDataViewTableColumnParameter                                from "../../types/TDataViewTableColumnParameter";
import ButtonWithSpinner, { SubmitButtonStatus }                    from "../common/form/ButtonWithSpinner";
import TReportLinkParameter                                         from "../../types/TReportLinkParameter";
import { ICallbackOnReportLinkDelete, ICallbackOnReportLinkUpdate } from "../../types/ICallBacks";
import apiDataContext                                               from "../../contexts/api_data/store/context";
import TReport                                                      from "../../types/TReport";
import env                                                          from "../../envVariables";
import { useReportStateReportInstanceDataViewInstanceFromLocation } from "../../contexts/report/ReportContextProvider";


const ReportLinkForm: React.FC<{
    indexForm: number,
    columnParameters: Array<TDataViewTableColumnParameter>,
    initialReportLink: TReportLink
    currentReportLinks: Array<TReportLink>
    isNewReportLink?: boolean,
    onReportLinkUpdate: ICallbackOnReportLinkUpdate,
    onReportLinkDelete: ICallbackOnReportLinkDelete
}> = ({
          indexForm,
          columnParameters,
          initialReportLink,
          currentReportLinks,
          isNewReportLink = false,
          onReportLinkUpdate,
          onReportLinkDelete
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);
    const reportState = useReportStateReportInstanceDataViewInstanceFromLocation(useLocation().pathname);

    const {state: apiDataState} = React.useContext(apiDataContext);

    const [submitButtonCreate, setSubmitButtonCreate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonUpdate, setSubmitButtonUpdate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonDelete, setSubmitButtonDelete] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);

    const handleOnCreate = (values: TReportLink): void => {

        setSubmitButtonCreate(SubmitButtonStatus.Validating);
        onReportLinkUpdate(values);
        setSubmitButtonCreate(SubmitButtonStatus.Validated);
    };

    const handleOnUpdate = (values: TReportLink): void => {

        setSubmitButtonUpdate(SubmitButtonStatus.Validating);
        onReportLinkUpdate(values);
        setSubmitButtonUpdate(SubmitButtonStatus.Validated);
    };

    return (
        <Formik
            key={'table_form_parameter_'}
            validateOnMount={true}
            validationSchema={Yup.object({
                label: Yup.string().nullable(),
                reportId: Yup.number().required().min(1),
            })}
            initialValues={{
                canBeOpenInSameTab: initialReportLink.canBeOpenInSameTab,
                reportId: initialReportLink.reportId,
                label: initialReportLink.label,
                parameters: initialReportLink.parameters,
            }}
            onSubmit={(values: TReportLink) => isNewReportLink ? handleOnCreate(values) : handleOnUpdate(values)}
        >
            {(formik) => (
                <Form placeholder="" onSubmit={formik.handleSubmit}>
                    <div className="formgrid grid">
                        <div className="field md:col-12">
                            <Tooltip
                                target=".report-link-label-tooltip"
                                position="bottom"
                                content={t('report:report_link.tooltip_label').toString()}
                                showDelay={env.tooltipShowDelay}
                                hideDelay={env.tooltipHideDelay}
                            />
                            <label htmlFor={'label_' + indexForm}>{t('report:report_link.label').toString()} </label>
                            &nbsp;&nbsp;&nbsp;<i className="pi pi-question-circle report-link-label-tooltip"/>
                            <InputText
                                id={'label_' + indexForm}
                                type="text"
                                {...formik.getFieldProps('label')}
                                className={!!formik.errors.label ? 'p-invalid w-full' : 'w-full'}
                                placeholder={t('report:report_link.label').toString()}
                                autoFocus
                            />
                        </div>

                        <div className="field md:col-12 pb-0">
                            <Tooltip
                                target=".report-link-selector-tooltip"
                                position="bottom"
                                content={t('report:report_link:here_we_list_only_report_with_input_parameters').toString()}
                                showDelay={env.tooltipShowDelay}
                                hideDelay={env.tooltipHideDelay}
                            />
                            <label htmlFor={'report_' + indexForm}>{t('report:linked_report').toString()}</label>
                            &nbsp;&nbsp;&nbsp;<i className="pi pi-question-circle report-link-selector-tooltip"/>
                            <DropDownReport
                                onChange={(event) => {
                                    formik.setFieldValue('reportId', event.value);
                                    if (!formik.values.label) {
                                        formik.setFieldValue(
                                            'label',
                                            apiDataState.reports.find((report: TReport) => report.id === event.value)?.name,
                                        );
                                    }
                                }}
                                id={'report_' + indexForm}
                                isInvalid={!!formik.errors.reportId}
                                value={formik.values.reportId}
                                excludedReportIds={
                                    [
                                        ...currentReportLinks
                                            .filter((reportLink: TReportLink) => reportLink.reportId !== formik.values.reportId)
                                            .map((reportLink: TReportLink) => reportLink.reportId),

                                        ...apiDataState.reports
                                            .filter((report: TReport) => !report.has_parameters)
                                            .map((report: TReport) => report.id)
                                    ]
                                }
                            />
                        </div>

                        <div className="field md:col-12 pt-0 pb-0">
                            <ReportLinkParameters
                                columnParameters={columnParameters}
                                initialReportLinkParameters={formik.values.parameters}
                                linkedReportId={formik.values.reportId}
                                onReportLinkParametersUpdate={
                                    (reportLinkParameters: Array<TReportLinkParameter>) => {

                                        formik.values.parameters = reportLinkParameters;
                                    }}
                            />
                        </div>

                        {(formik.values.reportId === reportState.report?.id)
                            && <>
                                <Divider align="left">
                                    <div className="inline-flex align-items-center">
                                        <i className="pi pi-link mr-2"></i>
                                        <b>{t('report:report_link.same_report_linked').toString()}</b>
                                    </div>
                                </Divider>
                                <div className="field md:col-12 pt-0">
                                    <Tooltip
                                        target=".report-link-same-report-tooltip"
                                        position="bottom"
                                        content={t('report:report_link.same_report_linked_explanation').toString()}
                                        showDelay={env.tooltipShowDelay}
                                        hideDelay={env.tooltipHideDelay}
                                    />
                                    <label htmlFor={'can_be_opened_same_tab' + indexForm}>
                                        {t('report:report_link.allow_self_linking').toString()}
                                    </label>
                                    &nbsp;&nbsp;&nbsp;
                                    <i className="pi pi-question-circle report-link-same-report-tooltip"/>
                                    <br/>
                                    <InputSwitch
                                        id={'can_be_opened_same_tab' + indexForm}
                                        checked={formik.values.canBeOpenInSameTab}
                                        {...formik.getFieldProps('canBeOpenInSameTab')}
                                    />
                                </div>
                            </>
                        }

                        <div className="flex flex-grow-1 justify-content-end">
                            {!isNewReportLink ?
                                <>
                                    <div className="mr-2">
                                        <ButtonWithSpinner
                                            type="button"
                                            buttonStatus={submitButtonDelete}
                                            disabled={!formik.isValid}
                                            id={`delete_report_link_${indexForm}`}
                                            labels={{
                                                default: t('common:form.delete').toString(),
                                                validating: t('common:form.deleting').toString(),
                                                validated: t('common:form.deleted').toString(),
                                                notValidated: t('common:form.delete_failed').toString(),
                                            }}
                                            severity="danger"
                                            validateAction
                                            validateActionCallback={() => {
                                                setSubmitButtonDelete(SubmitButtonStatus.Validating);
                                                onReportLinkDelete(formik.values);
                                            }}
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
                                    className="mr-2"
                                />
                            }
                        </div>

                    </div>
                </Form>
            )}
        </Formik>
    )
};
export default ReportLinkForm;