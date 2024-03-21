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

import * as React                           from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { context as authContext }                 from "../../contexts/auth/store/context";
import { IRouterContextInterface, RouterContext } from "../../contexts/RouterContext";
import { gotReportDataView }                      from "../../contexts/report/store/actions";
import * as RTReport                              from "../../contexts/report/ReportContextProvider";
import { updateReportDataViewJs }                 from "../../contexts/report/store/asyncAction";
import CenteredLoading                            from "../common/loading/CenteredLoading";
import TReportDataView                            from "../../types/TReportDataView";
import TReportDataViewJs                          from "../../types/TReportDataViewJs";

const ReportCacheJobsList = React.lazy(() => import('./ReportCacheJobsList'));
const ReportDataViewEditInitJSCodeForm = React.lazy(() => import('./data-view/ReportDataViewEditInitJSCodeForm'));
const ReportDataViewForm = React.lazy(() => import('./data-view/ReportDataViewForm'));
const ReportParametersForm = React.lazy(() => import('./ReportParametersForm'));
const ReportForm = React.lazy(() => import('./ReportForm'));

const ReportRouteForms = (): React.ReactElement => {

    const navigate = useNavigate();
    const {
        configurationReportId,
        configurationReportDataViewId,
        configurationReportIdForInputParameters,
        configurationReportIdForCacheJobs,
        editInitJsCodeReportDataViewId
    } = useParams();

    const routerContext: IRouterContextInterface = React.useContext(RouterContext);
    const reportDispatch = RTReport.useDispatch();
    const {state: authState} = React.useContext(authContext);

    return (
        <>
            {authState.user.organization_user.ui_grants.report.edit ? (
                <>
                    {(configurationReportId || configurationReportDataViewId || configurationReportIdForInputParameters || configurationReportIdForCacheJobs) && (
                        <React.Suspense fallback={<CenteredLoading/>}>

                            {(configurationReportId && Number(configurationReportId) > 0 && editInitJsCodeReportDataViewId && !configurationReportDataViewId && !configurationReportIdForInputParameters) &&
                                <ReportDataViewEditInitJSCodeForm
                                    reportId={Number(configurationReportId)}
                                    dataViewId={Number(editInitJsCodeReportDataViewId)}
                                    onUpdate={(dataViewJs: TReportDataViewJs) => {
                                        // (dataView: TReportDataView) => {
                                        navigate(routerContext.from || '/home', {replace: false});

                                        reportDispatch(
                                            updateReportDataViewJs({
                                                dataViewId: Number(editInitJsCodeReportDataViewId),
                                                dataViewJs,
                                                reportId: Number(configurationReportId),
                                                callback: () => {
                                                }
                                            })
                                        )
                                    }}
                                />
                            }

                            {(configurationReportId && !editInitJsCodeReportDataViewId && !configurationReportDataViewId && !configurationReportIdForInputParameters) &&
                                <ReportForm
                                    reportId={Number(configurationReportId)}
                                    onSubmitSuccess={() => {
                                        navigate(routerContext.from || '/home', {replace: false});
                                    }}/>
                            }

                            {(configurationReportIdForInputParameters && !configurationReportIdForCacheJobs && !configurationReportDataViewId && !configurationReportId) &&
                                <ReportParametersForm reportId={Number(configurationReportIdForInputParameters)}/>
                            }

                            {(configurationReportIdForCacheJobs && !configurationReportIdForInputParameters && !configurationReportDataViewId && !configurationReportId) &&
                                <ReportCacheJobsList reportId={Number(configurationReportIdForCacheJobs)}/>
                            }

                            {(configurationReportId && configurationReportDataViewId && !configurationReportIdForInputParameters) &&
                                <ReportDataViewForm
                                    reportId={Number(configurationReportId)}
                                    dataViewId={Number(configurationReportDataViewId)}
                                    onSuccess={(dataView: TReportDataView, dataViewJs?: TReportDataViewJs) => {

                                        // 9999999999999 by default, because report data view configuration is common to all instances.
                                        // `-> used when we create a new report and we add first data view.
                                        let reportInstanceId: number = 9999999999999;
                                        let newDataView = dataView;
                                        let defaultNavigate = true;

                                        // Creating a new data view.
                                        if (dataViewJs) {

                                            const reportIdAndInstanceIdMatches = new RegExp(/^\/report\/(\d{1,10})_(\d{1,30}).*/).exec(routerContext.from);

                                            if (dataViewJs) {

                                                newDataView = {...dataView, report_data_view_js: dataViewJs};
                                            }

                                            if (reportIdAndInstanceIdMatches) {

                                                reportInstanceId = Number(reportIdAndInstanceIdMatches[2]);
                                            }


                                            if (reportIdAndInstanceIdMatches && reportIdAndInstanceIdMatches[1] && reportIdAndInstanceIdMatches[2]) {

                                                defaultNavigate = false;
                                                navigate(`/report/${reportIdAndInstanceIdMatches[1]}_${reportIdAndInstanceIdMatches[2]}/data-view/${dataView.id}?view-mode=dev&run`, {replace: false});
                                            }
                                        }

                                        if (defaultNavigate) {

                                            navigate(routerContext.from || '/home', {replace: false});
                                        }

                                        reportDispatch(
                                            gotReportDataView({
                                                dataView: newDataView,
                                                reportId: Number(configurationReportId),
                                                reportInstanceId: reportInstanceId
                                            }))

                                    }}
                                />
                            }
                        </React.Suspense>
                    )}
                </>
            ) : (
                <Navigate to="/home"/>
            )}
        </>

    )
}

export default ReportRouteForms;