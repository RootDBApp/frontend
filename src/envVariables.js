const processEnv = typeof process.env !== 'undefined' ? process.env : {};
export const appConfig = window && window.appConfig ? window.appConfig : {};

const overridableParams = [
    'REACT_APP_DEMO',
    'REACT_APP_API_URL',
    'REACT_APP_ECHO_CLIENT_KEY',
    'REACT_APP_ECHO_CLIENT_CLUSTER',
    'REACT_APP_ECHO_CLIENT_AUTHENDPOINT',
    'REACT_APP_ECHO_CLIENT_WS_HOST',
    'REACT_APP_ECHO_CLIENT_WS_PORT',
    'REACT_APP_ECHO_CLIENT_WSS_HOST',
    'REACT_APP_ECHO_CLIENT_WSS_PORT'
];

const filteredAppConfig = Object.assign(
    {},
    ...overridableParams.map(key => (
        appConfig[key] !== undefined ? ({ [key]: appConfig[key] }) : undefined)
    ),
);

const env = {
    ...processEnv,
    ...filteredAppConfig,
    tooltipShowDelay: 500,
    tooltipHideDelay: 0
};

export default env;
