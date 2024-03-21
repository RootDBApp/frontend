import { FC }                       from "react";
import { matchRoutes, useLocation } from "react-router-dom";
import * as React                   from "react";

import { IRouterContextInterface, RouterContext } from "./RouterContext";
import { allTabRouteSettings }                    from "../services/pathDrivenTabService";
import TPDTabRouteSettings                        from "../types/pdt/TPDTabRouteSettings";

const RouterProvider: FC<{ children: React.ReactNode }> = ({children}): React.ReactElement => {

    const currentLocation = useLocation()
    const [route, setRoute] = React.useState<IRouterContextInterface>(
        {
            from: currentLocation.pathname
        }
    );

    React.useEffect(() => {
        // if the current route is one of the table routes (home, report, etc ...)
        // we update the `from` URL parameter.
        const matches = matchRoutes(allTabRouteSettings, currentLocation.pathname);
        const matchedRoute = matches?.find(match => match.route !== undefined && (match.route as TPDTabRouteSettings).type !== undefined);

        if (matchedRoute) {
            setRoute((prev) => {
                return ({
                    from: `${currentLocation.pathname}${currentLocation.search.replace(/[?&]run$/, '')}${currentLocation.hash}`.replace('//', '/')
                })
            });
        }

    }, [currentLocation]);

    return (
        <RouterContext.Provider value={route}>
            {children}
        </RouterContext.Provider>
    )
}

export default RouterProvider;