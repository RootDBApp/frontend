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
import { Button }         from "primereact/button";
import { Dialog }         from "primereact/dialog";
import { Dropdown }       from "primereact/dropdown";
import { InputSwitch }    from "primereact/inputswitch";
import { InputText }      from "primereact/inputtext";
import { Message }        from "primereact/message";
import { Tooltip }        from "primereact/tooltip";
import * as React         from "react";
import { useTranslation } from "react-i18next";
import * as Yup           from "yup";

import ButtonWithSpinner, { SubmitButtonStatus }       from "../../../common/form/ButtonWithSpinner";
import TDataViewTableColumnParameter                   from "../../../../types/TDataViewTableColumnParameter";
import { ETableFilterType }                            from "../../../../types/ETableFilterType";
import { ETableAggregateType }                         from "../../../../types/ETableAggregateType";
import { footerDefaultText }                           from "../../../../utils/tableView";
import { ICallbackOnCreateOrUpdateDataViewTableParam } from "../../../../types/ICallBacks";
import TReportLink                                     from "../../../../types/TReportLink";
import ReportLinks                                     from "../../ReportLinks";
import env                                             from "../../../../envVariables";
import TCallbackResponse                               from "../../../../types/TCallbackResponse";
import { ECallbackStatus }                             from "../../../../types/ECallbackStatus";
import { InputNumber }                                 from "primereact/inputnumber";
import TExternalLink                                   from "../../../../types/TExternalLink";
import ExternalLinks                                   from "../../ExternalLinks";
import { useDebouncedCallback }                        from "../../../../utils/hooks";

const DataViewTableColumnParameterForm: React.FC<{
    callBackResponse?: TCallbackResponse,
    columnParameters: Array<TDataViewTableColumnParameter>,
    currentColumnParameter: TDataViewTableColumnParameter,
    isNewParameter?: boolean
    onChangeCallback: ICallbackOnCreateOrUpdateDataViewTableParam,
    onCreateCallback: ICallbackOnCreateOrUpdateDataViewTableParam,
    onDeleteCallback: ICallbackOnCreateOrUpdateDataViewTableParam
}> = ({
          callBackResponse,
          columnParameters,
          currentColumnParameter,
          isNewParameter = false,
          onChangeCallback,
          onCreateCallback,
          onDeleteCallback,
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);

    const [submitButtonCreate, setSubmitButtonCreate] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [submitButtonDelete, setSubmitButtonDelete] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [displayError, setDisplayError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const [currentReportLinks, setCurrentReportLinks] = React.useState<Array<TReportLink>>([]);
    const [dialogDataViewTableParamReportLinksVisible, setDialogDataViewTableParamReportLinksVisible] = React.useState<boolean>(false);
    const [dialogDataViewTableParamReportLinksHeader, setDialogDataViewTableParamReportLinksHeader] = React.useState<string>('');

    const [currentExternalLinks, setCurrentExternalLinks] = React.useState<Array<TExternalLink>>([]);
    const [dialogDataViewTableParamExternalLinksVisible, setDialogDataViewTableParamExternalLinksVisible] = React.useState<boolean>(false);
    const [dialogDataViewTableParamExternalLinksHeader, setDialogDataViewTableParamExternalLinksHeader] = React.useState<string>('');

    React.useEffect(() => {
        switch (callBackResponse?.status) {
            case ECallbackStatus.ACTION_OK:
                if (submitButtonCreate !== SubmitButtonStatus.ToValidate) {
                    setSubmitButtonCreate(SubmitButtonStatus.Validated);
                }
                if (submitButtonDelete !== SubmitButtonStatus.ToValidate) {
                    setSubmitButtonDelete(SubmitButtonStatus.Validated);
                }
                break;
            case ECallbackStatus.ACTION_KO:
                if (submitButtonCreate !== SubmitButtonStatus.ToValidate) {
                    setSubmitButtonCreate(SubmitButtonStatus.NotValidated);
                }
                if (submitButtonDelete !== SubmitButtonStatus.ToValidate) {
                    setSubmitButtonDelete(SubmitButtonStatus.NotValidated);
                }
                break;
        }
    }, [callBackResponse, submitButtonCreate, submitButtonDelete]);

    React.useEffect(() => {
        if (callBackResponse?.status === ECallbackStatus.IDLE) {
            setSubmitButtonCreate(SubmitButtonStatus.ToValidate);
            setSubmitButtonDelete(SubmitButtonStatus.ToValidate);
        }
    }, [callBackResponse])

    const handleOnCreate = React.useCallback((values: TDataViewTableColumnParameter): void => {

        setDisplayError(false);
        setErrorMessage('');
        setSubmitButtonCreate(SubmitButtonStatus.Validating);
        onCreateCallback(values);
    }, [onCreateCallback]);

    const handleOnUpdate = React.useCallback((values: TDataViewTableColumnParameter): void => {

        setDisplayError(false);
        setErrorMessage('');
        onChangeCallback(values);
    }, [onChangeCallback]);

    const handleOnDelete = React.useCallback((values: TDataViewTableColumnParameter): void => {

        setDisplayError(false);
        setErrorMessage('');
        setSubmitButtonDelete(SubmitButtonStatus.Validating);
        onDeleteCallback(values);
    }, [onDeleteCallback]);

    const handleDebouncedUpdate = useDebouncedCallback((values: TDataViewTableColumnParameter): void => handleOnUpdate(values), 1000);

    return (
        <>
            <Formik
                key={'table_form_parameter_' + currentColumnParameter.header}
                validateOnMount={true}
                validationSchema={Yup.object({
                    header: Yup.string().required(),
                    column: Yup.string().required(),
                    hidden: Yup.boolean(),
                    filter: Yup.string().required(),
                    footerMethod: Yup.string(),
                    footerText: Yup.string(),
                    footerRounding: Yup.number(),
                    groupBy: Yup.boolean(),
                    collapsible: Yup.boolean(),
                    asImage: Yup.boolean(),
                    asImageThumbnailWidth: Yup.number().notRequired(),
                    asImageThumbnailHeight: Yup.number().notRequired(),
                    asImageFullSize: Yup.boolean(),
                })}
                onSubmit={values => isNewParameter ? handleOnCreate(values) : handleOnUpdate(values)}
                initialValues={{
                    header: currentColumnParameter.header,
                    column: currentColumnParameter.column,
                    hidden: currentColumnParameter.hidden || false,
                    filter: currentColumnParameter.filter || ETableFilterType.NONE,
                    footerMethod: currentColumnParameter.footerMethod || ETableAggregateType.NONE,
                    footerText: currentColumnParameter.footerText || '',
                    footerRounding: currentColumnParameter.footerRounding || 0,
                    groupBy: currentColumnParameter.groupBy,
                    reportLinks: currentColumnParameter.reportLinks || [],
                    externalLinks: currentColumnParameter.externalLinks || [],
                    collapsible: currentColumnParameter.collapsible || false,
                    asImage: !!currentColumnParameter.asImage,
                    asImageThumbnailWidth: currentColumnParameter.asImageThumbnailWidth,
                    asImageThumbnailHeight: currentColumnParameter.asImageThumbnailHeight,
                    asImageFullSize: !!currentColumnParameter.asImageFullSize,
                }}
            >
                {(formik) => (
                    <>
                        <Dialog
                            draggable={false}
                            header={dialogDataViewTableParamReportLinksHeader}
                            visible={dialogDataViewTableParamReportLinksVisible}
                            onHide={() => {
                                setDialogDataViewTableParamReportLinksVisible(false);
                            }}
                            breakpoints={{'1920px': '60vw', '1200px': '75vw', '900px': '90vw'}} style={{width: '50vw'}}
                        >
                            <ReportLinks
                                columnParameters={columnParameters}
                                initialReportLinks={currentReportLinks}
                                onReportLinksUpdate={
                                    (reportLinks: Array<TReportLink>) => {

                                        setCurrentReportLinks(reportLinks);
                                        onChangeCallback({...formik.values, reportLinks});
                                        formik.setFieldValue('reportLinks', reportLinks);
                                    }
                                }
                            />
                        </Dialog>

                        <Dialog
                            draggable={false}
                            header={dialogDataViewTableParamExternalLinksHeader}
                            visible={dialogDataViewTableParamExternalLinksVisible}
                            onHide={() => {
                                setDialogDataViewTableParamExternalLinksVisible(false);
                            }}
                            breakpoints={{'1920px': '60vw', '1200px': '75vw', '900px': '90vw'}} style={{width: '50vw'}}
                        >
                            <ExternalLinks
                                columnParameters={columnParameters}
                                initialLinks={currentExternalLinks}
                                onLinksUpdate={
                                    (externalLinks: Array<TExternalLink>) => {

                                        setCurrentExternalLinks(externalLinks);
                                        onChangeCallback({...formik.values, externalLinks});
                                        formik.setFieldValue('externalLinks', externalLinks);
                                    }
                                }
                            />
                        </Dialog>

                        <Form placeholder="" onSubmit={formik.handleSubmit}>
                            <div className="formgrid grid">

                                {/*<h3 className="col-12">{t('report:dataview.table_form.column_config_title')}</h3>*/}
                                <div className="field md:col-6">
                                    <label
                                        htmlFor={'name_' + currentColumnParameter.header}>{t('common:form.title')}</label>
                                    <InputText
                                        id={'name_' + currentColumnParameter.column}
                                        type="text"
                                        {...formik.getFieldProps('header')}
                                        className={!!formik.errors.header ? 'p-invalid w-full' : 'w-full'}
                                        placeholder={t('common:form.title').toString()}
                                        autoFocus
                                        onChange={(event) => {
                                            formik.setFieldValue('header', event.target.value);
                                            handleDebouncedUpdate({...formik.values, header: event.target.value});
                                        }}
                                    />
                                </div>

                                <div className="field md:col-6">
                                    <label
                                        id={'label_filter' + currentColumnParameter.column}
                                        htmlFor={'filter_' + currentColumnParameter.column}>
                                        {t('report:dataview.table_form.filter').toString()}
                                    </label><br/>
                                    <Dropdown
                                        {...formik.getFieldProps('filter')}
                                        options={[
                                            {
                                                label: t('report:dataview.table_form.filter_none').toString(),
                                                value: ETableFilterType.NONE
                                            },
                                            {
                                                label: t('report:dataview.table_form.filter_text').toString(),
                                                value: ETableFilterType.TEXT
                                            },
                                            {
                                                label: t('report:dataview.table_form.filter_value').toString(),
                                                value: ETableFilterType.RESULT
                                            },
                                            {
                                                label: t('report:dataview.table_form.filter_multi_values').toString(),
                                                value: ETableFilterType.MULTI_RESULT
                                            },
                                            {
                                                label: t('report:dataview.table_form.filter_minmax').toString(),
                                                value: ETableFilterType.MINMAX
                                            },
                                        ]}
                                        id={'filter_' + currentColumnParameter.column}
                                        inputId={'filter_input_' + currentColumnParameter.column}
                                        className="w-full"
                                        onChange={(event) => {
                                            formik.setFieldValue('filter', event.value);
                                            handleOnUpdate({...formik.values, filter: event.value});
                                        }}
                                    />
                                </div>

                                <h4 className="col-12 flex p-justify-between">
                                <span id={'label_hidden' + currentColumnParameter.column} className="flex-grow-1">
                                    {t('report:dataview.table_form.hidden').toString()}
                                </span><br/>
                                    <InputSwitch
                                        // ariaLabelledBy={'label_hidden' + currentColumnParameter.column}
                                        id={'hidden_' + currentColumnParameter.column}
                                        checked={formik.values.hidden}
                                        {...formik.getFieldProps('hidden')}
                                        onChange={(event) => {
                                            formik.setFieldValue('hidden', event.value);
                                            handleOnUpdate({...formik.values, hidden: Boolean(event.value)});
                                        }}
                                    />
                                </h4>

                                <h4 className="col-12 flex p-justify-between">
                                <span id={'label_collapsible' + currentColumnParameter.column} className="flex-grow-1">
                                    {t('common:collapsible')}
                                </span><br/>
                                    <InputSwitch
                                        // ariaLabelledBy={'label_collapsible' + currentColumnParameter.column}
                                        id={'collapsible_' + currentColumnParameter.column}
                                        checked={formik.values.collapsible}
                                        {...formik.getFieldProps('collapsible')}
                                        onChange={(event) => {
                                            formik.setFieldValue('collapsible', event.value);
                                            handleOnUpdate({...formik.values, collapsible: Boolean(event.value)});
                                        }}
                                    />
                                </h4>

                                <h4 className="col-12 flex p-justify-between">
                                <span className="flex-grow-1">
                                    {t('report:dataview.table_form.group_by_column_default').toString()}
                                </span>
                                    <InputSwitch
                                        id="columnGroupBy"
                                        checked={formik.values.groupBy}
                                        {...formik.getFieldProps('groupBy')}
                                        onChange={(event) => {
                                            formik.setFieldValue('groupBy', event.value);
                                            handleOnUpdate({...formik.values, groupBy: Boolean(event.value)});
                                        }}
                                    />
                                </h4>

                                <h4 className="col-12 flex p-justify-between">
                                    <Tooltip
                                        target=".image-placeholder-tooltip"
                                        position="bottom"
                                        content={t('report:dataview.table_form.image_column_tooltip').toString()}
                                        showDelay={env.tooltipShowDelay}
                                        hideDelay={env.tooltipHideDelay}
                                    />
                                    <span className="flex-grow-1">
                                        {t('report:dataview.table_form.image_column').toString()}
                                        <i className="pi pi-question-circle image-placeholder-tooltip ml-2"/>
                                    </span>
                                    <InputSwitch
                                        id="columnGroupBy"
                                        checked={formik.values.asImage}
                                        {...formik.getFieldProps('asImage')}
                                        onChange={(event) => {
                                            formik.setFieldValue('asImage', event.value);
                                            handleOnUpdate({...formik.values, asImage: Boolean(event.value)});
                                        }}
                                    />
                                </h4>
                                {formik.values.asImage && (
                                    <>
                                        <h4 className="col-12 flex p-justify-between">
                                            <span className="flex-grow-1">
                                                {t('report:dataview.table_form.image_column_thumbnail_full_size').toString()}
                                            </span>
                                            <InputSwitch
                                                id="columnGroupBy"
                                                checked={formik.values.asImageFullSize}
                                                {...formik.getFieldProps('asImageFullSize')}
                                                onChange={(event) => {
                                                    formik.setFieldValue('asImageFullSize', event.value);
                                                    handleOnUpdate({...formik.values, asImageFullSize: Boolean(event.value)});
                                                }}
                                            />
                                        </h4>
                                        <div className="field md:col-6">
                                            <label
                                                id={'label_image_width_text_' + currentColumnParameter.column}
                                                htmlFor={'image_width_text_' + currentColumnParameter.column}>
                                                {t('report:dataview.table_form.image_column_thumbnail_width').toString()}
                                            </label>
                                            <InputNumber
                                                min={0}
                                                mode="decimal"
                                                size={2}
                                                suffix=" px"
                                                id={'image_width_text_' + currentColumnParameter.column}
                                                {...formik.getFieldProps('asImageThumbnailWidth')}
                                                className={!!formik.errors.asImageThumbnailWidth ? 'p-invalid w-full' : 'w-full'}
                                                onChange={undefined}
                                                onValueChange={(e) => {
                                                    formik.setFieldValue('asImageThumbnailWidth', e.value)
                                                    handleOnUpdate({
                                                        ...formik.values,
                                                        asImageThumbnailWidth: e.value || undefined
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="field md:col-6">
                                            <label
                                                id={'label_image_height_text_' + currentColumnParameter.column}
                                                htmlFor={'image_height_text_' + currentColumnParameter.column}>
                                                {t('report:dataview.table_form.image_column_thumbnail_height').toString()}
                                            </label>
                                            <InputNumber
                                                min={0}
                                                mode="decimal"
                                                size={2}
                                                suffix=" px"
                                                id={'image_height_text_' + currentColumnParameter.column}
                                                {...formik.getFieldProps('asImageThumbnailHeight')}
                                                className={!!formik.errors.asImageThumbnailHeight ? 'p-invalid w-full' : 'w-full'}
                                                onChange={undefined}
                                                onValueChange={(e) => {
                                                    formik.setFieldValue('asImageThumbnailHeight', e.value)
                                                    handleOnUpdate({
                                                        ...formik.values,
                                                        asImageThumbnailHeight: e.value || undefined
                                                    });
                                                }}
                                            />
                                        </div>
                                    </>
                                )}

                                <h4 className="col-12">{t('report:dataview.table_form.footer_config_title')}</h4>
                                <div className="field md:col-6">
                                    <label
                                        id={'label_footer_calc_' + currentColumnParameter.column}
                                        htmlFor={'footer_calc_' + currentColumnParameter.column}>
                                        {t('report:dataview.table_form.footer_calc_method').toString()}
                                    </label><br/>
                                    <Dropdown
                                        {...formik.getFieldProps('footerMethod')}
                                        options={[
                                            {
                                                label: t('report:dataview.table_form.footer_calc_none').toString(),
                                                value: ETableAggregateType.NONE,
                                            },
                                            {
                                                label: t('report:dataview.table_form.footer_calc_sum').toString(),
                                                value: ETableAggregateType.SUM,
                                            },
                                            {
                                                label: t('report:dataview.table_form.footer_calc_average').toString(),
                                                value: ETableAggregateType.AVERAGE,
                                            },
                                            {
                                                label: t('report:dataview.table_form.footer_calc_count').toString(),
                                                value: ETableAggregateType.COUNT,
                                            },
                                            {
                                                label: t('report:dataview.table_form.footer_calc_unique_count').toString(),
                                                value: ETableAggregateType.UNIQUE_COUNT,
                                            },
                                        ]}
                                        id={'footer_calc_' + currentColumnParameter.column}
                                        inputId={'footer_calc_input_' + currentColumnParameter.column}
                                        onChange={(event) => {

                                            formik.setFieldValue('footerMethod', (event.value as ETableAggregateType));
                                            let footerText = formik.values.footerText;

                                            if (Object.values(footerDefaultText).includes(formik.values.footerText)) {
                                                formik.setFieldValue('footerText', footerDefaultText[(event.value as ETableAggregateType)]);
                                                footerText = footerDefaultText[(event.value as ETableAggregateType)];
                                            }

                                            handleOnUpdate({
                                                ...formik.values,
                                                footerMethod: event.value,
                                                footerText: footerText
                                            });
                                        }}
                                        className="w-full"
                                    />
                                </div>
                                {formik.values.footerMethod !== ETableAggregateType.NONE && (
                                    <>
                                        <div className="field md:col-6">
                                            <Tooltip
                                                target=".footer-placeholder-tooltip"
                                                position="bottom"
                                                content={t('report:dataview.table_form.footer_text_placeholder_info').toString()}
                                                showDelay={env.tooltipShowDelay}
                                                hideDelay={env.tooltipHideDelay}
                                            />
                                            <label
                                                id={'label_footer_text_' + currentColumnParameter.column}
                                                htmlFor={'footer_text_' + currentColumnParameter.column}>
                                                {t('report:dataview.table_form.footer_text').toString()}
                                            </label>
                                            &nbsp;&nbsp;&nbsp;<i className="pi pi-question-circle footer-placeholder-tooltip"/>
                                            <InputText
                                                id={'footer_text_' + currentColumnParameter.column}
                                                type="text"
                                                {...formik.getFieldProps('footerText')}
                                                className={!!formik.errors.footerText ? 'p-invalid w-full' : 'w-full'}
                                                placeholder={t('report:dataview.table_form.footer_text_placeholder').toString()}
                                                onChange={(event) => {
                                                    formik.setFieldValue('footerText', event.target.value);
                                                    handleDebouncedUpdate({
                                                        ...formik.values,
                                                        footerText: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>

                                        <div className="field md:col-6">
                                            <label
                                                id={'label_footer_rounding_' + currentColumnParameter.column}
                                                htmlFor={'footer_rounding_' + currentColumnParameter.column}>
                                                {t('report:dataview.table_form.footer_rounding').toString()}
                                            </label>
                                            <InputNumber
                                                id={'footer_rounding_' + currentColumnParameter.column}
                                                {...formik.getFieldProps('footerRounding')}
                                                onChange={undefined}
                                                className={!!formik.errors.footerRounding ? 'p-invalid w-full' : 'w-full'}
                                                min={0}
                                                max={10}
                                                mode="decimal"
                                                inputClassName="p-inputtext-sm"
                                                size={2}
                                                step={1}
                                                showButtons
                                                onValueChange={(e) => {
                                                    formik.setFieldValue('footerRounding', e.value)
                                                    handleDebouncedUpdate({
                                                        ...formik.values,
                                                        footerRounding: e.value || 0
                                                    });
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="col-12">
                                <Button
                                    type="button"
                                    icon="pi pi-external-link"
                                    className={`p-button-outlined ${(formik.values.reportLinks.length > 0) ? 'p-button-success' : 'p-button-secondary'}`}
                                    label={`${t('report:report_link.report_column_links')} ${(formik.values.reportLinks.length > 0) ? '(' + formik.values.reportLinks.length + ')' : ''}`}
                                    onClick={() => {

                                        setDialogDataViewTableParamReportLinksHeader(
                                            t('report:report_link.report_column_links')
                                            + ' ' + t('report:report_link.for_column')
                                            + ' "' + currentColumnParameter.column + '"'
                                        );
                                        setDialogDataViewTableParamReportLinksVisible(true);
                                        setCurrentReportLinks(formik.values.reportLinks);
                                    }}
                                />
                            </div>
                            <div className="col-12">
                                <Button
                                    type="button"
                                    icon="pi pi-external-link"
                                    className={`p-button-outlined ${(formik.values.externalLinks.length > 0) ? 'p-button-success' : 'p-button-secondary'}`}
                                    label={`${t('report:report_link.external_column_links')} ${(formik.values.externalLinks.length > 0) ? '(' + formik.values.externalLinks.length + ')' : ''}`}
                                    onClick={() => {

                                        setDialogDataViewTableParamExternalLinksHeader(
                                            t('report:report_link.external_column_links')
                                            + ' ' + t('report:report_link.for_column')
                                            + ' "' + currentColumnParameter.column + '"'
                                        );
                                        setDialogDataViewTableParamExternalLinksVisible(true);
                                        setCurrentExternalLinks(formik.values.externalLinks);
                                    }}
                                />
                            </div>

                            <div className="flex justify-content-end"
                                 key={`${currentColumnParameter.column}-actions-buttons-${currentColumnParameter.new}`}>
                                {isNewParameter ?
                                    <ButtonWithSpinner
                                        buttonStatus={submitButtonCreate}
                                        disabled={!formik.isValid}
                                        labels={{
                                            default: t('common:form.create').toString(),
                                            validating: t('common:form.creating').toString(),
                                            validated: t('common:form.created').toString(),
                                            notValidated: t('common:form.create_failed').toString(),
                                        }}
                                        type="submit"
                                    />
                                    :
                                    <ButtonWithSpinner
                                        severity="danger"
                                        className="mr-2"
                                        buttonStatus={submitButtonDelete}
                                        disabled={!formik.isValid}
                                        labels={{
                                            default: t('common:form.delete').toString(),
                                            validating: t('common:form.deleting').toString(),
                                            validated: t('common:form.deleted').toString(),
                                            notValidated: t('common:form.delete_failed').toString(),
                                        }}
                                        type="button"
                                        validateAction
                                        validateActionCallback={() => handleOnDelete(currentColumnParameter)}
                                    />
                                }
                            </div>

                            {displayError && <div className="col-12">
                                <Message severity="error" text={errorMessage}/>
                            </div>}

                        </Form>
                    </>
                )}

            </Formik>
        </>
    )
}

export default DataViewTableColumnParameterForm;
