import * as React from 'react';
import { FC }     from "react";

import context          from './store/context';
import reducer          from './store/reducer';
import { initialState } from './store/initialState'

const PreferencesContextProvider: FC = (props) => {

    const [state, dispatch] = React.useReducer(reducer, initialState);

    return (
        <context.Provider value={{preferencesState: state, preferencesStateDispatch: dispatch}} {...props}/>
    );
};

export default PreferencesContextProvider;