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
import { Tooltip }        from "primereact/tooltip";
import * as React         from "react";
import { useTranslation } from "react-i18next";
import * as Yup           from "yup";

import TDataViewTableColumnParameter                                    from "../../types/TDataViewTableColumnParameter";
import ButtonWithSpinner, { SubmitButtonStatus }                        from "../common/form/ButtonWithSpinner";
import { ICallbackOnExternalLinkDelete, ICallbackOnExternalLinkUpdate } from "../../types/ICallBacks";
import env                                                              from "../../envVariables";
import { useReportState }                                               from "../../contexts/report/ReportContextProvider";
import TExternalLink                                                    from "../../types/TExternalLink";
import { useCurrentActiveReportId }                                     from "../../utils/hooks";
import { InputTextarea }                                                from "primereact/inputtextarea";
import { Message }                                                      from "primereact/message";
import ReportParametersAndColumnsBinder                                 from "../common/form/ReportParametersAndColumnsBinder";

const ExternalLinkForm: React.FC<{
    indexForm: number,
    columnParameters: Array<TDataViewTableColumnParameter>,
    initialLink: TExternalLink
    currentLinks: Array<TExternalLink>
    isNewLink?: boolean,
    onLinkUpdate: ICallbackOnExternalLinkUpdate,
    onLinkDelete: ICallbackOnExternalLinkDelete
}> = ({
          indexForm,
          columnParameters,
          initialLink,
          currentLinks,
          isNewLink = false,
          onLinkUpdate,
          onLinkDelete
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);
    const reportId = useCurrentActiveReportId();
    const {report} = useReportState(Number(reportId));

    const [submitButtonCreate, setSubmitButtonCreate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonUpdate, setSubmitButtonUpdate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonDelete, setSubmitButtonDelete] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);

    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

    const addToTextArea = (text: string): string => {
        if (textAreaRef.current) {
            let start_position = textAreaRef.current.selectionStart;
            let end_position = textAreaRef.current.selectionEnd;

            return `${textAreaRef.current.value.substring(
                0,
                start_position
            )}${text}${textAreaRef.current.value.substring(
                end_position,
                textAreaRef.current.value.length
            )}`;
        }
        return '';
    };

    const handleOnCreate = (values: TExternalLink): void => {

        setSubmitButtonCreate(SubmitButtonStatus.Validating);
        onLinkUpdate(values);
        setSubmitButtonCreate(SubmitButtonStatus.Validated);
    };

    const handleOnUpdate = (values: TExternalLink): void => {

        setSubmitButtonUpdate(SubmitButtonStatus.Validating);
        onLinkUpdate(values);
        setSubmitButtonUpdate(SubmitButtonStatus.Validated);
    };

    return (
        <Formik
            key={'table_form_parameter_'}
            validateOnMount={true}
            validationSchema={Yup.object({
                label: Yup.string()
                    .required('')
                    .notOneOf(
                        currentLinks.filter(c => c.label !== initialLink.label).map(cl => cl.label),
                        t('report:report_link.external_column_link_label_uniqueness').toString()
                    ),
                url: Yup.string().required(''),
            })}
            initialValues={{
                url: initialLink.url,
                label: initialLink.label,
                initialLabel: initialLink.label,
            }}
            onSubmit={(values: TExternalLink) => isNewLink ? handleOnCreate(values) : handleOnUpdate(values)}
        >
            {(formik) => (
                <form onSubmit={formik.handleSubmit}>
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
                            {!!formik.errors.label && (
                                <small className="text-danger">
                                    {formik.errors.label}
                                </small>
                            )}
                        </div>
                        <div className="field md:col-12">
                            <Tooltip
                                target=".report-link-label-tooltip"
                                position="bottom"
                                content={t('report:report_link.tooltip_label').toString()}
                                showDelay={env.tooltipShowDelay}
                                hideDelay={env.tooltipHideDelay}
                            />
                            <label htmlFor={'url_' + indexForm}>{t('report:report_link.url').toString()} </label>
                            &nbsp;&nbsp;&nbsp;<i className="pi pi-question-circle report-link-label-tooltip"/>
                            <InputTextarea
                                ref={textAreaRef}
                                className="w-full"
                                {...formik.getFieldProps('url')}
                                // onChange={(event) => formik.setFieldValue('url', event.currentTarget.value.trim())}
                            />
                            {!!formik.errors.url && (
                                <small className="text-danger">
                                    {formik.errors.url}
                                </small>
                            )}
                            <div className="mt-3">
                                <Message
                                    className="w-full justify-content-start"
                                    severity="info"
                                    text={(
                                        <>
                                            {t('report:report_link.external_column_link_url_info').toString()}
                                            <br/>
                                            {t('report:report_link.external_column_link_url_add_on_click').toString()}
                                        </>
                                    )}
                                />
                                <ReportParametersAndColumnsBinder
                                    reportParameters={report?.parameters}
                                    columns={columnParameters.map(c => c.column)}
                                    onReportParameterClick={(parameterName: string) => formik.setFieldValue('url', addToTextArea(`[[${parameterName}]]`))}
                                    onColumnClick={(column: string) => formik.setFieldValue('url', addToTextArea(`{{${column}}}`))}
                                />
                            </div>
                        </div>

                        <div className="flex flex-grow-1 justify-content-end">
                            {!isNewLink ?
                                <>
                                    <div className="mr-2">
                                        <ButtonWithSpinner
                                            type="button"
                                            buttonStatus={submitButtonDelete}
                                            disabled={!formik.isValid}
                                            id={`delete_link_${indexForm}`}
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
                                                onLinkDelete(formik.values);
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
                </form>
            )}
        </Formik>
    )
};
export default ExternalLinkForm;