import * as React from "react";

import { TAPIDataAction } from "./actions";
import {
    CATEGORIES_LOADING,
    DIRECTORIES_LOADING,
    DIRECTORIES_TREE_LOADING,
    GOT_CATEGORIES,
    GOT_DATA_VIEW_LIB_TYPES,
    GOT_DATA_VIEW_LIB_VERSIONS,
    GOT_DIRECTORIES,
    GOT_DIRECTORIES_TREE, GOT_PARAMETER_INPUTS,
    GOT_REPORTS,
    GOT_ROLES,
    GOT_SERVICE_MESSAGES,
    REPORTS_LOADING,
    UPDATE_DIRECTORIES_TREE_NUM_REPORTS
}                         from "./types";
import TCache             from "../../../types/TCache";
import { apiSendRequest } from "../../../services/api";
import { EAPIEndPoint }   from "../../../types/EAPIEndPoint";

const getCachePromise = (): Promise<TCache> => {

    return new Promise((resolve) => {
        apiSendRequest({
            method: 'GET',
            endPoint: EAPIEndPoint.CACHE,
            urlParameters: [{
                key: 'locale',
                value: localStorage.getItem('lang') ? String(localStorage.getItem('lang')) : 'en'
            }],
            callbackSuccess: (response: TCache) => {
                resolve(response);
            },
            callbackError: () => {
                resolve({
                    directoriesPrimeReactTree: [],
                    directories: [],
                    categories: [],
                    parameterInputs: [],
                    reports: [],
                    reportDataViewLibTypes: [],
                    reportDataViewLibVersions: [],
                    roles: [],
                    serviceMessages: []
                });
            }
        });
    })
};


const apiDataCacheRefresh = async (organizationId: number, dispatch: React.Dispatch<TAPIDataAction>) => {

    dispatch({type: DIRECTORIES_LOADING, payload: true});
    dispatch({type: CATEGORIES_LOADING, payload: true});
    dispatch({type: REPORTS_LOADING, payload: true});
    dispatch({type: DIRECTORIES_TREE_LOADING, payload: true});

    const cache = await getCachePromise();

    dispatch({type: GOT_PARAMETER_INPUTS, payload: cache.parameterInputs});
    dispatch({type: GOT_REPORTS, payload: cache.reports});
    dispatch({type: GOT_CATEGORIES, payload: cache.categories});
    dispatch({type: GOT_DIRECTORIES, payload: cache.directories});
    dispatch({type: GOT_DIRECTORIES_TREE, payload: cache.directoriesPrimeReactTree});
    dispatch({type: GOT_ROLES, payload: cache.roles});
    dispatch({type: GOT_SERVICE_MESSAGES, payload: cache.serviceMessages});
    dispatch({type: GOT_DATA_VIEW_LIB_TYPES, payload: cache.reportDataViewLibTypes});
    dispatch({type: GOT_DATA_VIEW_LIB_VERSIONS, payload: cache.reportDataViewLibVersions});

    dispatch({type: UPDATE_DIRECTORIES_TREE_NUM_REPORTS, payload: undefined});
};


export default apiDataCacheRefresh;