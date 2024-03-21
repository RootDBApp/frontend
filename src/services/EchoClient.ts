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
