import { Method } from "axios";

import { EAPIEndPoint }                               from "./EAPIEndPoint";
import { ICallbackAxiosError, ICallbackAxiosSuccess } from "./ICallBacks";
import TURLParameter                                  from "./common/TURLParameter";

type TAxiosRequest = {
    callbackSuccess: ICallbackAxiosSuccess,
    endPoint: EAPIEndPoint
    method: Method
    callbackError?: ICallbackAxiosError
    expectedHttpCode?: number,
    extraUrlPath?: string, // Will be added after the end point and the resource ID. (ex: /api/report/{resourceId}/{extraUrlPath})
    formValues?: object,
    noDataExpected?: boolean, // If true, we won't check if reponse contains any data.
    resourceId?: number | string, // Will be added just after the end point. (ex: /api/report/{resourceId}
    urlParameters?: Array<TURLParameter>
}

export = TAxiosRequest;