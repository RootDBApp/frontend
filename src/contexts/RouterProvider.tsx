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