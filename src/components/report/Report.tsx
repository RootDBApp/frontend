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

import CenteredLoading                             from "../common/loading/CenteredLoading";
import * as RTReport                               from "../../contexts/report/ReportContextProvider";
import { useReportStateFromReportIdAndInstanceId } from "../../contexts/report/ReportContextProvider";
import { addReportInstance, closeReportInstance }  from "../../contexts/report/store/actions";
import { getReport }                               from "../../contexts/report/store/asyncAction";
import { apiSendRequest }                          from "../../services/api";
import { EAPIEndPoint }                            from "../../types/EAPIEndPoint";
import { context as apiDataContext }               from "../../contexts/api_data/store/context";
import TReport                                     from "../../types/TReport";
import ReportInstance                              from "./ReportInstance";
import AncestorSizeProvider                        from "../common/size/AncestorSizeProvider";

const Report: React.FC<{ reportId: number, instanceId: number }> = ({reportId, instanceId}): React.ReactElement => {

    const {state: apiDataState} = React.useContext(apiDataContext);
    const reportDispatch = RTReport.useDispatch();

    const reportState = useReportStateFromReportIdAndInstanceId(reportId, instanceId);

    const [loading, setLoading] = React.useState<boolean>(false);
    const [loaded, setLoaded] = React.useState<boolean>(false);

    // Report is closed.
    //
    React.useEffect(() => {

        return () => {

            apiSendRequest({
                method: 'GET',
                endPoint: EAPIEndPoint.REPORT,
                resourceId: reportId + '_' + instanceId,
                extraUrlPath: 'close',
                callbackSuccess: () => {
                    // do nothing.
                },
                callbackError: () => {
                    // do nothing.
                }
            });

            reportDispatch(closeReportInstance({reportId: reportId, reportInstanceId: instanceId}));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportId]);

    // get Report if we don't have any instance yet.
    //
    React.useEffect(() => {

        // apiDataState.reports.length > 0  because if we come from a direct report URL, and user was not logged
        // and cache was not done, we have no reports cached.
        // New report
        if (apiDataState.reports.length > 0
            && !loaded
            && !loading
            && reportId
            && !reportState.report
        ) {

            if (apiDataState.reports.some((report: TReport) => report.id === reportId)) {

                setLoading(true);
                // To not refresh the report if apiDataState.reports is updated.
                setLoaded(true);
                reportDispatch(getReport({reportId: reportId, reportInstanceId: instanceId}));
            }
        }
        // Add a new report's instance.
        else if (
            apiDataState.reports.length > 0
            && !loaded
            && !loading
            && reportId
            && reportState.report
        ) {

            setLoading(true);
            reportDispatch(addReportInstance({reportId: reportId, reportInstanceId: instanceId}));
        }

        if (loading
            && reportState.report
            && reportState.instance
        ) {

            // To not refresh the report if apiDataState.reports is updated.
            setLoaded(true);
            setLoading(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportId, reportDispatch, loading, reportState, reportState?.instance, reportState?.report, apiDataState.reports]);

    return (
        <div className="reports-container">
            {loading
                ? <CenteredLoading/>
                : <>
                    {(reportState.report && reportState.instance) &&

                        <AncestorSizeProvider widthPropName="width">
                            <ReportInstance
                                report={reportState.report}
                                reportInstance={reportState.instance}
                            />
                        </AncestorSizeProvider>
                    }
                </>
            }
        </div>
    );
};

export default Report;

