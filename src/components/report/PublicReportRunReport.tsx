import { Button }         from "primereact/button";
import { OverlayPanel }   from "primereact/overlaypanel";
import * as React         from 'react';
import { useTranslation } from "react-i18next";

import ReportParameters   from "../report/ReportParameters";
import { apiSendRequest } from "../../services/api";
import { EAPIEndPoint }   from "../../types/EAPIEndPoint";
import {
    useReportStateFromReportIdAndInstanceId
}                         from "../../contexts/report/ReportContextProvider";

//
// This component is displayed only when a report is displayed, so we can only rely on reportState context.
//
const PublicReportRunReport: React.FC<{
    instanceId: number,
    reportId: number,
    securityHash: string,
    webSocketPublicUserId: string
}> = (
    {
        instanceId,
        reportId,
        securityHash,
        webSocketPublicUserId
    }
): React.ReactElement => {

    const {t} = useTranslation(['report']);
    const reportState = useReportStateFromReportIdAndInstanceId(reportId, instanceId);
    const [hasParameters, setHasParameters] = React.useState<boolean>(false);
    const reportParameterFormOverlayRef = React.useRef<OverlayPanel>(null);

    React.useEffect(() => {

        if (reportState.report?.has_parameters) {

            setHasParameters(true)
        } else {

            setHasParameters(false);
        }

    }, [reportState.report?.has_parameters]);

    return (
        <>
            <OverlayPanel
                ref={reportParameterFormOverlayRef}
                id={`overlay-report-parameter-form`}
                className=""
                style={{width: '400px'}}
            >
                <ReportParameters
                    onSubmit={() => {
                        reportParameterFormOverlayRef?.current?.hide();
                    }}
                    securityHash={securityHash}
                    reportId={reportId}
                    reportInstanceId={instanceId}
                    reportIsEmbedded
                    webSocketPublicUserId={webSocketPublicUserId}
                />
            </OverlayPanel>
            <div className={hasParameters ? 'p-buttonset' : undefined}>
                <Button
                    type="button"
                    icon="pi pi-play"
                    tooltip={t('report:run_report_with_current_parameters').toString()}
                    tooltipOptions={{position: 'bottom'}}
                    label={t('report:run_report_without_shortcut').toString()}
                    onClick={() => {

                        apiSendRequest({
                            method: 'POST',
                            endPoint: EAPIEndPoint.PUBLIC_REPORT,
                            resourceId: Number(reportState.report?.id),
                            extraUrlPath: 'run',
                            formValues: {
                                useCache: reportState.instance?.useCache,
                                instanceId: instanceId,
                                parameters: reportState.instance?.reportParameterInputValues || [],
                                hashParameters: securityHash,
                                wspuid: webSocketPublicUserId,
                            },
                            callbackSuccess: () => {
                                //console.debug('Header | callbackSuccess@apiRunReport', data);
                            }
                        });
                    }}
                />
                {hasParameters && (
                    <Button
                        type="button"
                        icon="pi pi-cog"
                        tooltip={t('report:input_parameters').toString()}
                        tooltipOptions={{position: 'bottom'}}
                        onClick={(e) => {
                            reportParameterFormOverlayRef?.current?.toggle(e, e.target);
                        }}
                    />
                )}
            </div>
        </>
    );
}

export default PublicReportRunReport;