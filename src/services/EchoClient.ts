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
import Pusher    from 'pusher-js';
import channel   from "pusher-js/types/src/core/channels/channel";
import apiClient from "./api";
import env       from "../envVariables";

// @ts-ignore
window.Pusher = Pusher;

const EchoClient = new Echo({
    broadcaster: 'reverb',
    key: env.REACT_APP_VITE_REVERB_APP_KEY,
    wsHost: env.REACT_APP_VITE_REVERB_HOST,
    wsPort: env.REACT_APP_VITE_REVERB_PORT,
    wssPort: env.REACT_APP_VITE_REVERB_PORT,
    enabledTransports: ['ws', 'wss'],
    forceTLS: (env.REACT_APP_VITE_REVERB_SCHEME ?? 'https') === 'https',
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
