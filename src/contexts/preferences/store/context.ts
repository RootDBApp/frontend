import * as React                          from 'react';
import { TPreferencesAction }              from './actions';
import initialState, { IPreferencesState } from "./initialState";

interface IContextProps {
    preferencesState: IPreferencesState;
    preferencesStateDispatch: React.Dispatch<TPreferencesAction>;
}

export const context = React.createContext<IContextProps>({
    preferencesStateDispatch: () => {
        // Dispatch initial value
    },
    preferencesState: initialState
});

export default context;