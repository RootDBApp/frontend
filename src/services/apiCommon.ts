import { ICallbackAxiosSuccess } from "../types/ICallBacks";
import { EAPIEndPoint }          from "../types/EAPIEndPoint";
import { apiSendRequest }        from "./api";
import TLaravelPagination        from "../types/TLaravelPagination";
import TUser                     from "../types/TUser";

export const getUsers = (pageNum: number = 1, callBackSuccess: ICallbackAxiosSuccess, forDropDown: boolean = false): void => {

    let urlParameters = [
        {key: 'page', value: pageNum},
        {key: 'for-admin', value: 1}
    ];

    if (forDropDown) {
        urlParameters.push({key: 'for-dropdown', value: 1});
    }

    apiSendRequest({
        method: 'GET',
        endPoint: EAPIEndPoint.USER,
        urlParameters: urlParameters,
        callbackSuccess: (response: Array<TUser>, pagination?: TLaravelPagination) => {

            callBackSuccess(response, pagination);
        }
    });
};