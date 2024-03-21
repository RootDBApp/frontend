import { Button }         from "primereact/button";
import { Dialog }         from "primereact/dialog";
import { InputSwitch }    from "primereact/inputswitch";
import { OverlayPanel }   from "primereact/overlaypanel";
import * as React         from "react";
import { useTranslation } from "react-i18next";
import { useNavigate }    from "react-router-dom";

import TReport                                      from "../../types/TReport";
import { TNameValue }                               from "../../types/TNameValue";
import TReportParameter                             from "../../types/TReportParameter";
import { generateReportUniqId, nameValuesToString } from "../../utils/tools";
import CenteredLoading                              from "../common/loading/CenteredLoading";
import * as RTReport                                from "../../contexts/report/ReportContextProvider";
import { apiSendRequest }                           from "../../services/api";
import { EAPIEndPoint }                             from "../../types/EAPIEndPoint";
import { updateReportParameterInputValue }          from "../../contexts/report/store/actions";
import ReportParameter                              from "./reportParameters/ReportParameter";
import { useReportStateFromReportIdAndInstanceId }  from "../../contexts/report/ReportContextProvider";
import { handleUseCacheReportInstanceChange }       from "../../utils/headerMenu/reportMenu";
import ParametersSetsInCache                        from "./reportParameters/ParametersSetsInCache";
import { Badge }                                    from "primereact/badge";

const ReportParameters: React.FC<{
    onSubmit?: CallableFunction    // If report parameters are embedded inside an overlay, you will be able to properly close the overlay in the parent component
    overlayPanelRef?: React.RefObject<OverlayPanel>,
    report?: TReport,
    reportId?: number,
    reportInstanceId?: number,
    reportIsEmbedded?: boolean,
    securityHash?: string,
    webSocketPublicUserId?: string,
    overrideReportParameters?: boolean,
    reportParametersOverride?: Array<TReportParameter>
}> = ({
          onSubmit,
          report,
          reportId,
          reportInstanceId,
          reportIsEmbedded,
          securityHash,
          webSocketPublicUserId,
          overlayPanelRef,
          overrideReportParameters,
          reportParametersOverride
      }): React.ReactElement => {

    const {t} = useTranslation(['common', 'report']);
    const navigate = useNavigate();

    const reportState = useReportStateFromReportIdAndInstanceId(Number(reportId), Number(reportInstanceId));

    const reportDispatch = RTReport.useDispatch();

    // To generate the input parameters, used by current report instance.
    const [reportParameterInputValues, setReportParameterInputValues] = React.useState<Array<TNameValue>>([]);
    // Store the full report parameters.
    const [reportParameters, setReportParameters] = React.useState<Array<TReportParameter>>([]);
    const [isReportParametersLoading, setIsReportParametersLoading] = React.useState<boolean>(true);
    const [inputComponents, setInputComponents] = React.useState<React.ReactElement>(<></>);
    const [useCache, setUseCache] = React.useState<boolean>(report ? report.has_cache : false);
    const [parametersSetsVisible, setParametersSetsVisible] = React.useState<boolean>(false);

    const updateReportParameterInputValueAndLocalState = React.useCallback(
        (input: TNameValue) => {

            setReportParameterInputValues(reportParameterInputValues.map((parameterInputValueLooped) => {

                if (parameterInputValueLooped.name === input.name) {

                    if (reportState.report && reportState.instance) {

                        reportDispatch(
                            updateReportParameterInputValue({

                                reportId: Number(reportState.report.id),
                                reportInstanceId: reportState.instance.id,
                                name: input.name,
                                value: input.value,
                            })
                        );
                    }

                    return {
                        ...parameterInputValueLooped,
                        value: input.value,
                    }

                }

                return parameterInputValueLooped;
            }));
        },
        [reportDispatch, reportParameterInputValues, reportState.instance, reportState.report]
    )

    // Used to display all the report's input parameters.
    //
    React.useEffect(() => {

        if (reportParameters.length > 0) {

            let inputGroups: React.ReactElement[] = [];
            let nextToThisOneActivated: boolean;

            const classNamePMd: Array<string> = [
                'md:col-12', //  1 row, 1 parameter
                'md:col-6',  //  1 row, 2 parameters
                'md:col-6',
                'md:col-3',  //  1 row, 3-4 parameters
                'md:col-2',  //  1 row, 5~6 parameters
                'md:col-2',
            ];

            // Determinate the classname 'pd-md-x' to use.
            let componentByRow: number = 1;
            let componentByRowMax: number = 1;

            for (const [, parameter] of reportParameters.entries()) {

                if (parameter.following_parameter_next_to_this_one) {

                    nextToThisOneActivated = true;
                    componentByRow++;
                } else {

                    if (componentByRow > componentByRowMax) {
                        componentByRowMax = componentByRow;
                    }

                    nextToThisOneActivated = false;
                    componentByRow = 1;
                }
            }

            nextToThisOneActivated = false;
            for (const [index, parameter] of reportParameters.entries()) {

                let className = 'col-12 mb-1 p-p-1 ';
                if (parameter.following_parameter_next_to_this_one || nextToThisOneActivated) {

                    className += classNamePMd[componentByRowMax];

                    if (!nextToThisOneActivated) {

                        nextToThisOneActivated = true
                    } else if (nextToThisOneActivated && !parameter.following_parameter_next_to_this_one) {

                        nextToThisOneActivated = false;
                    }
                }

                inputGroups.push(
                    <div key={String('parameters-form-field-' + index)} className={`field ${className}`}>
                        <label key={String('parameter-form-label-' + index)}
                               htmlFor={parameter.variable_name}
                        >
                            {parameter.name}
                        </label>
                        <ReportParameter
                            index={index}
                            parameter={parameter}
                            onChange={(inputNameValue: TNameValue) => updateReportParameterInputValueAndLocalState(inputNameValue)}
                            value={reportParameterInputValues?.find((reportParameterInputValue: TNameValue) => reportParameterInputValue.name === parameter.variable_name)}
                        />
                    </div>
                );
            }

            // Display inputs components.
            setInputComponents(
                <div id="report-parameters" className="grid">
                    {inputGroups}
                </div>
            );
        }

    }, [reportParameters, reportParameterInputValues, updateReportParameterInputValueAndLocalState]);

    React.useEffect(() => {

        if (reportParameters.length > 0) {

            let currentReportParameterInputValues: Array<TNameValue> = [];
            // When we are in the reports listing.
            if (report) {

                // Simply initialize input parameters from report's parameters we got in the other useEffect below.
                currentReportParameterInputValues = reportParameters.map((parameter) => {
                    return {
                        name: parameter.variable_name,
                        value: parameter.forced_default_value ? parameter.forced_default_value : parameter.parameter_input?.default_value
                    }
                });
            }
            // Cleanup input parameters when there are some which are modified, updated or deleted.
            else {

                // Get existing input parameters. (from URL, initialized when report is loaded)
                currentReportParameterInputValues = reportState?.instance?.reportParameterInputValues || [];

                // Handle modified parameters. (only the variable_name, used in the request parameters)
                currentReportParameterInputValues.map((parameterInputValue) => {

                    const reportParameter = reportParameters.find((reportParameter) => reportParameter.variable_name === parameterInputValue.name);
                    if (reportParameter) {

                        return {name: reportParameter.variable_name, value: parameterInputValue.value}
                    }

                    return parameterInputValue;
                });

                // Handle new parameters
                const newReportParameters: Array<TReportParameter> = reportParameters.filter((reportParameter) => {
                    return !currentReportParameterInputValues.find((parameterInputValue) => parameterInputValue.name === reportParameter.variable_name);
                });

                for (const [, reportParameter] of newReportParameters.entries()) {
                    currentReportParameterInputValues.push({
                        name: reportParameter.variable_name,
                        value: reportParameter.forced_default_value
                    });
                }

                // Handle delete parameters.
                currentReportParameterInputValues = currentReportParameterInputValues.filter((parameterInputValue) => {
                    return reportParameters.find((reportParameter) => reportParameter.variable_name === parameterInputValue.name);
                });
            }

            setReportParameterInputValues(currentReportParameterInputValues);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportParameters]);
    // Working too, be we need to have this useEffect activated only when reportParameters are updated by following useEffect.
    // [report, reportParameters, reportState.reportParameterInputValues]);

    // Load report's parameters if we don't have it yet, and store in local state variable reportParameters
    //
    React.useEffect(() => {

            if (overrideReportParameters && reportParametersOverride) {

                setReportParameters(reportParametersOverride);
                setIsReportParametersLoading(false);
            } else {
                // When we are in the reports listing.
                if (report) {

                    apiSendRequest({
                        method: 'GET',
                        endPoint: EAPIEndPoint.REPORT_PARAMETER,
                        urlParameters: [
                            {key: 'report-id', value: report.id},
                            {key: 'parameter-values', value: 1}
                        ],
                        callbackSuccess: (reportParameters: Array<TReportParameter>) => {

                            setReportParameters(reportParameters);
                            setIsReportParametersLoading(false);
                        }
                    });

                    // If we have parameters here it's because we loaded a report. (so we have all data we need)...
                    // ... and parameters should already be available in a form of an Array<TFormValue> from ReportState.
                } else if (reportState.report?.parameters) {

                    setReportParameters(
                        reportState?.report?.parameters.filter((parameter: TReportParameter) => !(reportIsEmbedded && !parameter.available_public_access))
                    );
                    setIsReportParametersLoading(false);
                }
            }
        },

        [overrideReportParameters, report, report?.id, reportIsEmbedded, reportParametersOverride, reportState.report]
    );

    const submit = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {

        event.preventDefault();
        overlayPanelRef?.current?.hide();

        let reportId: number = 0;
        if (reportState.report) {

            reportId = reportState.report.id;
        } else if (report) {

            reportId = report.id
        }

        // Public report.
        if (reportState.instance && securityHash && webSocketPublicUserId) {

            apiSendRequest({
                method: 'POST',
                endPoint: EAPIEndPoint.PUBLIC_REPORT,
                resourceId: Number(reportId),
                extraUrlPath: 'run',
                formValues: {
                    useCache: useCache,
                    instanceId: reportInstanceId,
                    parameters: reportParameterInputValues,
                    hashParameters: securityHash,
                    wspuid: webSocketPublicUserId
                },
                callbackSuccess: () => {
                    //console.debug('Header | callbackSuccess@apiRunReport', data);
                }
            });

        } else {

            // Handle use-cache URL parameter only when report is not yet opened.
            if ((reportState?.report?.has_cache || report?.has_cache) && !reportState.instance) {

                navigate('/report/' + generateReportUniqId(Number(reportId)) + '?' + nameValuesToString(reportParameterInputValues) + '&use-cache=' + Number(useCache) + '&run');
            } else {

                navigate('/report/' + ((reportState.instance && reportState.instance.id > 0) ? reportId + '_' + reportState.instance.id : generateReportUniqId(Number(reportId))) + '?' + nameValuesToString(reportParameterInputValues) + '&run');
            }
        }

        if (onSubmit) {

            onSubmit();
        }

    }, [navigate, onSubmit, overlayPanelRef, report, reportInstanceId, reportParameterInputValues, reportState.instance, reportState.report, securityHash, useCache, webSocketPublicUserId]);

    return (
        <>
            {(reportState.report || report) &&
                <Dialog
                    id={'overlay-parameters-set-in-cache'}
                    visible={parametersSetsVisible}
                    onHide={() => {
                        setParametersSetsVisible(false);
                    }}
                    header={t('report:cache.parameters_sets_in_cache')}
                    position="top"
                >
                    <ParametersSetsInCache
                        // @ts-ignore
                        report={reportState.report ? reportState.report : report}
                        onSubmit={() => {
                            setParametersSetsVisible(false);
                            if (onSubmit) {

                                onSubmit();
                            }
                        }}
                        reportIsEmbedded
                        reportId={reportId}
                        reportInstanceId={reportInstanceId}
                        securityHash={securityHash}
                        webSocketPublicUserId={webSocketPublicUserId}
                    />
                </Dialog>
            }
            {isReportParametersLoading
                ? <CenteredLoading/>
                : <form>
                    <div className="flex justify-content-center" style={{marginBottom: '1rem'}}>
                        <Button
                            type="button"
                            label={t('report:run_report_without_shortcut').toString()}
                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => submit(event)}
                        />
                    </div>
                    {
                        inputComponents
                    }
                    {/**/}
                    {/* The Report is opened.*/}
                    {/**/}
                    {(reportIsEmbedded) && reportState?.report?.has_cache && !overrideReportParameters
                        ?
                        <div>
                            <div className="flex justify-content-end mb-4">
                                <label className="mr-2"> {t('report:cache.use_cache')}</label>
                                <InputSwitch
                                    checked={reportState.instance ? reportState.instance.useCache : false}
                                    onChange={() => {

                                        setUseCache(!reportState.instance?.useCache);
                                        handleUseCacheReportInstanceChange(
                                            {reportId: Number(reportState?.report?.id), reportInstanceId: Number(reportState.instance?.id), useCache: !reportState.instance?.useCache},
                                            reportDispatch
                                        )
                                    }}
                                />
                            </div>
                            <div className="flex justify-content-center">
                                <Button
                                    disabled={!reportState.instance?.useCache}
                                    type="button"
                                    label={t('report:cache.parameters_sets_in_cache').toString()}
                                    icon="pi pi-database"
                                    severity="info"
                                    outlined
                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                        event.stopPropagation();
                                        setParametersSetsVisible(true);
                                    }}
                                >
                                    <Badge
                                        value={reportState.report.num_parameter_sets_cached_by_jobs + reportState.report.num_parameter_sets_cached_by_users}
                                        severity="info"
                                    />
                                </Button>
                            </div>
                        </div>
                        //
                        // The Report is not yet opened.
                        //
                        : (report?.has_cache && !overrideReportParameters) &&
                        <div>
                            <div className="flex justify-content-end mb-4">
                                <label className="mr-2"> {t('report:cache.use_cache').toString()}</label>
                                <InputSwitch
                                    checked={useCache}
                                    onChange={() => {

                                        setUseCache(!useCache);
                                    }}
                                />
                            </div>
                            <div className="flex justify-content-center">
                                <Button
                                    disabled={!useCache}
                                    type="button"
                                    label={t('report:cache.parameters_sets_in_cache').toString()}
                                    icon="pi pi-database"
                                    outlined
                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                        event.stopPropagation();
                                        setParametersSetsVisible(true);
                                    }}
                                >
                                    <Badge
                                        value={report.num_parameter_sets_cached_by_jobs + report.num_parameter_sets_cached_by_users}
                                        severity="info"
                                    />
                                </Button>
                            </div>
                        </div>
                    }
                </form>
            }
        </>
    )
}

export default ReportParameters;