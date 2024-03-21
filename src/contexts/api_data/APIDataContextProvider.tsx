import * as React from 'react';
import { FC }     from "react";

import context          from './store/context';
import reducer          from './store/reducer';
import { initialState } from './store/initialState'
import middleware       from "./store/middleware";

const APIDataContextProvider: FC = (props) => {

    const [state, dispatch] = React.useReducer(reducer, initialState);

    const mDispatch = middleware(dispatch);

    return (
        <context.Provider value={{state, mDispatch}} {...props}/>
    );
};

export default APIDataContextProvider;