import * as React          from 'react';
import { createContainer } from "react-tracked";
import { useReducerAsync } from "use-reducer-async";

import { TReportAction }              from "./store/actions";
import { TReportAsyncAction }         from "./store/asyncAction";
import asyncActionHandlers            from "./store/asyncActionsHandler";
import { initialState, IReportState } from './store/initialState'
import reducer, {
    extractReportDataViewFromReportIdAndDataViewId,
    extractReportStateFromReportId,
    extractReportStateFromReportIdAndInstanceId,
    extractReportStateReportInstanceDataViewInstanceFromLocation,
}                                     from './store/reducer';

const {
    Provider,
    useTrackedState,
    useUpdate: useDispatch,
} = createContainer(
    () => useReducerAsync<React.Reducer<IReportState[], TReportAction>, TReportAsyncAction>(
        reducer,
        initialState,
        asyncActionHandlers,
    )
);

const useReportDataViewStateFromReportIdAndDataViewId = (reportId: number, dataViewId: number) => extractReportDataViewFromReportIdAndDataViewId(useTrackedState(), reportId, dataViewId);

const useReportState = (reportId: number | null) => extractReportStateFromReportId(useTrackedState(), reportId);

const useReportStateFromReportIdAndInstanceId = (reportId: number, reportInstanceId: number) => extractReportStateFromReportIdAndInstanceId(useTrackedState(), reportId, reportInstanceId);

const useReportStateReportInstanceDataViewInstanceFromLocation = (pathname: string, withLayout?: boolean) => extractReportStateReportInstanceDataViewInstanceFromLocation(useTrackedState(), pathname, withLayout);


export {
    Provider,
    useDispatch,
    useReportDataViewStateFromReportIdAndDataViewId,
    useReportState,
    useReportStateFromReportIdAndInstanceId,
    useReportStateReportInstanceDataViewInstanceFromLocation,
    useTrackedState
};