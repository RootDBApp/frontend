import * as React from 'react';

export interface IRouterContextInterface {
    from: string,
}

export const RouterContext = React.createContext<IRouterContextInterface>({from: ''});

