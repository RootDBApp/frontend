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

import * as React from 'react';

import * as RTReport                                from "../../contexts/report/ReportContextProvider";
import {
    listenPublicChannelReport,
    publicGetReport
}                                                   from "../../contexts/report/store/asyncAction";
import { generateId }                               from "../../utils/tools";
import PublicReportRunReport                        from "./PublicReportRunReport";
import { useReportUrlParameters }                   from "../../utils/hooks";
import { apiSendRequest }                           from "../../services/api";
import { EAPIEndPoint }                             from "../../types/EAPIEndPoint";
import { getReportRunInfo }                         from "../../utils/report";
import { useReportStateFromReportIdAndInstanceId, } from "../../contexts/report/ReportContextProvider";
import ReportInstance                               from "./ReportInstance";

const PublicReport: React.FC<{
    reportId: number,
    instanceId: number,
    securityHash: string
}> = ({
          reportId,
          instanceId,
          securityHash
      }): React.ReactElement => {

    // const parameters = useUrlParameters(useLocation().search, useLocation().key);
    const parameters = useReportUrlParameters();
    const reportState = useReportStateFromReportIdAndInstanceId(reportId, instanceId);
    // const reportState = useReportStateReportInstanceDataViewInstanceFromLocation(useLocation().pathname);

    const reportDispatch = RTReport.useDispatch();

    const [webSocketPublicUserId] = React.useState<string>(generateId(15));

    // Load report & data views.
    //
    React.useEffect(() => {

        if (securityHash.length === 40
            && !reportState?.instance?.isLoading
        ) {
            // Listen to events related to report & associated data views. (results, mainly)
            reportDispatch(
                listenPublicChannelReport(webSocketPublicUserId)
            );

            if (!reportState.report?.id) {

                reportDispatch(
                    publicGetReport({reportId: reportId, reportInstanceId: instanceId, securityHash: securityHash})
                );
            }
        }

    }, [
        instanceId,
        reportDispatch,
        reportId,
        reportState?.instance?.isLoading,
        reportState?.report?.id,
        securityHash,
        webSocketPublicUserId
    ]);

    // Execute report when report & data view are loaded.
    //
    React.useEffect(() => {

        if (parameters
            && reportState.report
            && reportState.instance
            && (reportState.report.dataViews?.length || [].length) > 0
        ) {

            const {'view-mode': view_mode, key, run, sh, ...reportParamsFromURL} = parameters;

            const runReportInfo = getReportRunInfo(
                reportDispatch,
                instanceId,
                reportState.report.id,
                reportState.report.has_parameters,
                reportParamsFromURL,
                run,
                reportState.report.has_cache,
                reportState.report.parameters,
            );

            if (runReportInfo.run) {

                apiSendRequest({
                    method: 'POST',
                    endPoint: EAPIEndPoint.PUBLIC_REPORT,
                    resourceId: Number(reportState.report?.id),
                    extraUrlPath: 'run',
                    formValues: {
                        useCache: runReportInfo.useCache,
                        instanceId: runReportInfo.instanceId,
                        parameters: runReportInfo.formValues,
                        sh: securityHash,
                        wspuid: webSocketPublicUserId
                    },
                    callbackSuccess: () => {
                    }
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        parameters,
        reportDispatch,
        reportState?.report,
        // reportState?.instance
    ]);

    return (
        <div className="reports-container">
            {reportState.report && reportState.report.id && (
                <>
                    <div className="flex justify-content-center px-2">
                        <div className="flex-initial flex align-items-center justify-content-center">
                            <PublicReportRunReport
                                instanceId={instanceId}
                                reportId={reportId}
                                securityHash={securityHash}
                                webSocketPublicUserId={webSocketPublicUserId}
                            />
                        </div>
                        <div
                            className="flex flex-grow-1 align-items-center justify-content-center font-bold m-2 px-5 py-3 text-2xl">
                            {reportState?.instance?.isLoading && (
                                <i className="pi pi-spin pi-spinner ml-2"/>
                            )}
                        </div>
                    </div>

                    {reportState?.instance &&
                        <ReportInstance
                            report={reportState.report}
                            reportInstance={reportState.instance}
                            publicMode
                        />
                    }

                </>
            )}
        </div>
    );
};

export default PublicReport;