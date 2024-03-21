import * as React                      from 'react';
import { TAPIDataAction }              from './actions';
import initialState, { IAPIDataState } from "./initialState";

interface IContextProps {
    state: IAPIDataState;
    mDispatch: React.Dispatch<TAPIDataAction>;
}

export const context = React.createContext<IContextProps>({
    mDispatch: () => { },
    state: initialState
});

export default context;