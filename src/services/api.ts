import axios, { AxiosError, AxiosResponse } from 'axios';
import { t }                                from "i18next";

import { notificationEvent }        from "../utils/events";
import { EReportDevBarMessageType } from "../types/applicationEvent/EReportDevBarMessageType";
import { TAPIDefaultParams }        from "../types/TAPIDefaultParams";
import TAxiosRequest                from "../types/TAxiosRequest";
import { URLParameterToString }     from "../utils/tools";
import TLaravelPagination           from "../types/TLaravelPagination";
import env                          from "../envVariables";
import { EAPIEndPoint }             from "../types/EAPIEndPoint";
import Cookies                      from "js-cookie";

export const apiDefaultParams: TAPIDefaultParams = {
    referer: document.referrer
}
// All these requests can work even if websocket is not working.
// for POST, PUT, DELETE.
// GET is always authorized for all end points.
const authorizedAPIEndPoint = [
    EAPIEndPoint.CACHE,
    EAPIEndPoint.FETCH_LATEST_VERSION,
    EAPIEndPoint.LOGIN,
    EAPIEndPoint.LOGOUT,
    EAPIEndPoint.ORGANIZATION,
    EAPIEndPoint.PUBLIC_REPORT,          // no wss_ok in local storage.
    EAPIEndPoint.PUBLIC_REPORT_DATAVIEW, // no wss_ok in local storage.
    EAPIEndPoint.START_UPDATE,
    EAPIEndPoint.TEST_WEB_SOCKET_SERVER,
    EAPIEndPoint.USER_PREFERENCES,
];


const apiClient = axios.create({
        baseURL: env.REACT_APP_API_URL,
        withCredentials: true,
        validateStatus: function (status) {

            // return status >= 200 && status < 300; // default
            return (status >= 200 && status < 300) || (status >= 400 && status < 500);
        },
        headers: {
            'Security-From': (apiDefaultParams.referer ? apiDefaultParams.referer : String(document.location)),
        }
    })
;

apiClient.defaults.headers.common = {
    'x-xsrf-token': sessionStorage.getItem('loggedIn') === "true" ? String(Cookies.get('XSRF-TOKEN')) : undefined,
};

apiClient.interceptors.response.use(
    // Any status code that lie within the range of HTTP code defined into validateStatus above fall here.
    function (response) {

        const {title, message} = response.data;
        if (title || message) {

            let notificationMessageType = EReportDevBarMessageType.ERROR;
            let forDevBarOnly = false;

            if (Number(response.status) >= 200
                && Number(response.status) <= 308
            ) {

                notificationMessageType = EReportDevBarMessageType.LOG;
                forDevBarOnly = true;
            }

            document.dispatchEvent(
                notificationEvent({
                    message: `API: ${message}`,
                    timestamp: Date.now(),
                    title,
                    type: notificationMessageType,
                    forDevBarOnly,
                    severity: (notificationMessageType === EReportDevBarMessageType.LOG) ? 'info' : 'danger',
                    toast: false
                })
            );
        }

        if (response.status === 403 && !window.location.href.endsWith('/login')) {
            sessionStorage.setItem('loggedIn', 'false');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('organization');
            window.location.href = '/login';
        }

        return response;
    },
    // Unhandled HTTP codes falls here.
    function (error: AxiosError) {

        if (error.response) {

            const {title, message} = error.response.data as any;

            if (message === "Unauthenticated." && !window.location.href.endsWith('/login')) {

                sessionStorage.setItem('loggedIn', 'false');
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('organization');
                window.location.href = '/login';
            }

            if (title || message) {

                document.dispatchEvent(
                    notificationEvent({
                        message: String(message),
                        timestamp: Date.now(),
                        title: String(title),
                        type: EReportDevBarMessageType.ERROR,
                        severity: "error",
                        toast: true
                    })
                );
            }

        } else {

            document.dispatchEvent(
                notificationEvent({
                    message: "Unknown error occurred.",
                    timestamp: Date.now(),
                    title: "Error",
                    type: EReportDevBarMessageType.ERROR,
                    severity: "error",
                    toast: true
                })
            );
        }

        //return Promise.reject(error);
        return error;
    });

function getResponseData(response: AxiosResponse | AxiosError): any {

    if (response instanceof AxiosError) {
        if (response.response && response.response.data) {
            return response.response.data;
        }
    } else {

        if (response.data && response.data.data) {

            return response.data.data;
        } else if (response.data) {

            return response.data;
        }
    }

    console.warn('No data in response', response);
    return false;
}

/*

  "links": {
    "first": "http:\/\/api.up.localhost.com\/api\/user?page=1",
    "last": "http:\/\/api.up.localhost.com\/api\/user?page=4",
    "prev": null,
    "next": "http:\/\/api.up.localhost.com\/api\/user?page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 4,
    "links": [
      {
        "url": null,
        "label": "pagination.previous",
        "active": false
      },
      {
        "url": "http:\/\/api.up.localhost.com\/api\/user?page=1",
        "label": "1",
        "active": true
      },
      ...
      {
        "url": "http:\/\/api.up.localhost.com\/api\/user?page=2",
        "label": "pagination.next",
        "active": false
      }
    ],
    "path": "http:\/\/api.up.localhost.com\/api\/user",
    "per_page": 5,
    "to": 5,
    "total": 20
  }

 */
function getResponsePagination(response: AxiosResponse): TLaravelPagination | undefined {

    if (response.data && response.data.meta) {

        return {
            current_page: response.data.meta.current_page,
            from: response.data.meta.from,
            last_page: response.data.meta.last_page,
            links: response.data.meta.links,
            path: response.data.meta.path,
            per_page: response.data.meta.per_page,
            to: response.data.meta.to,
            total: response.data.meta.total,
        }
    }

    return;
}

function handleResponse(axiosRequest: TAxiosRequest, response: AxiosResponse): void {

    const data = getResponseData(response);

    const pagination = getResponsePagination(response);
    const expectedStatusCode = axiosRequest.expectedHttpCode ?? 200;

    if (axiosRequest.noDataExpected && response.status === expectedStatusCode) {

        axiosRequest.callbackSuccess({});
        return;
    }

    if (response.status === expectedStatusCode && data !== false) {

        axiosRequest.callbackSuccess(data, pagination);
    } else {

        if (axiosRequest.callbackError && data !== false) {

            axiosRequest.callbackError(data);
        } else if (axiosRequest.callbackError && response) {

            axiosRequest.callbackError(response);
        } else {

            console.warn(response);
        }
    }
}

export function apiSendRequest(
    axiosRequest: TAxiosRequest
): void {

    // Prevent PUT, POST, DELETE if websocket server is not running.
    if (
        // If websocket is not running,
        sessionStorage.getItem('wss_ok') !== '1' &&
        //
        // If user is trying to run a report, from a direct given URL and we are not logged we have to ignore this if()
        //
        !axiosRequest.endPoint.match(EAPIEndPoint.REPORT) && !axiosRequest.endPoint.match('run') &&
        // And the endpoint is not the always authorized endpoints that be called even if websocket is not running,
        !authorizedAPIEndPoint.includes(axiosRequest.endPoint) &&
        // And it's not a GET call.
        axiosRequest.method.toLowerCase() !== 'get'
    ) {

        document.dispatchEvent(
            notificationEvent({
                message: t('common:request_blocked').toString(),
                timestamp: Date.now(),
                title: t('common:an_error_occured').toString(),
                forceInNotificationCenter: true,
                type: EReportDevBarMessageType.ERROR,
                severity: "error",
                toast: true,

            })
        );
        if (axiosRequest.callbackError) {
            axiosRequest.callbackError({message: t('common:request_blocked').toString()})
        }
    } else {

        let urlPath: string = '';
        if (axiosRequest.resourceId) {

            urlPath = '/' + axiosRequest.resourceId;
        }

        if (axiosRequest.extraUrlPath) {

            urlPath = urlPath + '/' + axiosRequest.extraUrlPath;
        }

        let urlParameters: string = '';
        if (axiosRequest.urlParameters && axiosRequest.urlParameters.length > 0) {

            urlParameters = '?' + URLParameterToString(axiosRequest.urlParameters);
        }

        console.debug('apiSendRequest - full URL path', axiosRequest.endPoint + urlPath + urlParameters);

        switch (axiosRequest.method) {

            case 'DELETE': {
                apiClient.delete(axiosRequest.endPoint + urlPath + urlParameters)
                    .then((response: AxiosResponse) => {

                        handleResponse(axiosRequest, response);
                    }).catch((error: any) => {

                    console.warn(error);
                });
                break;
            }

            case 'GET': {
                apiClient.get(axiosRequest.endPoint + urlPath + urlParameters)
                    .then((response: AxiosResponse) => {

                        handleResponse(axiosRequest, response);
                    }).catch((error: any) => {

                    console.warn(error);
                });
                break;
            }

            case 'POST': {
                apiClient.post(axiosRequest.endPoint + urlPath + urlParameters, axiosRequest.formValues ?? {})
                    .then((response: AxiosResponse) => {


                        handleResponse(axiosRequest, response);
                    }).catch((error: any) => {

                    console.warn(error);
                });
                break;
            }

            case 'PUT': {
                apiClient.put(axiosRequest.endPoint + urlPath + urlParameters, axiosRequest.formValues ?? [])
                    .then((response: AxiosResponse) => {

                        handleResponse(axiosRequest, response);
                    }).catch((error: any) => {

                    console.warn(error);
                });
                break;
            }

            default: {
                console.info('Unknown method ', axiosRequest.method);
            }
        }
    }
}


export default apiClient;
