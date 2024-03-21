import * as React                   from 'react';
import { TAuthAction }              from './actions';
import initialState, { IAuthState } from "./initialState";

interface IContextProps {
    state: IAuthState;
    mDispatch: React.Dispatch<TAuthAction>;
}

export const context = React.createContext<IContextProps>({
    mDispatch: () => {
        // Dispatch initial value
    },
    state: initialState
});

export default context;