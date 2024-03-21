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