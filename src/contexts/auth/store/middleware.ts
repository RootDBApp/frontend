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

import EchoClient                    from '../../../services/EchoClient';
import * as types                    from './types';
import { TAuthAction }               from './actions';
import apiClient, { apiSendRequest } from "../../../services/api";
import { EAPIEndPoint }              from "../../../types/EAPIEndPoint";
import { TLogin }                    from "../../../types/TLogin";
import { notificationEvent }         from "../../../utils/events";
import i18n, { t }                   from "i18next";
import { fetchLatestVersion }        from "../../../utils/tools";
import TUserLogin                    from "../../../types/TUserLogin";
import { EReportDevBarMessageType }  from "../../../types/applicationEvent/EReportDevBarMessageType";
import Cookies                       from "js-cookie";

const middleware = (dispatch: React.Dispatch<TAuthAction>) => (action: TAuthAction) => {

        dispatch(action);

        const {type, payload} = action;

        switch (type) {

            case types.FORCE_LOGOUT:

                dispatch({type: types.LOGGED_OUT, payload: undefined})
                break;

            case types.LOGIN:

                apiClient.get('/sanctum/csrf-cookie')
                    .then(() => {

                            apiClient.defaults.headers.common = {
                                'x-xsrf-token': String(Cookies.get('XSRF-TOKEN'))
                            };

                            apiSendRequest({
                                method: 'POST',
                                endPoint: EAPIEndPoint.LOGIN,
                                formValues: {
                                    name: (payload as TLogin).username,
                                    password: (payload as TLogin).password,
                                    locale: (payload as TLogin).locale,
                                    'organization-id': (payload as TLogin).organizationId ?? 1,
                                },
                                callbackSuccess: (response: TUserLogin) => {

                                    // For now, only `user.id = 1` is a super-admin.
                                    response.is_super_admin = response.id === 1;


                                    dispatch({type: types.LOGIN_SUCCESS, payload: response});
                                    i18n.changeLanguage(String(response.organization_user.user_preferences.lang)).then(() => {
                                        localStorage.setItem('lang', response.organization_user.user_preferences.lang);
                                    });

                                    // 1 - Test WS server
                                    // Wait 2s - to give to time to contexts to be properly initialized..
                                    setTimeout(() => {
                                        apiSendRequest({
                                            method: 'GET',
                                            endPoint: EAPIEndPoint.TEST_WEB_SOCKET_SERVER,
                                            callbackSuccess: () => {
                                            },
                                            callbackError: (error) => {
                                                // @todo - not sure if we should warn officially user here.
                                                console.error(error);
                                            }
                                        });

                                    }, 2000);

                                    // 2 - Test WS server
                                    // After waiting 5s, we should have received a message on WS user channel which
                                    // should had set a check item in session storage.
                                    setTimeout(() => {

                                        if (sessionStorage.getItem('wss_ok') !== '1') {

                                            document.dispatchEvent(
                                                notificationEvent({
                                                    message: t('common:websocket_server_not_running').toString(),
                                                    timestamp: Date.now(),
                                                    title: t('common:an_error_occured').toString(),
                                                    forceInNotificationCenter: true,
                                                    type: EReportDevBarMessageType.ERROR,
                                                    severity: "error",
                                                    toast: true,

                                                })
                                            );
                                        } else {

                                            // Websocket are working, let's fetch the latest version.
                                            if (response.organization_user.ui_grants.report.edit  // dev
                                                || response.organization_user.ui_grants.user.edit) { // admin

                                                // Result on websocket user channel.
                                                fetchLatestVersion();
                                            }
                                        }
                                    }, 5000);

                                },
                                callbackError: (error) => {
                                    dispatch({type: types.LOGIN_FAIL, payload: error});
                                }
                            });
                        }
                    )
                ;

                break;

            case  types.LOGOUT   :

                apiSendRequest({
                    method: 'POST',
                    endPoint: EAPIEndPoint.LOGOUT,
                    callbackSuccess: () => {
                        dispatch({type: types.LOGGED_OUT, payload: undefined})
                        EchoClient.leave('user.' + payload);
                        window.history.state.url = '/login';
                        sessionStorage.removeItem('wss_ok');
                    }
                });

                break;
        }
    }
;

export default middleware;