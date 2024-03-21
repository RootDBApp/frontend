import { Form, Formik, FormikProps } from "formik";
import { Message }                   from "primereact/message";
import * as React                    from "react";
import { useTranslation }            from "react-i18next";
import * as Yup                      from "yup";

import ButtonWithSpinner, { SubmitButtonStatus } from "../../../common/form/ButtonWithSpinner";
import TDataViewMetricRow                        from "../../../../types/TDataViewMetricRow";

import TCallbackResponse   from "../../../../types/TCallbackResponse";
import { ECallbackStatus } from "../../../../types/ECallbackStatus";

import { ICallbackOnCreateOrUpdateDataViewInfoParam }   from "../../../../types/ICallBacks";
import TSQLResultColumn                                 from "../../../../types/TSQLResultColumn";
import TReportParameter                                 from "../../../../types/TReportParameter";
import { EDataViewMetricFontWeight }                    from "../../../../types/EDataViewMetricFontWeight";
import { SelectButton }                                 from "primereact/selectbutton";
import { EDataViewMetricFontSize }                      from "../../../../types/EDataViewMetricFontSize";
import { InputText }                                    from "primereact/inputtext";
import { ColorPicker }                                  from "primereact/colorpicker";
import env                                              from "../../../../envVariables";
import { Tooltip }                                      from "primereact/tooltip";
import { InputSwitch }                                  from "primereact/inputswitch";
import { useDebouncedCallback }                         from "../../../../utils/hooks";
import { InputTextarea }                                from "primereact/inputtextarea";
import ReportParametersAndColumnsBinder                 from "../../../common/form/ReportParametersAndColumnsBinder";

const DataViewMetricColumnParameterForm: React.FC<{
    callBackResponse?: TCallbackResponse,
    rows: TDataViewMetricRow[],
    currentRow: TDataViewMetricRow,
    isNewParameter?: boolean
    onChangeCallback: ICallbackOnCreateOrUpdateDataViewInfoParam,
    onDeleteCallback: ICallbackOnCreateOrUpdateDataViewInfoParam,
    columns?: TSQLResultColumn[],
    reportParameters?: TReportParameter[],
}> = ({
          callBackResponse,
          rows,
          currentRow,
          onChangeCallback,
          onDeleteCallback,
          columns,
          reportParameters
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);

    const [submitButtonDelete, setSubmitButtonDelete] = React.useState<SubmitButtonStatus>(SubmitButtonStatus.ToValidate);
    const [displayError, setDisplayError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [useCustomColor, setUseCustomColor] = React.useState<boolean>(!!currentRow.color);

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

    React.useEffect(() => {
        switch (callBackResponse?.status) {
            case ECallbackStatus.ACTION_OK:
                if (submitButtonDelete !== SubmitButtonStatus.ToValidate) {
                    setSubmitButtonDelete(SubmitButtonStatus.Validated);
                }
                break;
            case ECallbackStatus.ACTION_KO:
                if (submitButtonDelete !== SubmitButtonStatus.ToValidate) {
                    setSubmitButtonDelete(SubmitButtonStatus.NotValidated);
                }
                break;
        }
    }, [callBackResponse, submitButtonDelete]);

    React.useEffect(() => {
        if (callBackResponse?.status === ECallbackStatus.IDLE) {
            setSubmitButtonDelete(SubmitButtonStatus.ToValidate);
        }
    }, [callBackResponse])

    React.useEffect(() => {
        setSubmitButtonDelete(SubmitButtonStatus.ToValidate);
    }, [rows])

    const handleOnUpdate = React.useCallback((values: TDataViewMetricRow): void => {

        resetStates();
        onChangeCallback(values);
    }, [onChangeCallback]);

    const handleOnDelete = React.useCallback((values: TDataViewMetricRow): void => {

        resetStates();
        setSubmitButtonDelete(SubmitButtonStatus.Validating);
        onDeleteCallback(values);
    }, [onDeleteCallback]);

    const handleDebouncedUpdate = useDebouncedCallback((values: TDataViewMetricRow): void => handleOnUpdate(values), 500);

    const handleDebouncedTextUpdate = (formik: FormikProps<any>, newText: string): void => {
        if (newText !== formik.values.text) {
            formik.setFieldValue('text', newText);
            handleDebouncedUpdate({...formik.values, text: newText});
        }
    };

    const resetStates = (): void => {

        setDisplayError(false);
        setErrorMessage('');
    }

    return (
        <>
            <Formik
                key={'info_form_parameter_' + currentRow.id}
                validateOnMount={true}
                validationSchema={Yup.object({
                    text: Yup.string().required(),
                    fontWeight: Yup.string(),
                    italic: Yup.boolean(),
                    fontSize: Yup.string(),
                })}
                onSubmit={values => handleOnUpdate(values)}
                initialValues={{
                    id: currentRow.id,
                    text: currentRow.text,
                    fontWeight: currentRow.fontWeight,
                    italic: currentRow.italic,
                    fontSize: currentRow.fontSize,
                    color: currentRow.color,
                }}
            >
                {(formik) => (

                    <Form placeholder="" onSubmit={formik.handleSubmit}>
                        <div className="formgrid grid">
                            <div className="field md:col-12">
                                <Tooltip
                                    target=".metric-placeholder-tooltip"
                                    position="bottom"
                                    content={`${t('report:dataview.info_view_form.text_help').toString()}\n\n${t('report:dataview.text_view.run_sql').toString()}`}
                                    showDelay={env.tooltipShowDelay}
                                    hideDelay={env.tooltipHideDelay}
                                    className="w-auto"
                                />
                                <label htmlFor="text">{t('report:dataview.info_view_form.text').toString()}</label>
                                <Message
                                    className="w-full justify-content-start"
                                    severity="info"
                                    text={(
                                        <>
                                            {t('report:dataview.text_view.placeholders').toString()}
                                            <br/>
                                            {t('report:dataview.text_view.run_sql').toString()}
                                            <br/>
                                            {t('report:dataview.text_view.add_on_click').toString()}
                                        </>
                                    )}
                                />
                                <ReportParametersAndColumnsBinder
                                    reportParameters={reportParameters}
                                    columns={columns?.map(c => c.name)}
                                    onReportParameterClick={(parameterName: string) => handleDebouncedTextUpdate(formik, addToTextArea(`[${parameterName}]`))}
                                    onColumnClick={(column: string) => handleDebouncedTextUpdate(formik, addToTextArea(`{${column}}`))}
                                />
                                <InputTextarea
                                    ref={textAreaRef}
                                    className="w-full"
                                    {...formik.getFieldProps('text')}
                                    onChange={(event) => handleDebouncedTextUpdate(formik, event.currentTarget.value)}
                                    onBlur={(event) => handleDebouncedTextUpdate(formik, event.currentTarget.value)}
                                />
                            </div>

                            <div className="formgrid grid mx-2 justify-content-start gap-3 flex-grow-1">
                                <div className="field">
                                    <label htmlFor="fontWeight" style={{width: '100px'}}>{t('report:dataview.info_view_form.text-font-weight').toString()}</label>
                                    <SelectButton
                                        options={[
                                            {label: 'normal', value: EDataViewMetricFontWeight.normal},
                                            {label: t('report:dataview.info_view_form.text-font-weight-bold').toString(), value: EDataViewMetricFontWeight.bold}
                                        ]}
                                        optionLabel="label"
                                        optionValue="value"
                                        value={formik.values.fontWeight}
                                        onChange={(e) => {
                                            formik.setFieldValue('fontWeight', e.value);
                                            handleOnUpdate({...formik.values, fontWeight: e.value});
                                        }}
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor="fontSize" style={{width: '100px'}}>{t('report:dataview.info_view_form.text-font-size').toString()}</label>
                                    <SelectButton
                                        options={[
                                            {label: 'normal', value: EDataViewMetricFontSize.normal},
                                            {label: 'medium', value: EDataViewMetricFontSize.medium},
                                            {label: 'large', value: EDataViewMetricFontSize.large},
                                            {label: 'xlarge', value: EDataViewMetricFontSize.xl},
                                        ]}
                                        optionLabel="label"
                                        optionValue="value"
                                        value={formik.values.fontSize}
                                        onChange={(e) => {
                                            formik.setFieldValue('fontSize', e.value);
                                            handleOnUpdate({...formik.values, fontSize: e.value});
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="field md:col-12">
                                <Tooltip
                                    target=".metric-text-color-info"
                                    position="bottom"
                                    content={t('report:dataview.info_view_form.text-color-info').toString()}
                                    showDelay={env.tooltipShowDelay}
                                    hideDelay={env.tooltipHideDelay}
                                    className="w-auto"
                                />
                                <label id="label_color" htmlFor="color">{t('report:dataview.info_view_form.text-color').toString()}</label>
                                &nbsp;&nbsp;&nbsp;<i className="pi pi-question-circle metric-text-color-info"/>
                                <div className="flex flex-row align-items-center justify-content-start mb-2 gap-3">
                                    <InputSwitch checked={useCustomColor} onChange={(e) => {
                                        if (!e.value) {
                                            formik.setFieldValue('color', '');
                                            onChangeCallback({...formik.values, color: ''});
                                            setUseCustomColor(false);
                                        } else {
                                            formik.setFieldValue('color', '000000');
                                            onChangeCallback({...formik.values, color: '000000'});
                                            setUseCustomColor(true);
                                        }
                                    }
                                    }/>
                                    {t('report:dataview.info_view_form.text-color-action').toString()}
                                    {useCustomColor && (
                                        <div>
                                            <ColorPicker
                                                format="hex"
                                                {...formik.getFieldProps('color')}
                                                onChange={(event) => {
                                                    formik.setFieldValue('color', event.value);
                                                    handleDebouncedUpdate({...formik.values, color: event.value?.toString()});
                                                }}
                                                value={formik.values.color || '000000'}
                                            />
                                            <InputText
                                                id="label_color_text"
                                                type="text"
                                                {...formik.getFieldProps('color')}
                                                value={formik.values.color || '000000'}
                                                size={5}
                                                className="ml-2"
                                                onChange={(event) => {
                                                    formik.setFieldValue('color', event.target.value);
                                                    onChangeCallback({...formik.values, color: event.target.value});
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>


                        <div className="flex justify-content-end mt-3" key={`${currentRow.id}-actions-buttons`}>
                            <ButtonWithSpinner
                                severity="danger"
                                className="mr-2"
                                buttonStatus={submitButtonDelete}
                                labels={{
                                    default: t('common:form.delete').toString(),
                                    validating: t('common:form.deleting').toString(),
                                    validated: t('common:form.deleted').toString(),
                                    notValidated: t('common:form.delete_failed').toString(),
                                }}
                                type="button"
                                validateAction
                                validateActionCallback={() => handleOnDelete(currentRow)}
                            />
                        </div>

                        {displayError && <div className="col-12">
                            <Message severity="error" text={errorMessage}/>
                        </div>}

                    </Form>
                )}

            </Formik>
        </>
    )
}

export default DataViewMetricColumnParameterForm;
