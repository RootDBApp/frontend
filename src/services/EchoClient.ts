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

import Echo      from "laravel-echo";
import apiClient from "./api";
import channel   from "pusher-js/types/src/core/channels/channel";
import env       from "../envVariables";

// @ts-ignore
window.Pusher = require('pusher-js');

const EchoClient = new Echo({
    key: env.REACT_APP_ECHO_CLIENT_KEY,
    cluster: env.REACT_APP_ECHO_CLIENT_CLUSTER,
    broadcaster: 'pusher',
    wsHost: env.REACT_APP_ECHO_CLIENT_WS_HOST,
    wsPort: env.REACT_APP_ECHO_CLIENT_WS_PORT,
    wssHost: env.REACT_APP_ECHO_CLIENT_WSS_HOST,
    wssPort: env.REACT_APP_ECHO_CLIENT_WSS_PORT,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    forceTLS: false,
    authorizer: (authorizedChannel: channel) => {
        return {
            authorize: (socketId: number, callback: (a: boolean, b: string) => void) => {
                apiClient.post('/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: authorizedChannel.name
                })
                    .then(response => {
                        callback(false, response.data);
                    })
                    .catch(error => {
                        callback(true, error);
                    });
            }
        };
    },
});

export default EchoClient;
