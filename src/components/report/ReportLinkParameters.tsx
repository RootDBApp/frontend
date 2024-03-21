import { Checkbox }       from "primereact/checkbox";
import { Divider }        from "primereact/divider";
import { Dropdown }       from "primereact/dropdown";
import { InputSwitch }    from "primereact/inputswitch";
import { SelectButton }   from "primereact/selectbutton";
import { SelectItem }     from "primereact/selectitem";
import { Tooltip }        from "primereact/tooltip";
import * as React         from "react";
import { useTranslation } from "react-i18next";


import TReportLinkParameter                      from "../../types/TReportLinkParameter";
import TReportParameter                          from "../../types/TReportParameter";
import { EReportLinkParameterValueType }         from "../../types/EReportLinkParameterValueType";
import TDataViewTableColumnParameter             from "../../types/TDataViewTableColumnParameter";
import * as RTReport                             from "../../contexts/report/ReportContextProvider";
import { useCurrentActiveReportId }              from "../../utils/hooks";
import { ICallbackOnReportLinkParamatersUpdate } from "../../types/ICallBacks";
import { apiSendRequest }                        from "../../services/api";
import { EAPIEndPoint }                          from "../../types/EAPIEndPoint";
import env                                       from "../../envVariables";


const itemTemplate = (option: any) => {

    // Option can be undefined if we :
    // * we have link on some columns
    // * change the sql query, with new names for columns
    // * reinitialize the columns
    // * and display the form which handle the report links
    if (option) {

        return option.value === '' ? <i>{option.label}</i> : option.label;
    }

    return <></>
}


const ReportLinkParameters: React.FC<{
    columnParameters: Array<TDataViewTableColumnParameter>,
    initialReportLinkParameters: Array<TReportLinkParameter>
    linkedReportId: number,
    onReportLinkParametersUpdate: ICallbackOnReportLinkParamatersUpdate
}> = ({
          columnParameters,
          initialReportLinkParameters,
          linkedReportId,
          onReportLinkParametersUpdate
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);

    const currentReportId = useCurrentActiveReportId();
    const reportState = RTReport.useReportState(Number(currentReportId));

    const [currentLinkedReportId, setCurrentLinkedReportId] = React.useState<number>(0);
    const [currentReportParameters, setCurrentReportParameters] = React.useState<Array<TReportParameter>>([]);
    const [currentLinksParameters, setCurrentLinksParameters] = React.useState<Array<TReportLinkParameter>>([]);

    const parameterValueTypeOptions = [
        {name: t('report:report_link.column_value').toString(), value: EReportLinkParameterValueType.COLUMN_VALUE},
        {
            name: t('report:report_link.report_parameter').toString(),
            value: EReportLinkParameterValueType.REPORT_PARAMETER
        }
    ];

    const getReportLinkIgnore = (reportParameter: TReportParameter): boolean => {

        const currentLinkParameterFound = currentLinksParameters.find(
            linkParameter => linkParameter.linkedReportParameterVariableName === reportParameter.variable_name
        );

        if (currentLinkParameterFound) {

            return currentLinkParameterFound.ignore;
        }

        return false;
    }

    const getReportLinkVariableValueType = (reportParameter: TReportParameter): number => {

        const currentLinkParameterFound = currentLinksParameters.find(
            linkParameter => linkParameter.linkedReportParameterVariableName === reportParameter.variable_name
        );

        if (currentLinkParameterFound) {

            return currentLinkParameterFound.linkedReportParameterVariableValueType;
        }

        return EReportLinkParameterValueType.COLUMN_VALUE;
    }

    const getParameterVariableValueName = (reportParameter: TReportParameter, reportLinkVariableValueType: EReportLinkParameterValueType): string | number | null => {

        const currentLinkParameterFound = currentLinksParameters.find(
            (linkParameter: TReportLinkParameter) => linkParameter.linkedReportParameterVariableName === reportParameter.variable_name
        );

        if (currentLinkParameterFound && !!currentLinkParameterFound.parameterVariableValueName) {

            return currentLinkParameterFound.parameterVariableValueName;
        }

        // no link setup for this report parameter, select the first value by default.
        return getParameterVariableValueNameOptions(getReportLinkVariableValueType(reportParameter))[0].value;
    }

    const getParameterVariableValueNameOptions = (reportLinkVariableValueType: EReportLinkParameterValueType): Array<SelectItem> => {

        const parameterVariableValueNameOptions: Array<SelectItem> = [];

        if (reportLinkVariableValueType === EReportLinkParameterValueType.COLUMN_VALUE) {

            columnParameters.forEach((columnParameter: TDataViewTableColumnParameter) => {

                parameterVariableValueNameOptions.push({
                    label: columnParameter.header,
                    value: columnParameter.column
                });
            });
        } else {

            reportState.report?.parameters?.forEach((reportParameter: TReportParameter) => {

                parameterVariableValueNameOptions.push({
                    label: reportParameter.name,
                    value: reportParameter.variable_name
                });
            });
        }

        return parameterVariableValueNameOptions;
    }

    // Used to generate the list of parameters to set up for the linked report.
    //
    React.useEffect(() => {

        if (linkedReportId > 0 && linkedReportId !== currentLinkedReportId) {

            setCurrentLinkedReportId(linkedReportId);
            const newReportLinkParameters: Array<TReportLinkParameter> = [];

            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.REPORT_PARAMETER,
                urlParameters: [
                    {key: 'report-id', value: linkedReportId},
                    {key: 'parameter-values', value: 0}
                ],
                callbackSuccess: (reportParameters: Array<TReportParameter>) => {

                    reportParameters.forEach((reportParameter) => {

                        const foundLinkParameter = initialReportLinkParameters.find((linkParameter: TReportLinkParameter) => {

                                return linkParameter.linkedReportParameterVariableName === reportParameter.variable_name
                            }
                        );

                        if (foundLinkParameter === undefined) {

                            newReportLinkParameters.push({
                                ignore: false,
                                linkedReportParameterVariableName: reportParameter.variable_name,
                                linkedReportParameterVariableValueType: EReportLinkParameterValueType.COLUMN_VALUE,
                                parameterVariableValueName: '',
                            })
                        } else {

                            newReportLinkParameters.push(foundLinkParameter);
                        }
                    });

                    setCurrentReportParameters(reportParameters);
                    setCurrentLinksParameters(newReportLinkParameters);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [linkedReportId]);

    // Used to inform the parent component ReportLinkForm that linked report parameters are updated.
    //
    React.useEffect(() => {

        onReportLinkParametersUpdate(currentLinksParameters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentLinksParameters]);

    return (
        <>
            {currentReportParameters.length > 0
                ? <>
                    <Divider align="left">
                        <div className="inline-flex align-items-center">
                            <i className="pi pi-sliders-h mr-2"></i>
                            <b>{t('report:report_link.input_parameters_linked_report').toString()}</b>
                        </div>
                    </Divider>
                    {currentReportParameters.map(
                        (reportParameter: TReportParameter) => (
                            <div className="field grid align-items-center" key={reportParameter.variable_name}>

                                <InputSwitch
                                    inputId={`ignore-${reportParameter.variable_name}`}
                                    className="mr-2"
                                    checked={!getReportLinkIgnore(reportParameter)}
                                    onChange={(event) => {

                                        const newReportLinkParameters = currentLinksParameters.map(
                                            (linkParameter: TReportLinkParameter) => {

                                                if (linkParameter.linkedReportParameterVariableName === reportParameter.variable_name) {

                                                    linkParameter.ignore = !Boolean(event.value);
                                                }

                                                return linkParameter;
                                            }
                                        )

                                        setCurrentLinksParameters(newReportLinkParameters);
                                    }}
                                />

                                <label
                                    htmlFor={`ignore-${reportParameter.variable_name}`}
                                    className={`col-12 xl:col-2 mt-2 ${getReportLinkIgnore(reportParameter) && 'disabled'}`}>
                                    {reportParameter.variable_name}
                                </label>

                                <SelectButton
                                    disabled={getReportLinkIgnore(reportParameter)}
                                    className="col-fixed"
                                    value={getReportLinkVariableValueType(reportParameter)}
                                    options={parameterValueTypeOptions}
                                    optionLabel="name"
                                    onChange={(event) => {

                                        const newReportLinkParameters = currentLinksParameters.map(
                                            (linkParameter: TReportLinkParameter) => {

                                                if (linkParameter.linkedReportParameterVariableName === reportParameter.variable_name) {

                                                    linkParameter.linkedReportParameterVariableValueType = event.value;
                                                }

                                                return linkParameter;
                                            }
                                        )

                                        setCurrentLinksParameters(newReportLinkParameters);
                                        getParameterVariableValueNameOptions(event.value);
                                    }}
                                    tooltip={
                                        getReportLinkVariableValueType(reportParameter) === EReportLinkParameterValueType.COLUMN_VALUE
                                            ? t('report:report_link.tooltip_value_type_column_value').toString()
                                            : t('report:report_link.tooltip_value_type_report_param_value').toString()
                                    }
                                    tooltipOptions={{
                                        position: 'bottom',
                                        showDelay: env.tooltipShowDelay,
                                        hideDelay: env.tooltipHideDelay
                                    }}
                                />

                                <Dropdown
                                    disabled={getReportLinkIgnore(reportParameter)}
                                    itemTemplate={itemTemplate}
                                    valueTemplate={itemTemplate}
                                    className="col-12 xl:col-2"
                                    value={getParameterVariableValueName(reportParameter, getReportLinkVariableValueType(reportParameter))}
                                    options={getParameterVariableValueNameOptions(getReportLinkVariableValueType(reportParameter))}
                                    onChange={(event) => {

                                        const newReportLinkParameters = currentLinksParameters.map(
                                            (linkParameter: TReportLinkParameter) => {

                                                if (linkParameter.linkedReportParameterVariableName === reportParameter.variable_name) {

                                                    linkParameter.parameterVariableValueName = event.value;
                                                }

                                                return linkParameter;
                                            }
                                        )

                                        setCurrentLinksParameters(newReportLinkParameters);
                                    }}
                                />

                                {getReportLinkVariableValueType(reportParameter) === EReportLinkParameterValueType.COLUMN_VALUE && (
                                    <div className="col">
                                        <Checkbox
                                            disabled={getReportLinkIgnore(reportParameter)}
                                            className="mr-2"
                                            inputId={`emptyValue-${reportParameter.variable_name}`}
                                            onChange={(event) => {

                                                const newReportLinkParameters = currentLinksParameters.map(
                                                    (linkParameter: TReportLinkParameter) => {

                                                        if (linkParameter.linkedReportParameterVariableName === reportParameter.variable_name) {

                                                            linkParameter.emptyValue = event.checked;
                                                        }

                                                        return linkParameter;
                                                    }
                                                )

                                                setCurrentLinksParameters(newReportLinkParameters);
                                                getParameterVariableValueNameOptions(event.value ? EReportLinkParameterValueType.COLUMN_VALUE : EReportLinkParameterValueType.REPORT_PARAMETER);
                                            }}
                                            checked={Boolean(currentLinksParameters.find(
                                                linkParameter => linkParameter.linkedReportParameterVariableName === reportParameter.variable_name
                                            )?.emptyValue)}
                                        />
                                        <label htmlFor={`emptyValue-${reportParameter.variable_name}`}
                                               className={`p-checkbox-label ${getReportLinkIgnore(reportParameter) && 'disabled'}`}>
                                            {t('report:report_link.empty_value').toString()}
                                        </label>
                                        <i className={`ml-2 pi pi-question-circle empty-value-tooltip ${getReportLinkIgnore(reportParameter) && 'disabled'}`}/>
                                        <Tooltip target=".empty-value-tooltip"
                                                 showDelay={env.tooltipShowDelay}
                                                 hideDelay={env.tooltipHideDelay}
                                        >
                                            {t('report:report_link.empty_value_tooltip').toString()}
                                        </Tooltip>
                                    </div>
                                )}

                            </div>
                        )
                    )}
                </>
                : <></>
            }
        </>
    )
}

export default ReportLinkParameters;