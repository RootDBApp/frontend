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

import * as React                  from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { context as apiDataContext }   from "../../contexts/api_data/store/context";
import * as RTReport                   from "../../contexts/report/ReportContextProvider";
import { listenWSOrganizationChannel } from "../../contexts/api_data/store/actions";
import { listenPrivateChannelReport }  from "../../contexts/report/store/asyncAction";
import { context as authContext }      from "../../contexts/auth/store/context";
import PathDrivenTabs                  from "../pdt/PathDrivenTabs";
import CenteredLoading                 from "../common/loading/CenteredLoading";
import Login                           from "../user/Login";
import Header                          from "../header/Header";

const Credits = React.lazy(() => import('../help/Credits'));
const Help = React.lazy(() => import('../help/Help'));
const OverView = React.lazy(() => import('../help/overview/Overview'));
const PublicRoute = React.lazy(() => import('./PublicRoute'));
const ResetPassword = React.lazy(() => import('../user/ResetPassword'));

const RouteSwitch = () => {

    const {mDispatch: apiDataDispatch} = React.useContext(apiDataContext);
    const {state: authState} = React.useContext(authContext);

    const reportDispatch = RTReport.useDispatch();

    const redirect = (): React.ReactElement => {

        if (document.location.pathname !== '/login' && document.location.pathname !== '/logout') {

            sessionStorage.setItem('previousURL', document.location.pathname + document.location.search);
        }

        return <Navigate replace to="/login"/>;
    }

    const getLoggedContents = (): React.ReactElement => {

        if (authState.isLoggedIn && authState?.user?.reset_password === false) {
            return (
                <>
                    <React.Suspense fallback={<CenteredLoading/>}>
                        <Routes>
                            <Route path="/credits"
                                   element={<React.Suspense fallback={<CenteredLoading/>}><Credits/></React.Suspense>}
                            />
                            <Route path="/display-help/:helperCardPath" element={<Help/>}/>
                            <Route path="/overview"
                                   element={<React.Suspense fallback={<CenteredLoading/>}><OverView/></React.Suspense>}
                            />
                        </Routes>

                        {authState.isLoggedIn && (
                            <div className="grid-area-header">
                                <Header/>
                            </div>
                        )}

                        {authState.isLoggedIn &&
                            <PathDrivenTabs
                                pdtHeaderClassname="grid-area-main-tabs"
                                pdtContentsClassname="grid-area-main-tabs-contents"
                            />
                        }

                    </React.Suspense>
                </>
            )
        } else if (authState.isLoggedIn && authState?.user?.reset_password === true) {

            return (
                <Routes>
                    <Route path="/reset-password"
                           element={<React.Suspense fallback={<CenteredLoading/>}><ResetPassword/></React.Suspense>}/>
                </Routes>
            )
        }

        return redirect()
    }

    React.useEffect(() => {

        if (authState.isLoggedIn) {

            // Listen to events related to the Organization.
            apiDataDispatch(listenWSOrganizationChannel(authState.user.organization_user.organization_id));

            reportDispatch(
                listenPrivateChannelReport({
                    webSocketSessionId: authState.websocketSessionId
                })
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authState.isLoggedIn, authState.user]);

    return (
        <Routes>
            <Route
                path='/public/*'
                element={<React.Suspense fallback={<CenteredLoading/>}><PublicRoute/></React.Suspense>}
            />

            <Route path='/login' element={<Login/>}/>

            <Route path="*" element={getLoggedContents()}/>
        </Routes>
    );
}
export default RouteSwitch;